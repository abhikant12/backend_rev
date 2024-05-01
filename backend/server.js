const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const dbConnect = require("./config/database");
const userRoutes = require("./routes/user");
require("dotenv").config();

const app = express();
const PORT = 4000 || process.env.PORT;


const bodyParser = require('body-parser');
app.use(bodyParser.json({ limit: '10mb' }));

/** middlewares */
app.use(
  cors()
);
app.use(express.json());
app.use(morgan('tiny'));


/** api routes */
app.use('/api', userRoutes);


dbConnect();

app.listen(PORT, () => {
  console.log(`THE SERVER IS UP AND RUNNING AT PORT ${PORT}`);
});
