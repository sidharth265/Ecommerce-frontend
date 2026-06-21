import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Package, Truck, Shield, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Product } from '../types';

interface ProductDetailProps {
  product: Product | null;
  onClose: () => void;
}

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 50 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring' as const, damping: 25, stiffness: 300 } },
  exit: { opacity: 0, scale: 0.9, y: 50, transition: { duration: 0.2 } },
};

export function ProductDetail({ product, onClose }: ProductDetailProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (product) {
      setCurrentImageIndex(0);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [product]);

  if (!product) return null;

  const discountedPrice = product.price * (1 - product.discountPercentage / 100);
  const images = product.images.length > 0 ? product.images : [product.thumbnail];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={onClose}
        >
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
          >
            <div className="flex flex-col lg:flex-row h-full">
              {/* Image Gallery */}
              <div className="lg:w-1/2 bg-slate-100 p-6 flex flex-col">
                <div className="relative flex-1 flex items-center justify-center mb-4">
                  <motion.img
                    key={currentImageIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    src={images[currentImageIndex]}
                    alt={product.title}
                    className="max-h-64 lg:max-h-80 object-contain rounded-xl"
                  />

                  {images.length > 1 && (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          prevImage();
                        }}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 rounded-full p-2 shadow-md hover:bg-white transition-colors"
                      >
                        <ChevronLeft className="w-5 h-5 text-slate-700" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          nextImage();
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 rounded-full p-2 shadow-md hover:bg-white transition-colors"
                      >
                        <ChevronRight className="w-5 h-5 text-slate-700" />
                      </motion.button>
                    </>
                  )}
                </div>

                {/* Thumbnails */}
                {images.length > 1 && (
                  <div className="flex gap-2 justify-center">
                    {images.map((img, idx) => (
                      <motion.button
                        key={idx}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentImageIndex(idx);
                        }}
                        className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                          idx === currentImageIndex ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-transparent'
                        }`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </motion.button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="lg:w-1/2 p-6 overflow-y-auto">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm text-indigo-600 font-medium uppercase tracking-wider mb-1">
                      {product.category}
                    </p>
                    {product.brand && (
                      <p className="text-xs text-slate-500 mb-2">by {product.brand}</p>
                    )}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-slate-500" />
                  </motion.button>
                </div>

                <h2 className="text-2xl font-bold text-slate-800 mb-4">{product.title}</h2>

                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.round(product.rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-slate-600 font-medium">{product.rating.toFixed(1)}</span>
                  <span className="text-slate-400">|</span>
                  <span className="text-slate-500 text-sm">{product.stock} in stock</span>
                </div>

                <div className="flex items-baseline gap-3 mb-6">
                  <span className="text-3xl font-bold text-slate-800">${discountedPrice.toFixed(2)}</span>
                  {product.discountPercentage > 0 && (
                    <>
                      <span className="text-lg text-slate-400 line-through">${product.price.toFixed(2)}</span>
                      <span className="bg-rose-100 text-rose-600 text-sm font-semibold px-2 py-1 rounded-full">
                        -{Math.round(product.discountPercentage)}%
                      </span>
                    </>
                  )}
                </div>

                <p className="text-slate-600 leading-relaxed mb-6">{product.description}</p>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                    <Package className="w-5 h-5 text-indigo-500" />
                    <div>
                      <p className="text-xs text-slate-500">SKU</p>
                      <p className="text-sm font-medium text-slate-700">{product.sku}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                    <Truck className="w-5 h-5 text-emerald-500" />
                    <div>
                      <p className="text-xs text-slate-500">Shipping</p>
                      <p className="text-sm font-medium text-slate-700 line-clamp-1">{product.shippingInformation}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                    <Shield className="w-5 h-5 text-amber-500" />
                    <div>
                      <p className="text-xs text-slate-500">Warranty</p>
                      <p className="text-sm font-medium text-slate-700 line-clamp-1">{product.warrantyInformation}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                    <Package className="w-5 h-5 text-rose-500" />
                    <div>
                      <p className="text-xs text-slate-500">Returns</p>
                      <p className="text-sm font-medium text-slate-700 line-clamp-1">{product.returnPolicy}</p>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                {product.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {product.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-slate-100 text-slate-600 text-xs px-3 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Action Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-slate-900 text-white py-3 rounded-xl font-semibold hover:bg-slate-700 transition-colors"
                >
                  Add to Cart - ${discountedPrice.toFixed(2)}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
