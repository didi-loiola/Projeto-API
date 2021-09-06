const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const usuario = require('../controllers/usuario')

router.post('/cadastro', usuario.cadastroUsuario);
router.post('/login', usuario.logarUsuario);

module.exports = router;