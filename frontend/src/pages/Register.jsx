import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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

  const onPhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 11) value = value.slice(0, 11);
    
    let formatted = "";
    if (value.length > 0) {
      formatted = value[0];
      if (value.length > 1) formatted += "(" + value.slice(1, 4);
      if (value.length > 4) formatted += ")" + value.slice(4, 7);
      if (value.length > 7) formatted += "-" + value.slice(7, 9);
      if (value.length > 9) formatted += "-" + value.slice(9, 11);
    }
    setForm((p) => ({ ...p, phone: formatted }));
  };

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
    <div className="page authPage">
      <div className="header">
        <div>
          <Link to="/" className="logo">Корочки.есть</Link>
          <p className="subtitle">Создай аккаунт для подачи заявок на обучение.</p>
        </div>
      </div>

      <form className="card authCard" onSubmit={onSubmit}>
        <div className="sectionTitle">Данные пользователя</div>

        <label>
          Логин
          <input name="login" value={form.login} onChange={onChange} placeholder="example123" />
          {errors.login && <div className="err">{errors.login}</div>}
        </label>

        <label>
          Пароль
          <input type="password" name="password" value={form.password} onChange={onChange} placeholder="минимум 8 символов" />
          {errors.password && <div className="err">{errors.password}</div>}
        </label>

        <label>
          ФИО
          <input name="full_name" value={form.full_name} onChange={onChange} placeholder="Кириллица и пробелы" />
          {errors.full_name && <div className="err">{errors.full_name}</div>}
        </label>

        <label>
          Телефон
          <input name="phone" value={form.phone} onChange={onPhoneChange} placeholder="8(XXX)XXX-XX-XX" />
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
