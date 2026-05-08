package com.parcial.orders.repository;

import com.parcial.orders.entity.Pedido;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {

    List<Pedido> findAllByOrderByCreatedAtDesc();

    List<Pedido> findByClienteEmailOrderByCreatedAtDesc(String clienteEmail);
}
