# Interfaz grafica de usuario para la aplicación de gestión de inventario de imprenta

Autor: Armando Enrique Kaneko Diaz

## Descripción

Aplicación web desarrollada para la gestión de inventario de una imprenta.
Permite administrar productos, stock, categorías, ordenes de entrega, movimientos de inventario y operaciones relacionadas mediante una interfaz moderna y responsive.

El proyecto consume una API REST desarrollada con Spring Boot y utiliza autenticación para el acceso de usuarios registrados.

## Características

- Autenticación de usuarios
- Gestión de productos
- Gestión de categorías
- Control de stock
- Subida de imágenes
- Diseño responsive
- Consumo de API REST
- Manejo de rutas protegidas
- Formularios validados

## Vista previa

[Proyecto desplegado en Netlify](https://lustrous-marigold-4b0a5d.netlify.app/)

## Variables de entorno

`VITE_API_URL` = URL base del [backend](https://github.com/ArmandoEnrique1010K/API-REST-Inventory-2) desplegado (debe terminar con "/api").

`VITE_FRONTEND_DOMAIN` = URL del dominio donde se encuentra desplegado el frontend.

## Acceso a la aplicación

Actualmente el registro de usuarios está restringido. Si deseas probar la aplicación, tienes 2 opciones:

### Usar un usuario de prueba

Inicia sesión con una de las siguientes credenciales de prueba:

| Correo             | Contraseña | Rol           |
| ------------------ | ---------- | ------------- |
| user@gmail.com     | 12345      | Usuario       |
| operator@gmail.com | 12345      | Operador      |
| admin@gmail.com    | 12345      | Administrador |

Los usuarios de prueba no pueden modificar su correo ni su contraseña.

### Usar un correo real

Puedes enviar un correo a [enrique1010k@gmail.com](mailto:enrique1010k@gmail.com) con tu email real y un rol: **Usuario**, **Operador** o **Administrador**. Si utilizas un correo real de Gmail, podrás recuperar o cambiar tu contraseña posteriormente desde la aplicación.

Ten en cuenta que todos los usuarios que inician sesión y tienen el rol de **Administrador**, pueden ver el correo de todos los usuarios registrados en la aplicación, pero la contraseña no se ve a pesar que esta encriptada en la base de datos. **Se recomienda no colocar una contraseña sensible cuando cambies de contraseña**.

## Licencia

Este proyecto es de uso educativo y de portafolio.
