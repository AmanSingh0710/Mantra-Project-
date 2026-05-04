"use client";
import Image from "next/image";
import { FaTruck, FaLock, FaUserMd } from "react-icons/fa";
import { useState, useEffect } from "react";

export default function Hero() {
  const images = [
    "/homepage3.webp",
    "/homepage1.webp",
    "/homepage2.webp",
    "/Homepagedesktop2.webp"
  ];

  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 3000); // Increased to 3s for better readability

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <section className="w-full flex flex-col">
      {/* Upper Div - Slider Container */}
      {/* We use a responsive height: 50vh on mobile, 80vh on desktop */}
      <div className="relative w-full h-[45vh] md:h-[75vh] lg:h-[85vh] overflow-hidden bg-[#f4f4f4]">
        {images.map((src, index) => (
          <div
            key={src}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentImage ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={src}
              alt="Kumkumadi Oil"
              fill
              priority={index === 0}
              sizes="100vw"
              className="object-cover md:object-center" 
              // Change 'object-cover' to 'object-contain' if you want to see the full image without any cropping
            />
          </div>
        ))}
        
        {/* Optional: Slider Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, i) => (
            <div 
              key={i} 
              className={`h-1.5 w-1.5 rounded-full transition-all ${i === currentImage ? "bg-white w-4" : "bg-white/50"}`}
            />
          ))}
        </div>
      </div>

      {/* Lower Div - Info Bar */}
      <div className="bg-[#fbf7f0] border-t border-[#e6dccb] grid grid-cols-3 gap-2 py-6 px-4">
        <div className="flex flex-col items-center gap-2 text-[#3a2a16]">
          <FaTruck className="text-xl md:text-2xl text-[#9c7c3b]" />
          <span className="text-[10px] sm:text-xs md:text-sm font-semibold uppercase tracking-wide">Free Shipping</span>
        </div>

        <div className="flex flex-col items-center gap-2 text-[#3a2a16]">
          <FaLock className="text-xl md:text-2xl text-[#9c7c3b]" />
          <span className="text-[10px] sm:text-xs md:text-sm font-semibold uppercase tracking-wide">Secure Checkout</span>
        </div>

        <div className="flex flex-col items-center gap-2 text-[#3a2a16]">
          <FaUserMd className="text-xl md:text-2xl text-[#9c7c3b]" />
          <span className="text-[10px] sm:text-xs md:text-sm font-semibold uppercase tracking-wide">Doctor Consultation</span>
        </div>
      </div>
    </section>
  );
}