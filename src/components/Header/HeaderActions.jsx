import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Heart, User, Search } from "lucide-react";
import CartBottomSheet from "../cart/CartBottomSheet";
import { useAuth } from "../../context/AuthContext";


export default function HeaderActions({ excludeUser = false, onlyUser = false }) {
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const { user, isAuthenticated, logout } = useAuth();

  // Close menu on outside click
  React.useEffect(() => {
    if (!menuOpen) return;
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  return (
    <>
      <div className="flex items-center gap-4">
        {/* Wishlist and cart first */}
        {!onlyUser && (
          <>
            <Link to="/wishlist" aria-label="Wishlist" className="hover:text-black text-gray-700 transition">
              <Heart className="w-5 h-5" />
            </Link>
            <button
              aria-label="Cart"
              className="hover:text-black text-gray-700 transition bg-transparent border-none p-0 m-0"
              style={{ background: "none" }}
              onClick={() => setCartOpen(true)}
            >
              <ShoppingCart className="w-5 h-5" />
            </button>
          </>
        )}
        {/* User icon only */}
        {!excludeUser && (
          isAuthenticated ? (
            <div className="relative" ref={menuRef}>
              <button
                aria-label="User menu"
                className="hover:text-black text-gray-700 transition bg-transparent border-none p-0 m-0"
                style={{ background: "none" }}
                tabIndex={0}
                onMouseDown={e => {
                  e.stopPropagation();
                  setMenuOpen(v => !v);
                }}
              >
                <User className="w-5 h-5" />
              </button>
              {menuOpen && (
                <div
                  className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-lg z-50 animate-fadeIn"
                  onMouseDown={e => e.stopPropagation()}
                >
                  <div className="px-4 py-2 text-sm text-gray-700 border-b">{user?.name || user?.email || "Account"}</div>
                  <Link to="/profile" className="block px-4 py-2 text-sm hover:bg-gray-100">Profile</Link>
                  <Link to="/orders" className="block px-4 py-2 text-sm hover:bg-gray-100">Orders</Link>
                  <button
                    onClick={() => { logout(); setMenuOpen(false); }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-red-500"
                  >Logout</button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" aria-label="User" className="hover:text-black text-gray-700 transition">
              <User className="w-5 h-5" />
            </Link>
          )
        )}
      </div>
      <CartBottomSheet open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}