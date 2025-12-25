import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, clearAuth } from "../services/api";

function badgeClass(status) {
  if (status === "Новая") return "badge new";
  if (status === "Идет обучение") return "badge progress";
  if (status === "Обучение завершено") return "badge done";
  return "badge";
}

function payLabel(pay) {
  if (pay === "cash") return "Наличными";
  if (pay === "transfer") return "Переводом";
  return pay;
}

export default function MyApplications() {
  const nav = useNavigate();
  const [items, setItems] = useState([]);
  const [errMsg, setErrMsg] = useState("");

  const load = async () => {
    setErrMsg("");
    try {
      const data = await api.myApplications();
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

  const saveReview = async (id, text) => {
    try {
      await api.saveReview(id, text);
      load();
    } catch (err) {
      alert(err?.response?.data?.error || "Ошибка сохранения отзыва");
    }
  };

  return (
    <div className="page">
      <div className="topbar">
        <div>
          <h1 className="title">Мои заявки</h1>
          <p className="subtitle">Список заявок и отзывы после завершения обучения.</p>
        </div>
        <button className="btn" onClick={logout}>Выйти</button>
      </div>

      <div className="actions">
        <Link className="btn primary" to="/new-application">Новая заявка</Link>
      </div>

      {errMsg && <div className="err">{errMsg}</div>}

      <div className="list">
        {items.map((a) => (
          <div className="card" key={a.id}>
            <div className="row" style={{ justifyContent: "space-between" }}>
              <span className={badgeClass(a.status)}>{a.status}</span>
              <span className="badge">{payLabel(a.payment)}</span>
            </div>

            <div className="hr" />

            <div><b>Курс:</b> {a.course_name}</div>

            <div className="hr" />

            <div className="small">Отзыв (доступно только после “Обучение завершено”)</div>

            <textarea
              defaultValue={a.review_text || ""}
              disabled={a.status !== "Обучение завершено"}
              placeholder="Напишите отзыв..."
              rows={3}
              id={`review-${a.id}`}
            />

            <button
              className="btn"
              disabled={a.status !== "Обучение завершено"}
              onClick={() => {
                const text = document.getElementById(`review-${a.id}`).value;
                saveReview(a.id, text);
              }}
            >
              Сохранить отзыв
            </button>
          </div>
        ))}

        {items.length === 0 && (
          <div className="card">
            Заявок пока нет. Нажми “Новая заявка”.
          </div>
        )}
      </div>
    </div>
  );
}
