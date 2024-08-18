// routes/memoRoutes.js
const express = require('express');
const memoRoutes = express.Router();
const authMiddleware = require('../middleware/authmiddleware');
const { addMemo, getMemos, updateMemo, deleteMemo } = require('../controllers/memoController');

memoRoutes.post('/memo', authMiddleware, addMemo);
memoRoutes.get('/memos/:projectId', authMiddleware, getMemos);
memoRoutes.put('/memo/:id', authMiddleware, updateMemo);
memoRoutes.delete('/memo/:id', authMiddleware, deleteMemo);

module.exports = memoRoutes;
