import { Link } from "react-router";

export const Navbar = () => {
  return (
    <nav className="navbar justify-between">
      <p className="text-2xl font-bold text-gradient">RESMIND</p>

      <Link to="/upload" className="primary-button w-fit">
        Upload Resume
      </Link>
    </nav>
  );
};