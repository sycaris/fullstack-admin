import mongoose from "mongoose";
import User from "../models/User.js";
import Transaction from "../models/Transaction.js";

export const getAdmins = async (req,res) => {
  try {
    const admins = await User.find({ role: "admin"}).select("-password");
    res.status(200).json(admins);

  } catch (error) {
    res.status(404).json({message: error.message});
  }
};

/* aggregate call */
export const getUserPerformance = async (req,res) => {
  try {
    
    /* grab user id
    convert to the correct mongodb format
    match it to the user with that id
    lookup from the affiliatestats table
    comparing betwen _id of current user and userId in affiliate stats table 
    then flatten the array
    
    yeild the current user's information and their affiliate stats information*/
    const { id } = req.params;
    const userWithStats = await User.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(id)}},
      {
        $lookup: {
          from: "affiliatestats",
          localField: "_id",
          foreignField: "userId",
          as: "affiliateStats"
        },
      },
      { $unwind: "$affiliateStats"}
    ]);

    const saleTransactions = await Promise.all(
      userWithStats[0].affiliateStats.affiliateSales.map((id) => {
        return Transaction.findById(id)
      })
    );

    const filterSaleTransactions = saleTransactions.filter(
      (transactions) => transactions !== null
    );

    res.status(200).json({user: userWithStats[0], sales: filterSaleTransactions});
    

  } catch (error) {
    res.status(404).json({message: error.message});
  }
};