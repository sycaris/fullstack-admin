import mongoose from "mongoose";


/*  schema that is passed to mongodb through mongoose 
    all data must follow this structure*/

/* add real validation criteria for real applications */
const OverallStatSchema = new mongoose.Schema(
  {
    totalCustomers: Number,
    yearlySalesTotal: Number,
    yearlyTotalSoldUnits: Number,
    year: Number,
    monthlyData: [{
        month: String,
        totalSales: Number,
        totalUnits: Number,
      }],
    dailyData: [{
      date: String,
      totalSales: Number,
      totalUnits: Number,
    }],
    salesByCategory: {
      type: Map,
      of: Number
    }
  },
  { timestamps: true}
);

const OverallStat = mongoose.model("OverallStat", OverallStatSchema);
export default OverallStat;