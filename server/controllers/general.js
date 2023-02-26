import User from "../models/User.js";
import OverallStat from "../models/OverallStat.js";
import Transaction from "../models/Transaction.js";


/* req gets the params, res sends info to front end */
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getDashboardStats = async( req, res ) => {
  try {
    // hard coded values
    const currentMonth = "January";
    const currentYear = 2021;
    const currentDay = "2021-01-30";

    // recent transactions
    const transactions = await Transaction.find()
      .limit(50)
      .sort({ createdOn: -1 });

    // overall stats
    const overallStat = await OverallStat.find({ year: currentYear });

    const {
      totalCustomers,
      yearlyTotalSoldUnits,
      yearlySalesTotal,
      monthlyData,
      salesByCategory,
    } = overallStat[0];

    const thisMonthStats = overallStat[0].monthlyData.find(({ month}) => {
      return month == currentMonth;
    });

    const todaysStats = overallStat[0].dailyData.find(({ date}) => {
      return date == currentDay;
    });

    res.status(200).json({
      totalCustomers,
      yearlyTotalSoldUnits,
      yearlySalesTotal,
      monthlyData,
      salesByCategory,
      thisMonthStats,
      todaysStats,
      transactions
    })

  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}