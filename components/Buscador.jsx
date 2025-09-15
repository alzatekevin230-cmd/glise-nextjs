// components/Buscador.jsx
"use client";

import { useState, useEffect } from 'react';
import Fuse from 'fuse.js';

export default function Buscador({ products }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [fuse, setFuse] = useState(null);

  useEffect(() => {
    // Inicializamos Fuse.js con la lista de productos
    if (products && products.length > 0) {
      const options = {
        keys: ['name', 'category', 'laboratorio'],
        includeScore: true,
        threshold: 0.4,
      };
      setFuse(new Fuse(products, options));
    }
  }, [products]);

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (fuse && term.length > 1) {
      const searchResults = fuse.search(term).slice(0, 5).map(result => result.item);
      setResults(searchResults);
    } else {
      setResults([]);
    }
  };

  const formatPrice = (price) => `$${Math.round(price).toLocaleString('es-CO')}`;

  return (
    <div className="relative w-full max-w-3xl">
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearch}
        placeholder="Busca tus productos, marcas y más..."
        className="w-full pl-5 pr-16 py-3 border-2 border-cyan-500 rounded-full focus:outline-none focus:ring-2 focus:ring-cyan-500"
      />
      <button type="button" className="absolute right-2 top-1/2 -translate-y-1/2 bg-cyan-600 text-white w-10 h-10 rounded-full" aria-label="Buscar">
        <i className="fas fa-search"></i>
      </button>

      {results.length > 0 && (
        <div className="absolute mt-2 w-full rounded-md bg-white shadow-lg z-50">
          {results.map(p => (
            <a key={p.id} href={`#/producto/${p.id}`} className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100">
              <img src={p.image || p.images?.[0]} alt={p.name} className="w-10 h-10 object-contain rounded-md mr-4" />
              <div>
                <p className="font-semibold">{p.name}</p>
                <p className="text-sm text-blue-600">{formatPrice(p.price)}</p>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}