import express from "express"
import axios from "axios"
import bodyParser from "body-parser"

const app = express();
const port = 3000;
const API_KEY = "ef21d491ff62cee23dbac33a0943cd0b";
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("index.ejs", { 
        name: null, 
        temperature: null, 
        pressure: null, 
        humidity: null, 
        temp: "Waiting for data..." 
     });
  });


app.post("/", async(req, res) => {
    const city = req.body.city;
    try {
        // Step 1: Get coordinates of the city
        const geoResponse = await axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${API_KEY}`);
        if (!geoResponse.data.length) {
            throw new Error("City not found. Please enter a valid city name.");
        }
        const { lat, lon } = geoResponse.data[0];

        // Step 2: Use coordinates to get temperature
        const weatherResponse = await axios.get(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const weather = weatherResponse.data.weather[0].main
        res.render("index.ejs", { 
            name: weatherResponse.data.name,
            temperature: weatherResponse.data.main.temp,
            pressure: weatherResponse.data.main.pressure,
            humidity: weatherResponse.data.main.humidity,
            weather: weather
         });
        
    } catch (error) {
        const errorMessage =  error.message|| "An error occurred while fetching data.";
        res.render("index.ejs", {
            name: null,
            temperature: null,
            pressure: null,
            humidity: null,
            temp: errorMessage 
            });
    }
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
