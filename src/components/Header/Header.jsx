import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Heart, ShoppingCart, User } from "lucide-react";
import SearchExpand from "./SearchExpand";
import HeaderActions from "./HeaderActions";
import CartBottomSheet from "../cart/CartBottomSheet";
import { useAuth } from "../../context/AuthContext";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileCartOpen, setMobileCartOpen] = useState(false);
  const [showNav, setShowNav] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const navItems = [
    { to: "/", label: "Home" },
    { to: "/shop", label: "Shop" },
    { to: "/about", label: "About" },
    { to: "/blog", label: "Blog" },
    { to: "/contact", label: "Contact" },
    { to: "/faq", label: "FAQ" },
  ];

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (window.scrollY > lastScrollY && window.scrollY > 40) {
            setShowNav(false); // scroll up, hide
          } else {
            setShowNav(true); // scroll down, show
          }
          setLastScrollY(window.scrollY);
          setScrolled(window.scrollY > 10);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setMobileMenuOpen(false);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileMenuOpen]);

  const toggleMobileMenu = () => setMobileMenuOpen((value) => !value);

  const handleMobileMenuBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      setMobileMenuOpen(false);
    }
  };

  const handleWishlistClick = () => {
    setMobileMenuOpen(false);
    navigate("/wishlist");
  };

  const handleCartClick = () => {
    setMobileMenuOpen(false);
    setMobileCartOpen(true);
  };

  const handleUserClick = () => {
    setMobileMenuOpen(false);
    navigate(isAuthenticated ? "/profile" : "/login");
  };

  const renderMobileSidebarFooter = () => (
    <div className="pt-4 border-t border-gray-200">
      <p className="text-xs text-gray-500">Luxury itself.</p>
      <p className="text-[11px] text-gray-400 mt-1">© {new Date().getFullYear()} MW Store</p>
    </div>
  );

  return (
    <header
      className={`fixed left-0 z-50 w-full transition-all duration-300`}
      style={{
        background: 'var(--color-mw-beige)',
        boxShadow: '0 2px 8px 0 rgba(0,0,0,0.03)',
        paddingTop: scrolled ? 8 : 32,
        paddingBottom: scrolled ? 4 : 16,
      }}
    >
      <div className={`mx-auto flex max-w-6xl items-center px-6 transition-all duration-300 ${scrolled ? 'h-10' : 'h-16'}`}>
        {/* Left: User, wishlist, cart, search */}
        <div className="hidden md:flex items-center min-w-[180px]">
          <HeaderActions />
        </div>

        {/* Center: Logo and navlinks (Coach style) */}
        <div className="hidden md:flex flex-1 flex-col items-center justify-center transition-all duration-300" style={{paddingTop: scrolled ? 2 : 24, paddingBottom: scrolled ? 0 : 8, marginLeft: '-112px'}}>
          <Link to="/" className="header-logo select-none mb-1 transition-all duration-300" style={{ marginTop: scrolled ? 32 : 0 }}>
            <span className="font-bold text-black tracking-wider uppercase transition-all duration-300" style={{ fontFamily: 'Playfair Display, serif', letterSpacing: '0.08em', fontSize: scrolled ? 24 : 36 }}>
              MW
            </span>
          </Link>
          {!scrolled && (
            <span className="text-xs font-light text-gray-500 mb-2 luxury transition-all duration-300" style={{ fontFamily: 'Playfair Display, serif' }}>Luxury itself.</span>
          )}
          <div style={{ minHeight: 40, width: '100%' }} className="flex items-center justify-center">
            <nav
              className={`hidden md:flex gap-12 items-center w-full justify-center bg-[#f4ede7] border-t border-b border-[#ece6e0] py-2 relative transition-all duration-300 rounded-2xl ${showNav ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-6 pointer-events-none'}`}
              style={{ boxShadow: '0 2px 8px 0 rgba(0,0,0,0.01)', minHeight: 40 }}
            >
              {navItems.map((item) => {
                const isActive = location.pathname === item.to;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="relative text-base tracking-wide font-normal text-black transition uppercase px-2"
                    style={{ letterSpacing: '0.04em', fontFamily: 'Playfair Display, serif', fontWeight: 500 }}
                  >
                    {item.label}
                    <span className={`nav-underline${isActive ? ' active' : ''}`} style={{height: 1, borderRadius: 1}} />
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Right: Expanding Search */}
        <div className="hidden md:flex items-center min-w-[60px] justify-end">
          <SearchExpand />
        </div>

        {/* Mobile Hamburger Button */}
        <div className="md:hidden flex items-center justify-between w-full">
          <button
            type="button"
            className="relative inline-flex h-11 w-11 items-center justify-center bg-transparent text-black transition focus:outline-none focus-visible:ring-2 focus-visible:ring-black/30"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-controls="mobile-nav-menu"
            aria-expanded={mobileMenuOpen}
            onClick={toggleMobileMenu}
          >
            <span className="relative block h-4 w-5" aria-hidden="true">
              <span
                className={`absolute left-0 top-0 block h-0.5 w-5 rounded bg-current transition-all duration-300 ${mobileMenuOpen ? "translate-y-[7px] rotate-45" : ""}`}
              ></span>
              <span
                className={`absolute left-0 top-[7px] block h-0.5 w-4 rounded bg-current transition-all duration-300 ${mobileMenuOpen ? "opacity-0" : "opacity-100"}`}
              ></span>
              <span
                className={`absolute left-0 top-[14px] block h-0.5 w-3 rounded bg-current transition-all duration-300 ${mobileMenuOpen ? "-translate-y-[7px] -rotate-45 w-5" : ""}`}
              ></span>
            </span>
          </button>

          <Link to="/" className="header-logo select-none" onClick={() => setMobileMenuOpen(false)}>
            <span
              className="font-bold text-black tracking-wider uppercase"
              style={{ fontFamily: 'Playfair Display, serif', letterSpacing: '0.08em', fontSize: 28 }}
            >
              MW
            </span>
          </Link>
        </div>
      </div>

      {/* Mobile Hamburger Sidebar */}
      <div
        className={`fixed inset-0 z-40 md:hidden bg-black/30 backdrop-blur-[1px] transition-opacity duration-300 ${mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={handleMobileMenuBackdropClick}
      >
        <aside
          id="mobile-nav-menu"
          className={`absolute left-0 top-0 h-full w-[82%] max-w-sm bg-white shadow-2xl px-6 py-8 flex flex-col gap-8 transition-transform duration-300 ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
          onClick={(event) => event.stopPropagation()}
        >
          <div className="flex items-center justify-between">
            <span className="text-2xl font-serif font-bold text-black">Menu</span>
            <button
              type="button"
              className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition"
              aria-label="Close menu"
              onClick={() => setMobileMenuOpen(false)}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <line x1="4.5" y1="4.5" x2="13.5" y2="13.5" stroke="black" strokeWidth="2" strokeLinecap="round"/>
                <line x1="13.5" y1="4.5" x2="4.5" y2="13.5" stroke="black" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          <nav className="flex flex-col gap-2">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="rounded-lg px-3 py-2 text-base text-gray-700 transition hover:bg-gray-100 hover:text-black"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mt-auto pt-4 border-t border-gray-200 space-y-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-label="Go to wishlist"
                className="h-11 w-11 rounded-full border border-gray-300 text-gray-700 hover:text-black hover:border-black transition flex items-center justify-center"
                onClick={handleWishlistClick}
              >
                <Heart className="w-5 h-5" />
              </button>
              <button
                type="button"
                aria-label="Open cart"
                className="h-11 w-11 rounded-full border border-gray-300 text-gray-700 hover:text-black hover:border-black transition flex items-center justify-center"
                onClick={handleCartClick}
              >
                <ShoppingCart className="w-5 h-5" />
              </button>
              <button
                type="button"
                aria-label="Open user account"
                className="h-11 w-11 rounded-full border border-gray-300 text-gray-700 hover:text-black hover:border-black transition flex items-center justify-center"
                onClick={handleUserClick}
              >
                <User className="w-5 h-5" />
              </button>
            </div>
            {renderMobileSidebarFooter()}
          </div>
        </aside>
      </div>

      <CartBottomSheet open={mobileCartOpen} onClose={() => setMobileCartOpen(false)} />
    </header>
  );
}
