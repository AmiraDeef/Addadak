const electricTiers=[
    {tier:1 ,min:0, max:50, rate:0.68},
    {tier:2 , min: 51, max: 100, rate: 0.78 },
    {tier:3 , min: 101, max: 200, rate: 0.95},
    {tier:4 , min: 201, max: 350, rate: 1.55 },
    {tier:5 , min: 351, max: 650, rate: 1.95 },
    {tier:6 , min: 651, max: 1000, rate: 2.10 },
    {tier:7 , min: 1001, max: Infinity, rate: 2.58 }

];

const {
  calculateTier,
  generateInvoice,
  billHistoryConsumption,
  getAllMeters,
  deleteUserMeters,
  currentMonthSmartConsumption,
  smartMonthlyHistoryConsumption,
  prepaidMonthlyHistoryConsumption
} = require("../domainLogic/domainLogic");

const viewAllTiers = (req,res,next)=>{
    try {
         res.status(200).json({Tiers:electricTiers})
    } catch (error) {
        next(error);
    }
}

const getAllElectricityMeters = async(req,res,next)=>{
    try {
        const {ID,utility} = req.params;
        const userMeters = await getAllMeters(ID,utility);
        if(userMeters.length === 0){
         return  res.status(404).json({message:"User metrics are not found!"})
        }
        res.status(200).json({message :"All meters",
            meters:userMeters });
    } catch (error) {
        next(error);
    }
}

//const getTier = asyc(req,res,next)=>{
    try {

        calculateTier()
    } catch (error) {
        
    }
//}