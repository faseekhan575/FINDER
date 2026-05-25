// ============================================================
// Finder.jsx — School Finder with Sub-Area Step
// Place in: src/Finder.jsx
// Changes from original:
//   1. Added "subarea" step after Muridke area selection
//   2. Shows all 10 Muridke localities from areasData (all unlocked)
//   3. "Details" button now links to /school/:slug
//   4. Compare bar links preserved
// ============================================================

import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaMapMarkerAlt, FaLock, FaSearch, FaFilter,
  FaStar, FaHeart, FaBookmark, FaChartBar, FaTimes, FaArrowLeft,
  FaSortAmountDown, FaChevronDown, FaLayerGroup,
} from "react-icons/fa";
import { schoolsData, areasData } from "./alldata";
import Navbar from "./Navbar";

/* ─── Loading messages ─── */
const LOADING_MSGS = [
  "Fetching educational records...",
  "Connecting to school database...",
  "Collecting nearby schools...",
  "Preparing recommendations...",
  "Analysing ratings...",
  "Almost ready...",
];

/* ─── Cities ─── */
const CITIES = [
  { name: "Lahore",      locked: false, emoji: "✅" },
  { name: "Karachi",     locked: true,  emoji: "🔒" },
  { name: "Islamabad",   locked: true,  emoji: "🔒" },
  { name: "Rawalpindi",  locked: true,  emoji: "🔒" },
  { name: "Faisalabad",  locked: true,  emoji: "🔒" },
  { name: "Multan",      locked: true,  emoji: "🔒" },
  { name: "Gujranwala",  locked: true,  emoji: "🔒" },
  { name: "Peshawar",    locked: true,  emoji: "🔒" },
];

/* ─── Lahore Areas ─── */
const LAHORE_AREAS = [
  { name: "Muridke",     locked: false, emoji: "🔓" },
  { name: "Shahdara",    locked: true,  emoji: "🔒" },
  { name: "Johar Town",  locked: true,  emoji: "🔒" },
  { name: "DHA",         locked: true,  emoji: "🔒" },
  { name: "Gulberg",     locked: true,  emoji: "🔒" },
  { name: "Model Town",  locked: true,  emoji: "🔒" },
  { name: "Bahria Town", locked: true,  emoji: "🔒" },
  { name: "Cantt",       locked: true,  emoji: "🔒" },
];

/* ─── Area icon map ─── */
const AREA_ICONS = {
  "muridke-city-centre": "🏙️",
  "gt-road-area":        "🛣️",
  "chand-bagh":          "🌿",
  "narang-mandi":        "🏪",
  "kala-shah-kaku":      "⚙️",
  "nangal-sahdan":       "🌾",
  "sahuki-mallian":      "🏡",
  "muridke-industrial":  "🏭",
  "chattha-town":        "🏘️",
  "model-town-muridke":  "🏗️",
};

/* ─── Filter config ─── */
const CATEGORY_FILTERS = [
  { label: "Government",  value: "government",      color: "bg-blue-500/20 text-blue-400 border-blue-500/40"   },
  { label: "Private",     value: "private",         color: "bg-green-500/20 text-green-400 border-green-500/40" },
  { label: "Semi-Govt",   value: "semi-government", color: "bg-teal-500/20 text-teal-400 border-teal-500/40"   },
  { label: "Islamic",     value: "islamic-madrassa",color: "bg-amber-500/20 text-amber-400 border-amber-500/40"},
];
const GENDER_FILTERS = [
  { label: "Boys",  value: "boys",  color: "bg-sky-500/20 text-sky-400 border-sky-500/40"    },
  { label: "Girls", value: "girls", color: "bg-pink-500/20 text-pink-400 border-pink-500/40" },
  { label: "Co-Ed", value: "co-ed", color: "bg-purple-500/20 text-purple-400 border-purple-500/40" },
];
const SORT_OPTIONS = [
  { label: "Highest Rated", value: "rating-desc" },
  { label: "Lowest Fees",   value: "fee-asc"     },
  { label: "Highest Fees",  value: "fee-desc"    },
  { label: "Newest First",  value: "year-desc"   },
  { label: "Name A–Z",      value: "name-asc"    },
];

