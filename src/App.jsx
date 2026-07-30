import React, { useState, useEffect, createContext, useContext } from "react";
import { BrowserRouter, Routes, Route, NavLink, Navigate } from "react-router-dom";

import CharacterPage from "./pages/CharacterPage.jsx";
import InventoryPage from "./pages/InventoryPage.jsx";
import QuestsPage from "./pages/QuestsPage.jsx";
import LeaderboardPage from "./pages/LeaderboardPage.jsx";
import OverviewPage from "./pages/OverviewPage.jsx";
import CombatPage from "./pages/CombatPage.jsx";
import ShopPage from "./pages/ShopPage.jsx";

const API = "https://631fead1-52c2-4865-b097-b2ebae910fac-00-bwnldj7qyjr0.riker.replit.dev";

export const UserContext = createContext(null);

export default function App() {
  const [user, setUser] = useState(undefined);

  // 🔐 LOGIN + CHARGEMENT DU JOUEUR
  useEffect(() => {
    async function init() {
      try {
        // 1️⃣ Login → obtenir le JWT
        const resLogin = await fetch(`${API}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key: "TA_CLE_API" }),
        });

        const { token } = await resLogin.json();
        localStorage.setItem("token", token);

        // 2️⃣ Charger les joueurs
        const resPlayers = await fetch(`${API}/api/players`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const players = await resPlayers.json();

        // 3️⃣ Choisir le premier joueur
        setUser(players[0] || null);
      } catch (err) {
        console.error(err);
        setUser(null);
      }
    }

    init();
  }, []);

  if (user === undefined) {
    return (
      <div className="loading" style={{ minHeight: "100vh" }}>
        <div className="spinner"></div>
        <span>Chargement du royaume...</span>
      </div>
    );
  }

  if (!user) {
    return <div>Impossible de charger le joueur.</div>;
  }

  return (
    <UserContext.Provider value={{ user }}>
      <BrowserRouter>
        <div className="layout">
          <aside className="sidebar">
            <div className="sidebar-logo">
              <span className="crown">⚔️</span>
              <h2>Kingdom</h2>
            </div>

            <nav className="sidebar-nav">
              <NavLink to="/" end className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}>
                <span className="icon">🏰</span>
                <span>Accueil</span>
              </NavLink>
              <NavLink to="/character" className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}>
                <span className="icon">⚔️</span>
                <span>Personnage</span>
              </NavLink>
              <NavLink to="/inventory" className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}>
                <span className="icon">🎒</span>
                <span>Inventaire</span>
              </NavLink>
              <NavLink to="/quests" className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}>
                <span className="icon">📜</span>
                <span>Quêtes</span>
              </NavLink>
              <NavLink to="/combat" className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}>
                <span className="icon">⚔️</span>
                <span>Combat</span>
              </NavLink>
              <NavLink to="/shop" className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}>
                <span className="icon">🏪</span>
                <span>Boutique</span>
              </NavLink>
              <NavLink to="/leaderboard" className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}>
                <span className="icon">🏆</span>
                <span>Classement</span>
              </NavLink>
            </nav>
          </aside>

          <main className="main-content">
            <Routes>
              <Route path="/" element={<OverviewPage />} />
              <Route path="/character" element={<CharacterPage />} />
              <Route path="/inventory" element={<InventoryPage />} />
              <Route path="/quests" element={<QuestsPage />} />
              <Route path="/combat" element={<CombatPage />} />
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/leaderboard" element={<LeaderboardPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </UserContext.Provider>
  );
}
