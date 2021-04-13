const app = require("./app/router/router.js");
const { sequelize_connection } = require("./app/config/db.config");
const logger = require("./app/logger.js");

// Create a Server
const PORT = process.env.PORT || 8000;


sequelize_connection()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`App listening on port ${PORT}!`);
    });
  })
  .catch(error => {
    logger.error(error, { catch_error: error });

  });
