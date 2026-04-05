import {body,query} from "express-validator";

export const createRecordValidator=[
    body("amount")
        .notEmpty()
        .withMessage("Amount is required")
        .isFloat({gt:0})
        .withMessage("Amount must be a positive number"),
    
    body("type")
        .notEmpty()
        .withMessage("Type is required")
        .isIn(["income", "expense"])
        .withMessage("Type must be income or expense"),

    body("category")
        .trim()
        .notEmpty()
        .withMessage("Category is required"),

    body("date")
        .notEmpty()
        .withMessage("Date is required")
        .isDate()
        .withMessage("Date must be a valid date (YYYY-MM-DD)"),

    body("notes")
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage("Notes cannot exceed 500 characters"),
];

export const updateRecordValidator = [
  body("amount")
    .optional()
    .isFloat({ gt: 0 })
    .withMessage("Amount must be a positive number"),

  body("type")
    .optional()
    .isIn(["income", "expense"])
    .withMessage("Type must be income or expense"),

  body("category")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Category cannot be empty"),

  body("date")
    .optional()
    .isDate()
    .withMessage("Date must be a valid date (YYYY-MM-DD)"),

  body("notes")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Notes cannot exceed 500 characters"),
];

export const filterValidator=[
    query("type")
        .optional()
        .isIn(["income", "expense"])
        .withMessage("Type must be income or expense"),

    query("category")
        .optional()
        .trim(),
    
    query("start_date")
        .optional()
        .isDate()
         .withMessage("start_date must be a valid date (YYYY-MM-DD)"),
    
    query("end_date")
        .optional()
        .isDate()
        .withMessage("end_date must be a valid date (YYYY-MM-DD)"),


    query("page")
        .optional()
        .isInt({ gt: 0 })
        .withMessage("Page must be a positive integer"),

    query("limit")
        .optional()
        .isInt({ gt: 0 })
        .withMessage("Limit must be a positive integer"),
];