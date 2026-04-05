import pool from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerUser = async({name,email,password,role})=>{
    const existing=await pool.query(
        "SELECT id FROM users WHERE email=$1",
        [email]
    );
    if(existing.rows.length >0){
        //unique email exists
        const error=new Error("Email already exists");
        error.status=409;
        throw error;
    }

    //hash password
    const password_hash=await bcrypt.hash(password,10);
    
    const result=await pool.query(
        `INSERT INTO users (name,email,password_hash,role)
        VALUES ($1,$2,$3,$4)
        RETURNING id,name,email,role,is_active,created_at`,
        [name,email,password_hash,role || "viewer"]
    );

    return result.rows[0];
};

export const logininUser=async({email,password})=>{
    //find user
    const result=await pool.query(
         "SELECT * FROM users WHERE email = $1",
        [email]
    );

    const user=result.rows[0];

    if(!user){
        const error = new Error("Invalid email or password");
        error.status = 401;
        throw error;
    }
    //check active or not
    if(!user.is_active){
        const error = new Error("Your account has been deactivated");
        error.status=403;
        throw error;
    }
    //verify password
    const isMatch=await bcrypt.compare(password,user.password_hash)
    if(!isMatch){
        const error= new Error("Invalid email or password");
        error.status=401;
        throw error;
    }
    //generate JWT(id,role)
    const token=jwt.sign(
        {id: user.id, role: user.role},
        process.env.JWT_SECRET,
        {expiresIn: process.env.JWT_EXPIRES_IN}
    );

    return{
        token,
        user:{
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
    };
};
