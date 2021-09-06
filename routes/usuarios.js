const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const usuario = require('../controllers/usuarios')

router.post('/cadastro', usuarios.cadastroUsuario);
router.post('/login', usuarios.logarUsuario);

module.exports = router;