package com.parcial.orders.service;

import com.parcial.orders.dto.PedidoRequest;
import com.parcial.orders.dto.PedidoResponse;
import com.parcial.orders.entity.Pedido;
import com.parcial.orders.entity.PedidoStatus;
import com.parcial.orders.exception.BusinessException;
import com.parcial.orders.exception.NotFoundException;
import com.parcial.orders.repository.PedidoRepository;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PedidoService {

    private final PedidoRepository pedidoRepository;

    @Transactional(readOnly = true)
    public List<PedidoResponse> list(String email, boolean admin) {
        List<Pedido> pedidos = admin
                ? pedidoRepository.findAllByOrderByCreatedAtDesc()
                : pedidoRepository.findByClienteEmailOrderByCreatedAtDesc(email);
        return pedidos.stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public PedidoResponse get(Long id, String email, boolean admin) {
        Pedido pedido = findVisible(id, email, admin);
        return toResponse(pedido);
    }

    @Transactional
    public PedidoResponse create(PedidoRequest request, String email) {
        BigDecimal total = request.precioKg()
                .multiply(request.cantidadKg())
                .setScale(2, RoundingMode.HALF_UP);

        Pedido pedido = Pedido.builder()
                .productoId(request.productoId())
                .productoNombre(request.productoNombre().trim())
                .precioKg(request.precioKg())
                .cantidadKg(request.cantidadKg())
                .total(total)
                .clienteNombre(request.clienteNombre().trim())
                .clienteEmail(email)
                .direccionEntrega(request.direccionEntrega().trim())
                .observaciones(clean(request.observaciones()))
                .status(PedidoStatus.PENDIENTE)
                .build();
        return toResponse(pedidoRepository.save(pedido));
    }

    @Transactional
    public PedidoResponse confirmar(Long id) {
        Pedido pedido = find(id);
        requireStatus(pedido, PedidoStatus.PENDIENTE, "Solo se pueden confirmar pedidos pendientes.");
        pedido.setStatus(PedidoStatus.CONFIRMADO);
        return toResponse(pedidoRepository.save(pedido));
    }

    @Transactional
    public PedidoResponse entregar(Long id) {
        Pedido pedido = find(id);
        requireStatus(pedido, PedidoStatus.CONFIRMADO, "Solo se pueden entregar pedidos confirmados.");
        pedido.setStatus(PedidoStatus.ENTREGADO);
        return toResponse(pedidoRepository.save(pedido));
    }

    @Transactional
    public PedidoResponse cancelar(Long id, String email, boolean admin) {
        Pedido pedido = findVisible(id, email, admin);
        if (pedido.getStatus() == PedidoStatus.ENTREGADO) {
            throw new BusinessException("No se puede cancelar un pedido entregado.");
        }
        pedido.setStatus(PedidoStatus.CANCELADO);
        return toResponse(pedidoRepository.save(pedido));
    }

    private Pedido findVisible(Long id, String email, boolean admin) {
        Pedido pedido = find(id);
        if (!admin && !pedido.getClienteEmail().equalsIgnoreCase(email)) {
            throw new BusinessException("No puedes ver este pedido.");
        }
        return pedido;
    }

    private Pedido find(Long id) {
        return pedidoRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Pedido no encontrado."));
    }

    private void requireStatus(Pedido pedido, PedidoStatus expected, String message) {
        if (pedido.getStatus() != expected) {
            throw new BusinessException(message + " Estado actual: " + pedido.getStatus());
        }
    }

    private String clean(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }

    private PedidoResponse toResponse(Pedido pedido) {
        return new PedidoResponse(
                pedido.getId(),
                pedido.getProductoId(),
                pedido.getProductoNombre(),
                pedido.getPrecioKg(),
                pedido.getCantidadKg(),
                pedido.getTotal(),
                pedido.getClienteNombre(),
                pedido.getClienteEmail(),
                pedido.getDireccionEntrega(),
                pedido.getObservaciones(),
                pedido.getStatus(),
                pedido.getCreatedAt(),
                pedido.getUpdatedAt()
        );
    }
}
