import pool from "../config/db.js";

export const createRecord=async (userId, {amount,type,category,date,notes})=>{
    const result=await pool.query(
        `INSERT INTO financial_records (user_id,amount,type,category,date,notes)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *`,
        [userId,amount,type,category,date,notes]
    );

    return result.rows[0];
};

export const getRecord=async ({type,category,start_date,end_date,page=1,limit=10})=>{
    //build query dynamically
    const conditions=["is_deleted=false"];//always applied
    const values=[];
    let i=1;//track $

    if(type){
        conditions.push(`type = $${i++}`);
        values.push(type);
    }
    if(category){
        conditions.push(`category ILIKE $${i++}`);
        values.push(`%${category}%`);
    }
    if (start_date) {
        conditions.push(`date >= $${i++}`);
        values.push(start_date);
    }
    if (end_date) {
        conditions.push(`date <= $${i++}`);
        values.push(end_date);
    }

    const whereClause = conditions.join(" AND ");

    //PAGINATION
    const offset=(page-1)*limit;
    values.push(limit,offset);

    const dataQuery = `
        SELECT * FROM financial_records
        WHERE ${whereClause}
        ORDER BY date DESC
        LIMIT $${i++} OFFSET $${i++}
    `;

    // Count query for total pages
    const countQuery = `
        SELECT COUNT(*) FROM financial_records
        WHERE ${whereClause}
    `;

    const [dataResult, countResult] = await Promise.all([
        pool.query(dataQuery, values),
        pool.query(countQuery, values.slice(0, -2)), // exclude limit/offset for count
    ]);

    const total = parseInt(countResult.rows[0].count);

    return {
        records: dataResult.rows,
        pagination: {
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            total_pages: Math.ceil(total / limit),
        },
    };
};

export const getRecordById= async(id)=>{
    const result=await pool.query(
        "SELECT * FROM financial_records WHERE id=$1 AND is_deleted=false",
        [id]
    );
    if(result.rows.length===0){
        const error = new Error("Record not found");
        error.status = 404;
        throw error;
    }
    return result.rows[0]
};

export const updateRecord=async(id,fields)=>{
    const allowed = ["amount", "type", "category", "date", "notes"];
    const updates = [];
    const values = [];
    let i = 1;

    for(const key of allowed){
        if(fields[key]!==undefined){//valid exists
            updates.push(`${key} = $${i++}`);
            values.push(fields[key]);
        }
    }
    if(updates.length === 0) {
        const error = new Error("No valid fields provided to update");
        error.status = 400;
        throw error;
    }

    updates.push(`updated_at = NOW()`);//update
    values.push(id);

    const result = await pool.query(
        `UPDATE financial_records
        SET ${updates.join(", ")}
        WHERE id = $${i} AND is_deleted = false
        RETURNING *`,
        values
    );

    if (result.rows.length === 0) {
        const error = new Error("Record not found");
        error.status = 404;
        throw error;
    }

    return result.rows[0];
};

export const deleteRecord=async(id)=>{
    //SOFT delete->is_delete=true
    const result=await pool.query(
        `UPDATE financial_records
        SET is_deleted = true, updated_at = NOW()
        WHERE id = $1 AND is_deleted = false
        RETURNING id`,
        [id]
    );

    if (result.rows.length === 0) {
        const error = new Error("Record not found");
        error.status = 404;
        throw error;
    }
    return { message: "Record deleted successfully" };
}