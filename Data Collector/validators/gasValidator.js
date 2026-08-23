const {logger} = require('../utils/logger');

//what we will do in case we didn't get or got a wrong reading 
//why didn't we use joi for exmaple --> because we want to use the logger and to make the app lighter with out any un necessary liberaries
const gasValidator = {
    validate: function (rawReading) {
        if (!rawReading) return false;

        const { nationalID, meterNumber, meterType, address , reading, readingDate } = rawReading;

        if (!nationalID || typeof nationalID !== 'string' || nationalID.trim() === '') {
            logger.warn('Failed to fetch reading: The nationalID number is missing or isn\'t correct ');
            return false;
        }


        if (!meterNumber || typeof meterNumber !== 'string' || meterNumber.trim() === '') {
            logger.warn('Failed to fetch reading: The meter number is missing or isn\'t correct ');
            return false;
        }

         if (!meterType || typeof meterType !== 'string' || meterType.trim() === '') {
            logger.warn('Failed to fetch reading: The meterType is missing or isn\'t correct ');
            return false;
        }

         if (!address || typeof address !== 'string' || address.trim() === '') {
            logger.warn('Failed to fetch reading: The address is missing or isn\'t correct ');
            return false;
        }


        if (reading === undefined || reading === null || typeof reading !== 'number' || reading < 0) {
            logger.warn(`The reading of the meter number ${meterNumber} isn't correct, failed to verify`);
            return false;
        }

        
        if (!readingDate || isNaN(Date.parse(readingDate))) {
            logger.warn(`The date isn't correct for the meter number ${meterNumber}`);
            return false;
        }
        return true;
    }
}

module.exports = gasValidator;