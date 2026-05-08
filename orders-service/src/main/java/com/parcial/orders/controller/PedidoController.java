package com.parcial.orders.controller;

import com.parcial.orders.dto.HealthResponse;
import com.parcial.orders.dto.PedidoRequest;
import com.parcial.orders.dto.PedidoResponse;
import com.parcial.orders.service.PedidoService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/pedidos")
@RequiredArgsConstructor
public class PedidoController {

    private final PedidoService pedidoService;
    private final JdbcTemplate jdbcTemplate;

    @GetMapping("/health")
    public HealthResponse health() {
        Integer value = jdbcTemplate.queryForObject("select 1", Integer.class);
        return new HealthResponse("orders-service", value != null && value == 1 ? "OK" : "ERROR");
    }

    @GetMapping
    public List<PedidoResponse> list(Authentication authentication) {
        return pedidoService.list(authentication.getName(), isAdmin(authentication));
    }

    @GetMapping("/{id}")
    public PedidoResponse get(@PathVariable Long id, Authentication authentication) {
        return pedidoService.get(id, authentication.getName(), isAdmin(authentication));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PedidoResponse create(@Valid @RequestBody PedidoRequest request, Authentication authentication) {
        return pedidoService.create(request, authentication.getName());
    }

    @PatchMapping("/{id}/confirmar")
    @PreAuthorize("hasRole('ADMIN')")
    public PedidoResponse confirmar(@PathVariable Long id) {
        return pedidoService.confirmar(id);
    }

    @PatchMapping("/{id}/entregar")
    @PreAuthorize("hasRole('ADMIN')")
    public PedidoResponse entregar(@PathVariable Long id) {
        return pedidoService.entregar(id);
    }

    @PatchMapping("/{id}/cancelar")
    public PedidoResponse cancelar(@PathVariable Long id, Authentication authentication) {
        return pedidoService.cancelar(id, authentication.getName(), isAdmin(authentication));
    }

    private boolean isAdmin(Authentication authentication) {
        return authentication.getAuthorities().stream()
                .anyMatch(authority -> authority.getAuthority().equals("ROLE_ADMIN"));
    }
}
