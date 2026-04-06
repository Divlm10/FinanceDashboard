import * as usersService from "../services/users.service.js";
import { validationResult } from "express-validator";

export const getAllUsers=async(req,res,next)=>{
    try{
        const result=await usersService.getAllUsers(req.query);
        res.status(200).json({
            success:true,
            data: result.users,
            pagination: result.pagination,
        });
    }catch(err){
        next(err);
    }
};

export const getUserById=async(req,res,next)=>{
    try{
        const result=await usersService.getUserById(req.params.id);
        res.status(200).json({
        success: true,
        data: result,
        });
    }catch (err) {
        next(err);
    }
};

export const updateUserRole=async(req,res,next)=>{
    try{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array().map((e) => e.msg),
            });
        }
        const user=await usersService.updateUserRole(
            req.params.id, //id to be updated
            req.body.role,
            req.user.id //requesters id from token
        );

         res.status(200).json({
            success: true,
            message: "User role updated successfully",
            data: user,
        });
    }catch(err){
        next(err);
    }
};

export const updateUserStatus=async(req,res,next)=>{
    try{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array().map((e) => e.msg),
            });
        }

        const user=usersService.updateUserStatus(
            req.params.id,
            req.body.is_active,
            req.user.id
        );

         res.status(200).json({
            success: true,
            message: `User ${req.body.is_active ? "activated" : "deactivated"} successfully`,
            data: user,
        });
    }catch(err){
        next(err);
    }
};

