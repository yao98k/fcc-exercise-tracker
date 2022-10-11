require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const connectDB = require("./db/connect");
const Router = require ("./routes/routes");
const notFoundMiddleware = require("./middleware/not-found");
const errorMiddleware = require("./middleware/error-handler");
const bodyParser = require("body-parser")
const bodyParserErrorHandler = require('express-body-parser-error-handler');
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(bodyParserErrorHandler());



app.use("/",Router);

app.use(notFoundMiddleware);
app.use(errorMiddleware);


app.use(cors());
app.use(express.static('/views'));
app.use(express.static("/public"));




connectDB(process.env.MONGO_URI);
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
