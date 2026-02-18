import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { fetchAllProducts } from "../../services/productApi";

export default function SearchExpand() {
  const [expanded, setExpanded] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [search, setSearch] = useState("");
  const [recent, setRecent] = useState(() => JSON.parse(localStorage.getItem("recentSearches") || "[]"));
  const [topProducts, setTopProducts] = useState([]);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (expanded) {
      setTimeout(() => inputRef.current?.focus(), 100);
      fetchAllProducts().then(products => {
        setTopProducts(products.sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 4));
      });
    }
    // Close dropdown on scroll
    const closeOnScroll = () => expanded && setExpanded(false);
    window.addEventListener("scroll", closeOnScroll);
    return () => window.removeEventListener("scroll", closeOnScroll);
  }, [expanded]);

  const handleIconClick = () => setExpanded(true);

  const handleBlur = (e) => {
    // Only collapse if not clicking inside dropdown
    if (!e.relatedTarget || !e.relatedTarget.classList.contains("search-dropdown-link")) {
      setExpanded(false);
      setSearch("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (search.trim()) {
      const updated = [search, ...recent.filter(r => r !== search)].slice(0, 5);
      setRecent(updated);
      localStorage.setItem("recentSearches", JSON.stringify(updated));
      setExpanded(false);
      setSearch("");
      navigate(`/shop?search=${encodeURIComponent(search)}`);
    }
  };

  const handleProductClick = (prod) => {
    setExpanded(false);
    setSearch("");
    navigate(`/shop?category=${encodeURIComponent(prod.category)}&product=${encodeURIComponent(prod.slug)}`);
  };

  return (
    <div
      className="relative flex items-center"
      style={{ minWidth: 40 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <button
        aria-label="Expand search"
        className="hover:text-black text-gray-700 transition"
        onClick={handleIconClick}
        style={{ zIndex: 10 }}
      >
        <Search className="w-5 h-5" />
      </button>
      <form
        onSubmit={handleSubmit}
        className={`absolute right-0 flex items-center px-1 z-40 transition-all duration-300 ${expanded || hovered ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-0 pointer-events-none'}`}
        style={{ minWidth: 120, background: "transparent", boxShadow: "none", top: 0, borderBottom: 'none' }}
        tabIndex={-1}
        onClick={e => { if (!expanded) { e.preventDefault(); setExpanded(true); setTimeout(() => inputRef.current?.focus(), 100); }}}
      >
        <div className="relative w-full flex-1 flex items-center">
          <input
            ref={inputRef}
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            onBlur={handleBlur}
            className="outline-none border-none bg-transparent flex-1 min-w-0 text-black"
            style={{ fontFamily: 'Playfair Display, serif', fontSize: 14, fontWeight: 500, letterSpacing: '0.04em', paddingBottom: 1 }}
            placeholder="Type to search..."
            autoFocus={expanded}
            readOnly={!expanded}
          />
          <span
            className="nav-underline"
            style={{
              width: expanded ? '100%' : '0%',
              transition: 'width 0.35s cubic-bezier(.4,0,.2,1)',
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: -2,
              background: '#111',
              height: 1,
              borderRadius: 1,
              pointerEvents: 'none',
            }}
          />
        </div>
      </form>
      {/* Dropdown Section */}
      {expanded && (
        <div className="absolute right-0 mt-2 w-[900px] bg-white rounded-xl shadow-xl border border-gray-100 z-50 flex flex-row p-8 gap-12" style={{top: 'calc(100% + 8px)'}}>
          {/* Top Rated Products (left) */}
          <div className="flex-1 min-w-[320px] flex flex-row gap-6 items-center relative">
            <div className="text-xs font-semibold mb-4 tracking-wider text-gray-700 luxury w-full" style={{position:'absolute',top:0,left:0}}>TOP RATED PRODUCTS</div>
            {topProducts.map(prod => (
              <div key={prod.id} className="flex flex-col items-center cursor-pointer justify-between mt-8" onMouseDown={() => handleProductClick(prod)} tabIndex={-1} style={{width:140, height: 220}}>
                <div className="w-28 h-28 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden mb-2" style={{marginTop: 0}}>
                  <img src={prod.image} alt={prod.name} className="object-contain w-full h-full" />
                </div>
                <div className="mt-2 text-xs font-serif text-center flex-1 flex items-end justify-center overflow-hidden" style={{fontFamily:'Playfair Display,serif', minHeight: 0, maxHeight: 48, wordBreak: 'break-word'}}>{prod.name}</div>
                <div className="text-xs text-gray-700 mt-1">{prod.price} €</div>
              </div>
            ))}
          </div>
          {/* Recent Searches (right) */}
          <div className="flex flex-col justify-start min-w-[180px] max-w-[220px]" style={{alignItems:'flex-end'}}>
            <div className="text-xs font-semibold mb-4 tracking-wider text-gray-700 luxury text-right">RECENT SEARCHES</div>
            {recent.length === 0 && <div className="text-xs text-gray-400 text-right">No recent searches</div>}
            {recent.map((r, i) => (
              <div key={i} className="text-sm mb-2 cursor-pointer search-dropdown-link text-right" tabIndex={-1} onMouseDown={() => { setExpanded(false); navigate(`/shop?search=${encodeURIComponent(r)}`); }}>{r}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

 