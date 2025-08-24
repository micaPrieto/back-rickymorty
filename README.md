<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

![NestJS](https://img.shields.io/badge/NestJS-9.x-E0234E?logo=nestjs)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14-blue?logo=postgresql)
![Render](https://img.shields.io/badge/Deploy-Render-success?logo=render)

```markdown
# Rick and Morty Wiki – Backend



API desarrollada en **NestJS** para la aplicación **Rick and Morty Wiki**, encargada de manejar autenticación, usuarios, episodios favoritos y comentarios. Proyecto final del programa **Pre-Academy de Moby Digital**.

---

## 🚀 Funcionalidades
- **Autenticación y registro de usuarios** con JWT.
- **Roles de usuario:** administrador y usuario común.
- **Gestión de favoritos por usuario** (agregar, listar, eliminar).
- **Módulo de comentarios** en episodios (CRUD completo):
  - Usuarios pueden crear, editar y eliminar sus comentarios.
  - Admins pueden eliminar cualquier comentario y desactivar nuevos comentarios.
- **Persistencia con PostgreSQL** y **TypeORM**.

---

## 🛠 Tecnologías
- **Framework:** NestJS
- **Base de datos:** PostgreSQL
- **ORM:** TypeORM
- **Autenticación:** JWT
- **Deploy:** Render

---

## 🌐 Deploy
- **Backend:** [Ver API en Render](https://dashboard.render.com/web/srv-d2amrrggjchc73efk8s0)
- **Frontend (Angular):** [Repositorio aquí](https://github.com/micaPrieto/rick-and-morty)
---

## ▶️ Instalación y ejecución local

1. Clonar proyecto
2. ```yarn install```
3. Clonar el archivo ```.env.template``` y renombrarlo a ```.env```
4. Cambiar las variables de entorno

# Uso diario
5. Levantar la base de datos: ```docker-compose up -d```
6. Levantar: ```yarn start:dev```#

