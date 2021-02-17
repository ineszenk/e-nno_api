const verifySignUp = require("./verifySignUp");
const authJwt = require("./verifyJwtToken");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../docs/swagger.json");
var express = require("express");
const volleyball = require("volleyball");
const bodyParser = require("body-parser");

const app = express();

const swaggerOptions = {
  swaggerOptions: {
    validatorUrl: null
  }
};

const authController = require("../controller/authController.js");
const staticController = require("../controller/staticController.js");
const hydraulicController = require("../controller/hydraulicController.js");
const consumptionController = require("../controller/consumptionController.js");
const metoeController = require("../controller/meteoController.js");
const kpiController = require("../controller/kpiController.js");
const graphicsController = require("../controller/graphicsController.js");

// logging middleware
app.use(volleyball);

// body parsing middleware

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));

// Swagger documentation
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, swaggerOptions)
);

// Sign up route
app.post(
  "/api/auth/signup",
  [verifySignUp.checkDuplicateUserNameOrEmail],
  authController.signup
);

// Login route
app.post("/user/login", authController.signin);

// Admin authentification and authorization
app.get(
  "/api/test/admin",
  [authJwt.verifyToken, authJwt.isAdmin],
  authController.adminBoard
);

// Get Meteo data for a given period
app.get(
  "/meteo/:enno_serial/:startDate/:endDate",
  [authJwt.verifyToken],
  metoeController.Meteo
);

// Get Meteo data for the last 24h
app.get(
  "/meteo/:enno_serial",
  [authJwt.verifyToken],
  metoeController.MeteoLast
);

// Get Hydraulic Group data
app.get(
  "/hydraulic_group/:enno_serial/:startDate/:endDate",
  [authJwt.verifyToken],
  hydraulicController.HydrauliqueGroup
);

// Get Hydraulic Group data for the last 24h
app.get(
  "/hydraulic_group/:enno_serial",
  [authJwt.verifyToken],
  hydraulicController.HydrauliqueGroupLast
);

app.get(
  "/consumption/:enno_serial/:startDate/:endDate",
  [authJwt.verifyToken],
  consumptionController.Consumption
);

app.get(
  "/consumption/:enno_serial",
  [authJwt.verifyToken],
  consumptionController.ConsumptionLast
);

app.get("/static/:key", [authJwt.verifyToken], staticController.static);

app.get("/kpi/:key", [authJwt.verifyToken], kpiController.Kpi);

app.get("/graphics/:key", [authJwt.verifyToken], graphicsController.Graphics);

module.exports = app;
