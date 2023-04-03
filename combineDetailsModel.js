const {sequelize, dt} = require("./config");

const Details = sequelize.define('Details', {
    index: {
        type: dt.INTEGER
    },
    xlDataKey: {
        type: dt.STRING
    },
    xlAmount: {
        type: dt.STRING
    },
    csvDataKey: {
        type: dt.STRING,
    },
    csvAmount: {
        type: dt.STRING,
    },
    DrillDownDesc: {
        type: dt.STRING
    }
}, {
    timestamps: false
});

module.exports = Details;