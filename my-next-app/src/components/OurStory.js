"use client";
import Image from "next/image";

export default function OurStory() {
  return (
    <section className="our-story">
      <h2 className="our-story-title">OUR STORY</h2>

      <div className="our-story-grid">
        {/* CARD 1 */}
        <div className="our-story-card">
          <div className="our-story-img">
            <Image
              src="/ourstory1.avif"
              alt="Rooted in Ayurveda"
              fill
              className="img"
            />
          </div>
          <h3>Rooted in Ayurveda</h3>
          <p>
            Crafted using ancient Ayurvedic formulations and dosha-balancing
            herbs, developed by expert Vaidyas at the Baidyanath Research
            Foundation.
          </p>
        </div>

        {/* CARD 2 */}
        <div className="our-story-card">
          <div className="our-story-img">
            <Image
              src="/Ourstory2.jpg"
              alt="Clean & Conscious Beauty"
              fill
              className="img"
            />
          </div>
          <h3>Clean & Conscious Beauty</h3>
          <p>
            Free from SLES, parabens, and synthetic fragrances.
            Dermatologically tested and safe for all skin types — even the most
            sensitive.
          </p>
        </div>

        {/* CARD 3 */}
        <div className="our-story-card">
          <div className="our-story-img">
            <Image
              src="/Ourstory3.avif"
              alt="Backed by Research"
              fill
              className="img"
            />
          </div>
          <h3>Backed by Research</h3>
          <p>
            Formulated using over 100 years of Ayurvedic research and
            manufactured in WHO-GMP certified facilities for global quality
            standards.
          </p>
        </div>

        {/* CARD 4 */}
        <div className="our-story-card">
          <div className="our-story-img">
            <Image
              src="/Ourstory4.avif"
              alt="Ethical & Sustainable"
              fill
              className="img"
            />
          </div>
          <h3>Ethical & Sustainable</h3>
          <p>
            Handpicked herbs from ethical sources, eco-friendly packaging, and a
            proud 85% women-led workforce that champions inclusive growth.
          </p>
        </div>
      </div>
    </section>
  );
}
