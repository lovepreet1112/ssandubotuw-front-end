import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Search, X, ChevronRight } from 'lucide-react';
import { setSearchQuery, setDropdownOpen, clearSearch, executeSearch } from '../../redux/slices/searchSlice';
import useDebounce from '../../hooks/useDebounce';

export const SearchBar = ({ className = '', onCloseMobile }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const { query, liveResults, isSearching, isDropdownOpen } = useSelector((state) => state.search);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery.trim()) {
      dispatch(executeSearch(debouncedQuery.trim()));
    }
  }, [debouncedQuery, dispatch]);

  // Handle outside click to close dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        dispatch(setDropdownOpen(false));
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dispatch]);

  const handleSelectProduct = (slugOrId) => {
    dispatch(clearSearch());
    if (onCloseMobile) onCloseMobile();
    navigate(`/product/${slugOrId}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && query.trim()) {
      dispatch(setDropdownOpen(false));
      if (onCloseMobile) onCloseMobile();
      navigate(`/clothing?search=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <div className="relative flex items-center">
        <Search className="absolute left-3 w-4 h-4 text-[#686558]" />
        <input
          type="text"
          value={query}
          onChange={(e) => dispatch(setSearchQuery(e.target.value))}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (liveResults.length > 0) dispatch(setDropdownOpen(true));
          }}
          placeholder="Search sweaters, cardigans, designs..."
          className="w-full pl-9 pr-8 py-2 text-xs md:text-sm bg-[#FAEDCD]/40 hover:bg-[#FAEDCD]/70 focus:bg-white border border-[#DDCBA4] rounded-sm placeholder-[#686558]/70 focus:outline-none focus:border-[#D4A373] transition-colors"
        />
        {query && (
          <button
            onClick={() => dispatch(clearSearch())}
            className="absolute right-2.5 p-0.5 text-[#686558] hover:text-[#2A2923]"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Live Search Results Dropdown */}
      {isDropdownOpen && liveResults.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-[#FDFBF7] border border-[#DDCBA4] rounded-sm shadow-warm-lg z-50 overflow-hidden">
          <div className="p-2 border-b border-[#DDCBA4]/50 bg-[#FAEDCD]/30 text-[11px] font-semibold uppercase tracking-wider text-[#686558] flex justify-between items-center">
            <span>Matching Winter Creations</span>
            {isSearching && <span className="animate-pulse text-[#D4A373]">Searching...</span>}
          </div>
          <div className="max-h-72 overflow-y-auto divide-y divide-[#DDCBA4]/30">
            {liveResults.map((item) => (
              <div
                key={item._id}
                onClick={() => handleSelectProduct(item.slug || item._id)}
                className="flex items-center gap-3 p-2.5 hover:bg-[#FAEDCD]/50 cursor-pointer transition-colors"
              >
                <img
                  src={item.thumbnail || item.images[0]}
                  alt={item.name}
                  className="w-10 h-12 object-cover rounded-sm bg-[#E9EDC9]"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-serif font-medium text-[#2A2923] truncate">
                    {item.name}
                  </p>
                  <p className="text-[11px] text-[#686558]">{item.category}</p>
                  <p className="text-xs font-semibold text-[#D4A373] mt-0.5">
                    ₹{(item.discountPrice || item.price).toLocaleString('en-IN')}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-[#686558]/50" />
              </div>
            ))}
          </div>
          <div
            onClick={() => {
              dispatch(setDropdownOpen(false));
              if (onCloseMobile) onCloseMobile();
              navigate(`/clothing?search=${encodeURIComponent(query.trim())}`);
            }}
            className="p-2.5 text-center text-xs font-medium text-[#D4A373] hover:bg-[#FAEDCD]/60 cursor-pointer border-t border-[#DDCBA4]/40 transition-colors"
          >
            View all results for "{query}" →
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
