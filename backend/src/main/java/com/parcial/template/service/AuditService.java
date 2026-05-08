package com.parcial.template.service;

import com.parcial.template.dto.AuditEventResponse;
import jakarta.annotation.PostConstruct;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

@Service
public class AuditService {

    private final JdbcTemplate auditJdbcTemplate;

    public AuditService(@Qualifier("auditJdbcTemplate") JdbcTemplate auditJdbcTemplate) {
        this.auditJdbcTemplate = auditJdbcTemplate;
    }

    @PostConstruct
    void init() {
        auditJdbcTemplate.execute("""
                create table if not exists audit_events (
                    id bigserial primary key,
                    evento varchar(80) not null,
                    entidad varchar(80) not null,
                    entidad_id bigint,
                    actor_email varchar(160),
                    detalle text,
                    created_at timestamp not null default now()
                )
                """);
    }

    public void record(String evento, String entidad, Long entidadId, String actorEmail, String detalle) {
        auditJdbcTemplate.update(
                "insert into audit_events (evento, entidad, entidad_id, actor_email, detalle) values (?, ?, ?, ?, ?)",
                evento,
                entidad,
                entidadId,
                actorEmail,
                detalle
        );
    }

    public List<AuditEventResponse> latest() {
        return auditJdbcTemplate.query("""
                        select id, evento, entidad, entidad_id, actor_email, detalle, created_at
                        from audit_events
                        order by created_at desc, id desc
                        limit 50
                        """,
                (rs, rowNum) -> mapEvent(rs)
        );
    }

    public String health() {
        Integer value = auditJdbcTemplate.queryForObject("select 1", Integer.class);
        return value != null && value == 1 ? "OK" : "ERROR";
    }

    private AuditEventResponse mapEvent(ResultSet rs) throws SQLException {
        return new AuditEventResponse(
                rs.getLong("id"),
                rs.getString("evento"),
                rs.getString("entidad"),
                rs.getLong("entidad_id"),
                rs.getString("actor_email"),
                rs.getString("detalle"),
                rs.getTimestamp("created_at").toLocalDateTime()
        );
    }
}
