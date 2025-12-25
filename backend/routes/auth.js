import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../db.js";

const router = express.Router();

/**
 * Простая серверная валидация под ТЗ
 */
const reLogin = /^[A-Za-z0-9]{6,}$/;
const rePhone = /^8\(\d{3}\)\d{3}-\d{2}-\d{2}$/;
const reFio = /^[А-Яа-яЁё\s]+$/;
const reEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.post("/register", async (req, res) => {
  const { login, password, full_name, phone, email } = req.body;

  const errors = {};
  if (!reLogin.test(login || "")) errors.login = "Логин: латиница/цифры, минимум 6 символов";
  if ((password || "").length < 8) errors.password = "Пароль: минимум 8 символов";
  if (!reFio.test(full_name || "")) errors.full_name = "ФИО: кириллица и пробелы";
  if (!rePhone.test(phone || "")) errors.phone = "Телефон: 8(XXX)XXX-XX-XX";
  if (!reEmail.test(email || "")) errors.email = "Email некорректен";

  if (Object.keys(errors).length) return res.status(400).json({ errors });

  try {
    const exists = await pool.query("SELECT id FROM users WHERE login=$1", [login]);
    if (exists.rows.length) return res.status(409).json({ errors: { login: "Логин уже занят" } });

    // bcrypt.hash: хешируем пароль, в БД пароль НЕ храним [объяснение на защите]
    const password_hash = await bcrypt.hash(password, 10);

    const created = await pool.query(
      `INSERT INTO users (login, password_hash, full_name, phone, email)
       VALUES ($1,$2,$3,$4,$5)
       RETURNING id, login, full_name, phone, email`,
      [login, password_hash, full_name, phone, email]
    );

    return res.status(201).json(created.rows[0]);
  } catch {
    return res.status(500).json({ error: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  const { login, password } = req.body;

  // Админ по ТЗ (не хранится в users)
  if (login === "Admin" && password === "KorokNET") {
    const token = jwt.sign({ role: "admin" }, process.env.JWT_SECRET, { expiresIn: "2h" }); // [web:3]
    return res.json({ token, role: "admin" });
  }

  try {
    const result = await pool.query("SELECT id, login, password_hash FROM users WHERE login=$1", [login]);
    if (!result.rows.length) return res.status(401).json({ error: "Неверный логин или пароль" });

    const user = result.rows[0];
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: "Неверный логин или пароль" });

    const token = jwt.sign({ role: "user", userId: user.id }, process.env.JWT_SECRET, { expiresIn: "2h" }); // [web:3]
    return res.json({ token, role: "user" });
  } catch {
    return res.status(500).json({ error: "Server error" });
  }
});

export default router;
