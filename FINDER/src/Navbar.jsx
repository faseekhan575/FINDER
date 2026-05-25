// Navbar.jsx
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaGraduationCap, FaBars, FaTimes, FaHeart } from "react-icons/fa";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [likedCount, setLikedCount] = useState(0);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const update = () => {
      const l = JSON.parse(localStorage.getItem("likedSchools") || "[]");
      setLikedCount(l.length);
    };
    update();
    window.addEventListener("likedUpdate", update);
    return () => window.removeEventListener("likedUpdate", update);
  }, []);

  const links = [
    { label: "Home", to: "/" },
    { label: "Find Schools", to: "/finder" },
    { label: "Compare", to: "/compare" },
  ];

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "glass border-b border-white/10 shadow-2xl" : "bg-transparent"}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00c9a7] to-[#d4af37] flex items-center justify-center shadow-lg group-hover:shadow-[0_0_20px_rgba(0,201,167,0.5)] transition-all duration-300">
              <FaGraduationCap className="text-white text-lg" />
            </div>
            <span className="font-bold text-lg" style={{ fontFamily: "Syne,sans-serif" }}>
              <span className="gold-text">School</span>
              <span className="text-white">Finder</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${location.pathname === l.to ? "bg-[#00c9a7]/20 text-[#00c9a7] border border-[#00c9a7]/30" : "text-white/70 hover:text-white hover:bg-white/10"}`}
              >
                {l.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {likedCount > 0 && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-pink-500/20 border border-pink-500/30 text-pink-400 text-sm font-medium">
                <FaHeart className="text-xs" />
                <span>{likedCount}</span>
              </div>
            )}
            <Link to="/finder" className="hidden md:block btn-teal px-4 py-2 rounded-xl text-sm font-semibold">
              Find Schools
            </Link>
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all">
              {menuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden glass border-t border-white/10"
          >
            <div className="px-4 py-4 flex flex-col gap-2">
              {links.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setMenuOpen(false)}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${location.pathname === l.to ? "bg-[#00c9a7]/20 text-[#00c9a7]" : "text-white/70 hover:text-white hover:bg-white/10"}`}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}