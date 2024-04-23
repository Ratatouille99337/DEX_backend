const express = require("express");
const axios = require("axios");
let response = null;
const cron = require("node-cron");

exports.getCoinData = async (req, res) => {
  fetchCryptoData(res);
};
async function fetchCryptoData(res) {
  try {
    const response = await axios.get(
      "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?limit=100",
      {
        headers: {
          "X-CMC_PRO_API_KEY": "7281cb38-d68e-41f2-8dfb-793727391e41",
        },
      }
    );

    // Send the data back to the client if it's the first request
    if (res && !res.headersSent) {
      res.json(response.data);
    }

    // Log the data in the console
    console.log(response.data);
  } catch (error) {
    console.error("Error fetching the crypto data:", error);

    // Send an error response back to the client if it's the first request
    if (res && !res.headersSent) {
      res.status(500).send("Unable to fetch data");
    }
  }
}

// We don't tie the interval directly to an Express route since that would set up
// multiple intervals per each user request. Instead, we use a separate routine.
setInterval(() => {
  fetchCryptoData(null); // Pass null because we're not responding to a specific request here
}, 5000); // Interval set to every 5 seconds
