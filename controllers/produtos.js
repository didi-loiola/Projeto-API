const mysql = require('../mysql').pool;

exports.getProdutos = (req, res, next) => {
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
                            imagem_produto: prod.imagem_produto,
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorna detalhes de um produto específico',
                                url: process.env.URL_API + '/produtos/' + prod.id_produtos
                            }
                        }
                    })
                }
                return res.status(200).send(response)
            }
        )
    })

}

exports.postProdutos = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        conn.query(
            'INSERT INTO produtos(nome, preco, imagem_produto) values (?,?,?)', [
                req.body.nome,
                req.body.preco,
                req.file.path
            ],
            (error, result, field) => {
                conn.release();

                if (error) { return res.status(500).send({ error: error, }) }
                const response = {
                    mensagem: 'Produto inserido com sucesso',
                    produtoCriado: {
                        id_produto: result.id_produtos,
                        nome: req.body.nome,
                        preco: req.body.preco,
                        imagem_produto: req.file.path,
                        request: {
                            tipo: 'POST',
                            descricao: 'Insere um produto',
                            url: process.env.URL_API + '/produtos/'
                        }
                    }
                }
                return res.status(201).send(response)
            }
        )
    })
}

exports.getProdutoUnico = (req, res, next) => {
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
                        imagem_produto: result[0].imagem_produto,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna um produto',
                            url: process.env.URL_API + '/produtos/'
                        }
                    }
                }
                return res.status(200).send(response);
            }
        )
    })
}

exports.deleteProduto = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        conn.query(
            `delete from produtos where id_produtos= ?`, [req.body.id_produto],
            (error, result, field) => {
                conn.release();

                if (error) { return res.status(500).send({ error: error }) }
                const response = {
                    messagem: 'Produto removido com sucesso',
                    request: {
                        tipo: 'DELETE',
                        descricao: 'Apaga um produto',
                        url: process.env.URL_API + '/produtos/',
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
}

exports.patchProduto = (req, res, next) => {
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
                    mensagem: 'Produto atualizado com sucesso',
                    produtoAtualizado: {
                        id_produto: req.body.id_produtos,
                        nome: req.body.nome,
                        preco: req.body.preco,
                        request: {
                            tipo: 'PATCH',
                            descricao: 'Atualiza um produto',
                            url: process.env.URL_API + '/produtos/' + req.body.id_produto
                        }
                    }
                }
                return res.status(202).send(response)
            }
        )
    })
}