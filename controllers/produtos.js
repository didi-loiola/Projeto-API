const mysql = require('../mysql');

exports.getProdutos = async(req, res, next) => {
    try {
        const result = await mysql.execute("select * from produtos;")
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
    } catch (error) {
        return res.status(500).send({ error: error })
    }
}

exports.postProdutos = async(req, res, next) => {
    try {
        const query = 'INSERT INTO produtos(nome, preco, imagem_produto) values (?,?,?)';
        const result = await mysql.execute(query, [
            req.body.nome,
            req.body.preco,
            req.file.path
        ])
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
    } catch (error) {
        console.error(error)
        return res.status(500).send({ error: error, })
    }
}

exports.getProdutoUnico = async(req, res, next) => {
    try {
        const query = 'select * from produtos where id_produtos=?;'
        const result = await mysql.execute(query, [req.params.id_produto]);
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
    } catch (error) {
        return res.status(500).send({ error: error })
    }
}

exports.deleteProduto = async(req, res, next) => {
    try {
        const query = `delete from produtos where id_produtos= ?;`
        await mysql.execute(query, [req.body.id_produto]);
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
        return res.status(201).send(response);
    } catch (error) {
        return res.status(500).send({ error: error });
    }
}

exports.patchProduto = async(req, res, next) => {
    try {
        const query = `update produtos set nome=?,preco=? where id_produtos= ?`;
        await mysql.execute(query, [
            req.body.nome,
            req.body.preco,
            req.body.id_produto
        ])
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
    } catch (error) {
        return res.status(500).send({ error: error })
    }
}

exports.postImagem = async(req, res, next) => {
    try {
        const query = 'INSERT INTO imagens_produtos(id_produtos, caminho) values (?,?)';
        const result = await mysql.execute(query, [
            req.params.id_produto,
            req.file.path
        ])
        const response = {
            mensagem: 'Imagem inserida com sucesso',
            imagemCriada: {
                id_produto: parseInt(req.params.id_produto),
                id_imagem: result.insertId,
                imagem_produto: req.file.path,
                request: {
                    tipo: 'GET',
                    descricao: 'Retorna todas imagens',
                    url: process.env.URL_API + '/produtos/' + req.params.id_produto + '/imagens'
                }
            }
        }
        return res.status(201).send(response)
    } catch (error) {
        console.error(error)
        return res.status(500).send({ error: error, })
    }
}

exports.getImagens = async(req, res, next) => {
    try {
        const query = "select * from imagens_produtos where id_produtos=?;"
        const result = await mysql.execute(query, [req.params.id_produto]);
        const response = {
            quantidade: result.length,
            imagens: result.map(img => {
                return {
                    id_produto: parseInt(req.params.id_produto),
                    id_imagem: img.id_imagem,
                    caminho: process.env.URL_API + img.caminho,
                }
            })
        }
        return res.status(200).send(response)
    } catch (error) {
        return res.status(500).send({ error: error })
    }
}