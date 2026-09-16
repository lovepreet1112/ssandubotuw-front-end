import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ChevronRight, ArrowRight } from 'lucide-react';
import { setSearchQuery, clearSearch, executeSearch } from '../../redux/slices/searchSlice';
import useDebounce from '../../hooks/useDebounce';

export const SearchDrawer = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const { query, liveResults, isSearching } = useSelector((state) => state.search);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
    }
  }, [isOpen]);

  useEffect(() => {
    if (debouncedQuery.trim()) {
      dispatch(executeSearch(debouncedQuery.trim()));
    }
  }, [debouncedQuery, dispatch]);

  const handleSelectProduct = (slugOrId) => {
    dispatch(clearSearch());
    onClose();
    navigate(`/product/${slugOrId}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && query.trim()) {
      dispatch(clearSearch());
      onClose();
      navigate(`/clothing?search=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/45 backdrop-blur-sm"
          />

          {/* Right-to-Left Slide-over Panel */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-8 sm:pl-12">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="w-screen max-w-md bg-[#FDFBF7] border-l border-[#DDCBA4] shadow-warm-lg flex flex-col"
            >
              {/* Drawer Header */}
              <div className="p-5 border-b border-[#DDCBA4]/60 bg-[#FAEDCD]/40 flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#2A2923]">
                    Search Atelier
                  </h3>
                  <p className="text-[11px] uppercase tracking-wider text-[#D4A373] font-semibold">
                    Handmade Winter Knitwear
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-full text-[#686558] hover:text-[#2A2923] hover:bg-[#FAEDCD] transition-colors"
                  aria-label="Close search"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Search Input Box */}
              <div className="p-5 border-b border-[#DDCBA4]/40 bg-white">
                <div className="relative flex items-center">
                  <Search className="w-4 h-4 text-[#686558] absolute left-3.5" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                    onKeyDown={handleKeyDown}
                    placeholder="Search sweaters, cardigans, shawls..."
                    className="w-full pl-10 pr-9 py-2.5 text-xs sm:text-sm bg-[#FAEDCD]/20 hover:bg-[#FAEDCD]/40 focus:bg-white border border-[#DDCBA4] rounded-sm focus:outline-none focus:border-[#D4A373] transition-colors"
                  />
                  {query && (
                    <button
                      onClick={() => dispatch(clearSearch())}
                      className="absolute right-3 p-0.5 text-[#686558] hover:text-[#2A2923]"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {isSearching && (
                  <p className="text-[11px] text-[#D4A373] mt-2 animate-pulse">
                    Searching atelier catalogue...
                  </p>
                )}
              </div>

              {/* Live Results Area */}
              <div className="flex-1 overflow-y-auto p-5 divide-y divide-[#DDCBA4]/30">
                {liveResults && liveResults.length > 0 ? (
                  <div className="space-y-3">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-[#686558]">
                      Matching Pieces ({liveResults.length})
                    </p>
                    {liveResults.map((item) => (
                      <div
                        key={item._id}
                        onClick={() => handleSelectProduct(item.slug || item._id)}
                        className="flex items-center gap-3.5 p-2.5 rounded-sm hover:bg-[#FAEDCD]/50 cursor-pointer transition-colors border border-transparent hover:border-[#DDCBA4]/60"
                      >
                        <img
                          src={item.thumbnail || item.images?.[0]}
                          alt={item.name}
                          className="w-12 h-16 object-cover rounded-sm border border-[#DDCBA4]/50 bg-[#FAEDCD]"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-serif font-semibold text-[#2A2923] truncate">
                            {item.name}
                          </h4>
                          <p className="text-[11px] text-[#686558]">{item.category}</p>
                          <p className="text-xs font-bold text-[#D4A373] mt-0.5">
                            ₹{(item.discountPrice || item.price).toLocaleString('en-IN')}
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-[#686558]/50 shrink-0" />
                      </div>
                    ))}
                  </div>
                ) : query.trim().length > 0 && !isSearching ? (
                  <div className="text-center py-12 text-[#686558] space-y-2">
                    <p className="text-sm font-serif font-semibold text-[#2A2923]">
                      No Results Found
                    </p>
                    <p className="text-xs">
                      No matching winter pieces found for "{query}". Try searching for Cashmere,
                      Merino, Cardigan, or Shawl.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4 pt-2">
                    <p className="text-xs font-semibold text-[#2A2923] uppercase tracking-wider">
                      Popular Searches
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { label: 'Sweaters', query: 'Winter Sweaters' },
                        { label: 'Cashmere', query: 'Cashmere' },
                        { label: 'Cardigans', query: 'Cardigans' },
                        { label: 'Shawls', query: 'Shawls' },
                        { label: 'Custom Knit', query: 'Custom' },
                      ].map((tag) => (
                        <button
                          key={tag.label}
                          onClick={() => {
                            dispatch(setSearchQuery(tag.query));
                            dispatch(executeSearch(tag.query));
                          }}
                          className="px-3 py-1.5 text-xs bg-[#FAEDCD]/50 hover:bg-[#FAEDCD] border border-[#DDCBA4] rounded-sm text-[#2A2923] transition-colors"
                        >
                          {tag.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Drawer Footer CTA */}
              {query.trim() && (
                <div className="p-4 border-t border-[#DDCBA4]/60 bg-[#FAEDCD]/30">
                  <button
                    onClick={() => {
                      onClose();
                      navigate(`/clothing?search=${encodeURIComponent(query.trim())}`);
                    }}
                    className="w-full py-2.5 px-4 bg-[#D4A373] hover:bg-[#c28f5e] text-white text-xs font-semibold rounded-sm flex items-center justify-center gap-2 transition-colors"
                  >
                    <span>View All Results ("{query}")</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SearchDrawer;
