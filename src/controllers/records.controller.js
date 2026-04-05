import { validationResult } from "express-validator";
import * as recordServices from "../services/records.service.js";

export const createRecord=async(req,res,next)=>{
    try{
        const errors=validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({
                success: false,
                errors: errors.array().map((e) => e.msg),
            });
        }
        const record=await recordServices.createRecord(req.user.id,req.body);

         res.status(201).json({
            success: true,
            message: "Record created successfully",
            data: record,
        });
    }catch(err){
        next(err);
    }
};

export const getRecords=async(req,res,next)=>{
    try{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array().map((e) => e.msg),
            });
        }

        const result=await recordServices.getRecord(req.query);

        res.status(200).json({
            success: true,
            data: result.records,
            pagination: result.pagination,
        });
    }catch(err){
        next(err);
    }
};

export const getRecordById = async (req, res, next) => {
  try {
    const record = await recordServices.getRecordById(req.params.id);

    res.status(200).json({
      success: true,
      data: record,
    });
  } catch (err) {
    next(err);
  }
};


export const updateRecord = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array().map((e) => e.msg),
      });
    }

    const record = await recordServices.updateRecord(req.params.id,req.body);

    res.status(200).json({
      success: true,
      message: "Record updated successfully",
      data: record,
    });
  } catch (err) {
    next(err);
  }
};


export const deleteRecord = async (req, res, next) => {
  try {
    const result = await recordServices.deleteRecord(req.params.id);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (err) {
    next(err);
  }
};