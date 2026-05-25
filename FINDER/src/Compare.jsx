// Compare.jsx
import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaChartBar, FaStar, FaCheckCircle, FaTimesCircle, FaArrowLeft,
  FaMoneyBillWave, FaUsers, FaUserTie, FaTrophy, FaBuilding,
  FaMapMarkerAlt, FaPhone, FaCalendarAlt, FaGraduationCap, FaSearch
} from "react-icons/fa";
import { schoolsData } from "./alldata";
import Navbar from "./Navbar";

function Stars({ rating, big = false }) {
  return (
    <div className={`flex items-center gap-${big ? "1" : "0.5"}`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <FaStar key={n} className={`${big ? "text-base" : "text-xs"} ${n <= Math.round(rating) ? "text-[#d4af37]" : "text-white/20"}`} />
      ))}
      <span className={`ml-1 font-bold ${big ? "text-[#d4af37] text-lg" : "text-white/60 text-xs"}`}>{rating}</span>
    </div>
  );
}

function WinnerBadge({ label }) {
  return (
    <span className="inline-flex items-center gap-1 bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/40 rounded-full px-2.5 py-0.5 text-xs font-bold">
      <FaTrophy className="text-[10px]" /> {label}
    </span>
  );
}

function CompareRow({ label, valA, valB, higherIsBetter = true, isCurrency = false, isList = false }) {
  let winA = false, winB = false;
  if (!isList && typeof valA === "number" && typeof valB === "number") {
    if (higherIsBetter) { winA = valA > valB; winB = valB > valA; }
    else { winA = valA < valB; winB = valB < valA; }
  }
  const fmt = (v) => {
    if (typeof v === "number") {
      if (isCurrency) return v === 0 ? "Free" : `Rs ${v.toLocaleString()}`;
      return v.toLocaleString();
    }
    return v;
  };

  return (
    <div className="grid grid-cols-3 gap-3 items-center py-3 border-b border-white/8">
      <div className="text-white/40 text-xs text-center">{label}</div>
      <div className={`text-center rounded-xl px-2 py-2 ${winA ? "bg-[#00c9a7]/15 border border-[#00c9a7]/30" : "bg-white/4"}`}>
        {isList ? (
          <div className="space-y-1">
            {(valA || []).slice(0, 4).map((f, i) => (
              <div key={i} className="text-xs text-white/70 flex items-center gap-1 justify-center">
                <FaCheckCircle className="text-[#00c9a7] text-[9px] shrink-0" />{f}
              </div>
            ))}
            {(valA || []).length > 4 && <div className="text-[10px] text-white/30">+{valA.length - 4} more</div>}
          </div>
        ) : (
          <span className={`font-bold text-sm ${winA ? "text-[#00c9a7]" : "text-white/80"}`}>{fmt(valA)}</span>
        )}
        {winA && <div className="mt-1"><WinnerBadge label="Better" /></div>}
      </div>
      <div className={`text-center rounded-xl px-2 py-2 ${winB ? "bg-[#00c9a7]/15 border border-[#00c9a7]/30" : "bg-white/4"}`}>
        {isList ? (
          <div className="space-y-1">
            {(valB || []).slice(0, 4).map((f, i) => (
              <div key={i} className="text-xs text-white/70 flex items-center gap-1 justify-center">
                <FaCheckCircle className="text-[#00c9a7] text-[9px] shrink-0" />{f}
              </div>
            ))}
            {(valB || []).length > 4 && <div className="text-[10px] text-white/30">+{valB.length - 4} more</div>}
          </div>
        ) : (
          <span className={`font-bold text-sm ${winB ? "text-[#00c9a7]" : "text-white/80"}`}>{fmt(valB)}</span>
        )}
        {winB && <div className="mt-1"><WinnerBadge label="Better" /></div>}
      </div>
    </div>
  );
}

