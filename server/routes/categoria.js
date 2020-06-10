const express = require('express');
const app = express();
let { verificarToken, veificaAdminRole } = require('../middlewares/autenticacion');
let Categoria = require('../models/categoria');

app.get('/categoria', verificarToken, (req, res) => {

    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                categorias
            });

        })
});

app.get('/categoria/:id', verificarToken, (req, res) => {

    let id = req.params.id;

    Categoria.findById({ _id: id })
        .exec((err, categoria) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err: err,
                    message: 'Error al intentar recuperar los registros'
                });
            }

            if (!categoria) {
                return res.status(400).json({
                    ok: false,
                    err: err,
                    message: 'El id que introdujo no es un id valido'
                });
            }

            res.json({
                categoria: categoria,
                ok: true
            });
        });
});

app.post('/categoria', verificarToken, (req, res) => {

    let body = req.body;
    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err: err,
                message: 'Error al intentar almacenar el registro'
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        }

        res.json({
            categoria: categoriaDB,
            ok: true,
            message: 'Registro almacenado de forma satisfactoria'
        });
    });
});

app.put('/categoria/:id', [verificarToken, veificaAdminRole], (req, res) => {

    let id = req.params.id;
    let body = req.body;

    let categoriaDes = {
        descripcion: body.descripcion
    }

    Categoria.findByIdAndUpdate(id, categoriaDes, { new: true, runValidators: true }, (err, categoriaUpdate) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err: err,
                message: 'Error al intentar actualizar el registro'
            });
        }

        if (!categoriaUpdate) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id del registro que intentar actulizar no existe'
                }
            });
        }

        res.status(200).json({
            categoria: categoriaUpdate,
            ok: true,
            message: 'Registro actualizado satisfactoriamente'
        });
    });
});

app.delete('/categoria/:id', [verificarToken, veificaAdminRole], (req, res) => {

    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaDelete) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: err,
                message: 'Error al intentar eliminar el registro'
            });
        }

        if (!categoriaDelete) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id del registro que intentar eliminar no existe'
                }
            });
        }

        res.json({
            categoria: categoriaDelete,
            ok: true,
            message: 'Registro eliminado satisfactoriamente'
        });
    });
});

module.exports = app;