import React, { useEffect, useState } from "react";

const slides = ["/slider/1.jpg", "/slider/2.jpg", "/slider/3.jpg", "/slider/4.jpg"];

export default function Slider() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx((v) => (v + 1) % slides.length), 3000);
    return () => clearInterval(t);
  }, []);

  const prev = () => setIdx((v) => (v - 1 + slides.length) % slides.length);
  const next = () => setIdx((v) => (v + 1) % slides.length);

  return (
    <div className="slider">
      <button className="btn" type="button" onClick={prev}>Назад</button>
      <div className="slide">
        <img src={slides[idx]} alt="slide" />
      </div>
      <button className="btn" type="button" onClick={next}>Вперед</button>
    </div>
  );
}
