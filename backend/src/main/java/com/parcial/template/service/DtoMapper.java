package com.parcial.template.service;

import com.parcial.template.dto.CatalogoResponse;
import com.parcial.template.dto.ItemResponse;
import com.parcial.template.dto.UserResponse;
import com.parcial.template.entity.AppUser;
import com.parcial.template.entity.Catalogo;
import com.parcial.template.entity.Item;
import org.springframework.stereotype.Component;

@Component
public class DtoMapper {

    public UserResponse toUserResponse(AppUser user) {
        return new UserResponse(user.getId(), user.getNombre(), user.getEmail(), user.getRole());
    }

    public CatalogoResponse toCatalogoResponse(Catalogo catalogo) {
        return new CatalogoResponse(catalogo.getId(), catalogo.getCodigo(), catalogo.getNombre(), catalogo.getDescripcion());
    }

    public ItemResponse toItemResponse(Item item) {
        return new ItemResponse(
                item.getId(),
                item.getTitulo(),
                item.getDescripcion(),
                item.getSolicitanteNombre(),
                item.getContacto(),
                item.getCantidad(),
                item.getFechaObjetivo(),
                item.getStatus(),
                item.getObservacionesStaff(),
                toCatalogoResponse(item.getCatalogo()),
                toUserResponse(item.getCreatedBy()),
                item.getCreatedAt(),
                item.getUpdatedAt(),
                item.getEnviadoAt(),
                item.getRevisadoAt()
        );
    }
}
