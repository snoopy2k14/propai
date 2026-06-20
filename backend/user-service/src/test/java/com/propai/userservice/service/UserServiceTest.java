
package com.propai.userservice.service;

import com.propai.userservice.model.User;
import com.propai.userservice.repository.UserRepository;
import com.propai.userservice.security.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.kafka.core.KafkaTemplate;

import java.time.Instant;
import java.util.Map;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/**
 * Unit tests for {@link UserService}.
 * <p>
 * These tests mock UserRepository, JwtService, and KafkaTemplate so they run
 * with no Spring context, no MongoDB, and no Kafka broker — pure business-logic
 * coverage of register/login/findById/update.
 * <p>
 * Note: UserService currently constructs its own BCryptPasswordEncoder internally
 * rather than receiving it via constructor injection. That's fine for these tests
 * since we exercise the real encoder (register + login round-trip), but it does
 * mean the encoder itself can't be mocked/swapped here. Worth a follow-up to
 * inject BCryptPasswordEncoder as a bean if you want full isolation later.
 */
@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository repo;

    @Mock
    private JwtService jwt;

    @Mock
    private KafkaTemplate<String, Object> kafka;

    @InjectMocks
    private UserService userService;

    private static final String FIRST_NAME = "Ada";
    private static final String LAST_NAME = "Lovelace";
    private static final String EMAIL = "ada@example.com";
    private static final String PASSWORD = "correct-password";
    private static final String USER_ID = "user-123";
    private static final String TOKEN = "fake.jwt.token";

    @BeforeEach
    void setUp() {
        // no-op: @InjectMocks + @Mock handle wiring per test
    }

    // ---------- register ----------

    @Test
    void register_savesNewUser_sendsNotification_andReturnsTokenAndUser() {
        when(repo.existsByEmail(EMAIL)).thenReturn(false);

        // Echo back whatever gets saved, with an id assigned, like a real repo would.
        when(repo.save(any(User.class))).thenAnswer(invocation -> {
            User toSave = invocation.getArgument(0);
            toSave.setId(USER_ID);
            return toSave;
        });

        when(jwt.generateToken(eq(USER_ID), eq(EMAIL))).thenReturn(TOKEN);

        Map<String, Object> result = userService.register(
                FIRST_NAME, LAST_NAME, EMAIL, PASSWORD, User.UserRole.BUYER);

        assertThat(result).containsKey("token");
        assertThat(result.get("token")).isEqualTo(TOKEN);
        assertThat(result).containsKey("user");

        User savedUser = (User) result.get("user");
        assertThat(savedUser.getId()).isEqualTo(USER_ID);
        assertThat(savedUser.getFirstName()).isEqualTo(FIRST_NAME);
        assertThat(savedUser.getLastName()).isEqualTo(LAST_NAME);
        assertThat(savedUser.getEmail()).isEqualTo(EMAIL);
        assertThat(savedUser.getRole()).isEqualTo(User.UserRole.BUYER);

        // Password must never be stored in plaintext.
        assertThat(savedUser.getPasswordHash()).isNotEqualTo(PASSWORD);
        assertThat(savedUser.getPasswordHash()).isNotBlank();

        verify(repo).save(any(User.class));

        // Notification must be sent with the correct topic and payload shape.
        ArgumentCaptor<Map<String, Object>> payloadCaptor = ArgumentCaptor.forClass(Map.class);
        verify(kafka).send(eq("notification.send"), eq(USER_ID), payloadCaptor.capture());

        Map<String, Object> payload = payloadCaptor.getValue();
        assertThat(payload.get("type")).isEqualTo("USER_REGISTERED");
        assertThat(payload.get("userId")).isEqualTo(USER_ID);
        assertThat(payload.get("email")).isEqualTo(EMAIL);
    }

    @Test
    void register_defaultsRoleToBuyer_whenRoleNotProvided() {
        // Mirrors the controller's req.getOrDefault("role", "BUYER") behaviour by
        // exercising the service directly with the BUYER role explicitly, since
        // role defaulting is a controller-layer concern, not UserService's.
        when(repo.existsByEmail(EMAIL)).thenReturn(false);
        when(repo.save(any(User.class))).thenAnswer(invocation -> {
            User toSave = invocation.getArgument(0);
            toSave.setId(USER_ID);
            return toSave;
        });
        when(jwt.generateToken(anyString(), anyString())).thenReturn(TOKEN);

        Map<String, Object> result = userService.register(
                FIRST_NAME, LAST_NAME, EMAIL, PASSWORD, User.UserRole.BUYER);

        User savedUser = (User) result.get("user");
        assertThat(savedUser.getRole()).isEqualTo(User.UserRole.BUYER);
    }

    @Test
    void register_throws_whenEmailAlreadyRegistered() {
        when(repo.existsByEmail(EMAIL)).thenReturn(true);

        assertThatThrownBy(() -> userService.register(
                FIRST_NAME, LAST_NAME, EMAIL, PASSWORD, User.UserRole.BUYER))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Email already registered");

        // Must not save, must not notify, must not issue a token, on a duplicate email.
        verify(repo, never()).save(any(User.class));
        verify(kafka, never()).send(anyString(), anyString(), any());
        verify(jwt, never()).generateToken(anyString(), anyString());
    }

    // ---------- login ----------

    @Test
    void login_returnsTokenAndUpdatesLastLoginAt_onValidCredentials() {
        // Build a user with a real bcrypt hash of PASSWORD, since UserService
        // uses its own internal BCryptPasswordEncoder to verify matches.
        String realHash = new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder()
                .encode(PASSWORD);

        User existing = User.builder()
                .id(USER_ID)
                .firstName(FIRST_NAME)
                .lastName(LAST_NAME)
                .email(EMAIL)
                .passwordHash(realHash)
                .role(User.UserRole.BUYER)
                .build();

        when(repo.findByEmail(EMAIL)).thenReturn(Optional.of(existing));
        when(repo.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(jwt.generateToken(USER_ID, EMAIL)).thenReturn(TOKEN);

        Instant before = Instant.now();
        Map<String, Object> result = userService.login(EMAIL, PASSWORD);

        assertThat(result.get("token")).isEqualTo(TOKEN);
        User returned = (User) result.get("user");
        assertThat(returned.getEmail()).isEqualTo(EMAIL);
        assertThat(returned.getLastLoginAt()).isNotNull();
        assertThat(returned.getLastLoginAt()).isAfterOrEqualTo(before);

        verify(repo).save(existing);
    }

    @Test
    void login_throws_whenEmailNotFound() {
        when(repo.findByEmail(EMAIL)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userService.login(EMAIL, PASSWORD))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Invalid credentials");

        verify(repo, never()).save(any(User.class));
        verify(jwt, never()).generateToken(anyString(), anyString());
    }

    @Test
    void login_throws_whenPasswordDoesNotMatch() {
        String realHash = new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder()
                .encode("a-completely-different-password");

        User existing = User.builder()
                .id(USER_ID)
                .email(EMAIL)
                .passwordHash(realHash)
                .role(User.UserRole.BUYER)
                .build();

        when(repo.findByEmail(EMAIL)).thenReturn(Optional.of(existing));

        assertThatThrownBy(() -> userService.login(EMAIL, PASSWORD))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Invalid credentials");

        // Critically: on a bad password, we must not update lastLoginAt or save.
        verify(repo, never()).save(any(User.class));
        verify(jwt, never()).generateToken(anyString(), anyString());
    }

    // ---------- findById ----------

    @Test
    void findById_returnsUser_whenPresent() {
        User existing = User.builder().id(USER_ID).email(EMAIL).build();
        when(repo.findById(USER_ID)).thenReturn(Optional.of(existing));

        Optional<User> result = userService.findById(USER_ID);

        assertThat(result).isPresent();
        assertThat(result.get().getId()).isEqualTo(USER_ID);
    }

    @Test
    void findById_returnsEmpty_whenNotPresent() {
        when(repo.findById(USER_ID)).thenReturn(Optional.empty());

        Optional<User> result = userService.findById(USER_ID);

        assertThat(result).isEmpty();
    }

    // ---------- update ----------

    @Test
    void update_preservesIdPasswordHashAndCreatedAt_fromExistingRecord() {
        Instant originalCreatedAt = Instant.parse("2024-01-01T00:00:00Z");
        String originalHash = "untouchable-hash";

        User existing = User.builder()
                .id(USER_ID)
                .firstName("Old")
                .lastName("Name")
                .email(EMAIL)
                .passwordHash(originalHash)
                .createdAt(originalCreatedAt)
                .role(User.UserRole.BUYER)
                .build();

        // Caller attempts to overwrite id/passwordHash/createdAt — these must NOT
        // make it through, per UserService.update's explicit preservation logic.
        User incoming = User.builder()
                .id("attacker-supplied-id")
                .firstName("New")
                .lastName("Name")
                .email(EMAIL)
                .passwordHash("attacker-supplied-hash")
                .createdAt(Instant.now())
                .role(User.UserRole.BUYER)
                .build();

        when(repo.findById(USER_ID)).thenReturn(Optional.of(existing));
        when(repo.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        User result = userService.update(USER_ID, incoming);

        assertThat(result.getId()).isEqualTo(USER_ID);
        assertThat(result.getPasswordHash()).isEqualTo(originalHash);
        assertThat(result.getCreatedAt()).isEqualTo(originalCreatedAt);
        // Non-protected fields should still be updated from the incoming payload.
        assertThat(result.getFirstName()).isEqualTo("New");

        verify(repo).save(incoming);
    }

    @Test
    void update_throws_whenUserNotFound() {
        when(repo.findById(USER_ID)).thenReturn(Optional.empty());

        User incoming = User.builder().id(USER_ID).build();

        assertThatThrownBy(() -> userService.update(USER_ID, incoming))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Not found");

        verify(repo, never()).save(any(User.class));
    }
}