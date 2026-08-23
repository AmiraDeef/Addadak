const axios = require('axios');
const axiosRetry = require('axios-retry').default;
const config = require('../config/index')
const {logger}  = require('../utils/logger');

// will test the code onm dummy Json....

const apiClient = axios.create({
    baseURL:config.provider.waterApiUrl, // THe link of the company API
    timeout:config.provider.timeout, //in seconds 
});

axiosRetry(apiClient, {
  retries: 3, //make three trailes 
  retryDelay: axiosRetry.exponentialDelay, //increase the time between each trail and another 
  retryCondition: (error) => {
    //try again only if it was networking error or server error.
    return axiosRetry.isNetworkOrIdempotentRequestError(error) || (error.response && error.response.status >= 500);
  },
  onRetry: (retryCount, error, requestConfig) => {
    logger.warn(`API Connection failed. Retrying request (${retryCount}/3)... URL: ${requestConfig.url}`);
  }
});

axios.Retry
const waterProvider = {
    async getLatestReadings (){
        try {
            logger.info('Fetching The Water Readings...');

            const response = await apiClient.get('/meters/readings') // this is the end point in the link --> base URL: https://dummyjson.com endpoint /recipes, total link:https://dummyjson.com/recipes/1
            logger.info(`The readings were fetched successfully: ${response.data.length} `)
            return response.data; 
        } catch (error) {
            logger.error('the connections to water company  was failed ' , error);
            throw error;
        }
    }
};

module.exports = waterProvider;

