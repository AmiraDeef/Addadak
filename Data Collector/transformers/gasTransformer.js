const gasTransformer = {
  transform(rawReading) {
    const readingDate = new Date(rawReading.readingDate);
    
    
    const year = readingDate.getFullYear();
    const month = String(readingDate.getMonth() + 1).padStart(2, '0');
    const billingMonth = `${year}-${month}`;

    return {
      nationalID: rawReading.nationalID,      
      utility: 'Gas',                 
      meterNumber: rawReading.meterNumber,      
      meterType: rawReading.meterType || 'Smart Card', 
      address: rawReading.address || 'Unknown Address',
      billingMonth: billingMonth,              
      reading: rawReading.reading,       
      readingDate: readingDate,             
    };
  }
};

module.exports = gasTransformer;