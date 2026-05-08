package com.parcial.template.controller;

import com.parcial.template.dto.CatalogoResponse;
import com.parcial.template.service.CatalogoService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/catalogos")
@RequiredArgsConstructor
public class CatalogoController {

    private final CatalogoService catalogoService;

    @GetMapping
    public List<CatalogoResponse> list() {
        return catalogoService.listPublicCatalogos();
    }

    @GetMapping("/{id}")
    public CatalogoResponse get(@PathVariable Long id) {
        return catalogoService.getPublicCatalogo(id);
    }
}
