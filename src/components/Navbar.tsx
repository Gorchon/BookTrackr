import { Link } from "react-router-dom";
import "./Navbar.css"; // make it pretty later

export default function Navbar() {
  return (
    <nav>
      <h1>📚 BookHub</h1>
      <div>
        <Link to="/">Home</Link>
        <Link to="/search">Search</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/profile">Profile</Link>
      </div>
    </nav>
  );
}
