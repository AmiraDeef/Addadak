const mongoose = require('mongoose');
const  config  = require('./config/index.js');
const {logger} = require('./utils/logger.js');
const ElectricityCollectorService = require('./services/electricityCollectorService.js');

async function runManualTest() {
  try {
    logger.info('Test Runner: Connecting to MongoDB...');
    await mongoose.connect(config.mongo.uri);
    logger.info('Test Runner: MongoDB connected successfully.');

   
    await ElectricityCollectorService.syncReadings();
    
    logger.info('Test Runner: Manual sync execution finished.');
  } catch (error) {
    logger.error('Test Runner: Fatal error during manual test:', error);
  } finally {
    
    await mongoose.disconnect();
    logger.info('Test Runner: MongoDB connection closed.');
  }
}

runManualTest();