const mysql = require('../mysql');

exports.getCategoria = async(req, res, next) => {
    try {
        const result = await mysql.execute("select * from categorias;")
        const response = {
            quantidade: result.length,
            produtos: result.map(categoria => {
                return {
                    id_categoria: categoria.id_categoria,
                    nome: categoria.nome,
                }
            })
        }
        return res.status(200).send(response)
    } catch (error) {
        return res.status(500).send({ error: error })
    }
}

exports.postCategoria = async(req, res, next) => {
    try {
        const query = 'INSERT INTO categorias(nome) values (?)';
        const result = await mysql.execute(query, [req.body.nome])
        const response = {
            mensagem: 'Categoria inserida com sucesso',
            categoriaCriada: {
                id_categoria: result.id_categoria,
                nome: req.body.nome,
                request: {
                    type: 'GET',
                    description: 'Retorna todas as categorias',
                    url: process.env.URL_API + 'categorias'
                }
            }
        }
        return res.status(201).send(response)
    } catch (error) {
        console.error(error)
        return res.status(500).send({ error: error, })
    }
}