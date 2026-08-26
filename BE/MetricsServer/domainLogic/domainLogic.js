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

//I need this function and the calcilateTier function to use them in the generateInvoice function
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

//Generate inovice function is a global function which used to create the invoces for any type of meters 
// you need to send the correct consumptionRecord paramter haa !!!
const generateInvoice = (consumptionRecord, utility) => {
  if (!consumptionRecord) return null;

  const tiers = getTiersByUtility(utility);

  const consumption = consumptionRecord.consumption ?? consumptionRecord.consumptionSoFar ?? 0;

  const { tier, rate } = calculateTier(consumption, tiers);

  return {
    utility: utility,
    message: "tier is",
    tier: tier,
    rate: rate,
    month: consumptionRecord.month,//month
    consumptionInMonth: consumption,//kw
    totalBillAmount: Number((consumption * rate).toFixed(2)) //money
};
}

const getMonthlyHistoryConsumption = async (meterNumber, utility) => {
  return await metricsSchema.aggregate([
    { $match: { meterNumber: meterNumber, utility: utility } },
    { $sort: { readingDate: -1 } },
    {
      $group: {
        _id: "$billingMonth",
        latestReadingDate: { $first: "$readingDate" },
        latestReading: { $first: "$reading" }
      }
    },
    { $sort: { latestReadingDate: -1 } },
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


//it calculates the consumption at a point or day in the month
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


// const viewAllTiers = ()=>{ // move this function 
//   return {
//     electricTiers:electricTiers,
//     gasTiers:gasTiers,
//     waterTiers:waterTiers
//   }
// }


//This function will be applied on the 3 types, so we need to add the utility type in concedirations
const getAllMeters = async (ID, utility) => {
  return await metricsSchema.aggregate([
    {
      $match: { nationalID: ID, utility: utility }
    },
    {
      $group: {
        _id: {
          meterType: "$meterType",
          meterNumber: "$meterNumber",
          address: "$address",
          utility: "$utility"
        }
      }
    },
    {
      $project: {
        _id: 0,
        meterType: "$_id.meterType",
        meterNumber: "$_id.meterNumber",
        address: "$_id.address",
        utility: "$_id.utility"
      }
    }
  ]);
};

//why did we exclude the getTier function ?

const deleteUserMeters = async(ID,utility)=>{
  //Note the function returns this object: {acknowledged: true, deletedCount: 0}
  // in case no item matched the condition, you need to handle this case in the controller.
  return await metricsSchema.deleteMany({nationalID:ID,utility:utility})
}

//addmeter were made for testing purposes no need to apply it...

module.exports ={
  electricTiers,
  gasTiers,
  waterTiers,
  calculateTier,
  generateInvoice,
  getMonthlyHistoryConsumption,
  getAllMeters,
  deleteUserMeters,
  currentMonthSmartConsumption,
}


/*
#1 Old route: metricsRouter.get("/getTier/:ID/:meterNo",authz,metricsController.getTier);
 new route: metricsRouter.get("/getTier/:ID/:meterNo",getInvoice) Note: we need to change the name getTier to get invoice
 the excepected output of this end point:
 {
    "utility": "Electricity",
    "message": "tier is",
    "tier": 6,
    "rate": 2.1,
    "month": "2026-07",
    "consumptionInMonth": 890,
    "totalBillAmount": 1869
}

#2 Old Route: metricsRouter.get("/viewAllTiers",metricsController.viewAllTiers);
   new route: metricsRouter.get("/viewAllTiers",viewAllTiers);
   the excepected output:
   {
    "Tiers": [
        {
            "tier": 1,
            "min": 0,
            "max": 50,
            "rate": 0.68
        },
        {
            "tier": 2,
            "min": 51,
            "max": 100,
            "rate": 0.78
        },
       teir 3, teir 4 , etc....
}

#3 Old Route: metricsRouter.get("/viewAllMeters/:ID",authz,metricsController.getAllMeters);
   new route: metricsRouter.get("/viewAllMeters/:ID",getAllElectricityMeters);
   the expected output:
   [
  {
    "meterType": "Smart Meter",
    "meterNumber": "ELEC-102030",
    "address": "Cairo, Egypt",
    "utility": "Electricity"
  },
  {
    "meterType": "Prepaid Card",
    "meterNumber": "ELEC-405060",
    "address": "Giza, Egypt",
    "utility": "Electricity"
  }
]

#4 old Route: metricsRouter.get("/getUserConsumptions/:meterNo",authz,metricsController.userConsumptions);
  new route: metricsRouter.get("/getUserConsumptions/:meterNo",getElectricityMonthlyHistoryConsumption);
   the expected output:
    [
    {
        "month": "2026-07",
        "consumption": 890
    },
    {
        "month": "2026-08",
        "consumption": 1300
    }
]


*/