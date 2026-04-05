import { validationResult } from "express-validator";
import * as authService from "../services/auth.service.js";

export const register=async(req,res,next)=>{
    try{
        const errors=validationResult(req);//check validation errors
        if(!errors.isEmpty()){
            return res.status(400).json({
                success: false,
                errors: errors.array().map((e) => e.msg),
            });
        }
        const user=await authService.registerUser(req.body);

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: user,
         });
    }catch(err){
        next(err);
    }
};

export const login=async(req,res,next)=>{
    try{
        const errors=validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({
                success:false,
                errors: errors.array().map((e) => e.msg),
            });
        }
        const result=await authService.logininUser(req.body);
        res.status(200).json({
            success:true,
            message:"Login successful",
            data: result,
        });
    }catch(err){
        next(err);
    }
};



