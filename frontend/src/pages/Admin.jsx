import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, clearAuth } from "../services/api";

const statuses = ["Новая", "Идет обучение", "Обучение завершено"];

function badgeClass(status) {
  if (status === "Новая") return "badge new";
  if (status === "Идет обучение") return "badge progress";
  if (status === "Обучение завершено") return "badge done";
  return "badge";
}

export default function Admin() {
  const nav = useNavigate();
  const [items, setItems] = useState([]);
  const [errMsg, setErrMsg] = useState("");

  const load = async () => {
    setErrMsg("");
    try {
      const data = await api.adminApplications();
      setItems(data);
    } catch (err) {
      setErrMsg(err?.response?.data?.error || "Ошибка загрузки");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const logout = () => {
    clearAuth();
    nav("/login");
  };

  const changeStatus = async (id, status) => {
    try {
      await api.adminSetStatus(id, status);
      load();
    } catch (err) {
      alert(err?.response?.data?.error || "Ошибка обновления статуса");
    }
  };

  return (
    <div className="page">
      <div className="topbar">
        <div>
          <h1 className="title">Админ‑панель</h1>
          <p className="subtitle">Просмотр всех заявок и смена статуса.</p>
        </div>
        <button className="btn" onClick={logout}>Выйти</button>
      </div>

      {errMsg && <div className="err">{errMsg}</div>}

      <div className="list">
        {items.map((a) => (
          <div className="card" key={a.id}>
            <div className="row" style={{ justifyContent: "space-between" }}>
              <span className={badgeClass(a.status)}>{a.status}</span>
              <span className="badge">{a.login}</span>
            </div>

            <div className="hr" />

            <div><b>ФИО:</b> {a.full_name}</div>
            <div><b>Курс:</b> {a.course_name}</div>

            <div className="hr" />

            <div className="small">Сменить статус</div>
            <div className="row">
              <select defaultValue={a.status} id={`st-${a.id}`}>
                {statuses.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <button
                className="btn primary"
                onClick={() => {
                  const status = document.getElementById(`st-${a.id}`).value;
                  changeStatus(a.id, status);
                }}
              >
                Обновить
              </button>
            </div>
          </div>
        ))}

        {items.length === 0 && <div className="card">Заявок пока нет.</div>}
      </div>
    </div>
  );
}
