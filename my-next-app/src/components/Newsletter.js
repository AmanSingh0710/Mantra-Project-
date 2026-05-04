"use client";
import { FaEnvelope } from "react-icons/fa";

export default function Newsletter() {
  return (
    <section className="newsletter-section">
      <div className="newsletter-container">
        <h2>Join the Mantra Herbal Newsletter</h2>
        <p>Get skincare tips, offers & new launch updates!</p>

        <div className="newsletter-input">
          <FaEnvelope className="mail-icon" />
          <input
            type="email"
            placeholder="youremail123@gmail.com"
          />
          <button>SUBSCRIBE</button>
        </div>
      </div>
    </section>
  );
}
