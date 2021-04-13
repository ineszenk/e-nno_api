const { db } = require("../config/db.config.js");

const Kwh_conso = db.kwh_conso
const Op = db.Sequelize.Op;

exports.Consumption = async (req, res, next) => {
  const { enno_serial, startDate, endDate } = req.body;
  try {
  // GET A DEVICE'S KWH CONSUMPTION FROM HISTORY RETRIEVAL DATABASE BETWEEN 2 DATES
  const kwh_consumption = await Kwh_conso.findAll({
        where: {
          enno_serial: {
            [Op.startsWith]: 
            enno_serial
          },
          [Op.or]: [
            {
              tmp: {
                [Op.between]: [startDate, endDate]
              }
            }
          ]
        }
      });

      let kwh_parsed = [];

      kwh_consumption.map(el =>
        kwh_parsed.push({
          tmp: el.tmp,
          kWh: el.value,
          enno_serial: el.enno_serial
        })
      )


      res.status(200).json({
        Description: "Consumption data (kWh)",
        Consumption: kwh_parsed
      })

    } catch (error) {
      res.status(500).json({
        Description: "Consumption Data not available for this device during the requested period",
        error: error
      });
    }
  }
  
exports.ConsumptionLast = async (req, res, next) => {
  const { enno_serial } = req.params;

  // GET LAST 24HOURS KWH CONSUMPTION FOR A DEVICE 
    try {
      const kwh_last = await Kwh_conso.findAll({
        where: {
          enno_serial: {
            [Op.startsWith]: 
              enno_serial
          },
          [Op.or]: [
            {
              tmp: {
                [Op.between]: [
                  new Date(),
                  new Date(new Date().getTime() - 24 * 60 * 60 * 1000)
                ]
              }
            }
          ]
        }
      });

      let kwh_last_parsed = [];

      kwh_last.map(el =>
        kwh_last_parsed.push({
          tmp: el.tmp,
          kWh: el.value,
          enno_serial: el.enno_serial
         }))

      res.status(200).json({
        Description: "Consumption data (kWh)",
        Consumption: kwh_last_parsed
      });
    } catch (error) {
      res.status(500).json({
        description: "Consumption Data not available for this device during the requested period",
        error: error
      });
    }
  }

