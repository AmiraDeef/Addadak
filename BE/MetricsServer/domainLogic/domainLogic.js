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



const billEnvoice =(userMeters,tiers )=>{
  const latestUserMeter=userMeters[0];
  let userMeter=0
  let userTier=1;
  let userRate=0;
  userMeter=latestUserMeter.reading-userMeters[1].reading;

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
    consumptionInMonth: userMeter 
  }
  return envoice;
}


const billHistoryConsumption=(userMeters,)=>{
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