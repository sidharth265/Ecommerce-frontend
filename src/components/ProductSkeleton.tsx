import { motion } from 'framer-motion';

export function ProductSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden">
      <div className="w-full h-48 bg-slate-200 animate-pulse" />
      <div className="p-4">
        <div className="h-3 w-20 bg-slate-200 rounded animate-pulse mb-2" />
        <div className="h-5 w-3/4 bg-slate-200 rounded animate-pulse mb-3" />
        <div className="flex items-center gap-1 mb-3">
          <div className="h-4 w-20 bg-slate-200 rounded animate-pulse" />
        </div>
        <div className="flex items-center justify-between">
          <div className="h-6 w-24 bg-slate-200 rounded animate-pulse" />
          <div className="h-9 w-16 bg-slate-200 rounded-lg animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.05 }}
        >
          <ProductSkeleton />
        </motion.div>
      ))}
    </div>
  );
}
