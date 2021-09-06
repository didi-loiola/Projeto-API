const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
const multer = require('multer');
const login = require('../middleware/login');
const produtos = require('../controllers/produtos')
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
    }
})
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
})

router.get('/', produtos.getProdutos);
router.post('/', login.obrigatorio, upload.single('produto_imagem'), produtos.postProdutos)
router.get('/:id_produto', produtos.getProdutoUnico)
router.delete('/', login.obrigatorio, produtos.deleteProduto)
router.patch('/', login.obrigatorio, produtos.patchProduto)

module.exports = router;