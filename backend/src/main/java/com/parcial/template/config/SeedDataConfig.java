package com.parcial.template.config;

import com.parcial.template.entity.AppUser;
import com.parcial.template.entity.Catalogo;
import com.parcial.template.entity.Role;
import com.parcial.template.repository.AppUserRepository;
import com.parcial.template.repository.CatalogoRepository;
import com.parcial.template.repository.ProductoRepository;
import java.math.BigDecimal;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
public class SeedDataConfig {

    private final PasswordEncoder passwordEncoder;

    @Value("${app.seed.enabled:true}")
    private boolean seedEnabled;

    @Bean
    CommandLineRunner seedData(
            AppUserRepository userRepository,
            CatalogoRepository catalogoRepository,
            ProductoRepository productoRepository
    ) {
        return args -> {
            if (!seedEnabled) {
                return;
            }

            createUserIfMissing(userRepository, "Administrador Carniceria", "admin@app.com", "admin123", Role.ADMIN);
            createUserIfMissing(userRepository, "Cliente Demo", "user@app.com", "user123", Role.USER);

            createCatalogoIfMissing(catalogoRepository, "RES", "Carne de res", "Cortes frescos de res para venta por kilogramo.", 1);
            createCatalogoIfMissing(catalogoRepository, "CERDO", "Carne de cerdo", "Cortes de cerdo, costilla, lomo y chuleta.", 2);
            createCatalogoIfMissing(catalogoRepository, "POLLO", "Pollo", "Pollo entero, pechuga, muslos y alas.", 3);
            createCatalogoIfMissing(catalogoRepository, "EMBUTIDOS", "Embutidos", "Chorizos, salchichas y productos preparados.", 4);

            createProductoIfMissing(productoRepository, "Punta de anca", "Res", "Corte premium para asar, fresco y seleccionado.", "42000", "35");
            createProductoIfMissing(productoRepository, "Costilla de cerdo", "Cerdo", "Costilla carnuda ideal para BBQ o guisos.", "28000", "45");
            createProductoIfMissing(productoRepository, "Pechuga de pollo", "Pollo", "Pechuga limpia por kilogramo.", "18500", "60");
            createProductoIfMissing(productoRepository, "Chorizo artesanal", "Embutidos", "Chorizo fresco preparado en la carniceria.", "22000", "30");
            createProductoIfMissing(productoRepository, "Carne molida especial", "Res", "Mezcla magra para hamburguesas, pasta o rellenos.", "26000", "40");
        };
    }

    private void createUserIfMissing(AppUserRepository repository, String nombre, String email, String password, Role role) {
        String normalizedEmail = email.toLowerCase();
        if (repository.existsByEmail(normalizedEmail)) {
            return;
        }

        repository.save(AppUser.builder()
                .nombre(nombre)
                .email(normalizedEmail)
                .password(passwordEncoder.encode(password))
                .role(role)
                .build());
    }

    private void createCatalogoIfMissing(CatalogoRepository repository, String codigo, String nombre, String descripcion, int orden) {
        if (repository.existsByCodigo(codigo)) {
            return;
        }

        repository.save(Catalogo.builder()
                .codigo(codigo)
                .nombre(nombre)
                .descripcion(descripcion)
                .activo(true)
                .orden(orden)
                .build());
    }

    private void createProductoIfMissing(
            ProductoRepository repository,
            String nombre,
            String categoria,
            String descripcion,
            String precioKg,
            String stockKg
    ) {
        if (repository.existsByNombreIgnoreCase(nombre)) {
            return;
        }

        repository.save(com.parcial.template.entity.Producto.builder()
                .nombre(nombre)
                .categoria(categoria)
                .descripcion(descripcion)
                .precioKg(new BigDecimal(precioKg))
                .stockKg(new BigDecimal(stockKg))
                .activo(true)
                .build());
    }
}
