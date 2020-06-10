const express = require('express');
const app = express();
const { verificarToken } = require('../middlewares/autenticacion');
const Producto = require('../models/Producto');
const _ = require('underscore');

app.get('/producto', verificarToken, (req, res) => {

    Producto.find({ disponible: 'true' })
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err: err,
                    message: 'Error al intentar recuperar los registros'
                });
            }

            Producto.count({ disponible: 'true' }, (err, cantidad) => {
                res.status(200).json({
                    productos: productos,
                    cantidad: cantidad,
                    ok: true
                });
            });

        });
});

app.get('/producto/:id', verificarToken, (req, res) => {

    let id = req.params.id;
    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, producto) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err: err,
                    message: 'Error al intentar recuperar el registro'
                });
            }

            res.status(200).json({
                producto: producto,
                ok: true
            });
        });
});

app.get('/producto/buscar/:termino', verificarToken, (req, res) => {

    let termino = req.params.termino;
    let regx = new RegExp(termino, 'i');

    Producto.find({ nombre: regx })
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err: err,
                    message: 'Error al intentar recuperar el registro'
                });
            }

            res.status(200).json({
                productos: productos,
                ok: true
            });

        });
});

app.post('/producto', verificarToken, (req, res) => {

    let body = req.body;
    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        usuario: req.usuario._id,
        categoria: body.categoria

    });

    producto.save((err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err: err,
                message: 'Error al intentar almacenr el registro'
            });
        }

        res.status(201).json({
            producto: productoDB,
            ok: true,
            message: 'Registro almacenado de forma satisfactoria'
        });
    });
});

app.put('/producto/:id', verificarToken, (req, res) => {

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'precioUni', 'descripcion', 'disponible']);

    Producto.findByIdAndUpdate(id, body, { new: true }, (err, producto) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err: err,
                message: 'Error al intentar actualizar el registro'
            });
        }

        if (!producto) {
            return res.status(400).json({
                ok: false,
                err: err,
                message: 'El id que introdujo no es válido'
            });
        }

        res.status(201).json({
            producto: producto,
            ok: true,
            message: 'Registro actualizado de forma satisfactoria'
        });
    });
});

app.delete('/producto/:id', verificarToken, (req, res) => {

    let id = req.params.id;
    let updateStatus = {
        disponible: false
    }
    Producto.findByIdAndUpdate(id, updateStatus, { new: true }, (err, producto) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err: err,
                message: 'Error al intentar eliminar el registro'
            });
        }

        if (!producto) {
            return res.status(400).json({
                ok: false,
                err: err,
                message: 'El id que introdujo no es válido'
            });
        }

        res.status(201).json({
            producto: producto,
            ok: true,
            message: 'Registro eliminado de forma satisfactoria'
        });
    })
});

module.exports = app;