-- Seed admin user for Kiwi System
-- Run after creating the database/schema (e.g. after mysql_schema.sql or Prisma migrations)
USE `kiwi_system`;

INSERT INTO `User` (`nombre`, `email`, `passwordHash`, `rol`)
VALUES ('Administrador', 'admin@localhost', '$2a$10$Tt5f28W0aA/9UK/MPbwdHuoEJtJEdavQ55fDoHu/s8QIhAGxATV0y', 'admin')
ON DUPLICATE KEY UPDATE
  `nombre` = VALUES(`nombre`),
  `passwordHash` = VALUES(`passwordHash`),
  `rol` = VALUES(`rol`);
