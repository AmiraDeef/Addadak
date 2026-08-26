const cron  = require('node-cron');
const config = require('../config/index');
const {logger} = require('../utils/logger');
const waterCollectorService = require('../services/waterCollectorService');


let isRunning = false;
let task = null;

const waterScheduler = {
    start (){
        const cronExpression = config.scheduler.cronExpression;

        logger.info(`Initializing Water Collector Scheduler with pattern: "${cronExpression}"`);

        task = cron.schedule(cronExpression, async ()=>{
            if(isRunning){
                logger.warn('Scheduler skipped execution: Previous sync cycle is still in progress.');
                return;
            }

            isRunning = true;

            try{
                logger.info('Scheduler triggered: Executing automated water sync cycle...');
                await waterCollectorService.syncReadings();

            }catch(error){
                logger.error('Scheduler encountered an error during sync cycle execution:', error);
            }finally{
                isRunning = false;
            }
        });
        logger.info('Water Collector Scheduler started successfully.');
    },

    stop (){
        if(task){
            task.stop();
            logger.info('Water Collector Scheduler stopped.');
        }
    }
}

module.exports = waterScheduler;