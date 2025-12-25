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
      <button className="sliderBtn" type="button" onClick={prev}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
      <div className="slide">
        <img src={slides[idx]} alt={`Слайд ${idx + 1}`} />
        <div className="slideIndicators">
          {slides.map((_, i) => (
            <div key={i} className={i === idx ? "indicator active" : "indicator"} onClick={() => setIdx(i)} />
          ))}
        </div>
      </div>
      <button className="sliderBtn" type="button" onClick={next}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>
    </div>
  );
}
