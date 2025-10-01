const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
color: { type: String },
size: { type: String },
stock: { type: Number, default: 0 }
});

const productSchema = new mongoose.Schema({
name: { type: String, required: true },
price: { type: Number },
category: { type: String },
details: {
    brand: { type: String },
    warranty: { type: String }
},
variants: [variantSchema]
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
