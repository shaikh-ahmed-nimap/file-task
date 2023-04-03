const {Sequelize, DataTypes} = require('sequelize');

const sequelize = new Sequelize('combine_sales_details', 'root', '12345678', {
    dialect: 'mysql'
});

(async function () {
    try {
        await sequelize.authenticate();
        console.log('Database authenticated');
    } catch (e) {
        console.log(e);
    }
})();

module.exports = {dt: DataTypes, sequelize};
