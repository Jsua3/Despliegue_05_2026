package com.parcial.template.controller;

import com.parcial.template.dto.ItemCreateRequest;
import com.parcial.template.dto.ItemResponse;
import com.parcial.template.dto.StaffDecisionRequest;
import com.parcial.template.entity.AppUser;
import com.parcial.template.service.ItemService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/items")
@RequiredArgsConstructor
public class ItemController {

    private final ItemService itemService;

    @GetMapping
    public List<ItemResponse> list(@AuthenticationPrincipal AppUser user) {
        return itemService.list(user);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ItemResponse create(@Valid @RequestBody ItemCreateRequest request, @AuthenticationPrincipal AppUser user) {
        return itemService.create(request, user);
    }

    @GetMapping("/{id}")
    public ItemResponse get(@PathVariable Long id, @AuthenticationPrincipal AppUser user) {
        return itemService.getById(id, user);
    }

    @PatchMapping("/{id}/enviar")
    public ItemResponse enviar(@PathVariable Long id, @AuthenticationPrincipal AppUser user) {
        return itemService.enviar(id, user);
    }

    @PatchMapping("/{id}/revisar")
    @PreAuthorize("hasAnyRole('STAFF','ADMIN')")
    public ItemResponse revisar(@PathVariable Long id, @RequestBody(required = false) StaffDecisionRequest request) {
        return itemService.revisar(id, request);
    }

    @PatchMapping("/{id}/aprobar")
    @PreAuthorize("hasAnyRole('STAFF','ADMIN')")
    public ItemResponse aprobar(@PathVariable Long id, @RequestBody(required = false) StaffDecisionRequest request) {
        return itemService.aprobar(id, request);
    }

    @PatchMapping("/{id}/rechazar")
    @PreAuthorize("hasAnyRole('STAFF','ADMIN')")
    public ItemResponse rechazar(@PathVariable Long id, @RequestBody(required = false) StaffDecisionRequest request) {
        return itemService.rechazar(id, request);
    }
}
