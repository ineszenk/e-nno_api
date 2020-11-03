var bcrypt = require("bcryptjs");

module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define(
    "users",
    {
      name: {
        type: Sequelize.STRING
      },
      username: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      }
    },

    {
      hooks: {
        beforeCreate: async user => {
          user.password = await bcrypt.hash(user.password, 10);
        }
      },
      instanceMethods: {
        validPassword: function(password, hash) {
          return bcrypt.compare(password, hash);
        }
      }
    }
  );

  return User;
};
