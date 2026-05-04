"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/* DATA */
const concerns = [
  { title: "Acne", img: "/shopconcern1.webp" },
  { title: "Black Heads", img: "/shopconcern2.webp" },
  { title: "Tanning", img: "/shopconcern3.webp" },
  { title: "Dry Skin", img: "/shopconcern4.webp" },
  { title: "Wrinkles", img: "/shopconcern5.webp" },
  { title: "Oily Skin", img: "/shopconcern6.webp" },
  { title: "Oily Skin", img: "/shopconcern7.webp" },
  { title: "Oily Skin", img: "/shopconcern8.jpg" },
];

/* SLIDER COMPONENT */
function Slider({ data }) {
  const sliderRef = useRef(null);
  const [isHover, setIsHover] = useState(false);

  const scroll = (dir) => {
    sliderRef.current.scrollBy({
      left: dir === "left" ? -220 : 220,
      behavior: "smooth",
    });
  };

  /* AUTO SLIDE */
  useEffect(() => {
    if (isHover) return;

    const interval = setInterval(() => {
      scroll("right");
    }, 2000);

    return () => clearInterval(interval);
  }, [isHover]);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      {/* LEFT BUTTON */}
      <button className="slider-btn left" onClick={() => scroll("left")}>
        ‹
      </button>

      {/* SLIDER */}
      <div ref={sliderRef} className="slider-track">
        {data.map((item, index) => (
          <div key={index} className="slider-card">
            <div className="img-box">
              <Image
                src={item.img}
                alt={item.title}
                fill
                className="img"
              />
            </div>
            <p>{item.title}</p>
          </div>
        ))}
      </div>

      {/* RIGHT BUTTON */}
      <button className="slider-btn right" onClick={() => scroll("right")}>
        ›
      </button>
    </div>
  );
}

/* MAIN COMPONENT */
export default function ShopBy() {
  return (
    <section className="shopby-section">
      <div className="container">
        <div>
          <h2 className="pill-title">SHOP BY CONCERN</h2>
          <Slider data={concerns} />
        </div>
      </div>
    </section>
  );
}
