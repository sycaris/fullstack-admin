import mongoose from "mongoose";


/*  schema that is passed to mongodb through mongoose 
    all data must follow this structure*/

/* add real validation criteria for real applications */
const AffiliateStatSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Types.ObjectId, ref: "User"},
    affiliateSales: {
      type: [mongoose.Types.ObjectId],
      ref: "Transaction"
    }

  },
  { timestamps: true}
);

const AffiliateStat = mongoose.model("AffiliateStat", AffiliateStatSchema);
export default AffiliateStat;