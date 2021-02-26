const app = require("./app/router/router.js");
const { sequelize_connection } = require("./app/config/db.config");
const logger = require("./app/logger.js");

// Create a Server
const PORT = process.env.PORT || 8000;

logger.error("ERROR");

sequelize_connection()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`App listening on port ${PORT}!`);
    });
  })
  .catch(error => {
    logger.error("ERROR", { catch_error: error });

    // console.log(error);
  });
