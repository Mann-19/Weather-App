require("dotenv").config();

const bodyParser = require("body-parser");
const express = require("express");
const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");

app.use(express.static(__dirname + "/public/"));
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));

const apiKey = process.env.API_KEY;

async function fetchWeatherData(region) {
  const apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${region}&days=4`;
  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const weatherData = await response.json();
    return weatherData;
  } catch (err) {
    throw err;
  }
}

app.get("/", async (req, res) => {
  let weatherData;

  if (req.query.region) {
    const userCity = req.query.region;
    try {
      weatherData = await fetchWeatherData(userCity);
    } catch (err) {
      console.error("Error fetching weather data:", err);
    }
  } else {
    weatherData = await fetchWeatherData('London');
  }

  res.status(200).render("index", { weatherData: weatherData });
});

app.listen(3000, () => {
  console.log("Connected to server");
});
