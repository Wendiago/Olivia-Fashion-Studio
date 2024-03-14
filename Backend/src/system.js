const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
dotenv.config();
const https = require("https");
const fs = require("fs");

const paymentRoute = require("./routes/SubSystem/payment");

const conecctToDB = require("./configs/db");

const PORT = process.env.PORTSYSTEM || 3000;

const app = express();

//CONNECT DATABASE
conecctToDB();
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://localhost:3001",
      "https://oliviafashion.netlify.app",
    ],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

//ROUTES

app.use("/api/payment", paymentRoute);

const server = https.createServer(
  {
    key: fs.readFileSync("./.cert/key.pem"),
    cert: fs.readFileSync("./.cert/cert.pem"),
  },
  app
);

server.listen(PORT, () => {
  console.log(`App listening at https://localhost:${PORT}`);
});
