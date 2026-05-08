package com.parcial.template.service;

import com.parcial.template.dto.CatalogoResponse;
import com.parcial.template.exception.NotFoundException;
import com.parcial.template.repository.CatalogoRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CatalogoService {

    private final CatalogoRepository catalogoRepository;
    private final DtoMapper mapper;

    public List<CatalogoResponse> listPublicCatalogos() {
        return catalogoRepository.findByActivoTrueOrderByOrdenAscNombreAsc()
                .stream()
                .map(mapper::toCatalogoResponse)
                .toList();
    }

    public CatalogoResponse getPublicCatalogo(Long id) {
        return catalogoRepository.findByIdAndActivoTrue(id)
                .map(mapper::toCatalogoResponse)
                .orElseThrow(() -> new NotFoundException("Catalogo no encontrado."));
    }
}
