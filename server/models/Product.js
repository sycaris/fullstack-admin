import mongoose from "mongoose";


/*  schema that is passed to mongodb through mongoose 
    all data must follow this structure*/

/* add real validation criteria for real applications */
const ProductSchema = new mongoose.Schema(
  {
    name: String,
    price: Number,
    description: String,
    category: String,
    rating: Number,
    supply: Number
  },
  { timestamps: true}
);

const Product = mongoose.model("Product", ProductSchema);
export default Product;