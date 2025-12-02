# Kiwi System

Aplicación ERP/CRM básica construida con Next.js (App Router), API Routes y Prisma sobre MySQL. Incluye autenticación con JWT, dashboard y CRUD completos para usuarios, clientes, productos, proveedores, ventas y compras.

## Requisitos
- Node.js 18+
- Base de datos MySQL accesible

## Configuración
1. Instala dependencias:
   ```bash
   npm install
   ```
2. Copia el archivo de entorno y ajusta los valores:
   ```bash
   cp .env.example .env
   ```
   - `DATABASE_URL`: cadena de conexión MySQL
   - `JWT_SECRET`: secreto para firmar los tokens
3. Crea la base de datos (dos opciones):
   - **Usando Prisma (recomendado):**
     ```bash
     npx prisma migrate dev --name init
     ```
   - **Importando el SQL listo para MySQL:**
     ```bash
     mysql -u <usuario> -p < prisma/mysql_schema.sql
     ```
     Esto crea la base `kiwi_system` con todas las tablas y llaves foráneas alineadas con `prisma/schema.prisma`.
4. Genera el cliente de Prisma:
   ```bash
   npm run prisma:generate
   ```
5. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

## Estructura
- `app/`: rutas del frontend y API (App Router)
- `app/api/*`: endpoints REST protegidos por JWT
- `lib/`: utilidades de base de datos, autenticación y validación
- `prisma/schema.prisma`: modelos de datos para User, Cliente, Producto, Proveedor, Venta/Compra e items
- `components/`: layout, UI y formularios reutilizables

## Autenticación
- Registro y login via `/api/auth/register` y `/api/auth/login`
- Los tokens JWT se almacenan en cookie httpOnly y se validan en `middleware.ts`
- Solo usuarios con rol `admin` pueden gestionar otros usuarios

## Scripts
- `npm run dev`: entorno de desarrollo
- `npm run build`: build de producción
- `npm run start`: arranque en producción
- `npm run lint`: lint de Next.js
- `npm run prisma:generate`: generar cliente Prisma

## Notas
- Al crear ventas se descuenta el stock de cada producto.
- Al registrar compras se incrementa el stock.
- Las vistas de listado incluyen filtros básicos y formularios para crear/editar registros.
