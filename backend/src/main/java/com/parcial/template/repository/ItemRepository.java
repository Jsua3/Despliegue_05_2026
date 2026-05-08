package com.parcial.template.repository;

import com.parcial.template.entity.Item;
import com.parcial.template.entity.ItemStatus;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ItemRepository extends JpaRepository<Item, Long> {

    List<Item> findAllByOrderByCreatedAtDesc();

    List<Item> findAllByCreatedByIdOrderByCreatedAtDesc(Long createdById);

    long countByStatus(ItemStatus status);

    long countByCreatedByIdAndStatus(Long createdById, ItemStatus status);
}
