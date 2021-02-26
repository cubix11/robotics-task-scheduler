"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const schema_1 = require("../schema");
const router = express_1.Router();
router.get('/signup', async (req, res) => {
    const user = req.body;
    const valid = schema_1.schemaSignup.validate(user);
});
exports.default = router;
