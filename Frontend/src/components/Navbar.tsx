import React from "react";

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
  const navItems = [
    { id: "home", label: "Home" },
    { id: "disease", label: "Disease Detection" },
    { id: "fertilizer", label: "Fertilizer Prediction" },
    { id: "agribot", label: "AgriBot" },
    { id: "monitoring", label: "Monitoring" },
  ];

  return (
    <nav className="fixed top-0 w-full bg-white shadow-md z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center py-4 px-6">
        <h1
          className="text-2xl font-bold text-green-600 cursor-pointer"
          onClick={() => onNavigate("home")}
        >
          AgriGuard AI
        </h1>

        <ul className="flex items-center gap-6">
          {navItems.map((item) => (
            <li
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`cursor-pointer font-medium ${
                currentPage === item.id
                  ? "text-green-600 border-b-2 border-green-600 pb-1"
                  : "text-gray-700 hover:text-green-600"
              }`}
            >
              {item.label}
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate("login")}
            className="px-4 py-2 rounded-full border border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition"
          >
            Login
          </button>
          <button
            onClick={() => onNavigate("register")}
            className="px-4 py-2 rounded-full bg-green-600 text-white hover:bg-green-700 transition"
          >
            Register
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
