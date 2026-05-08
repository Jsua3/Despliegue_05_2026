package com.parcial.template.config;

import com.parcial.template.entity.AppUser;
import com.parcial.template.entity.Catalogo;
import com.parcial.template.entity.Role;
import com.parcial.template.repository.AppUserRepository;
import com.parcial.template.repository.CatalogoRepository;
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
    CommandLineRunner seedData(AppUserRepository userRepository, CatalogoRepository catalogoRepository) {
        return args -> {
            if (!seedEnabled) {
                return;
            }

            createUserIfMissing(userRepository, "Administrador", "admin@app.com", "admin123", Role.ADMIN);
            createUserIfMissing(userRepository, "Equipo Staff", "staff@app.com", "staff123", Role.STAFF);
            createUserIfMissing(userRepository, "Usuario Demo", "user@app.com", "user123", Role.USER);

            createCatalogoIfMissing(catalogoRepository, "OPCION_A", "Solicitud General", "Caso base para solicitudes, tramites o requerimientos comunes.", 1);
            createCatalogoIfMissing(catalogoRepository, "OPCION_B", "Reserva / Agendamiento", "Opcion adaptable a reservas, citas, habitaciones o turnos.", 2);
            createCatalogoIfMissing(catalogoRepository, "OPCION_C", "Pedido / Orden", "Opcion adaptable a compras, pedidos, ventas o entregas.", 3);
            createCatalogoIfMissing(catalogoRepository, "OPCION_D", "Servicio / Reparacion", "Opcion adaptable a talleres, soporte tecnico o servicios internos.", 4);
            createCatalogoIfMissing(catalogoRepository, "OPCION_E", "Inscripcion / Registro", "Opcion adaptable a cursos, eventos, programas o membresias.", 5);
            createCatalogoIfMissing(catalogoRepository, "OPCION_F", "Movimiento / Prestamo", "Opcion adaptable a inventario, biblioteca, traslados o prestamos.", 6);
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
}
