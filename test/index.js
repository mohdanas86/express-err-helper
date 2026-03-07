import express from 'express';

import {
    asyncHandler,
    ApiError,
    errorHandler,
    responseHandler,
} from "../index.js";

const app = express();

app.use(responseHandler);

app.get("/", (req, res) => {
    res.success({ name: "Api is working" });
});

app.get("/error", asyncHandler(async (req, res) => {
    throw new ApiError("This is a test error", 500);
}));

app.use(errorHandler);

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});