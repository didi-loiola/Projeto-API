const express = require('express');
const router = express.Router();
const login = require('../middleware/login');
const imagens = require('../controllers/imagens');

router.delete('/:id_imagem', login.obrigatorio, imagens.deleteImagem);

module.exports = router;