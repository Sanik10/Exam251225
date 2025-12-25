import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, setAuth } from "../services/api";

export default function Login() {
  const nav = useNavigate();

  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrMsg("");

    try {
      const data = await api.login({ login, password });
      setAuth(data.token, data.role);
      nav(data.role === "admin" ? "/admin" : "/applications");
    } catch (err) {
      setErrMsg(err?.response?.data?.error || "Ошибка входа");
    }
  };

  return (
    <div className="page authPage">
      <div className="header">
        <div>
          <Link to="/" className="logo">Корочки.есть</Link>
          <p className="subtitle">Вход в систему записи на онлайн‑курсы.</p>
        </div>
      </div>

      <form className="card authCard" onSubmit={onSubmit}>
        <div className="sectionTitle">Авторизация</div>

        <label>
          Логин
          <input value={login} onChange={(e) => setLogin(e.target.value)} placeholder="Введите логин" />
        </label>

        <label>
          Пароль
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Введите пароль" />
        </label>

        {errMsg && <div className="err">{errMsg}</div>}

        <button className="btn primary" type="submit">Войти</button>

        <div className="hint">
          Еще не зарегистрированы? <Link to="/register">Регистрация</Link>
        </div>
      </form>
    </div>
  );
}
