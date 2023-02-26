import Product from "../models/Product.js";
import ProductStat from "../models/ProductStat.js";
import User from "../models/User.js";
import Transaction from "../models/Transaction.js";
import getCountryIso3 from "country-iso-2-to-3";



/* mongoose docs to see how to write more appi calls */

/* make sure to use robust error catching */
export const getProducts = async (req, res) => {
  try {
    // gets all products from db
    const products = await Product.find();

    // for all products get its product stat from db based on product ID
    // returns one object with the product and the stats combined

    // this is a slow query style
    // better to use aggregate calls ( just like joins and unions in SQL)
    const productsWithStats = await Promise.all(
      products.map( async(product) => {
        const stat = await ProductStat.find({
          productId: product._id,
        })
        return {
          ...product._doc,
          stat,
        }
      })
    );

    res.status(200).json(productsWithStats);

  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getCustomers = async(req, res) => {
  try {
    const customers = await User.find({role: "user"}).select("-password");
    res.status(200).json(customers);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getTransactions = async(req, res) => {
  try {
    // sort should look like this : {"field": "userId", "sort": "desc"}
    const { page = 1, pageSize=20, sort=null, search=""} = req.query;

    // formatted sort should look like { userId: -1}
    const generateSort = () => {
      const sortParsed = JSON.parse(sort);
      const sortFormatted = {
        [sortParsed.field]: sortParsed.sort = "asc" ? 1 : -1,
      };

      return sortFormatted;
    };


    const sortFormatted = Boolean(sort) ? generateSort() : {};

    // do a regular search on the based on the user's search
    const transactions = await Transaction.find({
      $or: [
        { cost: { $regex: new RegExp(search, "i")}},
        { userId: { $regex: new RegExp(search, "i")}}
      ],
    })
      .sort(sortFormatted)
      .skip(page*pageSize)
      .limit(pageSize);

    const total = await Transaction.countDocuments({
      name: { $regex: search, $options: "i" },
    });

    res.status(200).json({
      transactions,
      total
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getGeography = async( req, res) => {
  try {
    const users = await User.find();

    /* timestamp 4:12 */
    /* 
    grab country value for every user
    convert it to iso3 format and add to an object
    if there is no value for that iso3 in the object initialize it to 0
    then increment that iso3 by 1

    results in an array of key value pairs
      key: the country iso3
      value: number of users in that country
    
      generally foramt data in the backend
    */
    const mappedLocations = users.reduce((acc, {country}) => {
      const countryISO3 = getCountryIso3(country);
      if (!acc[countryISO3]){
        acc[countryISO3] = 0;
      }
      acc[countryISO3]++;
      return acc;
    }, {});

    /* put in proper foramt for nivo choropath chart */
    const formattedLocations = Object.entries(mappedLocations).map(
      ([country, count]) => {
        return { id: country, value: count}
      }
    );

    res.status(200).json(formattedLocations);


  } catch (error) {
    res.status(404).json({ message: error.message });
  }

}