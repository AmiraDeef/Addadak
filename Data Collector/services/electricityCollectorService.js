const ElectricityProvider = require('../providers/electricityProvider.js');
const ElectricityValidator = require('../validators/electricityValidator.js');
const ElectricityTransformer = require('../transformers/electricityTransformer.js');
const ReadingRepository = require('../repositories/readingRepository.js');
const {logger} = require('../utils/logger.js');

const ElectricityCollectorService = {
    
  async syncReadings() {
    try {
      logger.info('Starting electricity readings synchronization cycle...');

      // 1. Fetch Data: Get raw readings from provider
      const rawReadings = await ElectricityProvider.getLatestReadings();
      
      if (!rawReadings || !Array.isArray(rawReadings)) {
        logger.warn('Sync aborted: Provided data is empty or not an array');
        return;
      }

      let processedCount = 0;
      let skippedCount = 0;

      // Process readings one by one
      for (const rawReading of rawReadings) {
        // 2. Validate: Check raw data integrity
        if (!ElectricityValidator.validate(rawReading)) {
          skippedCount++;
          continue; 
        }

        // 3. Transform: Normalize data structure to internal schema
        const transformedData = ElectricityTransformer.transform(rawReading);

        // 4. Duplicate Check: Prevent duplicate entries
        const isDuplicate = await ReadingRepository.exists(
          transformedData.meterNumber, 
          transformedData.readingDate
        );

        if (isDuplicate) {
          logger.debug(`Skipped: Duplicate reading found for meter ${transformedData.meterNumber} at this timestamp`);
          skippedCount++;
          continue;
        }

        //cehck if we need to add this field 
        // 5. Load Previous Reading: Fetch the latest stored reading for this meter
        // const previousReading = await ReadingRepository.findLatest(transformedData.meterNumber);

        // // 6. Calculate Consumption Delta
        // if (previousReading) {
        //   // Delta = New Value - Previous Value
        //   transformedData.consumptionDelta = transformedData.reading - previousReading.reading;
          
        //   // Safeguard: Handle meter resets or anomalies
        //   if (transformedData.consumptionDelta < 0) {
        //     logger.warn(`Negative consumption detected for meter ${transformedData.meterNumber}. Resetting delta to 0`);
        //     transformedData.consumptionDelta = 0;
        //   }
        // } else {
        //   // First time this meter is registered in the system
        //   transformedData.consumptionDelta = 0;
        //   logger.info(`New meter discovered in the system: ${transformedData.meterNumber}`);
        // }

        // 7. Save Reading: Store processed record in MongoDB
        await ReadingRepository.save(transformedData);
        processedCount++;
      }

      // 8. Write Logs: Summary of the current cycle
      logger.info(`Sync cycle completed successfully. Saved: ${processedCount}, Skipped: ${skippedCount}`);

    } catch (error) {
      // Critical Catch: Log the error and prevent the background service from crashing
      logger.error('Critical error during electricity sync cycle:', error);
      throw error; 
    }
  }
};

module.exports = ElectricityCollectorService;