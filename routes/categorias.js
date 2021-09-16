const express = require('express');
const router = express.Router();
const login = require('../middleware/login');

const categorias = require('../controllers/categoria');

router.get('/', categorias.getCategoria);
router.post('/', login.obrigatorio, categorias.postCategoria);

module.exports = router;