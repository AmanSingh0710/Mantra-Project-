"use client";
import Link from "next/link";
import { FaFacebookF, FaInstagram, FaPinterestP, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* SHOP */}
        <div className="footer-col">
          <h4>SHOP</h4>
          <Link href="/skin">Skin</Link>
          <Link href="/bath-body">Bath & Body</Link>
          <Link href="/hair">Hair</Link>
          <Link href="/men">Men</Link>
          <Link href="/spa">Spa</Link>
          <Link href="/anantam">Anantam</Link>
          <Link href="/kits-gifting">Kits & Gifting</Link>
          <Link href="/combos">Combos</Link>
          <Link href="/exclusive-deals">Exclusive Deals</Link>
        </div>

        {/* ABOUT */}
        <div className="footer-col">
          <h4>About</h4>
          <Link href="/about">About us</Link>
          <Link href="/story">Our Story</Link>
          <Link href="/about">About Baidyanath</Link>
          <Link href="/media-press">Media & Press</Link>
          <Link href="/blogs">Blogs</Link>
        </div>

        {/* CUSTOMER CARE */}
        <div className="footer-col">
          <h4>CUSTOMER CARE</h4>
          <Link href="/contact">Contact Us</Link>
          <Link href="/shipping-policy">Shipping Policy</Link>
          <Link href="/cancellation-policy">Cancellation Policy</Link>
          <Link href="/return-refund">Return & Refund Policy</Link>
          <Link href="/privacy-policy">Privacy Policy</Link>
          <Link href="/terms">Terms & Conditions</Link>
          <Link href="/disclaimer">Disclaimer</Link>
          <Link href="/faq">FAQs</Link>
        </div>

        {/* AVAILABLE AT */}
        <div className="footer-col">
          <h4>AVAILABLE AT</h4>
          <Link href="https://amazon.in" target="_blank">Amazon</Link>
          <Link href="https://nykaa.com" target="_blank">Nykaa</Link>
          <Link href="https://flipkart.com" target="_blank">Flipkart</Link>
          <Link href="#">Tira</Link>
          <Link href="https://myntra.com" target="_blank">Myntra</Link>
          <Link href="#">Purplle</Link>
          <Link href="#">Firstcry</Link>
        </div>

        {/* ADDRESS */}
        <div className="footer-col footer-address">
          <h4>ADDRESS</h4>
          <p>
            31, Link Road, Opp. Defence Colony, Block A, Lajpat Nagar III,
            New Delhi – 110024, India
          </p>

          <p>
            Email: <a href="mailto:info@mantraherbal.in">info@mantraherbal.in</a>
          </p>

          <p>
            Toll-Free: <a href="tel:18001028384">1800-1028384</a>
          </p>

          <div className="footer-social">
            <Link href="#"><FaFacebookF /></Link>
            <Link href="#"><FaXTwitter /></Link>
            <Link href="#"><FaInstagram /></Link>
            <Link href="#"><FaPinterestP /></Link>
            <Link href="#"><FaLinkedinIn /></Link>
          </div>
        </div>

      </div>

      {/* Payments */}
      <div className="footer-payments">
        <a href="https://www.americanexpress.com" target="_blank" rel="noopener noreferrer">
    <img src="/Amex.avif" alt="Amex" />
  </a>
  <a href="https://www.mastercard.com" target="_blank" rel="noopener noreferrer">
    <img src="/Mastercard.avif" alt="Mastercard" />
  </a>
  <a href="https://www.paypal.com" target="_blank" rel="noopener noreferrer">
    <img src="/Paypal.webp" alt="Paypal" />
  </a>
  <a href="https://pay.google.com" target="_blank" rel="noopener noreferrer">
    <img src="/Gpay.webp" alt="Google Pay" />
  </a>
  <a href="https://www.upi.com" target="_blank" rel="noopener noreferrer">
    <img src="/UPI.webp" alt="UPI" />
  </a>
      </div>

      {/* Bottom */}
      <div className="footer-bottom">
        © 2026 – MANTRA HERBAL POWERED BY SHOPIFY
      </div>
    </footer>
  );
}
