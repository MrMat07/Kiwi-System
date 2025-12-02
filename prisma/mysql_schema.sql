-- MySQL schema for Kiwi-System ERP/CRM
-- Creates database, tables, indexes and foreign keys aligned with prisma/schema.prisma

CREATE DATABASE IF NOT EXISTS `kiwi_system` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */;
USE `kiwi_system`;

-- Users
CREATE TABLE IF NOT EXISTS `User` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(191) NOT NULL,
  `email` VARCHAR(191) NOT NULL,
  `passwordHash` VARCHAR(191) NOT NULL,
  `rol` VARCHAR(50) NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `User_email_key` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Clientes
CREATE TABLE IF NOT EXISTS `Cliente` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(191) NOT NULL,
  `tipo` VARCHAR(50) NOT NULL,
  `telefono` VARCHAR(191) NULL,
  `email` VARCHAR(191) NULL,
  `direccion` VARCHAR(191) NULL,
  `notas` TEXT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Proveedores
CREATE TABLE IF NOT EXISTS `Proveedor` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(191) NOT NULL,
  `telefono` VARCHAR(191) NULL,
  `email` VARCHAR(191) NULL,
  `direccion` VARCHAR(191) NULL,
  `notas` TEXT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Productos
CREATE TABLE IF NOT EXISTS `Producto` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(191) NOT NULL,
  `sku` VARCHAR(191) NOT NULL,
  `precio` DOUBLE NOT NULL,
  `stock` INT NOT NULL,
  `categoria` VARCHAR(191) NULL,
  `descripcion` TEXT NULL,
  `activo` TINYINT(1) NOT NULL DEFAULT 1,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `proveedorId` INT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Producto_sku_key` (`sku`),
  KEY `Producto_proveedorId_fkey` (`proveedorId`),
  CONSTRAINT `Producto_proveedorId_fkey` FOREIGN KEY (`proveedorId`) REFERENCES `Proveedor`(`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Ventas
CREATE TABLE IF NOT EXISTS `Venta` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `fecha` DATETIME(3) NOT NULL,
  `total` DOUBLE NOT NULL,
  `estado` VARCHAR(50) NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `clienteId` INT NOT NULL,
  `usuarioId` INT NULL,
  PRIMARY KEY (`id`),
  KEY `Venta_clienteId_fkey` (`clienteId`),
  KEY `Venta_usuarioId_fkey` (`usuarioId`),
  CONSTRAINT `Venta_clienteId_fkey` FOREIGN KEY (`clienteId`) REFERENCES `Cliente`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `Venta_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Venta Items
CREATE TABLE IF NOT EXISTS `VentaItem` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `cantidad` INT NOT NULL,
  `precioUnitario` DOUBLE NOT NULL,
  `subtotal` DOUBLE NOT NULL,
  `ventaId` INT NOT NULL,
  `productoId` INT NOT NULL,
  PRIMARY KEY (`id`),
  KEY `VentaItem_ventaId_fkey` (`ventaId`),
  KEY `VentaItem_productoId_fkey` (`productoId`),
  CONSTRAINT `VentaItem_ventaId_fkey` FOREIGN KEY (`ventaId`) REFERENCES `Venta`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `VentaItem_productoId_fkey` FOREIGN KEY (`productoId`) REFERENCES `Producto`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Compras
CREATE TABLE IF NOT EXISTS `Compra` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `fecha` DATETIME(3) NOT NULL,
  `total` DOUBLE NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `proveedorId` INT NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Compra_proveedorId_fkey` (`proveedorId`),
  CONSTRAINT `Compra_proveedorId_fkey` FOREIGN KEY (`proveedorId`) REFERENCES `Proveedor`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Compra Items
CREATE TABLE IF NOT EXISTS `CompraItem` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `cantidad` INT NOT NULL,
  `precioUnitario` DOUBLE NOT NULL,
  `subtotal` DOUBLE NOT NULL,
  `compraId` INT NOT NULL,
  `productoId` INT NOT NULL,
  PRIMARY KEY (`id`),
  KEY `CompraItem_compraId_fkey` (`compraId`),
  KEY `CompraItem_productoId_fkey` (`productoId`),
  CONSTRAINT `CompraItem_compraId_fkey` FOREIGN KEY (`compraId`) REFERENCES `Compra`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `CompraItem_productoId_fkey` FOREIGN KEY (`productoId`) REFERENCES `Producto`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Optional: seed an admin user placeholder (remove if not needed)
-- INSERT INTO `User` (`nombre`, `email`, `passwordHash`, `rol`) VALUES ('Admin', 'admin@example.com', '<hashed-password>', 'admin');
