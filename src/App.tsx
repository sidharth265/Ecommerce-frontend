import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, AlertCircle, RefreshCcw } from 'lucide-react';
import { ProductCard } from './components/ProductCard';
import { ProductDetail } from './components/ProductDetail';
import { ProductGridSkeleton } from './components/ProductSkeleton';
import { Filters } from './components/Filters';
import { Pagination } from './components/Pagination';
import { fetchProducts, fetchCategories, fetchProductsByCategory } from './services/api';
import type { Product, Category, SortOption, ProductsResponse } from './types';

const ITEMS_PER_PAGE = 12;

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('title-asc');
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE);

  // Sorting the products at client-side
  const sortedProducts = useMemo(() => {
    const sorted = [...products];
    switch (sortBy) {
      case 'price-asc':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return sorted.sort((a, b) => b.price - a.price);
      case 'title-asc':
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case 'title-desc':
        return sorted.sort((a, b) => b.title.localeCompare(a.title));
      default:
        return sorted;
    }
  }, [products, sortBy]);

  // Fetching the categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch {
        console.error('Failed to fetch categories');
      }
    };
    loadCategories();
  }, []);

  // Fetching the products when category or page changes
  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const skip = (currentPage - 1) * ITEMS_PER_PAGE;
      let response: ProductsResponse;

      if (selectedCategory) {
        response = await fetchProductsByCategory(selectedCategory, 100, 0);
      } else {
        response = await fetchProducts(ITEMS_PER_PAGE, skip);
      }

      if (selectedCategory) {
        setProducts(response.products);
        setTotalProducts(response.total);
      } else {
        setProducts(response.products);
        setTotalProducts(response.total);
      }
    } catch (err) {
      setError('Failed to load products. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, currentPage]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Reseting to page 1 when the category or sort is changed
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, sortBy]);

  const handleRetry = () => {
    loadProducts();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              className="flex items-center gap-3"
              whileHover={{ scale: 1.02 }}
            >
              <div className="bg-slate-900 p-2 rounded-xl">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Product Explorer</h1>
                <p className="text-xs text-slate-500">Discover amazing products</p>
              </div>
            </motion.div>

            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-500">
                {totalProducts} products
              </span>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        {!loading && !error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Filters
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              sortBy={sortBy}
              onSortChange={setSortBy}
            />
          </motion.div>
        )}

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-16 px-4"
          >
            <div className="bg-rose-50 rounded-2xl p-8 max-w-md text-center">
              <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Something went wrong</h3>
              <p className="text-slate-600 mb-4">{error}</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRetry}
                className="inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-slate-700 transition-colors"
              >
                <RefreshCcw className="w-4 h-4" />
                Try Again
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Loading State */}
        {loading && !error && <ProductGridSkeleton />}

        {/* Products Grid */}
        {!loading && !error && (
          <>
            {sortedProducts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <p className="text-slate-500">No products found.</p>
              </motion.div>
            ) : (
              <>
                <motion.div
                  layout
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                >
                  {sortedProducts.map((product, index) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onClick={setSelectedProduct}
                      index={index}
                    />
                  ))}
                </motion.div>

                {/* Pagination */}
                {!selectedCategory && totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                )}
              </>
            )}
          </>
        )}
      </main>

      {/* Product Detail Modal */}
      <ProductDetail product={selectedProduct} onClose={() => setSelectedProduct(null)} />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-slate-500">
            <p>Powered by DummyJSON API</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
