const Metrics = require('../models/reading.model');

exports.saveReadings = async (readingData)=>{
    const reading = new Metrics(readingData);
    return await reading.save();
}


exports.findLatest = (meterId)=>{
    return await Metrics.findOne({ meterNumber })
      .sort({ readingTimestamp: -1 });
}

exports.exists = async (meterId,readingTimestamp)=>{
    const result = await Metrics.exists({ meterNumber, readingDate });
    return !!result;
}

exports.findByMeter = async (meterId)=>{
    return await Metrics.find({ meterNumber })
      .sort({ readingDate: 1 });
  } 
