import pool from "../config/db.js";

export const getSummary =async() =>{
  const result = await pool.query(`
    SELECT
      COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) AS total_income,
      COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) AS total_expenses,
      COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) -
      COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) AS net_balance,
      COUNT(*) AS total_records
    FROM financial_records
    WHERE is_deleted = false
  `);

  return result.rows[0];
};

export const getCategoryTotals =async()=>{
  const result = await pool.query(`
    SELECT
      category,
      type,
      COALESCE(SUM(amount), 0) AS total,
      COUNT(*) AS record_count
    FROM financial_records
    WHERE is_deleted = false
    GROUP BY category, type
    ORDER BY total DESC
  `);

  return result.rows;
};

export const getMonthlyTrends =async()=>{
  const result = await pool.query(`
    SELECT
      TO_CHAR(date, 'YYYY-MM') AS month,
      COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) AS income,
      COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) AS expenses,
      COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) -
      COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) AS net
    FROM financial_records
    WHERE is_deleted = false
    GROUP BY TO_CHAR(date, 'YYYY-MM')
    ORDER BY month DESC
    LIMIT 12
  `);

  return result.rows;
};

export const getWeeklyTrends=async()=>{
    const result=await pool.query(
        `SELECT 
             TO_CHAR(date, 'IYYY-IW') AS week,
            COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) AS income,
            COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) AS expenses,
            COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) -
            COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) AS net
        FROM financial_records
        WHERE is_deleted=false
        GROUP BY TO_CHAR(date, 'IYYY-IW')
        ORDER BY week DESC
        LIMIT 8`
    );

    return result.rows;
};

export const getRecentAcitivity=async(limit=5)=>{
    const result = await pool.query(`
    SELECT
      fr.id,
      fr.amount,
      fr.type,
      fr.category,
      fr.date,
      fr.notes,
      fr.created_at,
      u.name AS created_by
    FROM financial_records fr
    JOIN users u ON fr.user_id = u.id
    WHERE fr.is_deleted = false
    ORDER BY fr.created_at DESC
    LIMIT $1
  `, [limit]);
    return result.rows;
};
