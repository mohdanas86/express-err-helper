# express-err-helper

Clean error handling and response formatting for Express.js APIs.

[![npm version](https://img.shields.io/npm/v/express-err-helper)](https://www.npmjs.com/package/express-err-helper)
[![license](https://img.shields.io/npm/l/express-err-helper)](https://github.com/mohdanas86/express-err-helper/blob/main/LICENSE)
[![npm downloads](https://img.shields.io/npm/dm/express-err-helper)](https://www.npmjs.com/package/express-err-helper)

## Install

```bash
npm install express-err-helper
```

## Usage

```js
// step 1: Import modules
import { 
  asyncHandler, 
  ApiError, 
  errorHandler, 
  responseHandler 
} from 'express-err-helper';

// step 2: attach res.success / res.error
app.use(responseHandler); 

// step 3: write your routes
app.get('/hello', asyncHandler(async (req, res) => {
  res.success({ name: 'Anas' }, 'Hello!');
}));

app.get('/fail', asyncHandler(async (req, res) => {
  throw new ApiError('Something went wrong', 400);
}));

// step 4: catch all errors
app.use(errorHandler);
```

## Middleware Order

```
app.use(responseHandler)  ← before routes
app.use(yourRoutes)
app.use(errorHandler)     ← after routes
```

## API

| Export            | Type        | Purpose                                                              |
| ----------------- | ----------- | -------------------------------------------------------------------- |
| `responseHandler` | Middleware  | Attaches `res.success()` and `res.error()` to every response         |
| `asyncHandler`    | Wrapper     | Wraps async route handlers, forwards errors to Express automatically |
| `ApiError`        | Error class | Creates errors with a custom HTTP status code                        |
| `errorHandler`    | Middleware  | Catches all errors and sends a consistent JSON error response        |

---

### `responseHandler`

Adds `res.success()` and `res.error()` to every response object.

#### `res.success(data, message?)`

```js
res.success({ name: 'Anas' }, 'Profile fetched');
// { success: true, message: "Profile fetched", data: { name: "Anas" } }
```

#### `res.error(message?, status?)`

```js
res.error('Unauthorized', 401);
// { success: false, message: "Unauthorized" }
```

---

### `ApiError`

Custom error class with an HTTP status code. Throw it inside `asyncHandler` and `errorHandler` will catch it automatically.

```js
throw new ApiError('User not found', 404);
throw new ApiError('Something broke'); // status defaults to 500
```

---

### `errorHandler`

Catches all errors (from `next(err)` or thrown inside `asyncHandler`) and sends a consistent JSON error response. Must be registered **after all routes**.

```js
app.use(errorHandler);
```

---

### `asyncHandler`

Wraps async route handlers — no try/catch needed. Any thrown error is automatically forwarded to Express.

```js
app.get('/orders', asyncHandler(async (req, res) => {
  const orders = await Order.find();
  res.success(orders);
}));
```

## Response Shape

**Success**
```json
{ "success": true, "message": "Users fetched", "data": [ ] }
```

**Error**
```json
{ "success": false, "message": "User not found" }
```

## License

[Apache-2.0](https://github.com/mohdanas86/express-err-helper/blob/main/LICENSE) © [Anas Alam](https://github.com/mohdanas86)
