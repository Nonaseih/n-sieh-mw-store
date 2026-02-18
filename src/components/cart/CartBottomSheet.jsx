/**
    * @description      : 
    * @author           : fortu
    * @group            : 
    * @created          : 02/12/2025 - 22:16:29
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 02/12/2025
    * - Author          : fortu
    * - Modification    : 
**/
/**
 * Bottom-sheet cart that slides up from the bottom.
 */
import React, { useRef, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";


export default function CartBottomSheet({ open, onClose }) {
  const { items, updateQuantity, removeItem, clearCart, total } = useCart();
  const { isAuthenticated } = useAuth();
  const containerRef = useRef(null);
  const [visible, setVisible] = useState(open);
  const [animating, setAnimating] = useState(false);

  // Handle open/close animation
  useEffect(() => {
    if (open) {
      setVisible(true);
      setAnimating(false);
    } else if (visible) {
      setAnimating(true);
      const timeout = setTimeout(() => {
        setVisible(false);
        setAnimating(false);
      }, 500); // match duration-500
      return () => clearTimeout(timeout);
    }
  }, [open, visible]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function handle(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open, onClose]);

  // Prevent background scroll/interactions
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (typeof document === "undefined") return null;
  return createPortal(
    visible && (
      <div className="fixed inset-0 z-50">
        {/* Overlay disables all background interaction */}
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
        <div
          ref={containerRef}
          className={`fixed left-0 right-0 bottom-0 transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] max-w-4xl mx-auto px-4 ${open && !animating ? "translate-y-0" : "translate-y-full"}`}
          style={{ pointerEvents: 'auto', willChange: 'transform' }}
        >
          <div className="bg-white rounded-t-xl shadow-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Your Cart </h3>
              <div className="flex items-center gap-2">
                <button onClick={clearCart} className="text-sm text-gray-600">Clear</button>
                <button onClick={onClose} className="px-3 py-1 bg-gray-100 rounded">Close</button>
              </div>
            </div>

            {items.length === 0 ? (
              <div className="py-12 text-center text-gray-600">Your cart is empty.</div>
            ) : (
              <div className="space-y-4 max-h-[50vh] overflow-y-auto">
                {/* Account Benefits Banner */}
                {!isAuthenticated && (
                  <div className="bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200 rounded-lg p-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex-1">
                        <p className="text-xs font-medium text-slate-900">Sign up for faster checkout</p>
                        <p className="text-[10px] text-slate-600">Save cart, track orders & more</p>
                      </div>
                      <Link 
                        to="/register" 
                        className="px-3 py-1.5 text-xs bg-slate-900 text-white rounded hover:bg-slate-800 transition whitespace-nowrap"
                        onClick={onClose}
                      >
                        Sign Up
                      </Link>
                    </div>
                  </div>
                )}
                {items.map((it) => (
                  <div key={it.id} className="flex items-center gap-3">
                    <img src={it.image} alt={it.name} className="w-16 h-16 object-cover rounded" />
                    <div className="flex-1">
                      <div className="font-medium">{it.name}</div>
                      <div className="text-sm text-gray-500">${it.price}</div>
                      <div className="flex items-center gap-2 mt-2">
                        <button onClick={() => updateQuantity(it.id, Math.max(1, it.quantity - 1))} className="px-2 py-1 border rounded">-</button>
                        <span className="text-sm">{it.quantity}</span>
                        <button onClick={() => updateQuantity(it.id, it.quantity + 1)} className="px-2 py-1 border rounded">+</button>
                      </div>
                    </div>
                    <button onClick={() => removeItem(it.id)} className="text-xl">×</button>
                  </div>
                ))}

                <div className="pt-4 border-t flex items-center justify-between">
                  <div className="text-sm font-medium">Subtotal</div>
                  <div className="text-lg font-semibold">${total.toLocaleString()}</div>
                </div>

                <div className="pt-3">
                  <a href="/checkout" className="block text-center px-4 py-3 bg-black text-white rounded">Checkout</a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    ),
    document.body
  );
}
