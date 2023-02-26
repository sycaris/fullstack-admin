import mongoose from "mongoose";


/*  schema that is passed to mongodb through mongoose 
    all data must follow this structure*/

/* add real validation criteria for real applications */
const TransactionSchema = new mongoose.Schema(
  {
    userId: String,
    cost: String,
    products: {
      type: [mongoose.Types.ObjectId],
      of: Number
    },

  },
  { timestamps: true}
);

const Transaction = mongoose.model("Transaction", TransactionSchema);
export default Transaction;