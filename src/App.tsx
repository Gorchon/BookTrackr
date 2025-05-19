import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "../src/components/Navbar";
import Home from "./pages/Home";
import Search from "@/pages/Search";
import Dashboard from "@/pages/Dashboard";
import Profile from "@/pages/Profile";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}
