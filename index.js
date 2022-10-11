require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const connectDB = require("./db/connect");
const Router = require ("./routes/routes");
const notFoundMiddleware = require("./middleware/not-found");
const errorMiddleware = require("./middleware/error-handler");
const bodyParser = require("body-parser")
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/api/users",Router);

app.use(notFoundMiddleware);
app.use(errorMiddleware);


app.use(cors());
app.use(express.static('public'));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});




connectDB(process.env.MONGO_URI);
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
