// components/PaginaCategoriaCliente.jsx
"use client";

import { useState, useMemo, useEffect, useRef } from 'react'; // CAMBIO: Añadimos useRef
import TarjetaProducto from '@/components/ProductCard.jsx';
import Pagination from '@/components/Pagination.jsx';
import ReactSlider from "react-slider";
import Link from 'next/link';
import BotonVolver from '@/components/BotonVolver';
import CategoryBanners from '@/components/CategoryBanners';

const formatPrice = (price) => `$${Math.round(price).toLocaleString('es-CO')}`;


export default function PaginaCategoriaCliente({ initialProducts, categoryName }) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  // ... (otros estados sin cambios)
  const [activeBrands, setActiveBrands] = useState([]);
  const [activePresentations, setActivePresentations] = useState([]);
  const [activeUnits, setActiveUnits] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 0]);
  const [brandSearchTerm, setBrandSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('popularity');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 20;


  const { availableBrands, availablePresentations, availableUnits, minPrice, maxPrice } = useMemo(() => {
    // ... (lógica de useMemo sin cambios)
    const unitRegex = /\b(\d+[\.,]?\d*\s*(?:g|gr|G|GR|mg|MG|mcg|MCG|ml|mL|ML|l|L|cápsulas|capsulas|cap|cáps|caps|tabletas|tabs|comprimidos|perlas|sobres|unidades|und|uds))\b/i;
    const productsWithUnits = initialProducts.map(p => {
        const match = p.name.match(unitRegex);
        return { ...p, unitOfMeasure: match ? match[0].replace(/\s+/g, ' ').trim() : null };
    });
    const brands = [...new Set(productsWithUnits.map(p => p.laboratorio).filter(Boolean))].sort();
    const presentations = [...new Set(productsWithUnits.map(p => p.presentacionFarmaceutica).filter(Boolean))].sort();
    const units = [...new Set(productsWithUnits.map(p => p.unitOfMeasure).filter(Boolean))].sort((a, b) => {
        const numA = parseFloat(a) || 0;
        const numB = parseFloat(b) || 0;
        if (numA !== numB) return numA - numB;
        return a.localeCompare(b);
    });
    const prices = productsWithUnits.map(p => p.price);
    return {
      availableBrands: brands,
      availablePresentations: presentations,
      availableUnits: units,
      minPrice: prices.length > 0 ? Math.floor(Math.min(...prices)) : 0,
      maxPrice: prices.length > 0 ? Math.ceil(Math.max(...prices)) : 100000,
    };
  }, [initialProducts]);
  

  useEffect(() => {
    setPriceRange([minPrice, maxPrice]);
  }, [minPrice, maxPrice]);
  
  // ... (resto de funciones y lógica sin cambios)
  const handleBrandChange = (brandName) => { setCurrentPage(1); setActiveBrands(prev => prev.includes(brandName) ? prev.filter(b => b !== brandName) : [...prev, brandName]); };
  const handlePresentationChange = (presentationName) => { setCurrentPage(1); setActivePresentations(prev => prev.includes(presentationName) ? prev.filter(p => p !== presentationName) : [...prev, presentationName]); };
  const handleUnitChange = (unitName) => { setCurrentPage(1); setActiveUnits(prev => prev.includes(unitName) ? prev.filter(u => u !== unitName) : [...prev, unitName]); };
  const clearFilters = () => {
    setActiveBrands([]);
    setActivePresentations([]);
    setActiveUnits([]);
    setPriceRange([minPrice, maxPrice]);
    setBrandSearchTerm('');
    setSortBy('popularity');
    setCurrentPage(1);
  };
  const filteredBrands = availableBrands.filter(brand => brand.toLowerCase().includes(brandSearchTerm.toLowerCase()));
  const sortedAndFilteredProducts = useMemo(() => {
    let filtered = [...initialProducts];
    if (activeBrands.length > 0) { filtered = filtered.filter(p => activeBrands.includes(p.laboratorio)); }
    if (activePresentations.length > 0) { filtered = filtered.filter(p => activePresentations.includes(p.presentacionFarmaceutica)); }
    if (activeUnits.length > 0) {
        const productsWithUnits = initialProducts.map(p => {
            const unitRegex = /\b(\d+[\.,]?\d*\s*(?:g|gr|G|GR|mg|MG|mcg|MCG|ml|mL|ML|l|L|cápsulas|capsulas|cap|cáps|caps|tabletas|tabs|comprimidos|perlas|sobres|unidades|und|uds))\b/i;
            const match = p.name.match(unitRegex);
            return { ...p, unitOfMeasure: match ? match[0].replace(/\s+/g, ' ').trim() : null };
        });
        filtered = productsWithUnits.filter(p => activeUnits.includes(p.unitOfMeasure));
    }
    filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);
    switch (sortBy) {
      case 'price-asc': filtered.sort((a, b) => a.price - b.price); break;
      case 'price-desc': filtered.sort((a, b) => b.price - a.price); break;
      case 'name-az': filtered.sort((a, b) => a.name.localeCompare(b.name)); break;
      default: filtered.sort((a, b) => (b.popularity || 0) - (a.popularity || 0)); break;
    }
    return filtered;
  }, [initialProducts, activeBrands, activePresentations, activeUnits, priceRange, sortBy]);
  const totalFilteredProducts = sortedAndFilteredProducts.length;
  const totalPages = Math.ceil(totalFilteredProducts / productsPerPage);
  const paginatedProducts = sortedAndFilteredProducts.slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage);
  const Sidebar = () => (
    <aside className="lg:col-span-1 bg-white p-4 rounded-lg shadow h-fit sticky top-32">
      <div className="space-y-2">
        <div className="flex justify-between items-center px-2 pb-2 border-b">
          <h3 className="text-xl font-semibold">Filtros</h3>
          <button onClick={clearFilters} className="text-sm text-blue-600 hover:underline font-semibold">Limpiar todo</button>
        </div>
        <details className="filter-accordion" open>
          <summary>Precio</summary>
          <div className="p-4">
            {maxPrice > minPrice && (
              <>
                <ReactSlider
                  className="slider"
                  thumbClassName="thumb"
                  trackClassName="track"
                  defaultValue={[minPrice, maxPrice]}
                  value={priceRange}
                  min={minPrice}
                  max={maxPrice}
                  ariaLabel={['Manija inferior', 'Manija superior']}
                  renderThumb={(props) => <div {...props} key={props.key}></div>}
                  pearling
                  minDistance={1000}
                  onChange={(value) => {
                    setCurrentPage(1);
                    setPriceRange(value);
                  }}
                />
                <div className="flex justify-between items-center text-sm text-gray-600 mt-2">
                    <span>{formatPrice(priceRange[0])}</span>
                    <span>{formatPrice(priceRange[1])}</span>
                </div>
              </>
            )}
          </div>
        </details>
         <details className="filter-accordion" open>
          <summary>Marca / Laboratorio</summary>
          <div className="p-4">
            <input id="brand-search-input" type="text" value={brandSearchTerm} onChange={e => setBrandSearchTerm(e.target.value)} placeholder="Buscar marca..." />
            <div className="filter-options-container space-y-2 mt-3">
              {filteredBrands.map(brand => (
                <label key={brand} className="filter-checkbox-label"><input type="checkbox" checked={activeBrands.includes(brand)} onChange={() => handleBrandChange(brand)} /><span className="filter-checkbox-span"><i className="fas fa-check"></i></span>{brand}</label>
              ))}
            </div>
          </div>
        </details>
        <details className="filter-accordion">
          <summary>Presentación</summary>
          <div className="p-4">
            <div className="filter-options-container space-y-2">
              {availablePresentations.map(pres => (
                <label key={pres} className="filter-checkbox-label"><input type="checkbox" checked={activePresentations.includes(pres)} onChange={() => handlePresentationChange(pres)} /><span className="filter-checkbox-span"><i className="fas fa-check"></i></span>{pres}</label>
              ))}
            </div>
          </div>
        </details>
        <details className="filter-accordion">
          <summary>Contenido</summary>
          <div className="p-4">
            <div className="filter-options-container space-y-2">
              {availableUnits.map(unit => (
                <label key={unit} className="filter-checkbox-label"><input type="checkbox" checked={activeUnits.includes(unit)} onChange={() => handleUnitChange(unit)} /><span className="filter-checkbox-span"><i className="fas fa-check"></i></span>{unit}</label>
              ))}
            </div>
          </div>
        </details>
      </div>
    </aside>
  );

  return (
    <>
      {/* CAMBIO: Nueva estructura del encabezado móvil */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
  <BotonVolver />
  <div className="lg:hidden">
    <button onClick={() => setIsFilterOpen(!isFilterOpen)} className="bg-white border border-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg flex items-center gap-2">
      <i className="fas fa-filter"></i>
      <span>{isFilterOpen ? 'Ocultar Filtros' : 'Mostrar Filtros'}</span>
    </button>
  </div>
</div>
      <div>
        <h1 className="text-3xl md:text-4xl font-bold">{categoryName === 'all' ? 'Tienda' : categoryName}</h1>
      </div>
      
      <CategoryBanners categoryName={categoryName} products={initialProducts} />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className={`lg:block ${isFilterOpen ? 'block' : 'hidden'}`}>
          <Sidebar />
        </div>
        
        <div className="lg:col-span-3">
          <div className="flex justify-end mb-6">
            <select value={sortBy} onChange={(e) => { setCurrentPage(1); setSortBy(e.target.value); }} className="border-gray-300 rounded-md shadow-sm text-sm">
              <option value="popularity">Más populares</option>
              <option value="price-asc">Precio: más bajo a más alto</option>
              <option value="price-desc">Precio: más alto a más bajo</option>
              <option value="name-az">Nombre: A-Z</option>
            </select>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-2">
            {paginatedProducts.map(product => (
              <TarjetaProducto key={product.id} product={product} />
            ))}
          </div>
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={(page) => setCurrentPage(page)} />
        </div>
      </div>
    </>
  );
}