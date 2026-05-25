// App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import Finder from "./Finder";
import Compare from "./Compare";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/finder" element={<Finder />} />
      <Route path="/compare" element={<Compare />} />
    </Routes>
  );
}