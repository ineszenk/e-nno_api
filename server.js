var express = require("express");
var app = express();
var bodyParser = require("body-parser");
app.use(bodyParser.json());

require("./app/router/router.js")(app);

// Create a Server
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});
