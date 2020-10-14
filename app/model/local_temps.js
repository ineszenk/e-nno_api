/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('local_temps', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    tmp: {
      type: DataTypes.DATE,
      allowNull: true
    },
    cmd_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    value: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    cmd_name: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    enno_serial: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    device_name: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    key: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'local_temps',
    schema: 'public'
    });
};
