import pool from "../config/db.js";

export const getAllUsers = async ({ page = 1, limit = 10 }) => {
  const offset = (page - 1) * limit;

  const dataResult = await pool.query(
    `SELECT id, name, email, role, is_active, created_at
     FROM users
     ORDER BY created_at DESC
     LIMIT $1 OFFSET $2`,
    [parseInt(limit), parseInt(offset)]
  );

  const countResult = await pool.query(
    `SELECT COUNT(*) FROM users`,
    []
  );

  const total = parseInt(countResult.rows[0].count);

  return {
    users: dataResult.rows,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      total_pages: Math.ceil(total / limit),
    },
  };
};

export const getUserById = async (id) => {
  const result = await pool.query(
    `SELECT id, name, email, role, is_active, created_at
     FROM users WHERE id = $1`,
    [id]
  );

  if (result.rows.length === 0) {
    const error = new Error("User not found");
    error.status = 404;
    throw error;
  }

  return result.rows[0];
};

export const updateUserRole = async (id, role, requesterId) => {
  if (id === requesterId) {
    const error = new Error("You cannot change your own role");
    error.status = 403;
    throw error;
  }

  const result = await pool.query(
    `UPDATE users
     SET role = $1
     WHERE id = $2
     RETURNING id, name, email, role, is_active`,
    [role, id]
  );

  if (result.rows.length === 0) {
    const error = new Error("User not found");
    error.status = 404;
    throw error;
  }

  return result.rows[0];
};

export const updateUserStatus = async (id, is_active, requesterId) => {
  if (id === requesterId) {
    const error = new Error("You cannot change your own status");
    error.status = 403;
    throw error;
  }

  const result = await pool.query(
    `UPDATE users
     SET is_active = $1
     WHERE id = $2
     RETURNING id, name, email, role, is_active`,
    [is_active, id]
  );

  if (result.rows.length === 0) {
    const error = new Error("User not found");
    error.status = 404;
    throw error;
  }

  return result.rows[0];
};