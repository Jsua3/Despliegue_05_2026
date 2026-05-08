package com.parcial.template.service;

import com.parcial.template.dto.DashboardSummaryResponse;
import com.parcial.template.entity.AppUser;
import com.parcial.template.entity.ItemStatus;
import com.parcial.template.entity.Role;
import com.parcial.template.repository.CatalogoRepository;
import com.parcial.template.repository.ItemRepository;
import java.util.Arrays;
import java.util.EnumMap;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final ItemRepository itemRepository;
    private final CatalogoRepository catalogoRepository;

    public DashboardSummaryResponse resumen(AppUser user) {
        boolean staff = user.getRole() == Role.STAFF || user.getRole() == Role.ADMIN;
        Map<ItemStatus, Long> counts = new EnumMap<>(ItemStatus.class);

        Arrays.stream(ItemStatus.values()).forEach(status -> counts.put(
                status,
                staff ? itemRepository.countByStatus(status) : itemRepository.countByCreatedByIdAndStatus(user.getId(), status)
        ));

        long total = counts.values().stream().mapToLong(Long::longValue).sum();
        long catalogos = catalogoRepository.findByActivoTrueOrderByOrdenAscNombreAsc().size();
        return new DashboardSummaryResponse(total, catalogos, counts);
    }
}
