-- Seed admin user for Kiwi System
-- Run after creating the database/schema (e.g. after mysql_schema.sql or Prisma migrations)
USE `kiwi_system`;

INSERT INTO `User` (`nombre`, `email`, `passwordHash`, `rol`)
VALUES ('Administrador', 'admin@localhost', '$2a$10$/FhfQ9dvAc1h35TSjJ9f4uKTt.humFy2EzFhhPkVCT2GLUNS3eSXC', 'admin')
ON DUPLICATE KEY UPDATE
  `nombre` = VALUES(`nombre`),
  `passwordHash` = VALUES(`passwordHash`),
  `rol` = VALUES(`rol`);
