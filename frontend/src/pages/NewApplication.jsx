import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../services/api";

const courses = [
  "Основы алгоритмизации и программирования",
  "Основы веб-дизайна",
  "Основы проектирования баз данных"
];

export default function NewApplication() {
  const nav = useNavigate();

  const [course_name, setCourse] = useState(courses[0]);
  const [start_date, setDate] = useState("");
  const [payment, setPayment] = useState("cash"); // cash | transfer
  const [errMsg, setErrMsg] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrMsg("");

    try {
      await api.createApplication({ course_name, start_date, payment });
      nav("/applications");
    } catch (err) {
      setErrMsg(err?.response?.data?.error || "Ошибка создания заявки");
    }
  };

  return (
    <div className="page">
      <div className="header">
        <div>
          <h1 className="title">Формирование заявки</h1>
          <p className="subtitle">Выбери курс, дату начала и способ оплаты.</p>
        </div>
        <Link className="btn ghost" to="/applications">Назад</Link>
      </div>

      <form className="card" onSubmit={onSubmit}>
        <div className="sectionTitle">Данные заявки</div>

        <label>
          Курс
          <select value={course_name} onChange={(e) => setCourse(e.target.value)}>
            {courses.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </label>

        <label>
          Дата начала (ДД.ММ.ГГГГ)
          <input value={start_date} onChange={(e) => setDate(e.target.value)} placeholder="25.12.2025" />
        </label>

        <div className="small">Способ оплаты</div>
        <div className="radioBox">
          <label className="radioRow">
            <input type="radio" name="pay" checked={payment === "cash"} onChange={() => setPayment("cash")} />
            Наличными
          </label>

          <label className="radioRow">
            <input type="radio" name="pay" checked={payment === "transfer"} onChange={() => setPayment("transfer")} />
            Переводом по номеру телефона
          </label>
        </div>

        {errMsg && <div className="err">{errMsg}</div>}

        <div className="actions">
          <button className="btn primary" type="submit">Отправить</button>
          <Link className="btn" to="/applications">Отмена</Link>
        </div>
      </form>
    </div>
  );
}
