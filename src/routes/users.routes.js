import express from "express";

import authenticate from "../middleware/auth.js";
import roleGuard from "../middleware/roleGuard.js";

import { getAllUsers,getUserById,updateUserRole,updateUserStatus } from "../controllers/user.controller.js";
import { updateRoleValidator,updateStatusValidator,paginationValidator } from "../validators/users.validator.js";

const router=express.Router();
//all routes
router.use(authenticate);
router.use(roleGuard("admin"));//only admin approved

router.get("/",paginationValidator,getAllUsers);
router.get("/:id",getUserById);

router.patch("/:id/role",updateRoleValidator,updateUserRole);
router.patch("/:id/status",updateStatusValidator,updateUserStatus);

export default router;
