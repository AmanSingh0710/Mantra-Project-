"use client";
import Link from "next/link";
import Image from "next/image";
import NotificationBell from "./NotificationBell";
import { FaUser, FaSearch, FaShoppingBag } from "react-icons/fa";
import { useEffect, useState } from "react";

export default function Header() {

  const [user, setUser] = useState(null);

  // Check localStorage for user info
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  return (
    <>
      {/* Announcement */}
      <div className="announcement-bar">
        NEW GST 2.0 APPLIED – LOWER PRICES FOR YOU!
      </div>

      {/* Header */}
      <header className="main-header">

        {/* Top Section */}
        <div className="header-top">

          {/* Left (Text + Logo Image) */}
          <div className="header-left">
            <Image
              src="/sideogo.avif"     // replace anytime
              alt="Brand Logo"
              width={150}
              height={50}
              className="header-logo-img"
            />
          </div>

          <Link href="/" className="header-logo">
            <Image src="/mantar.avif" alt="Brand Logo" width={150} height={50} className="header-logo-img" />
          </Link>

          {/* Right (Icons) */}
          <div className="header-icons flex items-center gap-4">
            <Link href="/search"><FaSearch size={20} /></Link>

            {/* Account */}
            {user ? (


              <Link href="/account" className="flex items-center gap-1">
                <FaUser size={18} />
                <span className="font-semibold">{user.name}</span>
              </Link>
            ) : (
              <Link href="/login"><FaUser size={20} /></Link>
            )}

            <div className="flex items-center justify-center">
              <NotificationBell />
            </div>

            <Link href="/cart"><FaShoppingBag size={20} /></Link>
          </div>

        </div>

        {/* Bottom Section */}
        <nav className="header-bottom">
          <Link href="/skin">Shop All</Link>
          <Link href="/bath-body">Skin</Link>
          <Link href="/hair">Bath & Body</Link>
          <Link href="/men">HAIR</Link>
          <Link href="/category">MEN</Link>
          <Link href="/anantam">ANANTAM</Link>
          <Link href="/anantam">WeDDING EDITS</Link>
          <Link href="/anantam">COMBOS</Link>
          <Link href="/anantam">SHOP BY</Link>
          <Link href="/story">OUR STORY</Link>

        </nav>

      </header>
    </>
  );
}
