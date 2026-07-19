const axios = require('axios');
//should use config ask the team about it 
const {logger}  = require('../config/logger');

// will test the code onm dummy Json....

const apiClient = axios.create({
    baseURL:process.env.ELEC_API_URL, // THe link of the company API
    timeout:Number(process.env.TIME_OUT)*1000, //in seconds 
    headers: {'Content-Type': 'application/json'}
});

const ELectricityProvider = {
    async getLatestReadings (){
        try {
            logger.info('Fetching The Electricity Readings...');

            const response = await apiClient.get('/recipes') // this is the end point in the link --> base URL: https://dummyjson.com endpoint /recipes, total link:https://dummyjson.com/recipes/1
            logger.info(`The readings were fetched successfully: ${response.data.recipes.length} `)
            return response.data; 
        } catch (error) {
            logger.error('the connections to electricity company  was failed ' , error);
            throw error;
        }
    }
};

module.exports = ELectricityProvider;

