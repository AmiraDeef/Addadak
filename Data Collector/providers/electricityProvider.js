const axios = require('axios');
const config = require('../config/index')
const {logger}  = require('../utils/logger');

// will test the code onm dummy Json....

const apiClient = axios.create({
    baseURL:config.provider.electricityApiUrl, // THe link of the company API
    timeout:config.provider.timeout, //in seconds 
    headers: {'Content-Type': 'application/json'}
});

const ELectricityProvider = {
    async getLatestReadings (){
        try {
            logger.info('Fetching The Electricity Readings...');

            const response = await apiClient.get('/meters/readings') // this is the end point in the link --> base URL: https://dummyjson.com endpoint /recipes, total link:https://dummyjson.com/recipes/1
            logger.info(`The readings were fetched successfully: ${response.data.length} `)
            return response.data; 
        } catch (error) {
            logger.error('the connections to electricity company  was failed ' , error);
            throw error;
        }
    }
};

module.exports = ELectricityProvider;

