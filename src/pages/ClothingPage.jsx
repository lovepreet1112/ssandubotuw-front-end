import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { Filter, X, ChevronLeft, ChevronRight } from 'lucide-react';
import ProductFilter from '../components/products/ProductFilter';
import ProductSort from '../components/products/ProductSort';
import ProductGrid from '../components/products/ProductGrid';
import { fetchProducts } from '../redux/slices/productSlice';
import { setCategory, setSort, setPage, resetFilters } from '../../src/redux/slices/filterSlice';
import Button from '../components/common/Button';

export const ClothingPage = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const { products, pagination, loading } = useSelector((state) => state.products);
  const filters = useSelector((state) => state.filters);

  // Sync URL search parameters if user navigated via link e.g. /clothing?category=Cardigans
  useEffect(() => {
    const catParam = searchParams.get('category');
    if (catParam) {
      dispatch(setCategory(catParam));
    }
    const sortParam = searchParams.get('sort');
    if (sortParam) {
      dispatch(setSort(sortParam));
    }
  }, [searchParams, dispatch]);

  // Fetch products whenever Redux filters change
  useEffect(() => {
    const queryParams = {
      page: filters.page,
      limit: filters.limit,
      sort: filters.sort,
    };

    if (filters.category && filters.category !== 'All') queryParams.category = filters.category;
    if (filters.minPrice) queryParams.minPrice = filters.minPrice;
    if (filters.maxPrice) queryParams.maxPrice = filters.maxPrice;
    if (filters.size && filters.size !== 'All') queryParams.size = filters.size;
    if (filters.color && filters.color !== 'All') queryParams.color = filters.color;
    if (filters.availability) queryParams.availability = true;

    // Search query from URL or Redux
    const searchParam = searchParams.get('search');
    if (searchParam) queryParams.search = searchParam;

    dispatch(fetchProducts(queryParams));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [filters, searchParams, dispatch]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= (pagination.totalPages || 1)) {
      dispatch(setPage(newPage));
    }
  };

  return (
    <div className="py-8 md:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
        <span className="text-xs uppercase tracking-[0.2em] text-[#D4A373] font-semibold">
          Seasonal Catalogue • ਸਰਦੀਆਂ ਦੇ ਕੱਪੜੇ
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#2A2923]">
          {filters.category !== 'All' ? filters.category : 'Handcrafted Winter Knitwear'}
        </h1>
        <p className="text-xs sm:text-sm text-[#686558] max-w-xl mx-auto leading-relaxed">
          Individually made to order with certified Himalayan Cashmere, pure Merino wool, and
          timeless craftsmanship.
        </p>

        {/* Mobile Filter Button */}
        <div className="pt-4 lg:hidden">
          <Button
            variant="warm"
            size="sm"
            onClick={() => setMobileFilterOpen(true)}
            icon={Filter}
            className="w-full sm:w-auto"
          >
            Filters & Specifications
          </Button>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Desktop Filter Sidebar */}
        <div className="hidden lg:block lg:col-span-1 bg-[#FDFBF7] p-5 border border-[#DDCBA4]/60 rounded-sm shadow-warm-sm sticky top-24">
          <ProductFilter />
        </div>

        {/* Products Grid & Sorting Column */}
        <div className="lg:col-span-3">
          <ProductSort totalCount={pagination.total || products.length} />

          <ProductGrid
            products={products}
            loading={loading}
            onResetFilters={() => dispatch(resetFilters())}
          />

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="pt-12 flex items-center justify-center gap-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="p-2 rounded-sm border border-[#DDCBA4] text-[#2A2923] hover:bg-[#FAEDCD] disabled:opacity-30 disabled:pointer-events-none transition-colors"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-1 text-xs font-semibold text-[#2A2923]">
                {[...Array(pagination.totalPages)].map((_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-8 h-8 rounded-sm transition-colors ${
                        pagination.page === pageNum
                          ? 'bg-[#D4A373] text-white shadow-sm'
                          : 'hover:bg-[#FAEDCD] text-[#2A2923] border border-transparent'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
                className="p-2 rounded-sm border border-[#DDCBA4] text-[#2A2923] hover:bg-[#FAEDCD] disabled:opacity-30 disabled:pointer-events-none transition-colors"
                aria-label="Next page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
          <div
            onClick={() => setMobileFilterOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
          />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-sm bg-[#FDFBF7] p-6 shadow-warm-lg flex flex-col justify-between overflow-y-auto">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-[#DDCBA4]/60 mb-6">
                  <h3 className="font-serif text-lg font-bold text-[#2A2923]">Filter Products</h3>
                  <button
                    onClick={() => setMobileFilterOpen(false)}
                    className="p-1 rounded-full text-[#686558] hover:bg-[#FAEDCD]"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <ProductFilter isMobile={true} onCloseMobile={() => setMobileFilterOpen(false)} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClothingPage;
