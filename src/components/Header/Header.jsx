import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import SearchExpand from "./SearchExpand";
import MegaDropdown from "./MegaDropdown";
import HeaderActions from "./HeaderActions";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNav, setShowNav] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navItems = [
    { to: "/", label: "Home" },
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
        <div className="flex-1 flex flex-col items-center justify-center transition-all duration-300" style={{paddingTop: scrolled ? 2 : 24, paddingBottom: scrolled ? 0 : 8, marginLeft: '-112px'}}>
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
                return item.label === "Shop" ? (
                  <MegaDropdown key="shop" />
                ) : (
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
        <div className="md:hidden flex items-center">
          <button
            className="p-2 focus:outline-none"
            aria-label="Open menu"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="block w-6 h-0.5 bg-black mb-1"></span>
            <span className="block w-6 h-0.5 bg-black mb-1"></span>
            <span className="block w-6 h-0.5 bg-black"></span>
          </button>
        </div>
      </div>

      {/* Mobile Hamburger Menu (with nav links) */}
      {mobileMenuOpen && (
        <div className="fixed left-0 top-0 w-full z-40 md:hidden bg-black bg-opacity-20">
          <div className="mx-auto max-w-6xl bg-white shadow-lg rounded-b-2xl p-8 pt-16 flex flex-col gap-6 relative" style={{ minHeight: '60vh' }}>
            <button className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition" aria-label="Close menu" onClick={() => setMobileMenuOpen(false)}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <line x1="4.5" y1="4.5" x2="13.5" y2="13.5" stroke="black" strokeWidth="2" strokeLinecap="round"/>
                <line x1="13.5" y1="4.5" x2="4.5" y2="13.5" stroke="black" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
            <div className="flex flex-col items-center gap-2 mb-4">
              <span className="text-3xl font-serif font-bold text-black">MW</span>
              <span className="text-xs font-light text-gray-500">luxury itself</span>
            </div>
            <nav className="flex flex-col gap-3">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="py-2 text-lg text-gray-700 hover:text-black text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
