// Home.jsx
import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaMapMarkerAlt, FaSearch, FaStar, FaChartBar,
  FaShieldAlt, FaGraduationCap, FaArrowRight,
  FaCheckCircle, FaSchool, FaUsers, FaAward, FaBookOpen
} from "react-icons/fa";
import Navbar from "./Navbar";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay, ease: "easeOut" },
});

const features = [
  { icon: <FaMapMarkerAlt className="text-2xl" />, title: "Area-Based Search", desc: "Find schools in your exact neighborhood. Filter by locality, city and region with pinpoint accuracy.", color: "from-[#00c9a7] to-[#009e84]" },
  { icon: <FaChartBar className="text-2xl" />, title: "Side-by-Side Compare", desc: "Compare any two schools across 12 parameters — fees, ratings, facilities, staff and more.", color: "from-[#d4af37] to-[#f0d060]" },
  { icon: <FaStar className="text-2xl" />, title: "Verified Ratings", desc: "Real parent reviews and verified ratings help you trust every school recommendation.", color: "from-purple-500 to-purple-700" },
  { icon: <FaShieldAlt className="text-2xl" />, title: "Trusted Data", desc: "Our database covers government, private, semi-government, and Islamic institutions across Pakistan.", color: "from-blue-500 to-blue-700" },
  { icon: <FaSearch className="text-2xl" />, title: "Smart Filters", desc: "Filter by gender, category, fee range, board affiliation and rating in seconds.", color: "from-pink-500 to-pink-700" },
  { icon: <FaBookOpen className="text-2xl" />, title: "Rich Profiles", desc: "Every school has a full profile: history, facilities, achievements, contact info and reviews.", color: "from-orange-500 to-orange-700" },
];

const stats = [
  { icon: <FaSchool />, value: "61+", label: "Schools Listed" },
  { icon: <FaMapMarkerAlt />, value: "10+", label: "Areas Covered" },
  { icon: <FaUsers />, value: "5000+", label: "Students Helped" },
  { icon: <FaAward />, value: "4.5★", label: "Average Rating" },
];

const steps = [
  { step: "01", title: "Enter Your Details", desc: "Provide your name and contact info to personalise your experience." },
  { step: "02", title: "Select Your City & Area", desc: "Choose Lahore → Muridke (more cities coming soon)." },
  { step: "03", title: "Apply Filters", desc: "Filter by category, gender, fees, board and ratings." },
  { step: "04", title: "Compare & Choose", desc: "Compare shortlisted schools side-by-side and pick the best." },
];

