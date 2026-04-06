import { body, query } from "express-validator";

export const updateRoleValidator = [
  body("role")
    .notEmpty()
    .withMessage("Role is required")
    .isIn(["viewer", "analyst", "admin"])
    .withMessage("Role must be viewer, analyst, or admin"),
];

export const updateStatusValidator = [
  body("is_active")
    .notEmpty()
    .withMessage("is_active is required")
    .isBoolean()
    .withMessage("is_active must be true or false"),
];

export const paginationValidator = [
  query("page")
    .optional()
    .isInt({ gt: 0 })
    .withMessage("Page must be a positive integer"),

  query("limit")
    .optional()
    .isInt({ gt: 0 })
    .withMessage("Limit must be a positive integer"),
];