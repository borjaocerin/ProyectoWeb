const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({

    email: {
        type: String,
        required: true
    },
    id_producto: {
        type: String,
        required: true
    },
    fecha_pedido: {
        type: String,
        required: true
    },
    precio: {
        type: Number,
        required: true
    },

});

module.exports = mongoose.model('Compra', productSchema);
