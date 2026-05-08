package com.parcial.template.repository;

import com.parcial.template.entity.Catalogo;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CatalogoRepository extends JpaRepository<Catalogo, Long> {

    List<Catalogo> findByActivoTrueOrderByOrdenAscNombreAsc();

    Optional<Catalogo> findByIdAndActivoTrue(Long id);

    boolean existsByCodigo(String codigo);
}