/* ─── Stars ─── */
function Stars({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <FaStar key={n} className={`text-xs ${n <= Math.round(rating) ? "text-[#d4af37]" : "text-white/20"}`} />
      ))}
      <span className="ml-1 text-xs text-white/60">{rating}</span>
    </div>
  );
}

function getCatColor(cat) {
  const map = {
    government:        "bg-blue-500/20 text-blue-400",
    private:           "bg-green-500/20 text-green-400",
    "semi-government": "bg-teal-500/20 text-teal-400",
    "islamic-madrassa":"bg-amber-500/20 text-amber-400",
    "boarding-school": "bg-purple-500/20 text-purple-400",
    college:           "bg-orange-500/20 text-orange-400",
  };
  return map[cat] || "bg-white/10 text-white/60";
}

function getGenderColor(g) {
  return { boys: "text-sky-400", girls: "text-pink-400", "co-ed": "text-purple-400" }[g] || "text-white/50";
}

/* ─── School Card ─── */
function SchoolCard({ school, onCompare, liked, saved, onLike, onSave }) {
  const fee = school.monthlyFee === 0 ? "Free" : `Rs ${school.monthlyFee.toLocaleString()}/mo`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="glass rounded-2xl overflow-hidden border border-white/10 card-lift group"
    >
      {/* Image */}
      <div className="relative h-44 overflow-hidden bg-gradient-to-br from-[#0d1f3c] to-[#162845]">
        <img
          src={school.images[0]}
          alt={school.schoolName}
          className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
          onError={(e) => { e.target.style.display = "none"; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070d1a] via-transparent to-transparent" />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className={`badge ${getCatColor(school.category)}`}>{school.categoryLabel}</span>
          <span className={`badge bg-white/10 ${getGenderColor(school.genderType)}`}>{school.genderType}</span>
        </div>
        <div className="absolute top-3 right-3 flex gap-2">
          <button
            onClick={() => onLike(school.id)}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${liked ? "bg-pink-500 text-white shadow-lg shadow-pink-500/30" : "bg-black/40 text-white/60 hover:bg-pink-500/30 hover:text-pink-400"}`}
          >
            <FaHeart className="text-xs" />
          </button>
          <button
            onClick={() => onSave(school.id)}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${saved ? "bg-[#d4af37] text-[#070d1a] shadow-lg shadow-[#d4af37]/30" : "bg-black/40 text-white/60 hover:bg-[#d4af37]/30 hover:text-[#d4af37]"}`}
          >
            <FaBookmark className="text-xs" />
          </button>
        </div>
        <div className="absolute bottom-3 left-3">
          <Stars rating={school.rating} />
        </div>
      </div>

      {/* Body */}
      <div className="p-5">
        <h3 className="font-bold text-white text-base leading-tight mb-1 line-clamp-2" style={{ fontFamily: "Syne,sans-serif" }}>
          {school.schoolName}
        </h3>
        <p className="text-[#00c9a7] text-xs font-medium mb-3 flex items-center gap-1">
          <FaMapMarkerAlt className="shrink-0" /> {school.areaLabel}
        </p>
        <p className="text-white/50 text-xs leading-relaxed mb-4 line-clamp-2">{school.description}</p>

        {/* Details grid */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="bg-white/5 rounded-lg p-2.5 text-center">
            <div className="text-[#d4af37] font-bold text-sm">{fee}</div>
            <div className="text-white/40 text-xs">Monthly Fee</div>
          </div>
          <div className="bg-white/5 rounded-lg p-2.5 text-center">
            <div className="text-white font-bold text-sm">{school.totalStudents.toLocaleString()}</div>
            <div className="text-white/40 text-xs">Students</div>
          </div>
        </div>

        {/* Facilities */}
        {school.facilities?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {school.facilities.slice(0, 3).map((f, i) => (
              <span key={i} className="text-xs bg-white/8 text-white/50 px-2 py-0.5 rounded-md border border-white/10">{f}</span>
            ))}
            {school.facilities.length > 3 && (
              <span className="text-xs text-white/30 px-2 py-0.5">+{school.facilities.length - 3} more</span>
            )}
          </div>
        )}

        {/* Address */}
        <p className="text-white/35 text-xs mb-4 truncate flex items-center gap-1">
          <FaMapMarkerAlt className="shrink-0 text-[10px]" /> {school.address}
        </p>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => onCompare(school)}
            className="flex-1 flex items-center justify-center gap-1.5 btn-gold py-2.5 rounded-xl text-xs font-bold"
          >
            <FaChartBar /> Compare
          </button>
          {/* ← Updated: now links to /school/:slug */}
          <Link
            to={`/school/${school.slug}`}
            className="flex-1 flex items-center justify-center gap-1.5 btn-teal py-2.5 rounded-xl text-xs font-semibold"
          >
            Details
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Loading Screen ─── */
function LoadingScreen({ onDone }) {
  const [msgIdx, setMsgIdx]   = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const msgTimer  = setInterval(() => setMsgIdx((p) => (p < LOADING_MSGS.length - 1 ? p + 1 : p)), 550);
    const progTimer = setInterval(() => setProgress((p) => { if (p >= 100) { clearInterval(progTimer); return 100; } return p + 2.5; }), 90);
    const doneTimer = setTimeout(onDone, 3600);
    return () => { clearInterval(msgTimer); clearInterval(progTimer); clearTimeout(doneTimer); };
  }, [onDone]);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#070d1a]"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#0d1f3c]/50 via-[#070d1a] to-[#0a2240]/50" />
      <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-[#00c9a7]/10 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-[#d4af37]/10 blur-3xl" />
      <div className="relative z-10 text-center max-w-sm px-6">
        <div className="relative w-24 h-24 mx-auto mb-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#00c9a7] border-r-[#00c9a7]/50"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
            className="absolute inset-2 rounded-full border-2 border-transparent border-t-[#d4af37] border-l-[#d4af37]/50"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl">🏫</span>
          </div>
        </div>
        <AnimatePresence mode="wait">
          <motion.p
            key={msgIdx}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35 }}
            className="text-[#00c9a7] text-base font-medium mb-8"
          >
            {LOADING_MSGS[msgIdx]}
          </motion.p>
        </AnimatePresence>
        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mb-3">
          <motion.div
            className="h-full bg-gradient-to-r from-[#00c9a7] to-[#d4af37] rounded-full"
            initial={{ width: "0%" }} animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
        </div>
        <p className="text-white/30 text-xs">{Math.round(progress)}% complete</p>
      </div>
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════
   MAIN FINDER
