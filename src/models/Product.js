import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  code: { type: Number, require: true },
  category: { type: String }
});

const Product = mongoose.model('Product', productSchema);

export default Product;
/* "title": "Presurizador Violeta",
  "description": "Presurizador para pelotas color Violeta",
  "price": 22000,
  "thumbnail": "https://img.example.com/x.jpg",
  "code": "001",
  "stock": 15,
  "category": "Presurizador",
  "status": true */