import React from "react";
import { Link } from "react-router-dom";
import Slider from "../components/Slider";

const features = [
  {
    title: "Курсы и заявки",
    text: "Быстрый старт обучения: выбирай курс, дату и отправляй заявку за минуту."
  },
  {
    title: "Умная проверка",
    text: "Администратор видит все заявки, меняет статусы и контролирует поток."
  },
  {
    title: "Отзывы и качество",
    text: "После завершения обучения оставь отзыв и помоги улучшить программу."
  }
];

export default function Home() {
  return (
    <div className="page home">
      <div className="hero">
        <div className="pill">Портал «Корочки.есть»</div>
        <h1>Онлайн-курсы и заявки без лишних кликов</h1>
        <p>
          Регистрируйся, подавай заявки, отслеживай статусы и оставляй отзывы!
        </p>
        <div className="cta">
          <Link className="btn primary" to="/login">Войти</Link>
          <Link className="btn ghost" to="/register">Регистрация</Link>
        </div>
      </div>

      <Slider />

      <div className="card featureCard">
        <div className="sectionTitle">Возможности</div>
        <div className="featureGrid">
          {features.map((f) => (
            <div className="feature" key={f.title}>
              <div className="featureDot" />
              <div>
                <div className="featureTitle">{f.title}</div>
                <div className="featureText">{f.text}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card quickGuide">
        <div className="sectionTitle">Пошаговая инструкция</div>
        <div className="guideGrid">
          <div className="guideStep">
            <div className="stepNumber">1</div>
            <div>
              <div className="stepTitle">Создай аккаунт</div>
              <div className="stepText">Укажи логин, пароль и контактные данные для регистрации в системе.</div>
            </div>
          </div>
          <div className="guideStep">
            <div className="stepNumber">2</div>
            <div>
              <div className="stepTitle">Выбери курс</div>
              <div className="stepText">Подай заявку: выбери программу обучения, дату старта и способ оплаты.</div>
            </div>
          </div>
          <div className="guideStep">
            <div className="stepNumber">3</div>
            <div>
              <div className="stepTitle">Отслеживай прогресс</div>
              <div className="stepText">Администратор проверит заявку и обновит статус обучения.</div>
            </div>
          </div>
          <div className="guideStep">
            <div className="stepNumber">4</div>
            <div>
              <div className="stepTitle">Оставь отзыв</div>
              <div className="stepText">После завершения курса поделись впечатлениями и помоги улучшить качество.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

