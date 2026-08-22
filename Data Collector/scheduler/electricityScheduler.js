const cron  = require('node-cron');
const config = require('../config/index');
const {logger} = require('../utils/logger');
const ElectricityCollectorService = require('../services/electricityCollectorService');


let isRunning = false;
let task = null;

const ElectricityScheduler = {
    start (){
        const cronExpression = config.scheduler.cronExpression;

        logger.info(`Initializing Electricity Collector Scheduler with pattern: "${cronExpression}"`);

        task = cron.schedule(cronExpression, async ()=>{
            if(isRunning){
                logger.warn('Scheduler skipped execution: Previous sync cycle is still in progress.');
                return;
            }

            isRunning = true;

            try{
                logger.info('Scheduler triggered: Executing automated electricity sync cycle...');
                await ElectricityCollectorService.syncReadings();

            }catch(error){
                logger.error('Scheduler encountered an error during sync cycle execution:', error);
            }finally{
                isRunning = false;
            }
        });
        logger.info('Electricity Collector Scheduler started successfully.');
    },

    stop (){
        if(task){
            task.stop();
            logger.info('Electricity Collector Scheduler stopped.');
        }
    }
}

module.exports = ElectricityScheduler;