//#Note any adjustment will be Marked with #, ctrl+f (#) you will find all the adjustments.
//notes for me this is the logic + reposotry
//no try and catch needed because the try and catch will implemented in the controller.
//no falied responses handling is require because it will be handeled in the controller
//all what you need is the implement the functions which handle the logic..
const metricsSchema = require("../model/metricsModel");

const electricTiers=[
    {tier:1 ,min:0, max:50, rate:0.68},
    {tier:2 , min: 51, max: 100, rate: 0.78 },
    {tier:3 , min: 101, max: 200, rate: 0.95},
    {tier:4 , min: 201, max: 350, rate: 1.55 },
    {tier:5 , min: 351, max: 650, rate: 1.95 },
    {tier:6 , min: 651, max: 1000, rate: 2.10 },
    {tier:7 , min: 1001, max: Infinity, rate: 2.58 }

];

const gasTiers = [
  { tier: 1, min: 0, max: 30, rate: 3.00 },
  { tier: 2, min: 31, max: 60, rate: 4.00 },
  { tier: 3, min: 61, max: Infinity, rate: 5.00 }
];



const waterTiers = [
  { tier: 1, min: 0, max: 10, rate: 0.65 },
  { tier: 2, min: 11, max: 20, rate: 1.60 },
  { tier: 3, min: 21, max: 30, rate: 2.25 },
  { tier: 4, min: 31, max: 40, rate: 2.75 },
  { tier: 5, min: 41, max: Infinity, rate: 3.15 }
];


const getTiersByUtility = (utility) => {
  switch (utility) {
    case "Electricity": return electricTiers;
    case "Gas": return gasTiers;
    case "Water": return waterTiers;
    default: return [];
  }
};

const calculateTier = (consumption, tiers) => {
  const safeConsumption = Math.abs(consumption || 0);
  for (let i = 0; i < tiers.length; i++) {
    if (safeConsumption >= tiers[i].min && safeConsumption <= tiers[i].max) {
      return { tier: tiers[i].tier, rate: tiers[i].rate };
    }
  }
  return { tier: 1, rate: 0 };
};

const generateInvoice = (consumptionRecord, utility) => {
  if (!consumptionRecord) return null;

  const tiers = getTiersByUtility(utility);

  const consumption = consumptionRecord.consumption ?? consumptionRecord.consumptionSoFar ?? 0;

  const { tier, rate } = calculateTier(consumption, tiers);

  return {
    utility: utility,
    month: consumptionRecord.month,
    consumptionInMonth: consumption,
    tier: tier,
    rate: rate,
    totalBillAmount: Number((consumption * rate).toFixed(2)) 
};
}

const billHistoryConsumption = async (meterNumber, utility) => {
  return await metricsSchema.aggregate([

    { 
      $match: { 
        meterNumber: meterNumber, 
        utility: utility 
      } 
    },
    { 
      $sort: { readingDate: -1 } 
    },
    {
      $group: {
        _id: "$billingMonth",
        latestReadingDate: { $first: "$readingDate" },
        latestReading: { $first: "$reading" }
      }
    },

    { 
      $sort: { latestReadingDate: -1 } 
    },
    
    {
      $setWindowFields: {
        sortBy: { latestReadingDate: -1 },
        output: {
          previousMonthReading: {
            $shift: {
              output: "$latestReading",
              by: 1 
            }
          }
        }
      }
    },
    {
      $project: {
        _id: 0,
        month: "$_id",
        consumption: {
          $cond: {
            if: { $ne: ["$previousMonthReading", null] },
            then: { $abs: { $subtract: ["$latestReading", "$previousMonthReading"] } },
            else: { $abs: "$latestReading" } 
          }
        }
      }
    }
  ]);
};

