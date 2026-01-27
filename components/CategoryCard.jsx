"use client";

import Link from 'next/link';
import MiniProductCard from './MiniProductCard';

export default function CategoryCard({ category }) {
  const { categoryName, linkToAll, products } = category;

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="flex-shrink-0 bg-[#f5f5f5] rounded-xl overflow-hidden border border-[#e0e0e0]">
      {/* Header de la categoría */}
      <div className="px-4 py-3 border-b border-[#e0e0e0] bg-[#f2f8fd]">
        <div className="flex justify-between items-center">
          <h3 className="text-base font-bold text-[#000000]">
            {categoryName}
          </h3>
          <Link
            href={linkToAll}
            className="text-[#0071ce] font-medium text-xs underline hover:text-[#0056a3] transition-colors"
          >
            Ver todo
          </Link>
        </div>
      </div>

      {/* Grid 2x2 de productos */}
      <div className="p-1.5">
        <div className="grid grid-cols-2 gap-0.5">
          {products.map((product) => (
            <div key={product.id}>
              <MiniProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
