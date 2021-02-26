"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const schema_1 = require("../schema");
const router = express_1.Router();
router.post('/signup', async (req, res, next) => {
    const user = req.body;
    const valid = schema_1.schemaSignup.validate(user);
    if (valid.error) {
        res.statusCode = 400;
        return next(new Error(valid.error.details[0].message));
    }
    ;
});
exports.default = router;