function SchoolSelector({ label, selected, onSelect, exclude }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const results = query.length > 1
    ? schoolsData.filter((s) => s.id !== exclude && s.schoolName.toLowerCase().includes(query.toLowerCase())).slice(0, 8)
    : [];

  return (
    <div className="relative">
      <p className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-2">{label}</p>
      {selected ? (
        <div className="glass rounded-2xl p-4 border border-[#00c9a7]/30 flex items-center justify-between">
          <div>
            <p className="text-white font-bold text-sm">{selected.schoolName}</p>
            <p className="text-[#00c9a7] text-xs">{selected.areaLabel}</p>
          </div>
          <button onClick={() => onSelect(null)} className="text-white/40 hover:text-white/80 transition-colors ml-3">✕</button>
        </div>
      ) : (
        <div className="relative">
          <div className="flex items-center glass rounded-xl border border-white/15 overflow-hidden">
            <FaSearch className="ml-3 text-white/30 text-xs shrink-0" />
            <input
              type="text"
              placeholder="Search school name..."
              value={query}
              onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
              onFocus={() => setOpen(true)}
              className="flex-1 bg-transparent px-3 py-3 text-xs text-white/80 placeholder:text-white/30 outline-none"
            />
          </div>
          {open && results.length > 0 && (
            <div className="absolute z-20 top-full left-0 right-0 mt-1 glass border border-white/15 rounded-xl overflow-hidden shadow-2xl max-h-56 overflow-y-auto">
              {results.map((s) => (
                <button
                  key={s.id}
                  onClick={() => { onSelect(s); setQuery(""); setOpen(false); }}
                  className="w-full text-left px-4 py-3 hover:bg-white/10 transition-colors border-b border-white/8 last:border-0"
                >
                  <p className="text-white text-xs font-medium">{s.schoolName}</p>
                  <p className="text-white/40 text-[10px]">{s.areaLabel} • {s.categoryLabel}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function Compare() {
  const [searchParams] = useSearchParams();
  const [schoolA, setSchoolA] = useState(null);
  const [schoolB, setSchoolB] = useState(null);

  useEffect(() => {
    const idA = searchParams.get("a");
    const idB = searchParams.get("b");
    if (idA) setSchoolA(schoolsData.find((s) => s.id === idA) || null);
    if (idB) setSchoolB(schoolsData.find((s) => s.id === idB) || null);
  }, [searchParams]);

  /* Determine winner */
  const getWinner = () => {
    if (!schoolA || !schoolB) return null;
    let scoreA = 0, scoreB = 0;
    if (schoolA.rating > schoolB.rating) scoreA += 2; else if (schoolB.rating > schoolA.rating) scoreB += 2;
    if (schoolA.monthlyFee < schoolB.monthlyFee) scoreA += 1; else if (schoolB.monthlyFee < schoolA.monthlyFee) scoreB += 1;
    if (schoolA.facilities.length > schoolB.facilities.length) scoreA += 1; else if (schoolB.facilities.length > schoolA.facilities.length) scoreB += 1;
    if (schoolA.totalStudents > schoolB.totalStudents) scoreA += 1; else if (schoolB.totalStudents > schoolA.totalStudents) scoreB += 1;
    if (scoreA > scoreB) return { school: schoolA, scoreA, scoreB };
    if (scoreB > scoreA) return { school: schoolB, scoreA, scoreB };
    return { school: null, scoreA, scoreB };
  };
  const winner = getWinner();

  const topRated = (schoolsData.slice().sort((a, b) => b.rating - a.rating)).slice(0, 6).filter((s) => (!schoolA || s.id !== schoolA.id) && (!schoolB || s.id !== schoolB.id)).slice(0, 4);

  return (
    <div className="min-h-screen bg-[#070d1a]">
      <Navbar />
      <div className="pt-20 pb-16 px-4 max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link to="/finder" className="flex items-center gap-2 text-white/40 hover:text-white/70 text-sm transition-colors">
              <FaArrowLeft /> Back
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white" style={{ fontFamily: "Syne,sans-serif" }}>
                <span className="gold-text">Compare</span> Schools
              </h1>
              <p className="text-white/50 text-sm mt-0.5">Select two schools to compare side by side</p>
            </div>
          </div>

          {/* Selectors */}
          <div className="grid sm:grid-cols-2 gap-5 mb-8">
            <SchoolSelector label="School A" selected={schoolA} onSelect={setSchoolA} exclude={schoolB?.id} />
            <SchoolSelector label="School B" selected={schoolB} onSelect={setSchoolB} exclude={schoolA?.id} />
          </div>

          {/* ── Winner Banner ── */}
          {schoolA && schoolB && winner && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}
              className="glass rounded-2xl p-6 border border-[#d4af37]/30 bg-gradient-to-r from-[#d4af37]/10 via-transparent to-[#00c9a7]/10 mb-8 text-center"
            >
              <FaTrophy className="text-[#d4af37] text-3xl mx-auto mb-3" />
              {winner.school ? (
                <>
                  <h2 className="text-xl font-extrabold text-white mb-1" style={{ fontFamily: "Syne,sans-serif" }}>
                    <span className="gold-text">{winner.school.schoolName}</span> Wins!
                  </h2>
                  <p className="text-white/50 text-sm">Based on rating, fees, facilities and student count</p>
                  <div className="flex items-center justify-center gap-6 mt-4">
                    <div className="text-center">
                      <div className="text-2xl font-extrabold text-[#00c9a7]">{winner.scoreA}</div>
                      <div className="text-white/40 text-xs">{schoolA.schoolName.split(" ").slice(0, 2).join(" ")}</div>
                    </div>
                    <div className="text-white/30 text-2xl font-bold">vs</div>
                    <div className="text-center">
                      <div className="text-2xl font-extrabold text-[#00c9a7]">{winner.scoreB}</div>
                      <div className="text-white/40 text-xs">{schoolB.schoolName.split(" ").slice(0, 2).join(" ")}</div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-xl font-extrabold text-white mb-1">It's a Tie!</h2>
                  <p className="text-white/50 text-sm">Both schools are equally matched — {winner.scoreA} points each</p>
                </>
              )}
            </motion.div>
          )}

          {/* ── Quick Summary Cards ── */}
          {schoolA && schoolB && (
            <div className="grid sm:grid-cols-2 gap-5 mb-8">
              {[schoolA, schoolB].map((s, idx) => (
                <motion.div key={s.id} initial={{ opacity: 0, x: idx === 0 ? -20 : 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.1 }}
                  className="glass rounded-2xl overflow-hidden border border-white/10"
                >
                  <div className="relative h-36 bg-gradient-to-br from-[#0d1f3c] to-[#162845]">
                    <img src={s.images[0]} alt={s.schoolName} className="w-full h-full object-cover opacity-70"
                      onError={(e) => { e.target.style.display = "none"; }} />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#070d1a] via-[#070d1a]/40 to-transparent" />
                    {winner?.school?.id === s.id && (
                      <div className="absolute top-3 right-3">
                        <span className="badge bg-[#d4af37] text-[#070d1a]">🏆 Winner</span>
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-extrabold text-white text-base mb-1 leading-tight" style={{ fontFamily: "Syne,sans-serif" }}>{s.schoolName}</h3>
                    <p className="text-[#00c9a7] text-xs mb-3 flex items-center gap-1"><FaMapMarkerAlt /> {s.areaLabel}</p>
                    <Stars rating={s.rating} big />
                    <div className="grid grid-cols-3 gap-2 mt-3">
                      <div className="bg-white/5 rounded-lg p-2 text-center">
                        <div className="text-[#d4af37] font-bold text-xs">{s.monthlyFee === 0 ? "Free" : `Rs ${s.monthlyFee.toLocaleString()}`}</div>
                        <div className="text-white/35 text-[10px]">Fee/mo</div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-2 text-center">
                        <div className="text-white font-bold text-xs">{s.totalStudents.toLocaleString()}</div>
                        <div className="text-white/35 text-[10px]">Students</div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-2 text-center">
                        <div className="text-white font-bold text-xs">{s.totalStaff}</div>
                        <div className="text-white/35 text-[10px]">Staff</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* ── Comparison Table ── */}
          {schoolA && schoolB && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}
              className="glass rounded-2xl border border-white/10 overflow-hidden mb-8"
            >
              <div className="p-5 border-b border-white/10">
                <h2 className="font-extrabold text-white text-lg flex items-center gap-2" style={{ fontFamily: "Syne,sans-serif" }}>
                  <FaChartBar className="text-[#00c9a7]" /> Detailed Comparison
                </h2>
              </div>
              <div className="p-5">
                {/* Column headers */}
                <div className="grid grid-cols-3 gap-3 mb-3">
                  <div />
                  <div className="text-center">
                    <span className="badge bg-[#00c9a7]/15 text-[#00c9a7] border border-[#00c9a7]/30">School A</span>
                    <p className="text-white/60 text-xs mt-1 truncate">{schoolA.schoolName.split(" ").slice(0, 3).join(" ")}</p>
                  </div>
                  <div className="text-center">
                    <span className="badge bg-[#d4af37]/15 text-[#d4af37] border border-[#d4af37]/30">School B</span>
                    <p className="text-white/60 text-xs mt-1 truncate">{schoolB.schoolName.split(" ").slice(0, 3).join(" ")}</p>
                  </div>
                </div>
                <CompareRow label="Rating" valA={schoolA.rating} valB={schoolB.rating} higherIsBetter={true} />
                <CompareRow label="Monthly Fee" valA={schoolA.monthlyFee} valB={schoolB.monthlyFee} higherIsBetter={false} isCurrency={true} />
                <CompareRow label="Admission Fee" valA={schoolA.admissionFee} valB={schoolB.admissionFee} higherIsBetter={false} isCurrency={true} />
                <CompareRow label="Total Students" valA={schoolA.totalStudents} valB={schoolB.totalStudents} higherIsBetter={true} />
                <CompareRow label="Total Staff" valA={schoolA.totalStaff} valB={schoolB.totalStaff} higherIsBetter={true} />
                <CompareRow label="Est. Year" valA={schoolA.establishedYear} valB={schoolB.establishedYear} higherIsBetter={false} />
                <CompareRow label="Category" valA={schoolA.categoryLabel} valB={schoolB.categoryLabel} />
                <CompareRow label="Board" valA={schoolA.boardLabel} valB={schoolB.boardLabel} />
                <CompareRow label="Medium" valA={schoolA.medium} valB={schoolB.medium} />
                <CompareRow label="Gender" valA={schoolA.genderType} valB={schoolB.genderType} />
                <CompareRow label="Facilities" valA={schoolA.facilities} valB={schoolB.facilities} isList={true} />
              </div>
            </motion.div>
          )}

          {/* ── Reviews ── */}
          {schoolA && schoolB && (
            <div className="grid sm:grid-cols-2 gap-5 mb-8">
              {[schoolA, schoolB].map((s) => (
                <div key={s.id} className="glass rounded-2xl p-5 border border-white/10">
                  <h3 className="font-bold text-white text-sm mb-4">Reviews — {s.schoolName.split(" ").slice(0, 3).join(" ")}</h3>
                  {(s.reviews || []).length > 0 ? (
                    <div className="space-y-3">
                      {s.reviews.map((r, i) => (
                        <div key={i} className="bg-white/5 rounded-xl p-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-white/80 text-xs font-medium">{r.reviewer}</span>
                            <Stars rating={r.rating} />
                          </div>
                          <p className="text-white/50 text-xs leading-relaxed">{r.comment}</p>
                          <p className="text-white/25 text-[10px] mt-1">{r.date}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-white/30 text-xs">No reviews yet.</p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* ── Achievements ── */}
          {schoolA && schoolB && (
            <div className="grid sm:grid-cols-2 gap-5 mb-10">
              {[schoolA, schoolB].map((s) => (
                <div key={s.id} className="glass rounded-2xl p-5 border border-white/10">
                  <h3 className="font-bold text-white text-sm mb-4 flex items-center gap-2">
                    <FaTrophy className="text-[#d4af37]" /> Achievements — {s.schoolName.split(" ").slice(0, 3).join(" ")}
                  </h3>
                  <div className="space-y-2">
                    {(s.achievements || []).map((a, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-white/60">
                        <FaCheckCircle className="text-[#00c9a7] shrink-0 mt-0.5 text-[11px]" /> {a}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── Empty State ── */}
          {(!schoolA || !schoolB) && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🏫</div>
              <h2 className="text-2xl font-extrabold text-white mb-2" style={{ fontFamily: "Syne,sans-serif" }}>
                {!schoolA && !schoolB ? "Select Two Schools to Compare" : "Select One More School"}
              </h2>
              <p className="text-white/40 text-sm mb-6">Use the search boxes above to pick schools, or go back to the finder.</p>
              <Link to="/finder" className="btn-teal px-6 py-3 rounded-xl text-sm font-semibold inline-flex items-center gap-2">
                <FaSearch /> Browse Schools
              </Link>
            </div>
          )}

          {/* ── Top Rated suggestions ── */}
          <div>
            <h2 className="text-xl font-extrabold text-white mb-5" style={{ fontFamily: "Syne,sans-serif" }}>
              Top Rated Schools
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {topRated.map((s) => (
                <motion.div key={s.id} whileHover={{ y: -4 }} transition={{ duration: 0.2 }}
                  className="glass rounded-xl overflow-hidden border border-white/10 cursor-pointer"
                  onClick={() => { if (!schoolA) setSchoolA(s); else if (!schoolB) setSchoolB(s); }}
                >
                  <div className="h-24 bg-gradient-to-br from-[#0d1f3c] to-[#162845] relative overflow-hidden">
                    <img src={s.images[0]} alt={s.schoolName} className="w-full h-full object-cover opacity-70"
                      onError={(e) => { e.target.style.display = "none"; }} />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#070d1a]/80 to-transparent" />
                    <div className="absolute bottom-2 left-2">
                      <Stars rating={s.rating} />
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="text-white text-xs font-bold line-clamp-1">{s.schoolName}</p>
                    <p className="text-[#00c9a7] text-[10px] mt-0.5">{s.categoryLabel}</p>
                    <p className="text-white/30 text-[10px] mt-1">Click to select</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}