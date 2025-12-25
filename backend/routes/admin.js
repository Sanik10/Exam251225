import express from "express";
import pool from "../db.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

router.get("/applications", requireAuth, requireAdmin, async (req, res) => {
  const result = await pool.query(
    `SELECT a.*, u.login, u.full_name, u.phone, u.email
     FROM applications a
     JOIN users u ON u.id = a.user_id
     ORDER BY a.created_at DESC`
  );
  res.json(result.rows);
});

router.patch("/applications/:id/status", requireAuth, requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const updated = await pool.query(
    "UPDATE applications SET status=$1 WHERE id=$2 RETURNING *",
    [status, id]
  );

  if (!updated.rows.length) return res.status(404).json({ error: "Not found" });
  res.json(updated.rows[0]);
});

export default router;
