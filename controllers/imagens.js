const mysql = require('../mysql');

exports.deleteImagem = async(req, res, next) => {
    try {
        const query = `delete from imagens_produtos where id_imagem= ?;`
        await mysql.execute(query, [req.params.id_imagem]);
        const response = {
            messagem: 'Imagem removida com sucesso',
            request: {
                tipo: 'DELETE',
                descricao: 'Apaga uma imagem',
                url: process.env.URL_API + '/produtos/' + req.body.id_produto + '/imagem',
                body: {
                    id_produto: 'Number',
                    imagem_produto: 'File'
                }
            }
        }
        return res.status(201).send(response);
    } catch (error) {
        return res.status(500).send({ error: error });
    }
}