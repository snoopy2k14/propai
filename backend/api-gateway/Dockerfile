# ── PropAI Backend — JDK 25 + Maven 3.9.9 (pinned) ──────────────────────────
# Uses Debian-based JDK 25 (not Alpine) to avoid musl libc issues.
# Pins Maven 3.9.9 because Debian's system Maven is too old for JDK 25.
# ─────────────────────────────────────────────────────────────────────────────

ARG JAVA_VERSION=25

# ── Stage 1: Build ────────────────────────────────────────────────────────────
FROM eclipse-temurin:${JAVA_VERSION}-jdk AS builder
WORKDIR /app

# Pin Maven 3.9.9 — confirmed compatible with JDK 25
ENV MAVEN_VERSION=3.9.9
RUN apt-get update -qq \
 && apt-get install -y --no-install-recommends wget tar \
 && wget -q "https://archive.apache.org/dist/maven/maven-3/${MAVEN_VERSION}/binaries/apache-maven-${MAVEN_VERSION}-bin.tar.gz" -O /tmp/maven.tar.gz \
 && tar -xzf /tmp/maven.tar.gz -C /opt \
 && ln -s /opt/apache-maven-${MAVEN_VERSION} /opt/maven \
 && rm /tmp/maven.tar.gz \
 && apt-get clean && rm -rf /var/lib/apt/lists/*

ENV MAVEN_HOME=/opt/maven
ENV PATH="${MAVEN_HOME}/bin:${PATH}"

RUN mvn --version

# Cache dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B -q || true

# Build
COPY src ./src
RUN mvn package -DskipTests -B -q

# ── Stage 2: Runtime ──────────────────────────────────────────────────────────
FROM eclipse-temurin:${JAVA_VERSION}-jre AS runtime
WORKDIR /app

RUN apt-get update -qq \
 && apt-get install -y --no-install-recommends curl \
 && apt-get clean && rm -rf /var/lib/apt/lists/*

RUN groupadd -r propai && useradd -r -g propai -d /app propai
COPY --from=builder --chown=propai:propai /app/target/*.jar app.jar
USER propai

ENV JAVA_OPTS="\
    -XX:+UseContainerSupport \
    -XX:MaxRAMPercentage=75.0 \
    -XX:+UseZGC \
    -XX:+ZGenerational \
    -XX:+UseStringDeduplication \
    -Djava.security.egd=file:/dev/./urandom"

HEALTHCHECK --interval=30s --timeout=10s --start-period=120s --retries=3 \
    CMD bash -c 'curl -sf http://localhost:${SERVER_PORT:-8080}/actuator/health || exit 1'

ENTRYPOINT ["sh", "-c", "exec java $JAVA_OPTS -jar app.jar"]