export default function Home() {
  const featuresRef = useRef(null);

  return (
    <div className="min-h-screen bg-[#070d1a]">
      <Navbar />

      {/* ── HERO ── */}
      <section className="hero-bg relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Decorative orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-[#00c9a7]/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-[#d4af37]/10 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-blue-900/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-[#00c9a7]/30 text-[#00c9a7] text-sm font-medium mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-[#00c9a7] animate-pulse" />
            Pakistan's #1 School Discovery Platform
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold leading-tight mb-6"
          >
            Find the{" "}
            <span className="gold-text">Perfect School</span>
            <br />
            <span className="text-white">Near You</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-white/60 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Discover, compare and choose from 61+ verified schools across Muridke and surrounding areas. Government, private, Cambridge, Islamic — all in one place.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/finder"
              className="blink-cta btn-teal flex items-center gap-3 px-8 py-4 rounded-2xl text-lg font-bold shadow-2xl"
            >
              <FaMapMarkerAlt className="text-xl" />
              📍 Find Schools Near Me
            </Link>
            <button
              onClick={() => featuresRef.current?.scrollIntoView({ behavior: "smooth" })}
              className="flex items-center gap-2 px-8 py-4 rounded-2xl text-white/80 glass border border-white/20 hover:border-white/40 hover:text-white transition-all duration-300 text-base font-medium"
            >
              Learn More <FaArrowRight className="text-sm" />
            </button>
          </motion.div>

          {/* Mini stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-16 max-w-3xl mx-auto"
          >
            {stats.map((s, i) => (
              <div key={i} className="glass rounded-2xl p-4 text-center border border-white/10">
                <div className="text-[#00c9a7] text-xl mb-1 flex justify-center">{s.icon}</div>
                <div className="text-2xl font-extrabold text-white" style={{ fontFamily: "Syne,sans-serif" }}>{s.value}</div>
                <div className="text-white/50 text-xs mt-0.5">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section ref={featuresRef} className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#070d1a] via-[#0d1f3c]/30 to-[#070d1a] pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div {...fadeUp()} className="text-center mb-16">
            <span className="badge bg-[#00c9a7]/15 text-[#00c9a7] border border-[#00c9a7]/30">Why SchoolFinder</span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white mt-4 mb-4">
              Everything You Need to{" "}
              <span className="gold-text">Decide Wisely</span>
            </h2>
            <p className="text-white/50 text-lg max-w-xl mx-auto">We built the most comprehensive school intelligence platform for Pakistan's families.</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div key={i} {...fadeUp(i * 0.08)} className="glass rounded-2xl p-6 card-lift border border-white/10 group">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {f.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
                <p className="text-white/55 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp()} className="text-center mb-16">
            <span className="badge bg-[#d4af37]/15 text-[#d4af37] border border-[#d4af37]/30">How It Works</span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white mt-4">
              Find Your School in{" "}
              <span className="gold-text">4 Simple Steps</span>
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-6">
            {steps.map((s, i) => (
              <motion.div key={i} {...fadeUp(i * 0.1)} className="glass rounded-2xl p-6 border border-white/10 flex gap-5 card-lift">
                <div className="text-4xl font-extrabold gold-text shrink-0" style={{ fontFamily: "Syne,sans-serif" }}>{s.step}</div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">{s.title}</h3>
                  <p className="text-white/55 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BENEFITS ── */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#00c9a7]/5 via-transparent to-[#d4af37]/5 pointer-events-none" />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div {...fadeUp()}>
              <span className="badge bg-purple-500/15 text-purple-400 border border-purple-500/30">Our Promise</span>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white mt-4 mb-6">
                Education Decisions<br />
                <span className="gold-text">Made Smarter</span>
              </h2>
              <p className="text-white/55 text-base leading-relaxed mb-8">
                Choosing the right school for your child is one of the most important decisions you'll make. SchoolFinder gives you verified data, real reviews and powerful comparison tools to make that decision with confidence.
              </p>
              <ul className="space-y-3">
                {[
                  "61+ schools across Muridke & surrounding areas",
                  "Government, Private, Cambridge & Islamic schools",
                  "Real fee data — from free to premium",
                  "Side-by-side comparison of any two schools",
                  "Save and like your favourite schools",
                  "Filter by gender, category, rating & more",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-white/70 text-sm">
                    <FaCheckCircle className="text-[#00c9a7] shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                to="/finder"
                className="inline-flex items-center gap-2 btn-gold px-6 py-3 rounded-xl mt-8 text-sm"
              >
                Start Exploring <FaArrowRight />
              </Link>
            </motion.div>

            <motion.div {...fadeUp(0.2)} className="grid grid-cols-2 gap-4">
              {[
                { label: "Government", count: "15+", icon: "🏛️", color: "from-blue-600/30 to-blue-800/30" },
                { label: "Private", count: "35+", icon: "🏫", color: "from-green-600/30 to-green-800/30" },
                { label: "Islamic / Madrassa", count: "5+", icon: "☪️", color: "from-amber-600/30 to-amber-800/30" },
                { label: "Colleges", count: "6+", icon: "🎓", color: "from-purple-600/30 to-purple-800/30" },
              ].map((c, i) => (
                <div key={i} className={`glass rounded-2xl p-6 text-center border border-white/10 bg-gradient-to-br ${c.color} card-lift`}>
                  <div className="text-4xl mb-3">{c.icon}</div>
                  <div className="text-3xl font-extrabold gold-text" style={{ fontFamily: "Syne,sans-serif" }}>{c.count}</div>
                  <div className="text-white/60 text-sm mt-1">{c.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            {...fadeUp()}
            className="glass rounded-3xl p-10 sm:p-16 text-center border border-white/10 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#00c9a7] via-[#d4af37] to-[#00c9a7]" />
            <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-[#00c9a7]/10 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-[#d4af37]/10 blur-3xl pointer-events-none" />
            <div className="relative z-10">
              <FaGraduationCap className="text-5xl text-[#00c9a7] mx-auto mb-6" />
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-4">
                Ready to Find the{" "}
                <span className="gold-text">Right School?</span>
              </h2>
              <p className="text-white/55 text-lg max-w-xl mx-auto mb-10">
                Join thousands of parents who've found their ideal school through SchoolFinder. It's free, fast and comprehensive.
              </p>
              <Link
                to="/finder"
                className="blink-cta btn-teal inline-flex items-center gap-3 px-10 py-4 rounded-2xl text-xl font-bold"
              >
                <FaMapMarkerAlt />
                📍 Find Schools Near Me
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/10 py-10 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#00c9a7] to-[#d4af37] flex items-center justify-center">
              <FaGraduationCap className="text-white text-sm" />
            </div>
            <span className="font-bold" style={{ fontFamily: "Syne,sans-serif" }}>
              <span className="gold-text">School</span>
              <span className="text-white">Finder</span>
            </span>
          </div>
          <p className="text-white/40 text-sm">© 2024 SchoolFinder. Muridke, Pakistan. All rights reserved.</p>
          <div className="flex gap-4 text-sm text-white/40">
            <Link to="/" className="hover:text-white/70 transition-colors">Home</Link>
            <Link to="/finder" className="hover:text-white/70 transition-colors">Finder</Link>
            <Link to="/compare" className="hover:text-white/70 transition-colors">Compare</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}