const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;

router.get('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            'select * from produtos;',
            (error, result, fields) => {
                if (error) { return res.status(500).send({ error: error }) }
                const response = {
                    quantidade: result.length,
                    produtos: result.map(prod => {
                        return {
                            id_produto: prod.id_produtos,
                            nome: prod.nome,
                            preco: prod.preco,
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorna detalhes de um produto específico',
                                url: 'http://localhost:3000/produtos/' + prod.id_produtos
                            }
                        }
                    })
                }
                return res.status(200).send(response)
            }
        )
    })

})

router.post('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        conn.query(
            'INSERT INTO produtos(nome, preco) values (?,?)', [req.body.nome, req.body.preco],
            (error, result, field) => {
                conn.release();

                if (error) { return res.status(500).send({ error: error, }) }
                const response = {
                    mensagem: 'Produto inserido com sucesso',
                    produtoCriado: {
                        id_produto: result.id_produtos,
                        nome: req.body.nome,
                        preco: req.body.preco,
                        request: {
                            tipo: 'POST',
                            descricao: 'Insere um produto',
                            url: 'http://localhost:3000/produtos/'
                        }
                    }
                }
                return res.status(201).send(response)
            }
        )
    })
})

router.get('/:id_produto', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            'select * from produtos where id_produtos=?;', [req.params.id_produto],
            (error, result, fields) => {
                if (error) { return res.status(500).send({ error: error }) }

                if (result.length == 0) {
                    return res.status(404).send({
                        mensagem: 'Não foi encontrado produto com esse id.'
                    })
                }
                const response = {
                    produto: {
                        id_produto: result[0].id_produtos,
                        nome: result[0].nome,
                        preco: result[0].preco,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna um produto',
                            url: 'http://localhost:3000/produtos/'
                        }
                    }
                }
                return res.status(200).send(response);
            }
        )
    })
})

router.delete('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        conn.query(
            `delete from produtos where id_produtos= ?`, [req.body.id_produto],
            (error, result, field) => {
                conn.release();

                if (error) { return res.status(500).send({ error: error }) }
                const response = {
                    messagem: 'Produto removido com sucesso',
                    request: {
                        tipo: 'POST',
                        descricao: 'Apaga um produto',
                        url: 'http://localhost:3000/produtos/',
                        body: {
                            nome: 'String',
                            preco: 'Number'
                        }
                    }
                }
                return res.status(201).send(response)
            }
        )
    })
})

router.patch('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        conn.query(
            `update produtos
                set nome=?,
                    preco=?
            where   id_produtos= ?`, [
                req.body.nome,
                req.body.preco,
                req.body.id_produto
            ],
            (error, result, field) => {
                conn.release();

                if (error) { return res.status(500).send({ error: error }) }
                const response = {
                    mensagem: 'Produto inserido com sucesso',
                    produtoAtualizado: {
                        id_produto: req.body.id_produtos,
                        nome: req.body.nome,
                        preco: req.body.preco,
                        request: {
                            tipo: 'PATCH',
                            descricao: 'Atualiza um produto',
                            url: 'http://localhost:3000/produtos/' + req.body.id_produto
                        }
                    }
                }
                return res.status(202).send(response)
            }
        )
    })
})

module.exports = router;