# REST API para un blog simple

Bienvenido a esta REST API! Ésta es una gran herramienta que te permitirá hacer tu propio blog o página similar. En este README, va a encontrar toda la información necesaria para aprender a usar ésta API, incluyendo cómo instalarla y configurarla.
Es facil de usar y de ponerla en marcha, asi que comencemos.

## Tabla de contenidos

- [Instalacion](#instalacion)
- [Autenticacion](#autenticacion)
- [Referencia API](#referencia-api)
- [Extra Utiles](#extra-utiles)
- [Issues](#issues)
- [Contribuciones](#contribuciones)
- [Licencia](#licencia)
- [Autores](#autores)

## Instalacion

**Clonar el Repositorio**

Comience por clonar el repositorio en un directorio local. Por lo general, el contenido se instala en una carpeta llamada `api` donde encontrará el código fuente de la API.

**Instalar Dependencias**

Deberá instalar las dependencias del proyecto para tener la API en funcionamiento. Para hacer esto, use npm o yarn para instalarlos:

`npm install` o `yarn install` funcionan correctamente.

**Creando archivo .env y database**

Como esta API funciona con PostgreSQL, deberá configurar una base de datos PG.

Deberá configurar un archivo .env en el directorio raíz con una estructura como esta:

```env
DB_NAME = <NOMBRE DE TU BASE DE DATOS>
USER = <USUARIO DE POSTGRES O "postgres">
PASSWORD = <TU CONTRASEÑA DE POSTGRES O "">
HOST = <HOST DE PRODUCCION O "localhost">
PORT = <PUERTO DEL BACKEND>

JWT_ACCESS_TOKEN = <TU TOKEN ENCRIPTADO>

ADMIN_NAME = <NOMBRE DEL ADMIN>
ADMIN_USERNAME = <USERNAME DEL ADMIN>
ADMIN_PASSWORD = <CONTRASEÑA DEL AMDIN>
ADMIN_EMAIL = <EMAIL DEL ADMIN>
```

- Sugerencia: si no sabe cómo configurar un `JWT_ACCESS_TOKEN`, puede escribir este código en la consola de su terminal para generar uno:

```bash
node
require('crypto').randomBytes(64).toString('hex')
```

- La sección de administración es solo la configuración del usuario que tendrá permisos adicionales en el sistema

## Issues

Las Issues son una excelente manera de realizar un seguimiento de las tareas, las correcciones de errores y las solicitudes de funciones en el proyecto.

Para cualquier error, corrección o función, abra un problema siguiendo la plantilla.

Asegúrese de seguir los pasos en [`ISSUE_TEMPLATE.md`](ISSUE_TEMPLATE.md) para ser aprobado.

## Contribuciones

Amamos las contribuciones!

Estoy abierto a cualquier discusión sobre un mayor desarrollo.

Estoy abierto a aceptar su solicitud de incorporación de cambios si cumple con los siguientes criterios:

- Incluye pruebas
- Parece razonable
- No rompe la compatibilidad con versiones anteriores

Si su cambio propuesto podría potencialmente romper la compatibilidad con versiones anteriores, menciónelo en su solicitud de incorporación de cambios. A partir de ahí, podemos discutir cómo podemos unirlo y lanzarlo y qué tipo de documentación o comunicación será necesaria.

Consulte [`CONTRIBUTING.md`](CONTRIBUTING.md) para conocer las formas de comenzar.

## Autenticacion

Deberá configurar `JWT_ACCESS_TOKEN` en .env para que la autenticación funcione correctamente.

Antes de entrar en la [Referencia API](#referencia-api) necesitamos entender cómo funciona la autenticación.
Para consultar cada endpoint, necesitará un token autenticado para obtener acceso, por lo que el primer paso de la autenticación es crear una cuenta y luego iniciar sesión (estos son los únicos endpoints que no necesitan autenticación).

O simplemente puede usar el usuario administrador para iniciar sesión, también tiene _permisos especiales_ para usar las rutas de administración.

En [Referencia API](#referencia-api) encontrará que la autenticación aparecerá en algunos colores.

```diff
- El rojo es para autenticación no requerida
+ Verde es para autenticación requerida
```

### Crear usuario

```http
  POST /users
```

**Parametros de body**

| Parametro  | Tipo     | Descripcion                                                              |
| :--------- | :------- | :----------------------------------------------------------------------- |
| `name`     | `string` | **Requerido**. Un nombre válido con longitud de 3-25                     |
| `username` | `string` | **Requerido**. Un username válido con longitud de 3-25                   |
| `email`    | `string` | **Requerido**. Un email válido                                           |
| `password` | `string` | **Requerido**. Por lo menos tener un número y una letra de 5-30 de largo |

Una vez que haya creado el usuario y reciba un mensaje de éxito, debe iniciar sesión para obtener el **accessToken**.

### Login

```http
  POST /auth/login
```

**Parametros de Body**

| Parámetro  | Tipo     | Descripción                                         |
| :--------- | :------- | :-------------------------------------------------- |
| `username` | `string` | **Requerido**. Un username válido existente         |
| `password` | `string` | **Requerido**. La contraseña del username existente |

Vas a obtener una respuesta como ésta:

```json
{
	"accessToken": "eyJhbGciOiJIxxxxxxxxxxxxxxxxxn31v3co1A",
	"message": "User authenticated."
}
```

La longitud del accessToken depende directamente de la longitud de su `JWT_ACCESS_TOKEN`.

Una vez que tenga su token de acceso, es posible que deba autorizar cada solicitud que realice a partir de ahora.
Deberá agregar un encabezado de autorización en sus solicitudes:

**Usando fetch:**

```js
fetch('https://example.com/api/endpoint', {
	method: 'GET', // POST PUT DELETE
	headers: {
		Authorization: `Bearer ${accessToken}`,
	},
}).then(...);
```

**Usando axios:**

```js
axios.get('https://example.com/api/endpoint', {
	//.post .put .delete request
	headers: {
		Authorization: `Bearer ${accessToken}`,
	},
}).then(...);
```

## Referencia API

Primero deberá leer [Autenticacion](#autenticacion) para asegurarse de que todas las consultas estén autenticadas para funcionar correctamente.

Aquí les dejo un índice refiriendose a la API asi tienen rápido acceso.

- [Error handling](#error-handling)
- [Auth endpoint](#auth-endpoint)
  - [POST Login](#post-login)
- [Users endpoint](#users-endpoint)
  - [POST Users](#post-users)
  - [GET Users](#get-users)
  - [GET one User](#get-one-user)
  - [PUT User](#put-user)
  - [DELETE User](#delete-user)
- [Posts endpoint](#posts-endpoint)
  - [POST Posts](#post-posts)
  - [GET Posts](#get-posts)
  - [GET one Post](#get-one-post)
  - [PUT Post](#put-post)
  - [DELETE Post](#delete-post)
- [Favorites endpoint](#favorites-endpoint)
  - [POST Favorites](#post-favorites)
  - [DELETE Favorites](#delete-favorites)
- [Reactions endpoint](#reactions-endpoint)
  - [POST Reactions](#post-reactions)
  - [PUT Reactions](#put-reactions)
  - [DELETE Reactions](#delete-reactions)
- [Comments endpoint](#comments-endpoint)
  - [POST Comment](#post-comment)
  - [PUT Comment](#put-comment)
  - [DELETE Comment](#delete-comment)
- [Upvotes endpoint](#upvotes-endpoint)
  - [POST Upvote](#post-upvote)
  - [DELETE Upvote](#delete-upvote)
- [⭐ Admin endpoints](#admin-endpoints)
  - [Admin Posts](#admin-posts)
    - [PUT Admin Post](#put-admin-post)
    - [DELETE Admin Post](#delete-admin-post)
  - [Admin Users](#admin-users)
    - [PUT Admin User](#put-admin-user)
    - [DELETE Admin User](#delete-admin-user)
- [Extra Utils](#extra-utils)
  - [Búsqueda de usuarios](#busqueda-de-usuarios)
  - [Posts pagination](#paginacion-de-posts)

## Error handling

Cada error que ocurre cuando intenta solicitar algo, obtendrá una respuesta como esta:

```json
{
	"error": true,
	"message": "..."
}
```

Donde `"message"` explica el error y en la mayoría de los casos explica cómo solucionarlo.

## Auth endpoint

<br/>

#### **POST** Login

```diff
- Autenticación no es requerida
```

Este es el método principal para iniciar sesión, que se utiliza para obtener **accessToken**. Puedes consultar el proceso de Autenticación [aquí](#autenticacion)

```http
  POST /auth/login
```

**Parametros de Body**

| Parámetro  | Tipo     | Descripción                                         |
| :--------- | :------- | :-------------------------------------------------- |
| `username` | `string` | **Requerido**. Un username válido existente         |
| `password` | `string` | **Requerido**. La contraseña del username existente |

**200 Response**

```json
{
	"accessToken": "eyJhbGciOiJIxxxxxxxxxxxxxxxxxn31v3co1A",
	"message": "User authenticated."
}
```

## Users endpoint

<br/>

#### **POST** Users

```diff
- Autenticación no es requerida
```

```http
  POST /users
```

**Parametros de Body**

| Parámetro  | Tipo     | Descripción                                                              |
| :--------- | :------- | :----------------------------------------------------------------------- |
| `name`     | `string` | **Requerido**. Un nombre válido con longitud de 3-25                     |
| `username` | `string` | **Requerido**. Un username válido con longitud de 3-25                   |
| `email`    | `string` | **Requerido**. Un email válido                                           |
| `password` | `string` | **Requerido**. Por lo menos tener un número y una letra de 5-30 de largo |

**200 Response**

```json
{
	"id": "b943a71f-xxxx-xxxx-xxxx-d88c80d9bcd3",
	"admin": false,
	"status": true,
	"username": "usernameofsomeone22",
	"email": "someone@example.com",
	"password": "$2b$10$0m7Of4KQqDbseapROuUBn.rpqr73E58Zrv0mmUW8zigqw60fygD/m",
	"name": "Someones name",
	"updatedAt": "yyyy-mm-dd",
	"createdAt": "yyyy-mm-dd"
}
```

#### **GET** Users

```diff
+ Autenticación es requerida
```

```http
  GET /users
```

**Parametros de Query**

| Parámetro  | Tipo     | Descripción                         |
| :--------- | :------- | :---------------------------------- |
| `name`     | `string` | **Opcional**. Parametro de busqueda |
| `username` | `string` | **Opcional**. Parametro de busqueda |
| `email`    | `string` | **Opcional**. Parametro de busqueda |

Puedes ver más información sobre los parámetros de búsqueda de usuarios y los usos [aquí](#busqueda-de-usuarios)

**200 Response**

```json
{
	"info": {
		"count": 100 // O el número de personas encontradas
	},
	"results": [
		{
			"id": "798dfe94-7f7a-4571-a1ea-7805dc973c4d",
			"name": "example",
			"email": "someone@example.com",
			"username": "someone02",
			"posts": [],
			"favorites": [],
			"reactions": []
		},
		{
			//... alguien más
		}
	]
}
```

#### **GET** one User

```diff
+ Autenticación es requerida
```

```http
  GET /users/${id}
```

**Parámetros**

| Parámetro | Tipo     | Descripción                                        |
| :-------- | :------- | :------------------------------------------------- |
| `id`      | `string` | **Requerido**. UUID usado para encontrar a alguien |

**200 Response**

```json
{
	"user": {
		"id": "798dfe94-7f7a-4571-a1ea-7805dc973c4d",
		"name": "example",
		"email": "someone@example.com",
		"username": "someone02",
		"posts": [],
		"favorites": [],
		"reactions": []
	},
	"message": "User created successfully!"
}
```

#### **PUT** User

```diff
+ Autenticación es requerida (solo se puede actualizar a uno mísmo)

```

```http
  PUT /users/${id}
```

**Parámetros**

| Parámetro | Tipo     | Descripción                                        |
| :-------- | :------- | :------------------------------------------------- |
| `id`      | `string` | **Requerido**. UUID usado para encontrar a alguien |

**Parametros de Body**

| Parámetro  | Tipo     | Descripción                                           |
| :--------- | :------- | :---------------------------------------------------- |
| `name`     | `string` | **Opcional**. Un nombre válido con longitud de 3-25   |
| `username` | `string` | **Opcional**. Un username válido con longitud de 3-25 |
| `email`    | `string` | **Opcional**. Un email válido                         |

**200 Response**

```json
{
	"message": "User updated successfully!"
}
```

#### **DELETE** User

```diff
+ Autenticación es requerida (solo se puede borrar a uno mismo)
```

```http
  DELETE /users/${id}
```

**Parámetros**

| Parámetro | Tipo     | Descripción                                        |
| :-------- | :------- | :------------------------------------------------- |
| `id`      | `string` | **Requerido**. UUID usado para encontrar a alguien |

**200 Response**

```json
{
	"message": "User deleted successfully!"
}
```

## Posts endpoint

<br/>

#### **POST** Posts

```diff
+ Autenticación es requerida
```

```http
  POST /posts
```

**Parametros de Body**

| Parámetro | Tipo            | Descripción                                                                |
| :-------- | :-------------- | :------------------------------------------------------------------------- |
| `title`   | `string`        | **Requerido**. Un título válido con longitud de 1-50                       |
| `content` | `string`        | **Requerido**. Un contenido válido (html aceptado) con longitud de 10-5000 |
| `tags`    | `array[stings]` | **Opcional**. String etiquetas                                             |

**200 Response**

```json
{
	"post": {
		"disabled": false,
		"id": 1,
		"title": "This is a good title!",
		"tags": ["irrelevant", "ignore"],
		"content": "This is an extreme irrelevant post, just ignore it'",
		"userId": "13ad2972-9679-4d5a-b1d7-f388d60a9e63", // ID of the user that created the post
		"updatedAt": "yyyy-mm-dd",
		"createdAt": "yyyy-mm-dd"
	},
	"message": "Post created successfully!"
}
```

#### **GET** Posts

```diff
+ Autenticación es requerida
```

```http
  GET /posts
```

**Parametros de Query**

| Parámetro | Tipo     | Descripción                           |
| :-------- | :------- | :------------------------------------ |
| `page`    | `string` | **Opcional**. Parámetro de paginación |
| `limit`   | `string` | **Opcional**. Parámetro de paginación |

Puedes ver más información sobre los parámetros de paginación y los usos [aquí](#paginacion-de-posts)

**200 Response**

```json
{
	"info": {
		//Pagination
		"count": 2,
		"pages": 1,
		"nextPage": null,
		"prevPage": null
	},
	"results": [
		//Results
		{
			"id": 1,
			"title": "This is a good title!",
			"tags": ["irrelevant", "ignore"],
			"content": "This is an extreme irrelevant post, just ignore it'",
			"disabled": false,
			"userId": "bbea059c-652d-4a85-9110-33ff5a3010d5",
			"createdAt": "2023-01-11T00:34:24.752Z",
			"updatedAt": "2023-01-11T00:34:24.760Z",
			"favorites": [],
			"comments": [],
			"reactions": []
		},
		{
			"id": 2,
			"title": "Just another post",
			"tags": [],
			"content": "This is other post",
			"disabled": false,
			"userId": "bbea059c-652d-4a85-9110-33ff5a3010d5",
			"createdAt": "2023-01-11T00:34:28.988Z",
			"updatedAt": "2023-01-11T00:34:28.993Z",
			"favorites": [],
			"comments": [],
			"reactions": []
		}
	]
}
```

#### **GET** one Post

```diff
+ Autenticación es requerida
```

```http
  GET /posts/${id}
```

**Parámetros**

| Parámetro | Tipo   | Descripción                                      |
| :-------- | :----- | :----------------------------------------------- |
| `id`      | `uint` | **Requerido**. uint usado para encontrar el post |

**200 Response**

```json
{
	"id": 2,
	"title": "Just another post",
	"tags": [],
	"content": "This is other post",
	"disabled": false,
	"userId": "b2cb15bc-2d47-461e-9c87-9e024f899aa1",
	"createdAt": "2023-01-11T01:01:02.038Z",
	"updatedAt": "2023-01-11T01:01:02.044Z",
	"favorites": [],
	"comments": [],
	"reactions": []
}
```

#### **PUT** Post

```diff
+ Autenticación es requerida (Solo el dueño puede actualizarlo)
```

```http
  PUT /posts/${id}
```

**Parámetros**

| Parámetro | Tipo   | Descripción                                      |
| :-------- | :----- | :----------------------------------------------- |
| `id`      | `uint` | **Requerido**. uint usado para encontrar el post |

**Parametros de Body**

| Parámetro | Tipo            | Descripción                                                               |
| :-------- | :-------------- | :------------------------------------------------------------------------ |
| `title`   | `string`        | **Opcional**. Un título válido con longitud de 1-50                       |
| `content` | `string`        | **Opcional**. Un contenido válido (html aceptado) con longitud de 10-5000 |
| `tags`    | `array[stings]` | **Opcional**. String etiquetas                                            |

**200 Response**

```json
{
	"message": "Post updated successfully!"
}
```

#### **DELETE** Post

```diff
+ Autenticación es requerida (Solo el dueño puede eliminarlo)
```

```http
  DELETE /posts/${id}
```

**Parámetros**

| Parámetro | Tipo   | Descripción                                      |
| :-------- | :----- | :----------------------------------------------- |
| `id`      | `uint` | **Requerido**. uint usado para encontrar el post |

**200 Response**

```json
{
	"message": "Post deleted successfully!"
}
```

## Favorites endpoint

<br/>

#### **POST** Favorites

```diff
+ Autenticación es requerida
```

```http
  POST /favorites
```

**Parametros de Body**

| Parámetro | Tipo   | Descripción                                      |
| :-------- | :----- | :----------------------------------------------- |
| `postId`  | `uint` | **Requerido**. uint usado para encontrar el post |

**200 Response**

```json
{
	"message": "Added post to favorites"
}
```

#### **DELETE** Favorites

```diff
+ Autenticación es requerida
```

```http
  DELETE /favorites
```

**Parametros de Body**

| Parámetro | Tipo   | Descripción                                      |
| :-------- | :----- | :----------------------------------------------- |
| `postId`  | `uint` | **Requerido**. uint usado para encontrar el post |

**200 Response**

```json
{
	"message": "Removed post from favorites"
}
```

## Reactions endpoint

<br/>

#### **POST** Reactions

```diff
+ Autenticación es requerida
```

```http
  POST /reactions
```

**Parametros de Body**

| Parámetro | Tipo     | Descripción                                      |
| :-------- | :------- | :----------------------------------------------- |
| `postId`  | `uint`   | **Requerido**. uint usado para encontrar el post |
| `type`    | `string` | **Requerido**. "love","sad","like"               |

**200 Response**

```json
{
	"message": "Added post to Reactions"
}
```

#### **PUT** Reactions

```diff
+ Autenticación es requerida
```

```http
  PUT /reactions
```

**Parametros de Body**

| Parámetro | Tipo     | Descripción                                      |
| :-------- | :------- | :----------------------------------------------- |
| `postId`  | `uint`   | **Requerido**. uint usado para encontrar el post |
| `type`    | `string` | **Requerido**. "love","sad","like"               |

```json
{
	"message": "Updated reaction"
}
```

#### **DELETE** Reactions

```diff
+ Autenticación es requerida
```

```http
  DELETE /reactions
```

**Parametros de Body**

| Parámetro | Tipo   | Descripción                                      |
| :-------- | :----- | :----------------------------------------------- |
| `postId`  | `uint` | **Requerido**. uint usado para encontrar el post |

**200 Response**

```json
{
	"message": "Removed post from Reactions"
}
```

## Comments endpoint

<br/>

#### **POST** Comment

```diff
+ Autenticación es requerida
```

```http
  POST /comments
```

**Parametros de Body**

| Parámetro | Tipo     | Descripción                                      |
| :-------- | :------- | :----------------------------------------------- |
| `postId`  | `uint`   | **Requerido**. uint usado para encontrar el post |
| `content` | `string` | **Requerido**. El contenido del comentario       |

**200 Response**

```json
{
	"message": "Added Comment"
}
```

#### **PUT** Comment

```diff
+ Autenticación es requerida
```

```http
  PUT /comments
```

**Parametros de Body**

| Parámetro | Tipo     | Descripción                                      |
| :-------- | :------- | :----------------------------------------------- |
| `postId`  | `uint`   | **Requerido**. uint usado para encontrar el post |
| `content` | `string` | **Requerido**. El contenido del comentario       |

```json
{
	"message": "Updated Comment"
}
```

#### **DELETE** Comment

```diff
+ Autenticación es requerida
```

```http
  DELETE /comments
```

**Parametros de Body**

| Parámetro | Tipo   | Descripción                                      |
| :-------- | :----- | :----------------------------------------------- |
| `postId`  | `uint` | **Requerido**. uint usado para encontrar el post |

**200 Response**

```json
{
	"message": "Removed Comment"
}
```

## Upvotes endpoint

<br/>

#### **POST** Upvote

```diff
+ Autenticación es requerida
```

```http
  POST /upvotes
```

**Parametros de Body**

| Parámetro   | Tipo   | Descripción                                            |
| :---------- | :----- | :----------------------------------------------------- |
| `commentId` | `uint` | **Requerido**. uint usado para encontrar el comentario |

**200 Response**

```json
{
	"message": "Added upvote"
}
```

#### **DELETE** Upvote

```diff
+ Autenticación es requerida
```

```http
  DELETE /upvotes
```

**Parametros de Body**

| Parámetro   | Tipo   | Descripción                                            |
| :---------- | :----- | :----------------------------------------------------- |
| `commentId` | `uint` | **Requerido**. uint usado para encontrar el comentario |

**200 Response**

```json
{
	"message": "Removed upvote"
}
```

## Admin endpoints

<br/>

### Admin Posts

<br/>

#### **PUT** Admin Post

```diff
+ Autenticación es requerida (debe ser admin)
```

```http
  PUT /admin/posts/${id}
```

**Parametros de Body**

| Parámetro  | Tipo            | Descripción                                                               |
| :--------- | :-------------- | :------------------------------------------------------------------------ |
| `title`    | `string`        | **Opcional**. Un título válido con longitud de 1-50                       |
| `content`  | `string`        | **Opcional**. Un contenido válido (html aceptado) con longitud de 10-5000 |
| `tags`     | `array[stings]` | **Opcional**. String etiquetas                                            |
| `disabled` | `boolean`       | **Opcional**. true / false                                                |

**Parámetros**

| Parámetro | Tipo   | Descripción                                      |
| :-------- | :----- | :----------------------------------------------- |
| `id`      | `uint` | **Requerido**. uint usado para encontrar el post |

**200 Response**

```json
{
	"message": "Post updated successfully!"
}
```

#### **DELETE** Admin Post

```diff
+ Autenticación es requerida (debe ser admin)
```

```http
  DELETE /admin/posts/${id}
```

**Parámetros**

| Parámetro | Tipo   | Descripción                                      |
| :-------- | :----- | :----------------------------------------------- |
| `id`      | `uint` | **Requerido**. uint usado para encontrar el post |

**200 Response**

```json
{
	"message": "Deleted post successfully!"
}
```

### Admin Users

<br/>

#### **PUT** Admin User

```diff
+ Autenticación es requerida (debe ser admin)
```

```http
  PUT /admin/users/${id}
```

**Parámetros**

| Parámetro | Tipo     | Descripción                                        |
| :-------- | :------- | :------------------------------------------------- |
| `id`      | `string` | **Requerido**. UUID usado para encontrar a alguien |

**Parametros de Body**

| Parámetro  | Tipo      | Descripción                                           |
| :--------- | :-------- | :---------------------------------------------------- |
| `name`     | `string`  | **Opcional**. Un nombre válido con longitud de 3-25   |
| `username` | `string`  | **Opcional**. Un username válido con longitud de 3-25 |
| `email`    | `string`  | **Opcional**. Un email válido                         |
| `admin`    | `boolean` | **Opcional**. true / false                            |
| `status`   | `boolean` | **Opcional**. true / false                            |

**200 Response**

```json
{
	"message": "User updated successfully!"
}
```

#### **DELETE** Admin User

```diff
+ Autenticación es requerida (debe ser admin)
```

```http
  DELETE /admin/users/${id}
```

**Parámetros**

| Parámetro | Tipo     | Descripción                                        |
| :-------- | :------- | :------------------------------------------------- |
| `id`      | `string` | **Requerido**. UUID usado para encontrar a alguien |

**200 Response**

```json
{
	"message": "User deleted successfully!"
}
```

## Extra Utiles

<br/>

### Busqueda de usuarios

<br/>

Para encontrar cualquier usuario, puede encontrarlo utilizando la solicitud `GET /users` con los parámetros query de `name`, `username` e `email`.

Aquí hay un ejemplo de cómo puedes usarlo:

```http
GET /users?username=ro
```

**200 Response**

```json
{
	"info": {
		"count": 2
	},
	"results": [
		{
			"id": "441d6e20-dfc5-47a4-8d4c-d9be73cba0f1",
			"name": "Dorothea Tanner",
			"email": "dorothea_tanner@hotmail.com",
			"username": "dorothea90",
			"posts": [],
			"favorites": [],
			"reactions": []
		},
		{
			"id": "dea31d42-a760-49cc-a422-eeef90eee970",
			"name": "Gross Ruiz",
			"email": "gross_ruiz@hotmail.com",
			"username": "gross92",
			"posts": [],
			"favorites": [],
			"reactions": []
		}
	]
}
```

También puedes concantar los parámetros query:

```http
GET /users?username=ro&email=dorothea
```

**200 Response**

```json
{
	"info": {
		"count": 1
	},
	"results": [
		{
			"id": "441d6e20-dfc5-47a4-8d4c-d9be73cba0f1",
			"name": "Dorothea Tanner",
			"email": "dorothea_tanner@hotmail.com",
			"username": "dorothea90",
			"posts": [],
			"favorites": [],
			"reactions": []
		}
	]
}
```

### Paginación de Posts

<br/>

Verás que las publicaciones están paginadas. Puede usar la paginación para obtener las publicaciones por separado en diferentes páginas.
Hay dos parámetros que puede usar para controlar la paginación, el primero es la `page`, que determina en qué página se encuentra y el segundo es `limit`, que determina cuántas publicaciones se devuelven por página.

**Parametros de Query**

| Parámetro | Tipo   | Descripción                                                             | Default value |
| :-------- | :----- | :---------------------------------------------------------------------- | ------------- |
| `limit`   | `uint` | **Opcional**. Valor de las publicaciones devueltas x página, max 50     | 10            |
| `page`    | `uint` | **Opcional**. Este valor determina en qué página estás según el límite. | 1             |

Una vez que use esos parámetros query (o no), obtendrá una respuesta `info` como esta:

```json
"info": { // Ejemplo usando valores por defecto
    "count": 44,
    "pages": 5,
    "nextPage": 2,
    "prevPage": null
  },
```

La respuesta `info` calcula el número total de `pages` según el límite especificado, también puede ver que tiene las propiedades `nextPage` y `prevPage` que son nulas cuando no hay página y tiene un número de la siguiente / anterior página cuando tiene contenido.

La propiedad `results` le da un `limit` de resultados por página.

## Licencia

Éste proyecto usa la Licencia [MIT](https://choosealicense.com/licenses/mit/).

## Autores

- [@Nikire](https://www.github.com/nikire)
