import express from "express";
import pool from "../db.js";
import { requireAuth, requireUser } from "../middleware/auth.js";

const router = express.Router();

router.get("/", requireAuth, requireUser, async (req, res) => {
  const userId = req.user.userId;

  const result = await pool.query(
    `SELECT a.*, r.text AS review_text
     FROM applications a
     LEFT JOIN reviews r ON r.application_id = a.id
     WHERE a.user_id=$1
     ORDER BY a.created_at DESC`,
    [userId]
  );

  res.json(result.rows);
});

router.post("/", requireAuth, requireUser, async (req, res) => {
  const userId = req.user.userId;
  const { course_name, start_date, payment } = req.body;

  if (!course_name || !start_date || !payment) {
    return res.status(400).json({ error: "Заполните все поля" });
  }

  try {
    const created = await pool.query(
      `INSERT INTO applications (user_id, course_name, start_date, payment)
       VALUES ($1, $2, TO_DATE($3,'DD.MM.YYYY'), $4)
       RETURNING *`,
      [userId, course_name, start_date, payment]
    );

    res.status(201).json(created.rows[0]);
  } catch {
    res.status(400).json({ error: "Проверь дату (ДД.ММ.ГГГГ) и поля" });
  }
});


router.post("/:id/review", requireAuth, requireUser, async (req, res) => {
  const userId = req.user.userId;
  const { id } = req.params;
  const { text } = req.body;

  if (!text || !text.trim()) return res.status(400).json({ error: "Пустой отзыв" });

  const app = await pool.query(
    "SELECT id, status FROM applications WHERE id=$1 AND user_id=$2",
    [id, userId]
  );

  if (!app.rows.length) return res.status(404).json({ error: "Заявка не найдена" });
  if (app.rows[0].status !== "Обучение завершено") {
    return res.status(403).json({ error: "Отзыв доступен только после завершения обучения" });
  }

  const saved = await pool.query(
    `INSERT INTO reviews(application_id, user_id, text)
     VALUES ($1,$2,$3)
     ON CONFLICT (application_id) DO UPDATE SET text=EXCLUDED.text
     RETURNING *`,
    [id, userId, text]
  );

  res.status(201).json(saved.rows[0]);
});

export default router;
