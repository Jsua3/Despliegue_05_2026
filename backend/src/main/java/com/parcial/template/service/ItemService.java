package com.parcial.template.service;

import com.parcial.template.dto.ItemCreateRequest;
import com.parcial.template.dto.ItemResponse;
import com.parcial.template.dto.StaffDecisionRequest;
import com.parcial.template.entity.AppUser;
import com.parcial.template.entity.Catalogo;
import com.parcial.template.entity.Item;
import com.parcial.template.entity.ItemStatus;
import com.parcial.template.entity.Role;
import com.parcial.template.exception.BusinessException;
import com.parcial.template.exception.NotFoundException;
import com.parcial.template.repository.CatalogoRepository;
import com.parcial.template.repository.ItemRepository;
import java.time.LocalDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ItemService {

    private final ItemRepository itemRepository;
    private final CatalogoRepository catalogoRepository;
    private final DtoMapper mapper;
    private final AuditService auditService;

    @Transactional(readOnly = true)
    public List<ItemResponse> list(AppUser user) {
        List<Item> items = isStaff(user)
                ? itemRepository.findAllByOrderByCreatedAtDesc()
                : itemRepository.findAllByCreatedByIdOrderByCreatedAtDesc(user.getId());

        return items.stream()
                .map(mapper::toItemResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public ItemResponse getById(Long id, AppUser user) {
        return mapper.toItemResponse(findVisibleItem(id, user));
    }

    @Transactional
    public ItemResponse create(ItemCreateRequest request, AppUser user) {
        Catalogo catalogo = catalogoRepository.findByIdAndActivoTrue(request.catalogoId())
                .orElseThrow(() -> new NotFoundException("Catalogo no encontrado."));

        Item item = Item.builder()
                .titulo(request.titulo().trim())
                .descripcion(request.descripcion().trim())
                .solicitanteNombre(request.solicitanteNombre().trim())
                .contacto(request.contacto().trim())
                .cantidad(request.cantidad() == null ? 1 : request.cantidad())
                .fechaObjetivo(request.fechaObjetivo())
                .status(ItemStatus.BORRADOR)
                .catalogo(catalogo)
                .createdBy(user)
                .build();

        Item saved = itemRepository.save(item);
        auditService.record("ITEM_CREADO", "Item", saved.getId(), user.getEmail(), "Item creado en estado BORRADOR.");
        return mapper.toItemResponse(saved);
    }

    @Transactional
    public ItemResponse enviar(Long id, AppUser user) {
        Item item = findVisibleItem(id, user);
        ensureOwner(item, user);
        requireStatus(item, ItemStatus.BORRADOR, "Solo se pueden enviar items en borrador.");

        item.setStatus(ItemStatus.ENVIADO);
        item.setEnviadoAt(LocalDateTime.now());
        Item saved = itemRepository.save(item);
        auditService.record("ITEM_ENVIADO", "Item", saved.getId(), user.getEmail(), "Cambio BORRADOR -> ENVIADO.");
        return mapper.toItemResponse(saved);
    }

    @Transactional
    public ItemResponse revisar(Long id, StaffDecisionRequest request, AppUser user) {
        Item item = findAnyItem(id);
        requireStatus(item, ItemStatus.ENVIADO, "Solo se pueden pasar a revision los items enviados.");

        item.setStatus(ItemStatus.EN_REVISION);
        item.setObservacionesStaff(cleanObservaciones(request));
        item.setRevisadoAt(LocalDateTime.now());
        Item saved = itemRepository.save(item);
        auditService.record("ITEM_EN_REVISION", "Item", saved.getId(), user.getEmail(), "Cambio ENVIADO -> EN_REVISION.");
        return mapper.toItemResponse(saved);
    }

    @Transactional
    public ItemResponse aprobar(Long id, StaffDecisionRequest request, AppUser user) {
        Item item = findAnyItem(id);
        requireStatus(item, ItemStatus.EN_REVISION, "Solo se pueden aprobar items en revision.");

        item.setStatus(ItemStatus.APROBADO);
        item.setObservacionesStaff(cleanObservaciones(request));
        item.setRevisadoAt(LocalDateTime.now());
        Item saved = itemRepository.save(item);
        auditService.record("ITEM_APROBADO", "Item", saved.getId(), user.getEmail(), "Cambio EN_REVISION -> APROBADO.");
        return mapper.toItemResponse(saved);
    }

    @Transactional
    public ItemResponse rechazar(Long id, StaffDecisionRequest request, AppUser user) {
        Item item = findAnyItem(id);
        requireStatus(item, ItemStatus.EN_REVISION, "Solo se pueden rechazar items en revision.");

        item.setStatus(ItemStatus.RECHAZADO);
        item.setObservacionesStaff(cleanObservaciones(request));
        item.setRevisadoAt(LocalDateTime.now());
        Item saved = itemRepository.save(item);
        auditService.record("ITEM_RECHAZADO", "Item", saved.getId(), user.getEmail(), "Cambio EN_REVISION -> RECHAZADO.");
        return mapper.toItemResponse(saved);
    }

    private Item findVisibleItem(Long id, AppUser user) {
        Item item = findAnyItem(id);
        if (!isStaff(user) && !item.getCreatedBy().getId().equals(user.getId())) {
            throw new BusinessException("No puedes ver este item.");
        }
        return item;
    }

    private Item findAnyItem(Long id) {
        return itemRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Item no encontrado."));
    }

    private void ensureOwner(Item item, AppUser user) {
        if (!item.getCreatedBy().getId().equals(user.getId())) {
            throw new BusinessException("Solo el creador puede enviar este item.");
        }
    }

    private void requireStatus(Item item, ItemStatus expected, String message) {
        if (item.getStatus() != expected) {
            throw new BusinessException(message + " Estado actual: " + item.getStatus());
        }
    }

    private boolean isStaff(AppUser user) {
        return user.getRole() == Role.STAFF || user.getRole() == Role.ADMIN;
    }

    private String cleanObservaciones(StaffDecisionRequest request) {
        if (request == null || request.observaciones() == null || request.observaciones().isBlank()) {
            return null;
        }
        return request.observaciones().trim();
    }
}
