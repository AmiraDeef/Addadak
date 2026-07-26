/* we will assume that we git from the company limited data so we will complete the
data and transform it to our schema using the transformer. */


const ElectricityTransformer = {
  transform(rawReading) {
    const readingDate = new Date(rawReading.readingDate);
    
    
    const year = readingDate.getFullYear();
    const month = String(readingDate.getMonth() + 1).padStart(2, '0');
    const billingMonth = `${year}-${month}`;

    return {
      nationalID: rawReading.nationalID,      
      utility: 'Electricity',                 
      meterNumber: rawReading.meterNumber,      
      meterType: rawReading.meterType || 'Smart Card', 
      address: rawReading.address || 'Unknown Address',
      billingMonth: billingMonth,              
      reading: rawReading.reading,       
      readingDate: readingDate,             
    };
  }
};

module.exports = ElectricityTransformer;