const express = require('express');
const cors = require('cors');
const listOfEndpoint = require('express-list-endpoints');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const app = express();

dotenv.config({ path: '.env' });

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Routes
app.use('/odds', fullSlotNewRouter);
app.use('/odds', betfairExchangeOdds);
app.use('/odds', matchedOdds);

// Preview of the current endpoints into the terminal
console.log(listOfEndpoint(app));

// MongoDB connection
const MONGO_CONNECTION_STRING = process.env.MONGO_CONNECTION_STRING;
mongoose
  .connect(MONGO_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(
    app.listen(process.env.PORT, () => {
      console.log(`working on port ${process.env.PORT}`);
    })
  );
mongoose.connection.on('connected', () => {
  console.log('connected to atlas');
});
