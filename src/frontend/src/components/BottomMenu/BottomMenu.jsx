import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Trophy, FileText } from 'lucide-react';
import '../../pages/style/style.css';

export default function BottomMenu() {
  return (
    <nav className="bottom-menu">
      {/* Link para HOME */}
      <NavLink 
        to="/" 
        className={({ isActive }) => isActive ? "menu-item active" : "menu-item"}
      >
        <Home size={24} />
        <span>Home</span>
      </NavLink>

      {/* Link para DESAFIOS */}
      <NavLink 
        to="/desafios" 
        className={({ isActive }) => isActive ? "menu-item active" : "menu-item"}
      >
        <Trophy size={24} />
        <span>Desafios</span>
      </NavLink>

      {/* Link para EXTRATO */}
      <NavLink 
        to="/extrato" 
        className={({ isActive }) => isActive ? "menu-item active" : "menu-item"}
      >
        <FileText size={24} />
        <span>Extrato</span>
      </NavLink>
    </nav>
  );
}