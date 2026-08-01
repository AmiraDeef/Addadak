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



const billEnvoice =(userMeters,tiers)=>{
  //##TO handle the emptyArrays
  if(!userMeters || userMeters.length === 0) return null;

  const latestUserMeter=userMeters[0];
  let userMeter=0
  let userTier=1;
  let userRate=0;
  //#2nd adjustment handled the case if the customer have a new meter and there is only one reading.
  if(userMeters.length == 1)
  {
    userMeter = latestUserMeter.reading ; 
  }else{
    userMeter=latestUserMeter.reading-userMeters[1].reading;
  }
 //how to handle negative values which can be caused by mistake?
  for (let i = 0; i < tiers.length; i++) {
    if (userMeter >= tiers[i].min && userMeter <= tiers[i].max) {
        userTier = tiers[i].tier;
        userRate=tiers[i].rate;
        break;
      }
  }

  const envoice ={
    tier:userTier,
    rate:userRate,
    consumptionInMonth: userMeter,
    utility:latestUserMeter.utility//Do we need to add utility type here? so it can be printed with the invoice 
  }
  return envoice;
}


const billHistoryConsumption=(userMeters)=>{ //Checked no adjustments are needed for this function. 
  const consumptions=[];
  for (let i = 0; i < userMeters.length; i++) {
      let currentConsumption = 0;
      if (userMeters[i + 1]) {
        currentConsumption = userMeters[i].reading - userMeters[i + 1].reading;
        } else {       
        currentConsumption = userMeters[i].reading-0;
        if(currentConsumption<0){
          currentConsumption=Math.abs(currentConsumption)
          }
        }
      consumptions.push({
        month: userMeters[i].billingMonth,
        consumption: currentConsumption
        });
  }
  return consumptions;
}

const viewAllTiers = ()=>{
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
  billEnvoice,
  billHistoryConsumption,
  viewAllTiers,
  getAllMeters,
  deleteUserMeters
}


/*
1̶-̶t̶r̶a̶n̶s̶f̶e̶r̶ t̶h̶e̶ r̶e̶m̶a̶i̶n̶i̶n̶g̶ f̶u̶n̶c̶t̶i̶o̶n̶s̶ e̶x̶c̶l̶u̶d̶e̶(̶a̶d̶d̶m̶e̶t̶e̶r̶-̶g̶e̶t̶T̶i̶e̶r̶-̶u̶s̶e̶r̶C̶o̶n̶s̶u̶m̶p̶t̶i̶o̶n̶s̶)̶
2-make user consumptions smart and card
3-get all tiers
4-delete meter
5- make utilities controllers 
6-make the end points

*/