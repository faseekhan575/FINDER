// ============================================================
// SchoolDetails.jsx — Full School Profile Page
// Place in: src/SchoolDetails.jsx
// Route: /school/:slug
// Requires react-router-dom, framer-motion, react-icons
// Reads from allData.jsx (dataset untouched)
// ============================================================

import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaArrowLeft, FaStar, FaMapMarkerAlt, FaPhone, FaEnvelope, FaGlobe,
  FaUsers, FaUserTie, FaMoneyBillWave, FaCalendarAlt, FaChartBar,
  FaHeart, FaBookmark, FaCheckCircle, FaFacebook, FaTwitter, FaInstagram,
  FaClock, FaBuilding, FaGraduationCap, FaTrophy, FaSchool, FaShare,
  FaChevronLeft, FaChevronRight, FaPlus,
} from "react-icons/fa";
import { getSchoolBySlug, schoolsData } from "./allData";
import Navbar from "./Navbar";

/* ─── Colour helpers (match Finder.jsx) ─── */
function getCatColor(cat) {
  const map = {
    government:        "bg-blue-500/20 text-blue-400 border-blue-500/30",
    private:           "bg-green-500/20 text-green-400 border-green-500/30",
    "semi-government": "bg-teal-500/20 text-teal-400 border-teal-500/30",
    "islamic-madrassa":"bg-amber-500/20 text-amber-400 border-amber-500/30",
    "boarding-school": "bg-purple-500/20 text-purple-400 border-purple-500/30",
    college:           "bg-orange-500/20 text-orange-400 border-orange-500/30",
  };
  return map[cat] || "bg-white/10 text-white/60 border-white/20";
}

function getGenderColor(g) {
  return { boys: "bg-sky-500/20 text-sky-400 border-sky-500/30", girls: "bg-pink-500/20 text-pink-400 border-pink-500/30", "co-ed": "bg-purple-500/20 text-purple-400 border-purple-500/30" }[g] || "bg-white/10 text-white/50";
}

function getBoardColor(b) {
  if (b === "cambridge") return "bg-indigo-500/20 text-indigo-400 border-indigo-500/30";
  if (b?.includes("lahore") || b?.includes("gujranwala")) return "bg-rose-500/20 text-rose-400 border-rose-500/30";
  return "bg-white/10 text-white/50 border-white/15";
}

/* ─── Stars ─── */
function Stars({ rating, size = "base" }) {
  const cls = size === "lg" ? "text-lg" : "text-sm";
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <FaStar key={n} className={`${cls} ${n <= Math.round(rating) ? "text-[#d4af37]" : "text-white/20"}`} />
      ))}
      <span className={`ml-1.5 font-bold ${size === "lg" ? "text-2xl text-white" : "text-sm text-white/70"}`}>{rating}</span>
    </div>
  );
}

/* ─── Stat tile ─── */
function StatTile({ icon, value, label, accent = "#00c9a7" }) {
  return (
    <div className="glass rounded-2xl p-5 border border-white/10 flex flex-col items-center text-center gap-2 hover:border-white/20 transition-colors">
      <div className="text-2xl" style={{ color: accent }}>{icon}</div>
      <div className="font-extrabold text-white text-xl leading-none">{value}</div>
      <div className="text-white/45 text-xs font-medium">{label}</div>
    </div>
  );
}

/* ─── Tab button ─── */
function Tab({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`relative px-5 py-3 text-sm font-semibold transition-all duration-200 whitespace-nowrap ${active ? "text-white" : "text-white/40 hover:text-white/70"}`}
    >
      {children}
      {active && (
        <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#00c9a7] to-[#d4af37] rounded-full" />
      )}
    </button>
  );
}