════════════════════════════════════════════════════════ */
export default function Finder() {
  // Steps: form → city → area → subarea → loading → results
  const [step, setStep]                     = useState("form");
  const [formData, setFormData]             = useState({ name: "", phone: "" });
  const [formErrors, setFormErrors]         = useState({});
  const [selectedCity, setSelectedCity]     = useState(null);
  const [selectedMuridkeArea, setSelectedMuridkeArea] = useState("all");
  const [search, setSearch]                 = useState("");
  const [categoryFilter, setCategoryFilter] = useState([]);
  const [genderFilter, setGenderFilter]     = useState([]);
  const [sortBy, setSortBy]                 = useState("rating-desc");
  const [highRated, setHighRated]           = useState(false);
  const [lowFee, setLowFee]                 = useState(false);
  const [compareList, setCompareList]       = useState([]);
  const [liked, setLiked]                   = useState(() => JSON.parse(localStorage.getItem("likedSchools") || "[]"));
  const [saved, setSaved]                   = useState(() => JSON.parse(localStorage.getItem("savedSchools") || "[]"));
  const [showCompareBar, setShowCompareBar] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  useEffect(() => { localStorage.setItem("likedSchools", JSON.stringify(liked)); window.dispatchEvent(new Event("likedUpdate")); }, [liked]);
  useEffect(() => { localStorage.setItem("savedSchools", JSON.stringify(saved)); }, [saved]);

  /* Compute school count per area for sub-area cards */
  const schoolCountByArea = areasData.reduce((acc, area) => {
    acc[area.slug] = schoolsData.filter((s) => s.area === area.slug).length;
    return acc;
  }, {});

  /* Form validation */
  const validateForm = () => {
    const errs = {};
    if (!formData.name.trim() || formData.name.trim().length < 3) errs.name = "Please enter your full name (min 3 chars)";
    if (!formData.phone.trim() || !/^[0-9+\-\s]{10,15}$/.test(formData.phone.trim())) errs.phone = "Please enter a valid phone number";
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleFormSubmit   = (e) => { e.preventDefault(); if (validateForm()) setStep("city"); };
  const handleCitySelect   = (city)  => { if (city.locked) return; setSelectedCity(city.name); setStep("area"); };
  const handleAreaSelect   = (area)  => { if (area.locked) return; setStep("subarea"); }; // ← go to subarea
  const handleSubAreaSelect = (slug) => { setSelectedMuridkeArea(slug); setStep("loading"); }; // ← new handler
  const handleLoadingDone  = useCallback(() => setStep("results"), []);

  /* Filter & sort */
  const filteredSchools = (() => {
    let list = [...schoolsData];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((s) =>
        s.schoolName.toLowerCase().includes(q) ||
        s.areaLabel.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.keywords.some((k) => k.includes(q))
      );
    }
    if (selectedMuridkeArea !== "all") list = list.filter((s) => s.area === selectedMuridkeArea);
    if (categoryFilter.length > 0)     list = list.filter((s) => categoryFilter.includes(s.category));
    if (genderFilter.length > 0)       list = list.filter((s) => genderFilter.includes(s.genderType));
    if (highRated)                     list = list.filter((s) => s.rating >= 4);
    if (lowFee)                        list = list.filter((s) => s.monthlyFee <= 3000);
    list.sort((a, b) => {
      if (sortBy === "rating-desc") return b.rating - a.rating;
      if (sortBy === "fee-asc")     return a.monthlyFee - b.monthlyFee;
      if (sortBy === "fee-desc")    return b.monthlyFee - a.monthlyFee;
      if (sortBy === "year-desc")   return b.establishedYear - a.establishedYear;
      if (sortBy === "name-asc")    return a.schoolName.localeCompare(b.schoolName);
      return 0;
    });
    return list;
  })();

  const toggleFilter  = (arr, setArr, val) => setArr((p) => p.includes(val) ? p.filter((x) => x !== val) : [...p, val]);
  const toggleLike    = (id) => setLiked((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]);
  const toggleSave    = (id) => setSaved((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]);
  const toggleCompare = (school) => {
    setCompareList((p) => {
      if (p.find((s) => s.id === school.id)) return p.filter((s) => s.id !== school.id);
      if (p.length >= 2) return [p[1], school];
      return [...p, school];
    });
    setShowCompareBar(true);
  };
  const clearFilters = () => { setSearch(""); setCategoryFilter([]); setGenderFilter([]); setHighRated(false); setLowFee(false); setSelectedMuridkeArea("all"); };

  /* Selected area label for results header */
  const selectedAreaLabel = selectedMuridkeArea === "all"
    ? "Muridke"
    : areasData.find((a) => a.slug === selectedMuridkeArea)?.name || "Muridke";

  /* ══════════════════════ RENDER ══════════════════════ */
  return (
    <div className="min-h-screen bg-[#070d1a]">
      <Navbar />
      <AnimatePresence mode="wait">
        {step === "loading" && <LoadingScreen key="loading" onDone={handleLoadingDone} />}
      </AnimatePresence>

      {step !== "loading" && (
        <div className="pt-20 pb-16 px-4 max-w-7xl mx-auto">

          {/* ══ STEP: FORM ══ */}
          {step === "form" && (
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-lg mx-auto mt-10">
              <div className="text-center mb-10">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00c9a7] to-[#d4af37] flex items-center justify-center text-white text-3xl mx-auto mb-5 shadow-2xl shadow-[#00c9a7]/30">🏫</div>
                <h1 className="text-3xl font-extrabold text-white mb-2" style={{ fontFamily: "Syne,sans-serif" }}>Let's Get Started</h1>
                <p className="text-white/50 text-sm">Tell us who you are so we can personalise your school search.</p>
              </div>
              <form onSubmit={handleFormSubmit} className="glass rounded-3xl p-8 border border-white/10 space-y-5">
                <div>
                  <label className="text-white/70 text-sm font-medium block mb-2">Full Name</label>
                  <input type="text" placeholder="e.g. Ahmad Raza Khan" value={formData.name} onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))} className="input-dark w-full px-4 py-3 text-sm" />
                  {formErrors.name && <p className="text-red-400 text-xs mt-1">{formErrors.name}</p>}
                </div>
                <div>
                  <label className="text-white/70 text-sm font-medium block mb-2">Phone Number</label>
                  <input type="tel" placeholder="e.g. 0300-1234567" value={formData.phone} onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))} className="input-dark w-full px-4 py-3 text-sm" />
                  {formErrors.phone && <p className="text-red-400 text-xs mt-1">{formErrors.phone}</p>}
                </div>
                <button type="submit" className="btn-teal w-full py-3.5 rounded-xl font-bold text-base flex items-center justify-center gap-2">
                  <FaMapMarkerAlt /> Continue to City Selection
                </button>
              </form>
            </motion.div>
          )}

          {/* ══ STEP: CITY ══ */}
          {step === "city" && (
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-2xl mx-auto mt-10">
              <div className="text-center mb-10">
                <h1 className="text-3xl font-extrabold text-white mb-2" style={{ fontFamily: "Syne,sans-serif" }}>
                  Hi, <span className="gold-text">{formData.name.split(" ")[0]}!</span>
                </h1>
                <p className="text-white/50 text-sm">Select your city to discover schools near you.</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {CITIES.map((city, i) => (
                  <button key={i} onClick={() => handleCitySelect(city)}
                    className={`relative glass rounded-2xl p-5 border text-center transition-all duration-300 ${city.locked ? "locked-item border-white/10 cursor-not-allowed" : "border-[#00c9a7]/40 hover:border-[#00c9a7] hover:bg-[#00c9a7]/10 cursor-pointer"}`}>
                    <div className="text-3xl mb-2">{city.emoji}</div>
                    <div className={`font-bold text-sm ${city.locked ? "text-white/40" : "text-white"}`}>{city.name}</div>
                    {city.locked && <div className="text-[10px] text-white/30 mt-1">Coming Soon</div>}
                    {city.locked && <div className="absolute top-2 right-2"><FaLock className="text-white/20 text-xs" /></div>}
                  </button>
                ))}
              </div>
              <button onClick={() => setStep("form")} className="mt-8 flex items-center gap-2 text-white/40 hover:text-white/70 text-sm transition-colors mx-auto">
                <FaArrowLeft /> Back
              </button>
            </motion.div>
          )}

          {/* ══ STEP: AREA (Lahore sub-area) ══ */}
          {step === "area" && (
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-2xl mx-auto mt-10">
              <div className="text-center mb-10">
                <span className="badge bg-[#00c9a7]/15 text-[#00c9a7] border border-[#00c9a7]/30 mb-4 inline-block">Lahore</span>
                <h1 className="text-3xl font-extrabold text-white mb-2" style={{ fontFamily: "Syne,sans-serif" }}>Select Your Area</h1>
                <p className="text-white/50 text-sm">Currently available: Muridke. More areas coming soon.</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {LAHORE_AREAS.map((area, i) => (
                  <button key={i} onClick={() => handleAreaSelect(area)}
                    className={`relative glass rounded-2xl p-5 border text-center transition-all duration-300 ${area.locked ? "locked-item border-white/10 cursor-not-allowed" : "border-[#00c9a7]/40 hover:border-[#00c9a7] hover:bg-[#00c9a7]/10 cursor-pointer"}`}>
                    <div className="text-3xl mb-2">{area.emoji}</div>
                    <div className={`font-bold text-sm ${area.locked ? "text-white/40" : "text-white"}`}>{area.name}</div>
                    {area.locked && <div className="text-[10px] text-white/30 mt-1">Coming Soon</div>}
                    {area.locked && <div className="absolute top-2 right-2"><FaLock className="text-white/20 text-xs" /></div>}
                  </button>
                ))}
              </div>
              <button onClick={() => setStep("city")} className="mt-8 flex items-center gap-2 text-white/40 hover:text-white/70 text-sm transition-colors mx-auto">
                <FaArrowLeft /> Back to Cities
              </button>
            </motion.div>
          )}

          {/* ══ STEP: SUBAREA (NEW — All localities within Muridke) ══ */}
          {step === "subarea" && (
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-3xl mx-auto mt-10">
              {/* Header */}
              <div className="text-center mb-10">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <span className="badge bg-[#00c9a7]/15 text-[#00c9a7] border border-[#00c9a7]/30">Lahore</span>
                  <span className="text-white/30 text-xs">›</span>
                  <span className="badge bg-[#d4af37]/15 text-[#d4af37] border border-[#d4af37]/30">Muridke</span>
                </div>
                <h1 className="text-3xl font-extrabold text-white mb-2" style={{ fontFamily: "Syne,sans-serif" }}>
                  Choose a <span className="gold-text">Locality</span>
                </h1>
                <p className="text-white/50 text-sm">
                  Pick a specific area within Muridke, or browse all {schoolsData.length} schools at once.
                </p>
              </div>

              {/* All Muridke card — full width */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => handleSubAreaSelect("all")}
                className="w-full glass rounded-2xl p-5 border border-[#00c9a7]/50 hover:border-[#00c9a7] hover:bg-[#00c9a7]/8 transition-all duration-300 flex items-center gap-5 mb-5 group"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#00c9a7]/30 to-[#d4af37]/20 flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition-transform duration-300">
                  🗺️
                </div>
                <div className="text-left flex-1">
                  <div className="font-extrabold text-white text-lg" style={{ fontFamily: "Syne,sans-serif" }}>All Muridke</div>
                  <div className="text-white/50 text-xs mt-0.5">Browse all localities · {schoolsData.length} schools available</div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="badge bg-[#00c9a7]/20 text-[#00c9a7] border border-[#00c9a7]/40 text-sm font-bold px-3 py-1">
                    {schoolsData.length} schools
                  </span>
                  <FaLayerGroup className="text-[#00c9a7] text-lg" />
                </div>
              </motion.button>

              {/* Individual locality grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {areasData.map((area, i) => {
                  const count = schoolCountByArea[area.slug] || 0;
                  const icon  = AREA_ICONS[area.slug] || "📍";
                  return (
                    <motion.button
                      key={area.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: i * 0.05 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSubAreaSelect(area.slug)}
                      className="glass rounded-2xl p-4 border border-white/15 hover:border-[#d4af37]/50 hover:bg-[#d4af37]/5 transition-all duration-300 flex items-center gap-4 text-left group"
                    >
                      {/* Icon bubble */}
                      <div className="w-12 h-12 rounded-xl bg-white/8 flex items-center justify-center text-xl shrink-0 group-hover:bg-[#d4af37]/15 transition-colors duration-300">
                        {icon}
                      </div>
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-white text-sm leading-tight truncate">{area.name}</div>
                        <div className="text-white/40 text-xs mt-0.5 truncate">{area.description}</div>
                      </div>
                      {/* Count badge */}
                      <div className="shrink-0">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${count > 0 ? "bg-[#d4af37]/20 text-[#d4af37]" : "bg-white/10 text-white/30"}`}>
                          {count} {count === 1 ? "school" : "schools"}
                        </span>
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              <button onClick={() => setStep("area")} className="mt-8 flex items-center gap-2 text-white/40 hover:text-white/70 text-sm transition-colors mx-auto">
                <FaArrowLeft /> Back to Areas
              </button>
            </motion.div>
          )}

          {/* ══ STEP: RESULTS ══ */}
          {step === "results" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white" style={{ fontFamily: "Syne,sans-serif" }}>
                    Schools in <span className="gold-text">{selectedAreaLabel}</span>
                  </h1>
                  <p className="text-white/50 text-sm mt-1">{filteredSchools.length} schools found</p>
                </div>
                <button onClick={() => setStep("subarea")} className="flex items-center gap-2 text-white/40 hover:text-white/70 text-sm transition-colors">
                  <FaArrowLeft /> Change Locality
                </button>
              </div>

              <div className="flex flex-col lg:flex-row gap-6">
                {/* ── Sidebar Filters ── */}
                <aside className="lg:w-64 shrink-0">
                  <div className="glass rounded-2xl p-5 border border-white/10 sticky top-20">
                    <div className="flex items-center justify-between mb-5">
                      <span className="font-bold text-white text-sm flex items-center gap-2"><FaFilter className="text-[#00c9a7]" /> Filters</span>
                      <button onClick={clearFilters} className="text-xs text-white/40 hover:text-[#00c9a7] transition-colors">Clear All</button>
                    </div>
                    {/* Search */}
                    <div className="relative mb-5">
                      <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-xs" />
                      <input type="text" placeholder="Search schools..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-dark w-full pl-8 pr-3 py-2.5 text-xs" />
                    </div>
                    {/* Area */}
                    <div className="mb-5">
                      <p className="text-white/50 text-xs font-semibold mb-2 uppercase tracking-wider">Locality</p>
                      <select value={selectedMuridkeArea} onChange={(e) => setSelectedMuridkeArea(e.target.value)} className="input-dark w-full px-3 py-2.5 text-xs appearance-none">
                        <option value="all">All Localities</option>
                        {areasData.map((a) => <option key={a.id} value={a.slug}>{a.name}</option>)}
                      </select>
                    </div>
                    {/* Category */}
                    <div className="mb-5">
                      <p className="text-white/50 text-xs font-semibold mb-2 uppercase tracking-wider">Category</p>
                      <div className="space-y-2">
                        {CATEGORY_FILTERS.map((f) => (
                          <button key={f.value} onClick={() => toggleFilter(categoryFilter, setCategoryFilter, f.value)}
                            className={`w-full text-left px-3 py-2 rounded-lg border text-xs font-medium transition-all ${categoryFilter.includes(f.value) ? f.color + " border-opacity-80" : "border-white/10 text-white/50 hover:border-white/30"}`}>
                            {categoryFilter.includes(f.value) ? "✓ " : ""}{f.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    {/* Gender */}
                    <div className="mb-5">
                      <p className="text-white/50 text-xs font-semibold mb-2 uppercase tracking-wider">Gender</p>
                      <div className="space-y-2">
                        {GENDER_FILTERS.map((f) => (
                          <button key={f.value} onClick={() => toggleFilter(genderFilter, setGenderFilter, f.value)}
                            className={`w-full text-left px-3 py-2 rounded-lg border text-xs font-medium transition-all ${genderFilter.includes(f.value) ? f.color + " border-opacity-80" : "border-white/10 text-white/50 hover:border-white/30"}`}>
                            {genderFilter.includes(f.value) ? "✓ " : ""}{f.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    {/* Quick */}
                    <div className="space-y-2">
                      <p className="text-white/50 text-xs font-semibold mb-2 uppercase tracking-wider">Quick</p>
                      <button onClick={() => setHighRated((p) => !p)}
                        className={`w-full text-left px-3 py-2 rounded-lg border text-xs font-medium transition-all ${highRated ? "bg-[#d4af37]/20 text-[#d4af37] border-[#d4af37]/50" : "border-white/10 text-white/50 hover:border-white/30"}`}>
                        {highRated ? "✓ " : ""}⭐ High Rated (4+)
                      </button>
                      <button onClick={() => setLowFee((p) => !p)}
                        className={`w-full text-left px-3 py-2 rounded-lg border text-xs font-medium transition-all ${lowFee ? "bg-green-500/20 text-green-400 border-green-500/50" : "border-white/10 text-white/50 hover:border-white/30"}`}>
                        {lowFee ? "✓ " : ""}💰 Low Fees (≤3000)
                      </button>
                    </div>
                  </div>
                </aside>

                {/* ── School Grid ── */}
                <div className="flex-1">
                  {/* Sort bar */}
                  <div className="flex items-center justify-between mb-5">
                    <p className="text-white/50 text-sm">{filteredSchools.length} results</p>
                    <div className="relative">
                      <button onClick={() => setShowSortDropdown((p) => !p)}
                        className="flex items-center gap-2 glass px-4 py-2 rounded-xl border border-white/15 text-xs text-white/70 hover:text-white hover:border-white/30 transition-all">
                        <FaSortAmountDown className="text-[#00c9a7]" />
                        {SORT_OPTIONS.find((o) => o.value === sortBy)?.label}
                        <FaChevronDown className="text-[10px]" />
                      </button>
                      <AnimatePresence>
                        {showSortDropdown && (
                          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.15 }}
                            className="absolute right-0 top-full mt-2 w-48 glass border border-white/15 rounded-xl overflow-hidden z-30">
                            {SORT_OPTIONS.map((o) => (
                              <button key={o.value} onClick={() => { setSortBy(o.value); setShowSortDropdown(false); }}
                                className={`w-full text-left px-4 py-2.5 text-xs transition-colors ${sortBy === o.value ? "text-[#00c9a7] bg-[#00c9a7]/10" : "text-white/60 hover:text-white hover:bg-white/8"}`}>
                                {o.label}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {filteredSchools.length === 0 ? (
                    <div className="text-center py-24">
                      <div className="text-5xl mb-4">🔍</div>
                      <p className="text-white/50 text-lg font-medium">No schools found</p>
                      <p className="text-white/30 text-sm mt-2">Try adjusting your filters</p>
                      <button onClick={clearFilters} className="mt-4 btn-teal px-5 py-2 rounded-xl text-sm font-medium">Clear Filters</button>
                    </div>
                  ) : (
                    <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                      <AnimatePresence>
                        {filteredSchools.map((school) => (
                          <SchoolCard key={school.id} school={school} onCompare={toggleCompare}
                            liked={liked.includes(school.id)} saved={saved.includes(school.id)}
                            onLike={toggleLike} onSave={toggleSave} />
                        ))}
                      </AnimatePresence>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* ══ Compare Bar ══ */}
      <AnimatePresence>
        {showCompareBar && compareList.length > 0 && (
          <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }} transition={{ duration: 0.3 }}
            className="fixed bottom-0 left-0 right-0 z-40 glass border-t border-white/15 px-4 py-4 shadow-2xl">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center gap-4">
              <div className="flex gap-3 flex-1 flex-wrap">
                {compareList.map((s) => (
                  <div key={s.id} className="flex items-center gap-2 bg-white/8 border border-white/15 rounded-xl px-3 py-2">
                    <span className="text-white text-xs font-medium truncate max-w-[140px]">{s.schoolName}</span>
                    <button onClick={() => setCompareList((p) => p.filter((x) => x.id !== s.id))} className="text-white/40 hover:text-white/80 transition-colors">
                      <FaTimes className="text-[10px]" />
                    </button>
                  </div>
                ))}
                {compareList.length === 1 && (
                  <div className="flex items-center gap-2 border border-dashed border-white/20 rounded-xl px-3 py-2">
                    <span className="text-white/30 text-xs">+ Add 1 more</span>
                  </div>
                )}
              </div>
              <div className="flex gap-3">
                {compareList.length === 2 && (
                  <Link to={`/compare?a=${compareList[0].id}&b=${compareList[1].id}`}
                    className="btn-gold px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2">
                    <FaChartBar /> Compare Now
                  </Link>
                )}
                <button onClick={() => { setCompareList([]); setShowCompareBar(false); }}
                  className="px-4 py-2.5 rounded-xl border border-white/20 text-white/60 hover:text-white text-sm transition-all">
                  Clear
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}