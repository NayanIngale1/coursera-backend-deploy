const express= require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user.model");
const {body, validationResult}=require("express-validator")
const router= express.Router();
router.patch("/:id",body("password").not().isEmpty().withMessage("PLease enter new password").bail().isLength({min:8,max:25}).bail().custom((value)=>{
    const regex= /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
    if(!value.match(regex)){
         throw new Error("Password must be strong");
    }
    
         return true;
}).bail(),async(req,res)=>{
     try {
          const errors=validationResult(req)
        if(!errors.isEmpty()){
            
            return res.status(400).json({error:errors.array()})
     
        }
        function hashed (){ 
          const hash= bcrypt.hashSync(req.body.password, 8);
          req.body.password=hash
          return true}
          hashed()
          console.log(req.body.password);

         const user= await User.findByIdAndUpdate(req.params.id, req.body,{new:true}).lean().exec();
        return res.status(400).send({message:"Password reset Successfull, Please login",user:user})
     } catch (error) {
         return res.status(400).send(error)
     }
})
module.exports=router