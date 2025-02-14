const express = require('express');
const cron = require('node-cron');
const axios = require('axios');

var fuelPrices = {};

const getFuelPrices = async () => {
  const options = {
    method: 'GET',
    url: 'https://daily-fuel-prices-update-india.p.rapidapi.com/car/v2/fuel/cities',
    headers: {
      'x-rapidapi-key': '783a04fd4bmsha3ae366dfb58653p13770ajsna9b405552ab1',
      'x-rapidapi-host': 'daily-fuel-prices-update-india.p.rapidapi.com',
      src: 'android-app',
      appVersion: '1.0',
      deviceId: 'abcs',
    },
  };

  try {
    const response = await axios.request(options);
    fuelPrices = response.data;
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
};

const fetchFuelPrices = async () => {
  cron.schedule('0 6 * * *', () => {
    console.log('Starting fuel price updates for the day...');

    // Fetch immediately at 6:00 AM
    getFuelPrices();

    // Schedule to refresh every 5 minutes until 7:00 AM
    const refreshInterval = setInterval(fetchFuelPrices, 5 * 60 * 1000);

    // Stop refreshing at 7:00 AM
    setTimeout(() => {
      clearInterval(refreshInterval);
      console.log('Stopped refreshing fuel prices.');
    }, 60 * 60 * 1000); // Stop after 1 hour
  });
};

module.exports = { fetchFuelPrices, getFuelPrices, fuelPrices };
