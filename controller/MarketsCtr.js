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
          Accepts: "application/json",
          // "X-CMC_PRO_API_KEY": "6413a04e-32f7-4907-8588-ee16541e827c",
          "X-CMC_PRO_API_KEY": "482b34b5-bdbd-4157-840d-82aa9d1c5637",
        },
      }
    );

    // Send the data back to the client if it's the first request
    if (res && !res.headersSent) {
      res.json(response.data);
    }

    // Log the data in the console
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
