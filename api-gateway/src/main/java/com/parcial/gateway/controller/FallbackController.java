package com.parcial.gateway.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

import java.util.Map;

@RestController
@RequestMapping("/fallback")
public class FallbackController {

    @GetMapping("/backend")
    public Mono<ResponseEntity<Map<String, String>>> backendFallback() {
        return Mono.just(ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(Map.of(
                        "error", "Servicio backend no disponible",
                        "message", "El servicio principal está temporalmente fuera de línea. Intente nuevamente."
                )));
    }

    @GetMapping("/orders")
    public Mono<ResponseEntity<Map<String, String>>> ordersFallback() {
        return Mono.just(ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(Map.of(
                        "error", "Servicio de pedidos no disponible",
                        "message", "El servicio de pedidos está temporalmente fuera de línea. Intente nuevamente."
                )));
    }
}
