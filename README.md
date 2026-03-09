# express-err-helper

Clean and consistent **error handling** and **API response formatting** for **Express.js** applications.

Stop repeating `try/catch` blocks and inconsistent response formats in every route.
`express-err-helper` provides simple utilities to standardize your API responses and error handling.

---

[![npm version](https://img.shields.io/npm/v/express-err-helper)](https://www.npmjs.com/package/express-err-helper)
[![npm downloads](https://img.shields.io/npm/dm/express-err-helper)](https://www.npmjs.com/package/express-err-helper)
[![license](https://img.shields.io/npm/l/express-err-helper)](https://github.com/mohdanas86/express-err-helper/blob/main/LICENSE)

---

## ✨ Features

* Clean **API response formatting**
* Built-in **async error handling**
* Custom **HTTP error class**
* Consistent **JSON response structure**
* Minimal setup
* Works with any Express project

---

## 📦 Installation

```bash
npm install express-err-helper
```

---

## ⚡ Quick Start

```js
import express from "express";
import {
  asyncHandler,
  ApiError,
  errorHandler,
  responseHandler
} from "express-err-helper";

const app = express();

/* attach helpers */
app.use(responseHandler);

/* example route */
app.get(
  "/hello",
  asyncHandler(async (req, res) => {
    res.success({ name: "Anas" }, "Hello!");
  })
);

/* example error */
app.get(
  "/fail",
  asyncHandler(async () => {
    throw new ApiError("Something went wrong", 400);
  })
);

/* global error handler */
app.use(errorHandler);

app.listen(3000);
```

---

## 📌 Middleware Order

Make sure middleware order is correct.

```
app.use(responseHandler)   // before routes
app.use(routes)
app.use(errorHandler)      // after routes
```

---

# 📖 API Reference

## responseHandler

Middleware that attaches helper functions to every Express response object.

### `res.success(data, message?)`

Send a successful response.

```js
res.success({ name: "Anas" }, "Profile fetched");
```

Response

```json
{
  "success": true,
  "message": "Profile fetched",
  "data": { "name": "Anas" }
}
```

---

### `res.error(message?, status?)`

Send an error response.

```js
res.error("Unauthorized", 401);
```

Response

```json
{
  "success": false,
  "message": "Unauthorized"
}
```

---

## ApiError

Custom error class with an HTTP status code.

Throw this inside routes or services.

```js
throw new ApiError("User not found", 404);
throw new ApiError("Internal server error");
```

If status is not provided, it defaults to **500**.

---

## asyncHandler

Wrapper for async Express route handlers.

Removes the need for repetitive try/catch blocks.

```js
app.get(
  "/orders",
  asyncHandler(async (req, res) => {
    const orders = await Order.find();
    res.success(orders);
  })
);
```

If an error occurs, it will automatically be passed to `errorHandler`.

---

## errorHandler

Global Express error middleware.

Handles errors thrown by:

* `ApiError`
* `asyncHandler`
* `next(err)`

Must be registered **after all routes**.

```js
app.use(errorHandler);
```

Example response:

```json
{
  "success": false,
  "message": "User not found"
}
```

---

# 🔄 Response Structure

### Success

```json
{
  "success": true,
  "message": "Users fetched",
  "data": []
}
```

### Error

```json
{
  "success": false,
  "message": "User not found"
}
```

---

# 🧠 Why Use This Package?

Without helper:

```js
try {
  const user = await User.find();
  res.status(200).json({ success: true, data: user });
} catch (err) {
  res.status(500).json({ success: false, message: err.message });
}
```

With `express-err-helper`:

```js
res.success(user);
```

Much cleaner and easier to maintain.

---

# 🛠 Use Cases

* REST APIs
* Microservices
* Express backends
* Node.js API servers
* Backend projects with consistent response format

---

# 🤝 Contributing

Contributions are welcome.

1. Fork the repository
2. Create a feature branch
3. Submit a pull request

---

# 📄 License

Apache-2.0

© Anas Alam
https://github.com/mohdanas86
