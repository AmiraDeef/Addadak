const Metrics = require('../models/reading.model');

const ReadingRepository = {
  
  async save(readingData) {
    const reading = new Metrics(readingData);
    return await reading.save();
  },

  
  async findLatest(meterNumber) {
    return await Metrics.findOne({ meterNumber })
      .sort({ readingDate: -1 });
  },

  
  async exists(meterNumber, readingDate) {
    const result = await Metrics.exists({ meterNumber, readingDate });
    return !!result;
  },

  

  
  async findByMeter(meterNumber) {
    return await Metrics.find({ meterNumber })
      .sort({ readingDate: 1 });
  }
};

module.exports = ReadingRepository;