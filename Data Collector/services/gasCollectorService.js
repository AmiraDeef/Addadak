const gasProvider = require('../providers/gasProvider.js');
const gasValidator = require('../validators/gasValidator.js');
const gasTransformer = require('../transformers/gasTransformer.js');
const ReadingRepository = require('../repositories/readingRepository.js');
const {logger} = require('../utils/logger.js');

const gasCollectorService = {
    
  async syncReadings() {
    try {
      logger.info('Starting gas readings synchronization cycle...');

      // 1. Fetch Data: Get raw readings from provider
      const rawReadings = await gasProvider.getLatestReadings();
      
      if (!rawReadings || !Array.isArray(rawReadings)) {
        logger.warn('Sync aborted: Provided data is empty or not an array');
        return;
      }

      let processedCount = 0;
      let skippedCount = 0;

      // Process readings one by one
      for (const rawReading of rawReadings) {
        // 2. Validate: Check raw data integrity
        if (!gasValidator.validate(rawReading)) {
          skippedCount++;
          continue; 
        }

        // 3. Transform: Normalize data structure to internal schema
        const transformedData = gasTransformer.transform(rawReading);

        // 4. Duplicate Check: Prevent duplicate entries
        const isDuplicate = await ReadingRepository.exists(
          transformedData.meterNumber, 
          transformedData.readingDate
        );

        if (isDuplicate) {
          logger.debug(`Skipped: Duplicate reading found for meter ${transformedData.meterNumber} at this timestamp ${transformedData.readingDate}`);
          skippedCount++;
          continue;
        }

        await ReadingRepository.save(transformedData);
        processedCount++;
      }

      // 5. Write Logs: Summary of the current cycle
      logger.info(`Sync cycle completed successfully. Saved: ${processedCount}, Skipped: ${skippedCount}`);

    } catch (error) {
      // Critical Catch: Log the error and prevent the background service from crashing
      logger.error('Critical error during gas sync cycle:', error);
      throw error; 
    }
  }
};

module.exports = gasCollectorService;