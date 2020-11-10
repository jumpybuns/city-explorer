require('dotenv').config();

import request from 'superagent';
import { mungeLocation, mungeWeather, mungeTrails, mungeReviews } from '../utils.js';

const express = require('express');
const cors = require('cors');
const app = express();
const morgan = require('morgan');
const ensureAuth = require('./auth/ensure-auth');
const createAuthRoutes = require('./auth/create-auth-routes');


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev')); // http logging


const authRoutes = createAuthRoutes();

// setup authentication routes to give user an auth token
// creates a /auth/signin and a /auth/signup POST route. 
// each requires a POST body with a .email and a .password
app.use('/auth', authRoutes);

// everything that starts with "/api" below here requires an auth token!
app.use('/api', ensureAuth);

// and now every request that has a token in the Authorization header will have a `req.userId` property for us to see who's talking
app.get('/api/test', (req, res) => {
  res.json({
    message: `in this proctected route, we get the user's id like so: ${req.userId}`
  });
});

app.get('/location', async(req, res) => {
  try {
    const response = await request.get(`https://us1.locationiq.com/v1/search.php?key=${process.env.LOCATION_IQ_API_KEY}&q=${req.query.display_name}&format=json`);

    const munged = mungeLocation(response.body.location);
    res.json(munged);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});

app.get('/weather', async(req, res) => {
  try {
    const response = await request.get(
      `https://api.weatherbit.io/v2.0/forecast/daily?&lat=${req.query.lat}&lon=${req.query.lon}&key=${process.env.WEATHER_BIT_API_KEY}`
    );
    const munged = mungeWeather(response.body.weather);
    res.json(munged);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});

app.get('/trails', async(req, res) => {
  try {
    const response = await request.get(
      `https://www.hikingproject.com/data/get-trails?lat=${req.query.lat}&lon=${req.query.lon}&maxDistance=200&key=${process.env.HIKING_PROJECT_API_KEY}`
    );
    const munged = mungeTrails(response.body.trails);
    res.json(munged);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});

app.get('/reviews', async(req, res) => {
  try {
    const response = await request
      .get(
        `https://api.yelp.com/v3/businesses/search?location=${req.query.location}`)
      .set(
        'Authorization', `Bearer ${process.env.YELP_API_KEY}`);
    
    res.json(response.body.business);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});

app.use(require('./middleware/error'));




module.exports = app;
