# Plantilla Fullstack Parcial 2026

Base reutilizable para parcial: Spring Boot 3.2, Angular 21, MySQL 8, Docker Compose y Nginx. La app queda preparada para adaptar rapidamente una tematica tipo restaurante, clinica, tienda, biblioteca, hotel, universidad, taller o inventario.

## Stack

- Backend: Java 17, Spring Boot 3.2.12, Maven, Spring Security, JWT, JPA, MySQL, Lombok, Validation.
- Frontend: Angular 21 standalone, Signals, Router, Reactive Forms, HttpClient, interceptor JWT, Tailwind CSS.
- Produccion: Docker Compose, MySQL 8, backend en `8080`, frontend Nginx en `80`, proxy `/api/ -> http://backend:8080/api/`.

## Credenciales demo

- `admin@app.com` / `admin123` / `ADMIN`
- `staff@app.com` / `staff123` / `STAFF`
- `user@app.com` / `user123` / `USER`

## Endpoints base

- `POST /api/auth/login`
- `POST /api/auth/register`
- `GET /api/auth/me`
- `GET /api/catalogos`
- `GET /api/catalogos/{id}`
- `GET /api/items`
- `POST /api/items`
- `GET /api/items/{id}`
- `PATCH /api/items/{id}/enviar`
- `PATCH /api/items/{id}/revisar`
- `PATCH /api/items/{id}/aprobar`
- `PATCH /api/items/{id}/rechazar`

Flujo base: `BORRADOR -> ENVIADO -> EN_REVISION -> APROBADO | RECHAZADO`.

## Ejecutar local

```bash
cp .env.example .env
docker compose up -d mysql
cd backend
mvn clean package -DskipTests
mvn spring-boot:run
```

En otra terminal:

```bash
cd angular-frontend
npm install
npm start
```

Frontend local: `http://localhost:4200`

Backend local: `http://localhost:8080/api/catalogos`

## Build requerido antes de desplegar

```bash
cd backend
mvn clean package -DskipTests

cd ../angular-frontend
npm run build -- --configuration production
```

`environment.production.ts` usa `apiUrl: '/api'`, listo para Nginx.

## Docker Compose

```bash
cp .env.example .env
docker compose down --remove-orphans
docker compose up -d --build
docker compose ps
curl -i http://localhost
curl -i http://localhost:8080/api/catalogos
curl -i http://localhost/api/catalogos
```

## Adaptar tematica en menos de 20 minutos

1. Nombre visual:
   Cambia `Plantilla Parcial` en `angular-frontend/src/app/shared/navbar/navbar.ts`, `angular-frontend/src/app/pages/auth/login/login.ts`, `angular-frontend/src/app/pages/auth/registro/registro.ts` y `angular-frontend/src/index.html`.

2. Catalogos iniciales:
   Edita `backend/src/main/java/com/parcial/template/config/SeedDataConfig.java`. Renombra `OPCION_A` a categorias reales como mesa, cita, reserva, producto, servicio, libro o habitacion.

3. Entidad principal:
   Si no hay tiempo, conserva `Item` como nombre interno y cambia textos frontend. Si el profesor exige nombres exactos, renombra `Item`, `ItemResponse`, `ItemCreateRequest`, `ItemService`, `ItemController` y rutas `/api/items`.

4. Flujo:
   Para cambiar estados, edita `backend/src/main/java/com/parcial/template/entity/ItemStatus.java`, reglas en `ItemService.java` y etiquetas en `angular-frontend/src/app/shared/status-badge/status-badge.ts`.

5. Campos del formulario:
   Ajusta `ItemCreateRequest.java`, entidad `Item.java` y `angular-frontend/src/app/pages/items/item-create/item-create.ts`. Mantener `titulo`, `descripcion`, `catalogo` y `status` ahorra tiempo.

6. Textos frontend:
   Busca `Item`, `Catalogo`, `Solicitud`, `flujo generico` y reemplaza por el vocabulario del negocio.

7. Variables de despliegue:
   Cambia `.env` en servidor o `.env.example`: `MYSQL_PASSWORD`, `JWT_SECRET`, `CORS_ALLOWED_ORIGINS`.

8. Verificacion express:
   Crea item con `user@app.com`, envialo, entra con `staff@app.com`, pasalo a revision y apruebalo.

## Deploy EC2 Ubuntu 24.04 por SSH

Key local Windows:

```powershell
ssh -i "D:\Sua_Files\Downloads\almacen-key.pem" ubuntu@18.230.85.195
```

Si SSH falla por permisos en Windows:

```powershell
icacls "D:\Sua_Files\Downloads\almacen-key.pem" /inheritance:r
icacls "D:\Sua_Files\Downloads\almacen-key.pem" /remove:g "*S-1-5-11" "*S-1-5-32-545" "*S-1-1-0"
icacls "D:\Sua_Files\Downloads\almacen-key.pem" /grant:r "$env:USERNAME:R"
```

En la instancia:

```bash
git clone https://github.com/Jsua3/Despliegue_05_2026.git /home/ubuntu/Despliegue_05_2026
cd /home/ubuntu/Despliegue_05_2026
chmod +x deploy.sh
./deploy.sh
```

El script crea swap de 2GB, instala Docker/Git/Curl si hace falta, crea `.env`, ejecuta `docker compose down --remove-orphans`, `docker compose up -d --build`, muestra logs y prueba:

- `curl -i http://localhost`
- `curl -i http://localhost:8080/api/catalogos`
- `curl -i http://localhost/api/catalogos`

## Alternativa SSM Run Command

Usar si SSH no entra y la instancia tiene SSM Agent activo con permisos IAM.

```bash
aws ssm send-command \
  --document-name "AWS-RunShellScript" \
  --targets "Key=instanceids,Values=i-xxxxxxxxxxxxxxxxx" \
  --parameters 'commands=["git clone https://github.com/Jsua3/Despliegue_05_2026.git /home/ubuntu/Despliegue_05_2026 || true","cd /home/ubuntu/Despliegue_05_2026 && git pull --ff-only || true","cd /home/ubuntu/Despliegue_05_2026 && chmod +x deploy.sh && ./deploy.sh"]' \
  --comment "Deploy plantilla parcial"
```

## GitHub

Repositorio destino:

```bash
git init
git branch -M main
git remote add origin https://github.com/Jsua3/Despliegue_05_2026.git
git add .
git commit -m "Crear plantilla fullstack para parcial"
git push -u origin main
```

## Notas importantes

- En templates Angular 21, si escribes correos estaticos usa `user&#64;app.com`.
- No devolver entidades JPA directamente si agregas relaciones bidireccionales: usa DTOs como en esta plantilla.
- En Ubuntu usa `docker compose`, no `docker-compose`.
- En instancia pequena, conserva el swap de `deploy.sh`.
