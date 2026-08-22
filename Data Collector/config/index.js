/*This file was made to organize and check on the env variables
 and to centralize it, it's best practice, to use it, so I will check it later....
*/
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, '../.env')});


const requiredENV = ['DB_URL', 'PORT','TIME_OUT','ELEC_API_URL','NODE_ENV','SYNC_CRON_EXPRESSION'];
requiredENV.forEach((envName) => {
    if (!process.env[envName]) {
        throw new Error(`The .env variable ${envName} is not found`);
    }
});

const config = {
    env: process.env.NODE_ENV || "dev",
    mongo: {
        uri: process.env.DB_URL,
    },
    provider: {
        electricityApiUrl: process.env.ELEC_API_URL,
        timeout: parseInt(process.env.TIME_OUT, 10)*1000, // 5 second 
    },
    scheduler:{
        cronExpression: process.env.SYNC_CRON_EXPRESSION
    }
};

module.exports = config;