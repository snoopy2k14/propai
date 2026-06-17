package com.propai.aichatservice.controller;
import com.propai.aichatservice.service.AiChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;
import java.util.Map;

@RestController @RequestMapping("/api/v1/chat")
@RequiredArgsConstructor @CrossOrigin(origins = "*")
public class ChatController {
    private final AiChatService svc;

    @PostMapping("/message")
    public Mono<ResponseEntity<Map<String,Object>>> chat(
            @RequestBody Map<String,String> req,
            @RequestHeader(value="X-User-Id",required=false) String userId) {
        return svc.chat(req.get("sessionId"), req.get("message"), userId).map(ResponseEntity::ok);
    }
}