//check this function again you need to mermorize it greate logic...
const smartMonthlyHistoryConsumption= async (meterNumber ,utility) => {
  return await metricsSchema.aggregate([
    { $match: { meterNumber: meterNumber,utility:utility} },
    { $sort: { readingDate: -1 } },
    // Group hourly/daily readings to take only the latest reading per billing month
    {
      $group: {
        _id: "$billingMonth",
        latestReadingDate: { $first: "$readingDate" },
        latestReading: { $first: "$reading" }
      }
    },
    { $sort: { latestReadingDate: -1 } },
    // Window Operator to shift and calculate delta between months
    {
      $setWindowFields: {
        sortBy: { latestReadingDate: -1 },
        output: {
          previousMonthReading: {
            $shift: {
              output: "$latestReading",
              by: 1
            }
          }
        }
      }
    },
    {
      $project: {
        _id: 0,
        month: "$_id",
        consumption: {
          $cond: {
            if: { $ne: ["$previousMonthReading", null] },
            then: { $abs: { $subtract: ["$latestReading", "$previousMonthReading"] } },
            else: "$latestReading"
          }
        }
      }
    }
  ]);
};
const currentMonthSmartConsumption = async (meterNumber,currentMonth,utility)=>{
  return await metricsSchema.aggregate([
    { $match: { meterNumber: meterNumber, billingMonth: currentMonth , utility: utility } },
    { $sort: { readingDate: -1 } },
    {
      $group: {
        _id: "$billingMonth",
        latestReading: { $first: "$reading" },
        firstReading: { $last: "$reading" },
        latestDate: { $first: "$readingDate" }
      }
    },
    {
      $project: {
        _id: 0,
        month: "$_id",
        latestReadingDate: "$latestDate",
        consumptionSoFar: { $abs: { $subtract: ["$latestReading", "$firstReading"] } }
      }
    }
  ]);
}

const prepaidMonthlyHistoryConsumption= async (meterNumber , utility) => {
  return await metricsSchema.aggregate([
    
    { $match: { meterNumber: meterNumber,utility:utility } },
    
   
    { $sort: { readingDate: -1 } },
    
    {
      $group: {
        _id: "$billingMonth",
        latestReadingDate: { $first: "$readingDate" },
        latestReadingFromCard: { $first: "$reading" }
      }
    },
    
    { $sort: { latestReadingDate: -1 } },
    

    {
      $setWindowFields: {
        sortBy: { latestReadingDate: -1 },
        output: {
          previousMonthReading: {
            $shift: {
              output: "$latestReadingFromCard",
              by: 1
            }
          }
        }
      }
    },
    
  
    {
      $project: {
        _id: 0,
        month: "$_id",
        consumption: {
          $cond: {
            if: { $ne: ["$previousMonthReading", null] },
            then: { $abs: { $subtract: ["$latestReadingFromCard", "$previousMonthReading"] } },
            else: "$latestReadingFromCard" 
          }
        }
      }
    }
  ]);
};

const viewAllTiers = ()=>{ // move this function 
  return {
    electricTiers:electricTiers,
    gasTiers:gasTiers,
    waterTiers:waterTiers
  }
}


//This function will be applied on the 3 types, so we need to add the utility type in concedirations
const getAllMeters = async(ID,utility)=>{ //#1st adjustment
  //note we added utility here to handle the meter type.
    return await metricsSchema.aggregate([
      {
        $match:{nationalID:ID ,utility:utility}
      },
      {
        $group:{
          _id:{
            meterType:"$meterType",
            meterNumber:"$meterNumber",
            address:"$address",
            utility:"$utility"
          }
        }
      }
    ])
}

//why did we exclude the getTier function ?

const deleteUserMeters = async(ID,utility)=>{
  //Note the function returns this object: {acknowledged: true, deletedCount: 0}
  // in case no item matched the condition, you need to handle this case in the controller.
  return await metricsSchema.deleteMany({nationalID:ID,utility:utility})
}

//addmeter were made for testing purposes no need to apply it...

module.exports ={
  calculateTier,
  generateInvoice,
  billHistoryConsumption,
  viewAllTiers,
  getAllMeters,
  deleteUserMeters,
  currentMonthSmartConsumption,
  smartMonthlyHistoryConsumption,
  prepaidMonthlyHistoryConsumption
}


/*
1̶-̶t̶r̶a̶n̶s̶f̶e̶r̶ t̶h̶e̶ r̶e̶m̶a̶i̶n̶i̶n̶g̶ f̶u̶n̶c̶t̶i̶o̶n̶s̶ e̶x̶c̶l̶u̶d̶e̶(̶a̶d̶d̶m̶e̶t̶e̶r̶-̶g̶e̶t̶T̶i̶e̶r̶-̶u̶s̶e̶r̶C̶o̶n̶s̶u̶m̶p̶t̶i̶o̶n̶s̶)̶
2̶-̶m̶a̶k̶e̶ u̶s̶e̶r̶ c̶o̶n̶s̶u̶m̶p̶t̶i̶o̶n̶s̶ s̶m̶a̶r̶t̶ a̶n̶d̶ p̶r̶e̶p̶a̶i̶d̶ c̶a̶r̶d̶
3̶-̶g̶e̶t̶ a̶l̶l̶ t̶i̶e̶r̶s̶
4̶-̶d̶e̶l̶e̶t̶e̶ m̶e̶t̶e̶r̶
5- make utilities controllers 
6-make the end points

*/