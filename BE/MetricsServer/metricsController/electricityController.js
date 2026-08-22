//check the function check if any additional functions needed...
const utility = 'Electricity';


const {
  electricTiers,
  calculateTier,
  generateInvoice,
  getAllMeters,
  deleteUserMeters,
  currentMonthSmartConsumption,
  getMonthlyHistoryConsumption,
 
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
        const {ID} = req.params;
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

const getInvoice = async(req,res,next)=>{
    try {
        const meterNumber = req.params.meterNo;
        const consumption= await getMonthlyHistoryConsumption(meterNumber,utility);
        if(!consumption || consumption.length === 0 ){
            return res.status(404).json({message:"User metrics are not found!"});
        }
        const invoice = generateInvoice(consumption[0],utility);
        if(!invoice) return res.status(500).json({Message:"unexcepected eror"});
        return res.status(200).json(invoice);

    } catch (error) {
        next(error);
    }
}
//check if we need it later...
const getElectricityMonthlyHistoryConsumption= async(req,res,next)=>{
    try {
        const meterNumber = req.params.meterNo;
        const consumption= await getMonthlyHistoryConsumption(meterNumber,utility);
        if(consumption.length === 0 ){
            return res.status(404).json({message:"User metrics are not found!"});
        }
        return res.status(200).json(consumption); 
    } catch (error) {
        next(error);
    }
}

//To get the real time consumption of the user for smart meter which will be within 12 hours as desgined
const getcurrentMonthSmartConsumption = async(req,res,next)=>{
    try {
        const meterNumber = req.params.meterNo;

        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const currentMonth = `${year}-${month}`;
        
        const currentConsumption = await currentMonthSmartConsumption(meterNumber,currentMonth,utility);
        if(!currentConsumption || currentConsumption.length === 0) return res.status(200).json({message:"The consumptions isn't available right now"});
        return res.status(200).json(currentConsumption);
    } catch (error) {
        next(error);
    }
}


module.exports = {
    viewAllTiers,
    getAllElectricityMeters,
    getInvoice,
    getElectricityMonthlyHistoryConsumption,
    getcurrentMonthSmartConsumption
}