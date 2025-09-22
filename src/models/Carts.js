import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
  usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  productos: [
    {
      productoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      cantidad: { type: Number, default: 1 }
    }
  ]
});

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;
