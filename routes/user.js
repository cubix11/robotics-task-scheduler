"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = express_1.Router();
router.get('/signup', async (req, res) => {
    const user = req.body;
});
exports.default = router;
