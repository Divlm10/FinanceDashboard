import express from "express";

import authenticate from "../middleware/auth.js";
import roleGuard from "../middleware/roleGuard.js";

import{
    createRecord,
    getRecords,
    getRecordById,
    updateRecord,
    deleteRecord,
} from "../controllers/records.controller.js";

import { createRecordValidator,updateRecordValidator,filterValidator } from "../validators/records.validator.js";

const router=express.Router();

//All routes require authentication
router.use(authenticate);

//viewer,analyst,admin=>view records
router.get("/",filterValidator,roleGuard("viewer","analyst","admin"),getRecords);
router.get("/:id",roleGuard("viewer", "analyst", "admin"),getRecordById);

//admin only CRUD
router.post("/",createRecordValidator,roleGuard("admin"),createRecord);
router.put("/:id",updateRecordValidator,roleGuard("admin"),updateRecord);
router.delete("/:id",roleGuard("admin"),deleteRecord);

export default router;
