const userController=require("../controllers/userController.js");
const {validateRegister,validateLogging}=require("../validations/userValidation.js");
const authZmiddleware=require("../middlewres/authzMiddleware.js");
const express=require("express");
const userRouter=express.Router();


//register
userRouter.post('/user/register',validateRegister,userController.createUser);
//login
userRouter.post('/user/login',validateLogging,userController.logUser);
//get
userRouter.get('/logged/user/:_id',authZmiddleware,userController.getUserById);
//get all
userRouter.get('/user/all',userController.getAllUsers);
//delete
userRouter.delete('/logged/user/delete/:_id',authZmiddleware,userController.deleteUser);
//update
userRouter.put('/logged/user/update/:_id',authZmiddleware,userController.userUpdate);

//cookie checker
userRouter.get('/logged/user', authZmiddleware, (req, res) => {
    if (req.user) {
        return res.status(200).json({ loggedIn: true, userId: req.user });
    }
    return res.status(401).json({ loggedIn: false, message: "Not authorized" });
});

module.exports=userRouter;