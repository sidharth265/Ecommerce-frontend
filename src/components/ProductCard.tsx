import { motion } from 'framer-motion';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
  index: number;
}

export function ProductCard({ product, onClick, index }: ProductCardProps) {
  const discountedPrice = product.price * (1 - product.discountPercentage / 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      onClick={() => onClick(product)}
      className="bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer group hover:shadow-xl transition-shadow duration-300"
    >
      <div className="relative overflow-hidden">
        <motion.img
          src={product.thumbnail}
          alt={product.title}
          className="w-full h-48 object-cover"
          whileHover={{ scale: 1.08 }}
          transition={{ duration: 0.3 }}
        />
        {product.discountPercentage > 0 && (
          <div className="absolute top-3 right-3 bg-rose-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
            -{Math.round(product.discountPercentage)}%
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="p-4">
        <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">{product.category}</p>
        <h3 className="font-semibold text-slate-800 text-lg mb-2 line-clamp-1 group-hover:text-indigo-600 transition-colors">
          {product.title}
        </h3>

        <div className="flex items-center gap-1 mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-4 h-4 ${i < Math.round(product.rating) ? 'text-amber-400' : 'text-slate-200'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.951.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-xs text-slate-500">({product.rating.toFixed(1)})</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-xl font-bold text-slate-800">${discountedPrice.toFixed(2)}</span>
            {product.discountPercentage > 0 && (
              <span className="text-sm text-slate-400 line-through ml-2">${product.price.toFixed(2)}</span>
            )}
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-slate-900 text-white text-sm px-4 py-2 rounded-lg font-medium hover:bg-slate-700 transition-colors"
          >
            View
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
