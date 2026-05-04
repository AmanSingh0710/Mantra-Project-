"use client";
import Image from "next/image";
import { useRef } from "react";

const categories = [
  { title: "", img: "/shopcategory1webp.webp" },
  { title: "", img: "/shopcategory2.webp" },
  { title: "", img: "/shopcategory6.webp" },
  { title: "", img: "/shopcategory4.webp" },
  { title: "", img: "/shopcategory5.webp" },
  { title: "", img: "/shopcategory3.webp" }
];

export default function ShopByCategory() {
  const CARD_WIDTH = 240 + 22;
  const sliderRef = useRef(null);

  const scroll = (dir) => {
    sliderRef.current.scrollBy({
      left: dir === "left" ? -CARD_WIDTH : CARD_WIDTH,
      behavior: "smooth",
    });
  };

  return (
    <section className="category-section">
      <h2 className="category-title">SHOP BY CATEGORY</h2>

      <div className="category-wrapper">
        <button className="cat-btn left" onClick={() => scroll("left")}>
          ‹
        </button>

        <div className="category-track" ref={sliderRef}>
          {categories.map((item, i) => (
            <div className="category-card" key={i}>
              <Image src={item.img} alt={item.title} fill
                sizes="(max-width: 640px) 100vw,
         (max-width: 1024px) 50vw,
         25vw"
              />
              <div className="category-overlay">
                <span>{item.title}</span>
              </div>
            </div>
          ))}
        </div>

        <button className="cat-btn right" onClick={() => scroll("right")}>
          ›
        </button>
      </div>
    </section>
  );
}
