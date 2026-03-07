# express-err-helper

> Clean, consistent error handling and response formatting for Express.js APIs.

[![npm version](https://img.shields.io/npm/v/express-err-helper)](https://www.npmjs.com/package/express-err-helper)
[![license](https://img.shields.io/npm/l/express-err-helper)](https://github.com/mohdanas86/express-err-helper/blob/main/LICENSE)
[![npm downloads](https://img.shields.io/npm/dm/express-err-helper)](https://www.npmjs.com/package/express-err-helper)

---

## Why express-err-helper?

- **Zero boilerplate** — stop repeating `res.status(200).json(...)` in every route
- **Consistent responses** — every success and error follows the same JSON shape
- **Async-ready** — wrap async route handlers without try/catch clutter
- **Lightweight** — no dependencies beyond Express

---

## Installation

```bash
npm install express-err-helper
```

---

## Quick Start

```js
import express from 'express';
import {
  asyncHandler,
  ApiError,
  errorHandler,
  responseHandler,
} from 'express-err-helper';

const app = express();

// Register responseHandler BEFORE your routes
app.use(responseHandler);

app.get('/users', asyncHandler(async (req, res) => {
  const users = await getUsers();
  res.success(users, 'Users fetched successfully');
}));

app.get('/fail', asyncHandler(async (req, res) => {
  throw new ApiError('User not found', 404);
}));

// Register errorHandler AFTER all routes
app.use(errorHandler);

app.listen(3000);
```

---

## API Reference

### `responseHandler`

Middleware that attaches `res.success()` and `res.error()` to the response object.

**Must be registered before your routes.**

```js
app.use(responseHandler);
```

---

#### `res.success(data, message?)`

Sends a `200 OK` JSON response.

| Parameter | Type   | Default     | Description           |
|-----------|--------|-------------|-----------------------|
| `data`    | `any`  | —           | The response payload  |
| `message` | `string` | `"success"` | A status message    |

**Response shape:**
```json
{
  "success": true,
  "message": "Users fetched successfully",
  "data": { ... }
}
```

**Example:**
```js
app.get('/profile', (req, res) => {
  res.success({ name: 'Anas' }, 'Profile fetched');
});
```

---

#### `res.error(message?, status?)`

Sends a JSON error response with the given HTTP status.

| Parameter | Type     | Default             | Description        |
|-----------|----------|---------------------|--------------------|
| `message` | `string` | `"Error"`           | Error message      |
| `status`  | `number` | `500`               | HTTP status code   |

**Response shape:**
```json
{
  "success": false,
  "message": "Something went wrong"
}
```

**Example:**
```js
app.get('/restricted', (req, res) => {
  res.error('Unauthorized', 401);
});
```

---

### `ApiError`

A custom error class that carries an HTTP status code.

```js
throw new ApiError(message, status?);
```

| Parameter | Type     | Default | Description             |
|-----------|----------|---------|-------------------------|
| `message` | `string` | —       | Human-readable message  |
| `status`  | `number` | `500`   | HTTP status code        |

**Example:**
```js
throw new ApiError('Product not found', 404);
throw new ApiError('Unauthorized', 401);
throw new ApiError('Something broke'); // defaults to 500
```

---

### `errorHandler`

Express error-handling middleware. Catches any error passed to `next()` or thrown inside `asyncHandler`, and sends a consistent JSON error response.

**Must be registered after all routes.**

```js
app.use(errorHandler);
```

**Response shape:**
```json
{
  "success": false,
  "message": "Product not found"
}
```

---

### `asyncHandler`

Wraps an async route handler and automatically forwards any thrown errors to Express's `next(err)` — no try/catch needed.

```js
asyncHandler(fn)
```

**Example:**
```js
app.get('/orders', asyncHandler(async (req, res) => {
  const orders = await Order.find();
  res.success(orders);
}));
```

---

## Response Format

All responses follow a consistent structure:

**Success**
```json
{
  "success": true,
  "message": "...",
  "data": { ... }
}
```

**Error**
```json
{
  "success": false,
  "message": "..."
}
```

---

## Complete Example

```js
import express from 'express';
import {
  asyncHandler,
  ApiError,
  errorHandler,
  responseHandler,
} from 'express-err-helper';

const app = express();
app.use(express.json());
app.use(responseHandler); // <-- must come before routes

const users = [{ id: 1, name: 'Anas' }];

// GET all users
app.get('/users', asyncHandler(async (req, res) => {
  res.success(users, 'Users fetched successfully');
}));

// GET single user
app.get('/users/:id', asyncHandler(async (req, res) => {
  const user = users.find(u => u.id === Number(req.params.id));
  if (!user) throw new ApiError('User not found', 404);
  res.success(user);
}));

app.use(errorHandler); // <-- must come after routes

app.listen(3000, () => console.log('Server running on port 3000'));
```

---

## Middleware Order

```
app.use(responseHandler)   ← 1st: attaches res.success / res.error
app.use(routes)            ← 2nd: your route handlers
app.use(errorHandler)      ← last: catches all errors
```

---

## License

[Apache-2.0](https://github.com/mohdanas86/express-err-helper/blob/main/LICENSE) © [Anas Alam](https://github.com/mohdanas86)