/* ─── Image Gallery ─── */
function Gallery({ images, name }) {
  const [current, setCurrent] = useState(0);
  const valid = images?.filter(Boolean) || [];
  if (!valid.length) return null;

  return (
    <div className="relative rounded-3xl overflow-hidden h-72 sm:h-96 bg-[#0d1f3c]">
      <AnimatePresence mode="wait">
        <motion.img
          key={current}
          src={valid[current]}
          alt={`${name} ${current + 1}`}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full h-full object-cover"
          onError={(e) => { e.target.style.display = "none"; }}
        />
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-t from-[#070d1a]/80 via-transparent to-transparent" />
      {valid.length > 1 && (
        <>
          <button onClick={() => setCurrent((p) => (p === 0 ? valid.length - 1 : p - 1))}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 border border-white/20 flex items-center justify-center text-white hover:bg-black/70 transition-all">
            <FaChevronLeft className="text-xs" />
          </button>
          <button onClick={() => setCurrent((p) => (p === valid.length - 1 ? 0 : p + 1))}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 border border-white/20 flex items-center justify-center text-white hover:bg-black/70 transition-all">
            <FaChevronRight className="text-xs" />
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
            {valid.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)}
                className={`rounded-full transition-all duration-200 ${i === current ? "w-5 h-1.5 bg-[#00c9a7]" : "w-1.5 h-1.5 bg-white/40 hover:bg-white/60"}`} />
            ))}
          </div>
        </>
      )}
      {/* Total images badge */}
      {valid.length > 1 && (
        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm border border-white/15 rounded-lg px-2.5 py-1 text-white/70 text-xs">
          {current + 1} / {valid.length}
        </div>
      )}
    </div>
  );
}

/* ─── Compare mini-bar (persists in localStorage like Finder.jsx) ─── */
function useCompare(thisSchool) {
  const [compareList, setCompareList] = useState(() => {
    try { return JSON.parse(localStorage.getItem("compareList") || "[]"); } catch { return []; }
  });
  const isInList = compareList.some((s) => s.id === thisSchool?.id);

  const toggle = () => {
    setCompareList((prev) => {
      let next;
      if (isInList) {
        next = prev.filter((s) => s.id !== thisSchool.id);
      } else {
        if (prev.length >= 2) next = [prev[1], thisSchool];
        else next = [...prev, thisSchool];
      }
      localStorage.setItem("compareList", JSON.stringify(next));
      return next;
    });
  };

  return { compareList, isInList, toggle };
}

