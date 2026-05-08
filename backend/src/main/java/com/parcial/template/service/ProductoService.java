package com.parcial.template.service;

import com.parcial.template.dto.ProductoRequest;
import com.parcial.template.dto.ProductoResponse;
import com.parcial.template.entity.Producto;
import com.parcial.template.exception.BusinessException;
import com.parcial.template.exception.NotFoundException;
import com.parcial.template.repository.ProductoRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ProductoService {

    private final ProductoRepository productoRepository;

    @Transactional(readOnly = true)
    public List<ProductoResponse> list(boolean incluirInactivos) {
        List<Producto> productos = incluirInactivos
                ? productoRepository.findAllByOrderByNombreAsc()
                : productoRepository.findByActivoTrueOrderByNombreAsc();
        return productos.stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public ProductoResponse get(Long id) {
        return productoRepository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new NotFoundException("Producto no encontrado."));
    }

    @Transactional
    public ProductoResponse create(ProductoRequest request) {
        if (productoRepository.existsByNombreIgnoreCase(request.nombre().trim())) {
            throw new BusinessException("Ya existe un producto con ese nombre.");
        }
        Producto producto = Producto.builder()
                .nombre(request.nombre().trim())
                .categoria(request.categoria().trim())
                .precioKg(request.precioKg())
                .stockKg(request.stockKg())
                .descripcion(request.descripcion().trim())
                .activo(request.activo() == null || request.activo())
                .build();
        return toResponse(productoRepository.save(producto));
    }

    @Transactional
    public ProductoResponse update(Long id, ProductoRequest request) {
        Producto producto = findEntity(id);
        producto.setNombre(request.nombre().trim());
        producto.setCategoria(request.categoria().trim());
        producto.setPrecioKg(request.precioKg());
        producto.setStockKg(request.stockKg());
        producto.setDescripcion(request.descripcion().trim());
        producto.setActivo(request.activo() == null || request.activo());
        return toResponse(productoRepository.save(producto));
    }

    @Transactional
    public void delete(Long id) {
        Producto producto = findEntity(id);
        producto.setActivo(false);
        productoRepository.save(producto);
    }

    private Producto findEntity(Long id) {
        return productoRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Producto no encontrado."));
    }

    private ProductoResponse toResponse(Producto producto) {
        return new ProductoResponse(
                producto.getId(),
                producto.getNombre(),
                producto.getCategoria(),
                producto.getPrecioKg(),
                producto.getStockKg(),
                producto.getDescripcion(),
                producto.getActivo(),
                producto.getCreatedAt(),
                producto.getUpdatedAt()
        );
    }
}
