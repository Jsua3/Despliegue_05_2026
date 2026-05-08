# Carniceria Buen Corte

Aplicacion full-stack dockerizada para la tematica **Carniceria**. Cumple microservicios, JWT, roles, MySQL + PostgreSQL, Angular y despliegue con Docker Compose en nube publica.

## Arquitectura

- `backend/`: microservicio Spring Boot 3.2 para autenticacion JWT y CRUD de productos. Usa MySQL.
- `orders-service/`: microservicio Spring Boot 3.2 para pedidos. Usa PostgreSQL.
- `angular-frontend/`: cliente Angular 21 standalone con guards, interceptor JWT y vistas por rol.
- `mysql`: MySQL 8 para usuarios, roles y productos.
- `postgres`: PostgreSQL 16 para pedidos.
- `frontend`: Nginx puerto 80, sirve Angular y enruta:
  - `/api/pedidos` -> `orders-service:8081`
  - `/api/` -> `backend:8080`

## Roles y credenciales

- `admin@app.com` / `admin123` / `ADMIN`
- `user@app.com` / `user123` / `USER`

## Funcionalidad

- Registro y login con JWT.
- Productos de carniceria: listar, crear, editar y desactivar.
- Pedidos: crear como cliente, listar por usuario, administrar como ADMIN.
- Flujo de pedido: `PENDIENTE -> CONFIRMADO -> ENTREGADO`, con cancelacion antes de entrega.
- Vistas frontend diferentes para `ADMIN` y `USER`.

## Endpoints principales

Auth/productos, MySQL:

- `POST /api/auth/login`
- `POST /api/auth/register`
- `GET /api/auth/me`
- `GET /api/productos`
- `GET /api/productos/{id}`
- `POST /api/productos` (`ADMIN`)
- `PUT /api/productos/{id}` (`ADMIN`)
- `DELETE /api/productos/{id}` (`ADMIN`, desactiva)

Pedidos, PostgreSQL:

- `GET /api/pedidos/health`
- `GET /api/pedidos`
- `POST /api/pedidos`
- `GET /api/pedidos/{id}`
- `PATCH /api/pedidos/{id}/confirmar` (`ADMIN`)
- `PATCH /api/pedidos/{id}/entregar` (`ADMIN`)
- `PATCH /api/pedidos/{id}/cancelar`

## Ejecutar local

```bash
cp .env.example .env
docker compose down --remove-orphans
docker compose up -d --build
docker compose ps
```

URLs locales:

- Frontend: `http://localhost`
- Auth/productos: `http://localhost/api/productos`
- Pedidos: `http://localhost/api/pedidos/health`

## Builds manuales

```bash
cd backend
mvn clean package -DskipTests

cd ../orders-service
mvn clean package -DskipTests

cd ../angular-frontend
npm install
npm run build -- --configuration production
```

## Pruebas rapidas

```bash
curl -i http://localhost/api/productos
curl -i http://localhost/api/pedidos/health
```

Login:

```bash
curl -X POST http://localhost/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@app.com","password":"admin123"}'
```

## Deploy EC2 Ubuntu 24.04

Key local Windows:

```powershell
ssh -i "D:\Sua_Files\Downloads\almacen-key.pem" ubuntu@18.230.85.195
```

Si SSH falla por permisos:

```powershell
icacls "D:\Sua_Files\Downloads\almacen-key.pem" /inheritance:r
icacls "D:\Sua_Files\Downloads\almacen-key.pem" /remove:g "*S-1-5-11" "*S-1-5-32-545" "*S-1-1-0"
icacls "D:\Sua_Files\Downloads\almacen-key.pem" /grant:r "$env:USERNAME:R"
```

En EC2:

```bash
git clone https://github.com/Jsua3/Despliegue_05_2026.git /home/ubuntu/Despliegue_05_2026
cd /home/ubuntu/Despliegue_05_2026
chmod +x deploy.sh
./deploy.sh
```

El script crea swap de 2GB, instala Docker/Git/Curl si hace falta, crea `.env`, reconstruye contenedores, muestra logs y prueba frontend/productos/pedidos.

## Entrega

- GitHub: `https://github.com/Jsua3/Despliegue_05_2026.git`
- Backend publico esperado: `http://IP_PUBLICA/api/productos` y `http://IP_PUBLICA/api/pedidos/health`
- Frontend publico esperado: `http://IP_PUBLICA`