/* ════════════════════════════════════════════════════════
   SCHOOL DETAILS — MAIN COMPONENT
════════════════════════════════════════════════════════ */
export default function SchoolDetails() {
  const { slug }    = useParams();
  const navigate    = useNavigate();
  const school      = getSchoolBySlug(slug);

  const [activeTab, setActiveTab] = useState("overview");
  const [liked,     setLiked]     = useState(() => (JSON.parse(localStorage.getItem("likedSchools") || "[]")).includes(school?.id));
  const [saved,     setSaved]     = useState(() => (JSON.parse(localStorage.getItem("savedSchools") || "[]")).includes(school?.id));
  const [showShare, setShowShare] = useState(false);

  const { compareList, isInList, toggle: toggleCompare } = useCompare(school);

  /* Sync liked / saved to localStorage */
  const toggleLike = () => {
    setLiked((p) => {
      const list = JSON.parse(localStorage.getItem("likedSchools") || "[]");
      const next = p ? list.filter((id) => id !== school.id) : [...list, school.id];
      localStorage.setItem("likedSchools", JSON.stringify(next));
      return !p;
    });
  };
  const toggleSave = () => {
    setSaved((p) => {
      const list = JSON.parse(localStorage.getItem("savedSchools") || "[]");
      const next = p ? list.filter((id) => id !== school.id) : [...list, school.id];
      localStorage.setItem("savedSchools", JSON.stringify(next));
      return !p;
    });
  };

  /* Similar schools — same area, exclude this one */
  const similarSchools = schoolsData
    .filter((s) => s.area === school?.area && s.id !== school?.id)
    .slice(0, 3);

  /* 404 guard */
  if (!school) {
    return (
      <div className="min-h-screen bg-[#070d1a] flex flex-col items-center justify-center gap-6">
        <Navbar />
        <div className="text-center">
          <div className="text-6xl mb-4">🏫</div>
          <h1 className="text-2xl font-bold text-white mb-2">School Not Found</h1>
          <p className="text-white/50 text-sm mb-6">The school you're looking for doesn't exist in our database.</p>
          <Link to="/finder" className="btn-teal px-6 py-3 rounded-xl font-semibold flex items-center gap-2 mx-auto w-fit">
            <FaArrowLeft /> Back to Finder
          </Link>
        </div>
      </div>
    );
  }

  const fee = school.monthlyFee === 0 ? "Free" : `Rs ${school.monthlyFee.toLocaleString()}`;
  const admFee = school.admissionFee === 0 ? "Free" : `Rs ${school.admissionFee.toLocaleString()}`;

  /* ══════════════ TABS CONTENT ══════════════ */
  const TABS = [
    { id: "overview",    label: "Overview"    },
    { id: "facilities",  label: "Facilities"  },
    { id: "reviews",     label: `Reviews (${school.reviews?.length || 0})` },
    { id: "contact",     label: "Contact"     },
  ];

  return (
    <div className="min-h-screen bg-[#070d1a]">
      <Navbar />

      <div className="pt-20 pb-24 px-4 max-w-6xl mx-auto">

        {/* ── Breadcrumb ── */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
          className="flex items-center gap-2 text-xs text-white/40 mb-6 flex-wrap">
          <Link to="/" className="hover:text-white/70 transition-colors">Home</Link>
          <span>/</span>
          <Link to="/finder" className="hover:text-white/70 transition-colors">Finder</Link>
          <span>/</span>
          <span className="text-white/70 truncate max-w-xs">{school.schoolName}</span>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">

          {/* ══════════════════════════
              LEFT COLUMN — main content
          ══════════════════════════ */}
          <div className="lg:col-span-2 space-y-6">

            {/* ── Gallery ── */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
              <Gallery images={school.images} name={school.schoolName} />
            </motion.div>

            {/* ── Title block ── */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.05 }}
              className="glass rounded-3xl p-6 border border-white/10">
              {/* Badges row */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`badge border ${getCatColor(school.category)}`}>{school.categoryLabel}</span>
                <span className={`badge border ${getGenderColor(school.genderType)}`}>{school.genderType}</span>
                <span className={`badge border ${getBoardColor(school.board)}`}>{school.boardLabel}</span>
                <span className="badge bg-white/8 text-white/50 border border-white/10">{school.medium} Medium</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight mb-2" style={{ fontFamily: "Syne,sans-serif" }}>
                {school.schoolName}
              </h1>
              <p className="text-[#00c9a7] text-sm font-medium flex items-center gap-1.5 mb-4">
                <FaMapMarkerAlt className="shrink-0" /> {school.address}
              </p>
              <Stars rating={school.rating} size="lg" />

              {/* Action buttons */}
              <div className="flex flex-wrap gap-3 mt-5 pt-5 border-t border-white/8">
                <button onClick={toggleLike}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all duration-200 ${liked ? "bg-pink-500/20 text-pink-400 border-pink-500/40" : "bg-white/5 text-white/50 border-white/15 hover:border-pink-500/40 hover:text-pink-400"}`}>
                  <FaHeart /> {liked ? "Liked" : "Like"}
                </button>
                <button onClick={toggleSave}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all duration-200 ${saved ? "bg-[#d4af37]/20 text-[#d4af37] border-[#d4af37]/40" : "bg-white/5 text-white/50 border-white/15 hover:border-[#d4af37]/40 hover:text-[#d4af37]"}`}>
                  <FaBookmark /> {saved ? "Saved" : "Save"}
                </button>
                <button onClick={toggleCompare}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all duration-200 ${isInList ? "btn-gold border-[#d4af37]" : "bg-white/5 text-white/50 border-white/15 hover:border-[#d4af37]/40 hover:text-[#d4af37]"}`}>
                  <FaChartBar /> {isInList ? "Added to Compare" : "Compare"}
                </button>
                <button onClick={() => { navigator.clipboard?.writeText(window.location.href); setShowShare(true); setTimeout(() => setShowShare(false), 2000); }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-white/5 text-white/50 border border-white/15 hover:border-white/30 hover:text-white/80 transition-all duration-200">
                  <FaShare /> {showShare ? "Copied!" : "Share"}
                </button>
              </div>
            </motion.div>

            {/* ── Stats ── */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.1 }}>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <StatTile icon={<FaMoneyBillWave />} value={fee} label="Monthly Fee" accent="#d4af37" />
                <StatTile icon={<FaUsers />}          value={school.totalStudents?.toLocaleString()} label="Students" accent="#00c9a7" />
                <StatTile icon={<FaUserTie />}        value={school.totalStaff}  label="Staff"    accent="#a78bfa" />
                <StatTile icon={<FaCalendarAlt />}    value={school.establishedYear} label="Est. Year" accent="#f472b6" />
              </div>
            </motion.div>

            {/* ── Tabs ── */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.15 }}>
              {/* Tab bar */}
              <div className="glass rounded-2xl border border-white/10 overflow-hidden">
                <div className="flex overflow-x-auto border-b border-white/10 scrollbar-hide">
                  {TABS.map((t) => (
                    <Tab key={t.id} active={activeTab === t.id} onClick={() => setActiveTab(t.id)}>{t.label}</Tab>
                  ))}
                </div>

                {/* Tab panels */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25 }}
                    className="p-6"
                  >

                    {/* ── OVERVIEW ── */}
                    {activeTab === "overview" && (
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-white font-bold text-base mb-3 flex items-center gap-2">
                            <FaSchool className="text-[#00c9a7]" /> About
                          </h3>
                          <p className="text-white/60 text-sm leading-relaxed">{school.description}</p>
                        </div>
                        {school.history && (
                          <div>
                            <h3 className="text-white font-bold text-base mb-3 flex items-center gap-2">
                              <FaCalendarAlt className="text-[#d4af37]" /> History
                            </h3>
                            <p className="text-white/60 text-sm leading-relaxed">{school.history}</p>
                          </div>
                        )}
                        {/* Quick info grid */}
                        <div className="grid sm:grid-cols-2 gap-3">
                          {[
                            { label: "Principal",      value: school.principal,    icon: "👤" },
                            { label: "Type",           value: school.typeLabel,    icon: "🏫" },
                            { label: "Timings",        value: school.timings,      icon: "🕐" },
                            { label: "Admission Fee",  value: admFee,              icon: "💳" },
                          ].map((item) => (
                            <div key={item.label} className="bg-white/5 rounded-xl p-3.5 flex items-start gap-3 border border-white/8">
                              <span className="text-lg shrink-0">{item.icon}</span>
                              <div>
                                <div className="text-white/40 text-xs">{item.label}</div>
                                <div className="text-white text-sm font-semibold mt-0.5">{item.value || "—"}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                        {/* Achievements */}
                        {school.achievements?.length > 0 && (
                          <div>
                            <h3 className="text-white font-bold text-base mb-3 flex items-center gap-2">
                              <FaTrophy className="text-[#d4af37]" /> Achievements
                            </h3>
                            <div className="space-y-2">
                              {school.achievements.map((ach, i) => (
                                <div key={i} className="flex items-center gap-3 bg-[#d4af37]/8 border border-[#d4af37]/20 rounded-xl px-4 py-2.5">
                                  <FaCheckCircle className="text-[#d4af37] text-sm shrink-0" />
                                  <span className="text-white/80 text-sm">{ach}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        {/* Compare tags */}
                        {school.compareTags?.length > 0 && (
                          <div>
                            <h3 className="text-white font-bold text-base mb-3">Tags</h3>
                            <div className="flex flex-wrap gap-2">
                              {school.compareTags.map((tag, i) => (
                                <span key={i} className="text-xs bg-[#00c9a7]/10 text-[#00c9a7] border border-[#00c9a7]/25 px-3 py-1 rounded-full">{tag}</span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* ── FACILITIES ── */}
                    {activeTab === "facilities" && (
                      <div>
                        <h3 className="text-white font-bold text-base mb-5 flex items-center gap-2">
                          <FaBuilding className="text-[#00c9a7]" /> Available Facilities
                          <span className="ml-auto text-xs text-white/40 font-normal">{school.facilities?.length || 0} facilities</span>
                        </h3>
                        {school.facilities?.length > 0 ? (
                          <div className="grid sm:grid-cols-2 gap-3">
                            {school.facilities.map((f, i) => (
                              <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: i * 0.04 }}
                                className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3 hover:border-[#00c9a7]/30 hover:bg-[#00c9a7]/5 transition-all duration-200"
                              >
                                <div className="w-2 h-2 rounded-full bg-[#00c9a7] shrink-0" />
                                <span className="text-white/80 text-sm">{f}</span>
                              </motion.div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-white/40 text-sm">No facilities listed.</p>
                        )}
                      </div>
                    )}

                    {/* ── REVIEWS ── */}
                    {activeTab === "reviews" && (
                      <div className="space-y-5">
                        {/* Rating summary */}
                        <div className="flex items-center gap-6 glass rounded-2xl p-5 border border-white/10">
                          <div className="text-center shrink-0">
                            <div className="text-5xl font-extrabold text-white" style={{ fontFamily: "Syne,sans-serif" }}>{school.rating}</div>
                            <Stars rating={school.rating} />
                            <div className="text-white/40 text-xs mt-1">{school.reviews?.length || 0} reviews</div>
                          </div>
                          <div className="flex-1 space-y-1.5">
                            {[5, 4, 3, 2, 1].map((star) => {
                              const count = (school.reviews || []).filter((r) => Math.round(r.rating) === star).length;
                              const pct   = school.reviews?.length ? Math.round((count / school.reviews.length) * 100) : 0;
                              return (
                                <div key={star} className="flex items-center gap-2">
                                  <span className="text-xs text-white/40 w-3">{star}</span>
                                  <FaStar className="text-[#d4af37] text-xs shrink-0" />
                                  <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                    <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.6, delay: 0.2 }}
                                      className="h-full bg-gradient-to-r from-[#d4af37] to-[#00c9a7] rounded-full" />
                                  </div>
                                  <span className="text-xs text-white/40 w-7 text-right">{pct}%</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Individual reviews */}
                        {school.reviews?.length > 0 ? school.reviews.map((rev, i) => (
                          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: i * 0.08 }}
                            className="glass rounded-2xl p-5 border border-white/10 hover:border-white/20 transition-colors">
                            <div className="flex items-start justify-between gap-3 mb-3">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#00c9a7]/30 to-[#d4af37]/20 flex items-center justify-center text-white font-bold text-sm">
                                  {rev.reviewer.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <div className="text-white text-sm font-semibold">{rev.reviewer}</div>
                                  <div className="text-white/35 text-xs">{rev.date}</div>
                                </div>
                              </div>
                              <Stars rating={rev.rating} />
                            </div>
                            <p className="text-white/65 text-sm leading-relaxed">"{rev.comment}"</p>
                          </motion.div>
                        )) : (
                          <p className="text-white/40 text-sm text-center py-8">No reviews yet.</p>
                        )}
                      </div>
                    )}

                    {/* ── CONTACT ── */}
                    {activeTab === "contact" && (
                      <div className="space-y-4">
                        <h3 className="text-white font-bold text-base mb-5 flex items-center gap-2">
                          <FaPhone className="text-[#00c9a7]" /> Contact Information
                        </h3>
                        {[
                          { icon: <FaMapMarkerAlt className="text-[#00c9a7]" />, label: "Address", value: school.address, href: null },
                          { icon: <FaPhone className="text-green-400" />,         label: "Phone",   value: school.contact, href: school.contact ? `tel:${school.contact}` : null },
                          { icon: <FaEnvelope className="text-blue-400" />,       label: "Email",   value: school.email,   href: school.email   ? `mailto:${school.email}` : null },
                          { icon: <FaGlobe className="text-purple-400" />,        label: "Website", value: school.website, href: school.website  ? school.website : null },
                          { icon: <FaClock className="text-[#d4af37]" />,         label: "Timings", value: school.timings, href: null },
                        ].map((item) => (
                          item.value ? (
                            <div key={item.label} className="glass rounded-2xl p-4 border border-white/10 flex items-center gap-4 hover:border-white/20 transition-colors">
                              <div className="w-10 h-10 rounded-xl bg-white/8 flex items-center justify-center text-base shrink-0">{item.icon}</div>
                              <div className="flex-1 min-w-0">
                                <div className="text-white/40 text-xs mb-0.5">{item.label}</div>
                                {item.href ? (
                                  <a href={item.href} target={item.label === "Website" ? "_blank" : "_self"} rel="noreferrer"
                                    className="text-white text-sm font-medium hover:text-[#00c9a7] transition-colors break-all">{item.value}</a>
                                ) : (
                                  <div className="text-white text-sm font-medium">{item.value}</div>
                                )}
                              </div>
                            </div>
                          ) : null
                        ))}

                        {/* Social links */}
                        {(school.socialLinks?.facebook || school.socialLinks?.twitter || school.socialLinks?.instagram) && (
                          <div>
                            <h4 className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-3 mt-2">Social Media</h4>
                            <div className="flex gap-3">
                              {school.socialLinks.facebook && (
                                <a href={school.socialLinks.facebook} target="_blank" rel="noreferrer"
                                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600/20 border border-blue-600/30 text-blue-400 text-xs font-semibold hover:bg-blue-600/30 transition-all">
                                  <FaFacebook /> Facebook
                                </a>
                              )}
                              {school.socialLinks.twitter && (
                                <a href={school.socialLinks.twitter} target="_blank" rel="noreferrer"
                                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-500/20 border border-sky-500/30 text-sky-400 text-xs font-semibold hover:bg-sky-500/30 transition-all">
                                  <FaTwitter /> Twitter
                                </a>
                              )}
                              {school.socialLinks.instagram && (
                                <a href={school.socialLinks.instagram} target="_blank" rel="noreferrer"
                                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-pink-500/20 border border-pink-500/30 text-pink-400 text-xs font-semibold hover:bg-pink-500/30 transition-all">
                                  <FaInstagram /> Instagram
                                </a>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Map placeholder */}
                        <div className="rounded-2xl overflow-hidden border border-white/10 bg-[#0d1f3c] h-48 flex items-center justify-center">
                          <div className="text-center">
                            <FaMapMarkerAlt className="text-[#00c9a7] text-3xl mx-auto mb-2" />
                            <p className="text-white/40 text-xs">
                              {school.locationCoordinates?.lat?.toFixed(4)}, {school.locationCoordinates?.lng?.toFixed(4)}
                            </p>
                            <a
                              href={`https://maps.google.com?q=${school.locationCoordinates?.lat},${school.locationCoordinates?.lng}`}
                              target="_blank" rel="noreferrer"
                              className="inline-block mt-3 btn-teal text-xs px-4 py-2 rounded-lg font-semibold"
                            >
                              Open in Google Maps
                            </a>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

          {/* ══════════════════════════
              RIGHT COLUMN — sidebar
          ══════════════════════════ */}
          <div className="space-y-5">

            {/* ── Fee card ── */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45, delay: 0.1 }}
              className="glass rounded-3xl p-6 border border-[#d4af37]/25 bg-gradient-to-br from-[#d4af37]/5 to-transparent">
              <h3 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
                <FaGraduationCap className="text-[#d4af37]" /> Fee Structure
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-white/50 text-xs">Monthly Fee</span>
                  <span className="text-[#d4af37] font-extrabold text-lg">{fee}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/50 text-xs">Admission Fee</span>
                  <span className="text-white font-bold">{admFee}</span>
                </div>
                <div className="h-px bg-white/10 my-2" />
                <div className="flex items-center justify-between">
                  <span className="text-white/50 text-xs">Board</span>
                  <span className="text-white/80 text-xs font-medium">{school.boardLabel}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/50 text-xs">Medium</span>
                  <span className="text-white/80 text-xs font-medium">{school.medium}</span>
                </div>
              </div>
            </motion.div>

            {/* ── Quick actions ── */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45, delay: 0.15 }}
              className="glass rounded-3xl p-6 border border-white/10 space-y-3">
              <h3 className="text-white font-bold text-sm mb-4">Quick Actions</h3>
              {school.contact && (
                <a href={`tel:${school.contact}`}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-green-500/15 border border-green-500/30 rounded-xl text-green-400 text-sm font-semibold hover:bg-green-500/25 transition-all">
                  <FaPhone className="shrink-0" /> Call School
                </a>
              )}
              {school.email && (
                <a href={`mailto:${school.email}`}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-blue-500/15 border border-blue-500/30 rounded-xl text-blue-400 text-sm font-semibold hover:bg-blue-500/25 transition-all">
                  <FaEnvelope className="shrink-0" /> Send Email
                </a>
              )}
              {school.website && (
                <a href={school.website} target="_blank" rel="noreferrer"
                  className="w-full flex items-center gap-3 px-4 py-3 bg-purple-500/15 border border-purple-500/30 rounded-xl text-purple-400 text-sm font-semibold hover:bg-purple-500/25 transition-all">
                  <FaGlobe className="shrink-0" /> Visit Website
                </a>
              )}
              <button onClick={toggleCompare}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${isInList ? "btn-gold" : "bg-[#d4af37]/15 border border-[#d4af37]/30 text-[#d4af37] hover:bg-[#d4af37]/25"}`}>
                <FaChartBar className="shrink-0" /> {isInList ? "✓ In Compare List" : "Add to Compare"}
              </button>
            </motion.div>

            {/* ── Compare status ── */}
            {compareList.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
                className="glass rounded-3xl p-5 border border-[#00c9a7]/25">
                <p className="text-white/60 text-xs font-semibold mb-3">Compare List ({compareList.length}/2)</p>
                <div className="space-y-2">
                  {compareList.map((s) => (
                    <div key={s.id} className="flex items-center gap-2 text-xs text-white/70">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#00c9a7] shrink-0" />
                      <span className="truncate">{s.schoolName}</span>
                    </div>
                  ))}
                </div>
                {compareList.length === 2 && (
                  <Link to={`/compare?a=${compareList[0].id}&b=${compareList[1].id}`}
                    className="w-full mt-4 btn-gold py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2">
                    <FaChartBar /> Compare Now
                  </Link>
                )}
              </motion.div>
            )}

            {/* ── Similar schools ── */}
            {similarSchools.length > 0 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45, delay: 0.2 }}
                className="glass rounded-3xl p-6 border border-white/10">
                <h3 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
                  <FaMapMarkerAlt className="text-[#00c9a7]" /> Also in {school.areaLabel}
                </h3>
                <div className="space-y-3">
                  {similarSchools.map((s) => (
                    <Link key={s.id} to={`/school/${s.slug}`}
                      className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all duration-200 group">
                      <div className="w-10 h-10 rounded-xl overflow-hidden bg-[#0d1f3c] shrink-0">
                        <img src={s.images[0]} alt={s.schoolName} className="w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity" onError={(e) => { e.target.style.display="none"; }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-white text-xs font-semibold leading-tight line-clamp-2 group-hover:text-[#00c9a7] transition-colors">{s.schoolName}</div>
                        <div className="flex items-center gap-1 mt-1">
                          <Stars rating={s.rating} />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* ── Back to Finder ── */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.4 }} className="mt-10 flex justify-center">
          <button onClick={() => navigate(-1)}
            className="flex items-center gap-2 glass px-6 py-3 rounded-xl border border-white/15 text-white/60 hover:text-white hover:border-white/30 text-sm font-medium transition-all">
            <FaArrowLeft /> Go Back
          </button>
        </motion.div>
      </div>
    </div>
  );
}