import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Slider from "../components/Slider";
import { api } from "../services/api";

export default function Register() {
  const nav = useNavigate();

  const [form, setForm] = useState({
    login: "",
    password: "",
    full_name: "",
    phone: "",
    email: ""
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  const onChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setServerError("");

    try {
      await api.register(form);
      nav("/login");
    } catch (err) {
      const data = err?.response?.data;
      if (data?.errors) setErrors(data.errors);
      else setServerError(data?.error || "Ошибка регистрации");
    }
  };

  return (
    <div className="page">
      <div className="header">
        <div>
          <h1 className="title">Регистрация</h1>
          <p className="subtitle">Создай аккаунт для подачи заявок на обучение.</p>
        </div>
      </div>

      <Slider />

      <form className="card" onSubmit={onSubmit}>
        <div className="sectionTitle">Данные пользователя</div>

        <label>
          Логин
          <input name="login" value={form.login} onChange={onChange} placeholder="latin+digits, >=6" />
          {errors.login && <div className="err">{errors.login}</div>}
        </label>

        <label>
          Пароль
          <input type="password" name="password" value={form.password} onChange={onChange} placeholder=">=8" />
          {errors.password && <div className="err">{errors.password}</div>}
        </label>

        <label>
          ФИО
          <input name="full_name" value={form.full_name} onChange={onChange} placeholder="Кириллица и пробелы" />
          {errors.full_name && <div className="err">{errors.full_name}</div>}
        </label>

        <label>
          Телефон
          <input name="phone" value={form.phone} onChange={onChange} placeholder="8(XXX)XXX-XX-XX" />
          {errors.phone && <div className="err">{errors.phone}</div>}
        </label>

        <label>
          Email
          <input name="email" value={form.email} onChange={onChange} placeholder="mail@example.com" />
          {errors.email && <div className="err">{errors.email}</div>}
        </label>

        {serverError && <div className="err">{serverError}</div>}

        <button className="btn primary" type="submit">Зарегистрироваться</button>

        <div className="hint">
          Уже зарегистрированы? <Link to="/login">Войти</Link>
        </div>
      </form>
    </div>
  );
}
