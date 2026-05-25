// App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import Finder from "./Finder";
import Compare from "./Compare";
import SchoolDetails from "./SchoolDetails";

export default function App() {
  return (
    <Routes>
      <Route path="/school/:slug" element={<SchoolDetails />} />
      <Route path="/" element={<Home />} />
      <Route path="/finder" element={<Finder />} />
      <Route path="/compare" element={<Compare />} />
    </Routes>
  );
}