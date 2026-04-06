import * as dashboardService from "../services/dashboard.service.js";

export const getSummary=async(req,res,next)=>{
    try{
        const summary=await dashboardService.getSummary();
        res.status(200).json({
            success:true,
            data:summary
        });
    }catch(err){
        next(err);
    }
};

export const getCategoryTotals=async(req,res,next)=>{
    try{
        const categories=await dashboardService.getCategoryTotals();
        res.status(200).json({
        success: true,
        data: categories,
        });
    }catch(err){
        next(err);
    }
};

export const getMonthlyTrends=async(req,res,next)=>{
    try{
        const trends=await dashboardService.getMonthlyTrends();
         res.status(200).json({
            success: true,
            data: trends,
        });
    }catch(err){
        next(err);
    }
};

export const getWeeklyTrends=async(req,res,next)=>{
    try{
        const trends=await dashboardService.getWeeklyTrends();
         res.status(200).json({
            success: true,
            data: trends,
        });
    }catch(err){
        next(err);
    }
};

export const getRecentAcitivity=async(req,res,next)=>{
    try{
        const limit=parseInt(req.query.limit) || 5;//default to 5
        const activity=await dashboardService.getRecentAcitivity(limit);
        res.status(200).json({
            success: true,
            data: activity,
        });
    }catch(err){
        next(err);
    }
};

