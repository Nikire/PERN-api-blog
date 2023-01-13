# REST API for a simple blog

Welcome to this REST API! This is a great tool to create your
own blog or similar website. In this README, you'll find all
the information you need to use this API, including
how to configure it and install it.
It's easy to use and set up, so get started

_Read this in other lenguages: [English](README.md),[Español](README.es.md)._

## Table of Contents

- [Installation](#installation)
- [Authentication](#authentication)
- [API Reference](#api-reference)
- [Extra Utils](#extra-utils)
- [Issues](#issues)
- [Contributions](#contributions)
- [License](#license)
- [Authors](#authors)

## Installation

**Clone the Repository**

Begin by cloning the repo to a local directory. Usually the content is installed in a folder called `api` where you will find the source code for the API.

**Install Dependencies**

You'll need to install the project dependencies in order to have the API up and running. To do this, use either npm or yarn to install them:

`npm install` or `yarn install` works.

**Setting up the .env file and database**

As this API is working with PostgreSQL, you will need to setup a PG database.

You'll need to setup a .env file at root directory with a structure like this one:

```env
DB_NAME = <YOUR PG DATABASE NAME>
USER = <YOUR USER OF PG OR "postgres">
PASSWORD = <YOUR PG PASSWORD OR "">
HOST = <PRODUCTION HOST OR "localhost">
PORT = <YOUR BACKEND PORT>

JWT_ACCESS_TOKEN = <YOUR ENCRYPTED TOKEN>

ADMIN_NAME = <ADMIN_NAME>
ADMIN_USERNAME = <USERNAME>
ADMIN_PASSWORD = <PASSWORD>
ADMIN_EMAIL = <EMAIL>
```

- Tip: If you doesn't know how to setup a `JWT_ACCESS_TOKEN`, you can just write this code at your terminal console to generate one:

```bash
node
require('crypto').randomBytes(64).toString('hex')
```

- The admin section is just the setup of the user that will have extra permissions in the system

## Issues

Issues are a great way to keep track of tasks, bug fixes, and feature requests in the project.

For any bug, fix, or feature, open a issue following the template.

Make sure to follow the steps at [`ISSUE_TEMPLATE.md`](ISSUE_TEMPLATE.md) to be approved.

## Contributions

❤️ contributions!

I am open to any discussion on further development.

I am open to accepting your pull request if it meets the following criteria:

- Includes tests
- Appears reasonable
- Does not break backwards compatibility

If your proposed change could potentially break backwards compatibility, please mention it in your pull request. From there, we can discuss how we can release it and what kind of documentation or communication will be necessary.

See [`CONTRIBUTING.md`](CONTRIBUTING.md) for ways to get started.

## Authentication

You will need to setup `JWT_ACCESS_TOKEN` at .env to get the Authentication work correctly.

Before we get into the [API Reference](#api-reference) we need ot understand how the authentication works.
To query every endpoint you will need an authenticated token to get access, so the first step of the authentication is to create an account and then login (These are the unique endpoints that doesn't need any authentication).

Or you can just use the admin user to login, it also has _special permissions_ to use the admin routes.

At [API Reference](#api-reference) you will find that authentication will appear in some colors.

```diff
- Red is for not required authentication
+ Green is for required authentication
```

### Create user

```http
  POST /users
```

**Body params**

| Parameter  | Type     | Description                                            |
| :--------- | :------- | :----------------------------------------------------- |
| `name`     | `string` | **Required**. A valid name with length of 3-25         |
| `username` | `string` | **Required**. A valid username with length of 3-25     |
| `email`    | `string` | **Required**. A valid email string                     |
| `password` | `string` | **Required**. At least have a number and a letter 5-30 |

Once you have created the user, and you get an success message you need to login to obtain the **accessToken**.

### Login

```http
  POST /auth/login
```

**Body params**

| Parameter  | Type     | Description                                         |
| :--------- | :------- | :-------------------------------------------------- |
| `username` | `string` | **Required**. A valid existing username             |
| `password` | `string` | **Required**. The password of the existing username |

You will get a response like this:

```json
{
	"accessToken": "eyJhbGciOiJIxxxxxxxxxxxxxxxxxn31v3co1A",
	"message": "User authenticated."
}
```

The length of the accessToken depends directly on the length of your `JWT_ACCESS_TOKEN`.

Once you have your accessToken, you may need to authorize every request you made from henceforth.
You will need to add an authorization header into your requests:

**Using fetch:**

```js
fetch('https://example.com/api/endpoint', {
	method: 'GET', // POST PUT DELETE
	headers: {
		Authorization: `Bearer ${accessToken}`,
	},
}).then(...);
```

**Using axios:**

```js
axios.get('https://example.com/api/endpoint', {
	//.post .put .delete request
	headers: {
		Authorization: `Bearer ${accessToken}`,
	},
}).then(...);
```

## API Reference

You will need to read the [Authentication](#authentication) section first to make sure that every query is authenticated to work properly.

Here a table of every endpoint so you can access quickly:

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
  - [Users search](#users-search)
  - [Posts pagination](#posts-pagination)

## Error handling

Every error that occurs whem you are trying to request something, you will get a response like this:

```json
{
	"error": true,
	"message": "..."
}
```

Where `"message"` explains the error and most cases explains how to solve it.

## Auth endpoint

<br/>

#### **POST** Login

```diff
- Authentication is not required
```

This is the main method to login, which is used to get the **accessToken**. You can check the Authentication process [here](#authentication)

```http
  POST /auth/login
```

**Body params**

| Parameter  | Type     | Description                                         |
| :--------- | :------- | :-------------------------------------------------- |
| `username` | `string` | **Required**. A valid existing username             |
| `password` | `string` | **Required**. The password of the existing username |

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
- Authentication is not required
```

```http
  POST /users
```

**Body params**

| Parameter  | Type     | Description                                            |
| :--------- | :------- | :----------------------------------------------------- |
| `name`     | `string` | **Required**. A valid name with length of 3-25         |
| `username` | `string` | **Required**. A valid username with length of 3-25     |
| `email`    | `string` | **Required**. A valid email string                     |
| `password` | `string` | **Required**. At least have a number and a letter 5-30 |

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
+ Authentication is required
```

```http
  GET /users
```

**Query params**

| Parameter  | Type     | Description                    |
| :--------- | :------- | :----------------------------- |
| `name`     | `string` | **Optional**. Search parameter |
| `username` | `string` | **Optional**. Search parameter |
| `email`    | `string` | **Optional**. Search parameter |

You can see more information about the user search parameters and the uses [here](#users-search)

**200 Response**

```json
{
	"info": {
		"count": 100 // Or the count of results found
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
			//... someone else
		}
	]
}
```

#### **GET** one User

```diff
+ Authentication is required
```

```http
  GET /users/${id}
```

**Params**

| Parameter | Type     | Description                             |
| :-------- | :------- | :-------------------------------------- |
| `id`      | `string` | **Required**. UUID used to find someone |

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
+ Authentication is required (only self-updating is allowed)

```

```http
  PUT /users/${id}
```

**Params**

| Parameter | Type     | Description                             |
| :-------- | :------- | :-------------------------------------- |
| `id`      | `string` | **Required**. UUID used to find someone |

**Body params**

| Parameter  | Type     | Description                                        |
| :--------- | :------- | :------------------------------------------------- |
| `name`     | `string` | **Optional**. A valid name with length of 3-25     |
| `username` | `string` | **Optional**. A valid username with length of 3-25 |
| `email`    | `string` | **Optional**. A valid email string                 |

**200 Response**

```json
{
	"message": "User updated successfully!"
}
```

#### **DELETE** User

```diff
+ Authentication is required (only self-deleting is allowed)
```

```http
  DELETE /users/${id}
```

**Params**

| Parameter | Type     | Description                             |
| :-------- | :------- | :-------------------------------------- |
| `id`      | `string` | **Required**. UUID used to find someone |

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
+ Authentication is required
```

```http
  POST /posts
```

**Body params**

| Parameter | Type            | Description                                                          |
| :-------- | :-------------- | :------------------------------------------------------------------- |
| `title`   | `string`        | **Required**. A valid title with length of 1-50                      |
| `content` | `string`        | **Required**. A valid content (html accepted) with length of 10-5000 |
| `tags`    | `array[stings]` | **Optional**. String tags                                            |

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
+ Authentication is required
```

```http
  GET /posts
```

**Query params**

| Parameter | Type     | Description                        |
| :-------- | :------- | :--------------------------------- |
| `page`    | `string` | **Optional**. Pagination parameter |
| `limit`   | `string` | **Optional**. Pagination parameter |

You can see more information about the pagination parameters and the uses [here](#posts-pagination)

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
+ Authentication is required
```

```http
  GET /posts/${id}
```

**Params**

| Parameter | Type   | Description                              |
| :-------- | :----- | :--------------------------------------- |
| `id`      | `uint` | **Required**. uint used to find the post |

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
+ Authentication is required (Owner of the post must update)
```

```http
  PUT /posts/${id}
```

**Params**

| Parameter | Type   | Description                              |
| :-------- | :----- | :--------------------------------------- |
| `id`      | `uint` | **Required**. uint used to find the post |

**Body params**

| Parameter | Type            | Description                                                          |
| :-------- | :-------------- | :------------------------------------------------------------------- |
| `title`   | `string`        | **Optional**. A valid title with length of 1-50                      |
| `content` | `string`        | **Optional**. A valid content (html accepted) with length of 10-5000 |
| `tags`    | `array[stings]` | **Optional**. String tags                                            |

**200 Response**

```json
{
	"message": "Post updated successfully!"
}
```

#### **DELETE** Post

```diff
+ Authentication is required (Owner of the post must delete)
```

```http
  DELETE /posts/${id}
```

**Params**

| Parameter | Type   | Description                              |
| :-------- | :----- | :--------------------------------------- |
| `id`      | `uint` | **Required**. uint used to find the post |

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
+ Authentication is required
```

```http
  POST /favorites
```

**Body params**

| Parameter | Type   | Description                              |
| :-------- | :----- | :--------------------------------------- |
| `postId`  | `uint` | **Required**. uint used to find the post |

**200 Response**

```json
{
	"message": "Added post to favorites"
}
```

#### **DELETE** Favorites

```diff
+ Authentication is required
```

```http
  DELETE /favorites
```

**Body params**

| Parameter | Type   | Description                              |
| :-------- | :----- | :--------------------------------------- |
| `postId`  | `uint` | **Required**. uint used to find the post |

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
+ Authentication is required
```

```http
  POST /reactions
```

**Body params**

| Parameter | Type     | Description                              |
| :-------- | :------- | :--------------------------------------- |
| `postId`  | `uint`   | **Required**. uint used to find the post |
| `type`    | `string` | **Required**. "love","sad","like"        |

**200 Response**

```json
{
	"message": "Added post to Reactions"
}
```

#### **PUT** Reactions

```diff
+ Authentication is required
```

```http
  PUT /reactions
```

**Body params**

| Parameter | Type     | Description                              |
| :-------- | :------- | :--------------------------------------- |
| `postId`  | `uint`   | **Required**. uint used to find the post |
| `type`    | `string` | **Required**. "love","sad","like"        |

```json
{
	"message": "Updated reaction"
}
```

#### **DELETE** Reactions

```diff
+ Authentication is required
```

```http
  DELETE /reactions
```

**Body params**

| Parameter | Type   | Description                              |
| :-------- | :----- | :--------------------------------------- |
| `postId`  | `uint` | **Required**. uint used to find the post |

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
+ Authentication is required
```

```http
  POST /comments
```

**Body params**

| Parameter | Type     | Description                              |
| :-------- | :------- | :--------------------------------------- |
| `postId`  | `uint`   | **Required**. uint used to find the post |
| `content` | `string` | **Required**. The content of the comment |

**200 Response**

```json
{
	"message": "Added Comment"
}
```

#### **PUT** Comment

```diff
+ Authentication is required
```

```http
  PUT /comments
```

**Body params**

| Parameter | Type     | Description                              |
| :-------- | :------- | :--------------------------------------- |
| `postId`  | `uint`   | **Required**. uint used to find the post |
| `content` | `string` | **Required**. The content of the comment |

```json
{
	"message": "Updated Comment"
}
```

#### **DELETE** Comment

```diff
+ Authentication is required
```

```http
  DELETE /comments
```

**Body params**

| Parameter | Type   | Description                              |
| :-------- | :----- | :--------------------------------------- |
| `postId`  | `uint` | **Required**. uint used to find the post |

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
+ Authentication is required
```

```http
  POST /upvotes
```

**Body params**

| Parameter   | Type   | Description                                 |
| :---------- | :----- | :------------------------------------------ |
| `commentId` | `uint` | **Required**. uint used to find the comment |

**200 Response**

```json
{
	"message": "Added upvote"
}
```

#### **DELETE** Upvote

```diff
+ Authentication is required
```

```http
  DELETE /upvotes
```

**Body params**

| Parameter   | Type   | Description                                 |
| :---------- | :----- | :------------------------------------------ |
| `commentId` | `uint` | **Required**. uint used to find the comment |

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
+ Authentication is required (must be admin)
```

```http
  PUT /admin/posts/${id}
```

**Body params**

| Parameter  | Type            | Description                                                          |
| :--------- | :-------------- | :------------------------------------------------------------------- |
| `title`    | `string`        | **Optional**. A valid title with length of 1-50                      |
| `content`  | `string`        | **Optional**. A valid content (html accepted) with length of 10-5000 |
| `tags`     | `array[stings]` | **Optional**. String tags                                            |
| `disabled` | `boolean`       | **Optional**. true / false                                           |

**Params**

| Parameter | Type   | Description                              |
| :-------- | :----- | :--------------------------------------- |
| `id`      | `uint` | **Required**. uint used to find the post |

**200 Response**

```json
{
	"message": "Post updated successfully!"
}
```

#### **DELETE** Admin Post

```diff
+ Authentication is required (must be admin)
```

```http
  DELETE /admin/posts/${id}
```

**Params**

| Parameter | Type   | Description                              |
| :-------- | :----- | :--------------------------------------- |
| `id`      | `uint` | **Required**. uint used to find the post |

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
+ Authentication is required (must be admin)
```

```http
  PUT /admin/users/${id}
```

**Params**

| Parameter | Type     | Description                             |
| :-------- | :------- | :-------------------------------------- |
| `id`      | `string` | **Required**. UUID used to find someone |

**Body params**

| Parameter  | Type      | Description                                        |
| :--------- | :-------- | :------------------------------------------------- |
| `name`     | `string`  | **Optional**. A valid name with length of 3-25     |
| `username` | `string`  | **Optional**. A valid username with length of 3-25 |
| `email`    | `string`  | **Optional**. A valid email string                 |
| `admin`    | `boolean` | **Optional**. true / false                         |
| `status`   | `boolean` | **Optional**. true / false                         |

**200 Response**

```json
{
	"message": "User updated successfully!"
}
```

#### **DELETE** Admin User

```diff
+ Authentication is required (must be admin)
```

```http
  DELETE /admin/users/${id}
```

**Params**

| Parameter | Type     | Description                             |
| :-------- | :------- | :-------------------------------------- |
| `id`      | `string` | **Required**. UUID used to find someone |

**200 Response**

```json
{
	"message": "User deleted successfully!"
}
```

## Extra Utils

<br/>

### Users Search

<br/>

To find any user you can find it using the `GET /users` request with the query parameters `name`, `username` and `email`.

Here is an example on how you can use it:

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

You can also concat the query parameters:

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

### Posts Pagination

<br/>

You will see that the posts are paginated. You can use the pagination to get the posts separately in different pages.
There is two params you can use to control the pagination, the first one is the `page`,which determins in what page are you and the second is `limit` that determines how many posts are returned per page.

**Query Params**

| Parameter | Type   | Description                                                                  | Default value |
| :-------- | :----- | :--------------------------------------------------------------------------- | ------------- |
| `limit`   | `uint` | **Optional**. This is the value of posts returned each page,max value of 50  | 10            |
| `page`    | `uint` | **Optional**. This value determines in which page are you based on the limit | 1             |

Once you use that querys (or not) you will get a `info` response like this:

```json
"info": { // Example using default values
    "count": 44,
    "pages": 5,
    "nextPage": 2,
    "prevPage": null
  },
```

The `info` response calculates the total number of `pages` based on the limit specified, you can see also that it has the `nextPage` and `prevPage` properties that are null when there is no page and has a number of the next/prev page when has content.

The `results` property gives you `limit` results per page.

## License

This project is using [MIT](https://choosealicense.com/licenses/mit/) License.

## Authors

- [@Nikire](https://www.github.com/nikire)
