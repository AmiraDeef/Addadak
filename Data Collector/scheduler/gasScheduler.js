const cron  = require('node-cron');
const config = require('../config/index');
const {logger} = require('../utils/logger');
const gasCollectorService = require('../services/gasCollectorService');


let isRunning = false;
let task = null;

const gasScheduler = {
    start (){
        const cronExpression = config.scheduler.cronExpression;

        logger.info(`Initializing Gas Collector Scheduler with pattern: "${cronExpression}"`);

        task = cron.schedule(cronExpression, async ()=>{
            if(isRunning){
                logger.warn('Scheduler skipped execution: Previous sync cycle is still in progress.');
                return;
            }

            isRunning = true;

            try{
                logger.info('Scheduler triggered: Executing automated Gas sync cycle...');
                await gasCollectorService.syncReadings();

            }catch(error){
                logger.error('Scheduler encountered an error during sync cycle execution:', error);
            }finally{
                isRunning = false;
            }
        });
        logger.info('Gas Collector Scheduler started successfully.');
    },

    stop (){
        if(task){
            task.stop();
            logger.info('Gas Collector Scheduler stopped.');
        }
    }
}

module.exports = gasScheduler;