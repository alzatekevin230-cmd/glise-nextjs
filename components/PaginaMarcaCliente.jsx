// components/PaginaMarcaCliente.jsx
"use client";

import { useState, useMemo, useEffect, useCallback } from 'react';
import TarjetaProducto from '@/components/ProductCard.jsx';
import Pagination from '@/components/Pagination.jsx';
import dynamic from 'next/dynamic';
import BrandHero from '@/components/BrandHero';
import Breadcrumbs from '@/components/Breadcrumbs';
import ProductCarousel from '@/components/ProductCarousel';
import { FaThLarge, FaCheck, FaFilter, FaFire, FaBoxes, FaSearch } from 'react-icons/fa';

// Cargar PriceFilter solo en el cliente
const PriceFilter = dynamic(() => import('@/components/PriceFilter'), {
  ssr: false,
  loading: () => (
    <div className="p-4 text-center text-gray-500 text-sm">
      <div className="animate-pulse">Cargando filtro...</div>
    </div>
  )
});

const formatPrice = (price) => `$${Math.round(price).toLocaleString('es-CO')}`;

export default function PaginaMarcaCliente({ brandName, initialProducts }) {
  // Mapeo de banners específicos por marca
  const getBannerImages = (brand) => {
    const brandLower = brand.toLowerCase();
    
    if (brandLower.includes('nivea')) {
      return {
        desktop: '/imagenespagina/banerdemarcaniveaescritorio.webp',
        mobile: '/imagenespagina/banerdemarcanivea.webp'
      };
    }
    
    if (brandLower.includes('eucerin')) {
      return {
        desktop: '/imagenespagina/banerdemarcaeucerinescritorio.webp',
        mobile: '/imagenespagina/banerdemarcaeucerinmovil.webp'
      };
    }
    
    if (brandLower.includes('dermanat')) {
      return {
        desktop: '/imagenespagina/banerdemarcadermantaescritorio.webp',
        mobile: '/imagenespagina/banerdemarcadermanatmovil.webp'
      };
    }
    if (brandLower.includes('isdin')) {
      return {
        desktop: '/imagenespagina/banerdemarcaisdinescritorio.webp',
        mobile: '/imagenespagina/banerdemarcaisdinmovil.webp'
      };
    }
    if (brandLower.includes('cerave')) {
      return {
        desktop: '/imagenespagina/banerdeceraveescritorio.webp',
        mobile: '/imagenespagina/banerdeceravemovil.webp'
      };
    }
    if (brandLower.includes('almipro')) {
      return {
        desktop: '/imagenespagina/banerdealmiproescritorio.webp',
        mobile: '/imagenespagina/banerdealmipromovil.webp'
      };
    }
    if (brandLower.includes('funat')) {
      return {
        desktop: '/imagenespagina/banerdefunatescritorio.webp',
        mobile: '/imagenespagina/banerdefunatmovil.webp'
      };
    }
    if (brandLower.includes('glisé')) {
      return {
        desktop: '/imagenespagina/banerdegliseescritorio.webp',
        mobile: '/imagenespagina/banerdeglisemovil.webp'
      };
    }
    if (brandLower.includes('heel')) {
      return {
        desktop: '/imagenespagina/banerdeheelescritorio.webp',
        mobile: '/imagenespagina/banerdeheelmovil.webp'
      };
    }
    
    return {
      desktop: '/imagenespagina/baner1.webp',
      mobile: '/imagenespagina/banermovil1.webp'
    };
  };

  const bannerImages = getBannerImages(brandName);

  // Estados para filtros
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeBrands, setActiveBrands] = useState([]);
  const [activePresentations, setActivePresentations] = useState([]);
  const [activeUnits, setActiveUnits] = useState([]);
  const [activeCategories, setActiveCategories] = useState([]); // NUEVO: filtro por categorías
  const [priceRange, setPriceRange] = useState([0, 0]);
  const [brandSearchTerm, setBrandSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('popularity');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 20;

  // Calcular filtros disponibles
  const { availableBrands, availablePresentations, availableUnits, availableCategories, minPrice, maxPrice } = useMemo(() => {
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
    const categories = [...new Set(productsWithUnits.map(p => p.category).filter(Boolean))].sort();
    const prices = productsWithUnits.map(p => p.price);
    return {
      availableBrands: brands,
      availablePresentations: presentations,
      availableUnits: units,
      availableCategories: categories,
      minPrice: prices.length > 0 ? Math.floor(Math.min(...prices)) : 0,
      maxPrice: prices.length > 0 ? Math.ceil(Math.max(...prices)) : 100000,
    };
  }, [initialProducts]);
  
  useEffect(() => {
    setPriceRange([minPrice, maxPrice]);
  }, [minPrice, maxPrice]);

  // Funciones de manejo de filtros
  const handleBrandChange = (brandName) => { 
    setCurrentPage(1); 
    setActiveBrands(prev => prev.includes(brandName) ? prev.filter(b => b !== brandName) : [...prev, brandName]); 
  };
  
  const handlePresentationChange = (presentationName) => { 
    setCurrentPage(1); 
    setActivePresentations(prev => prev.includes(presentationName) ? prev.filter(p => p !== presentationName) : [...prev, presentationName]); 
  };
  
  const handleUnitChange = (unitName) => { 
    setCurrentPage(1); 
    setActiveUnits(prev => prev.includes(unitName) ? prev.filter(u => u !== unitName) : [...prev, unitName]); 
  };

  const handleCategoryChange = (categoryName) => {
    setCurrentPage(1);
    setActiveCategories(prev => prev.includes(categoryName) ? prev.filter(c => c !== categoryName) : [...prev, categoryName]);
  };

  const handlePriceChange = useCallback((newRange) => {
    setCurrentPage(1);
    setPriceRange(newRange);
  }, []);
  
  const clearFilters = () => {
    setActiveBrands([]);
    setActivePresentations([]);
    setActiveUnits([]);
    setActiveCategories([]);
    setPriceRange([minPrice, maxPrice]);
    setBrandSearchTerm('');
    setSortBy('popularity');
    setCurrentPage(1);
  };

  const filteredBrands = availableBrands.filter(brand => brand.toLowerCase().includes(brandSearchTerm.toLowerCase()));
  
  // Productos filtrados y ordenados
  const sortedAndFilteredProducts = useMemo(() => {
    let filtered = [...initialProducts];
    if (activeBrands.length > 0) { filtered = filtered.filter(p => activeBrands.includes(p.laboratorio)); }
    if (activePresentations.length > 0) { filtered = filtered.filter(p => activePresentations.includes(p.presentacionFarmaceutica)); }
    if (activeCategories.length > 0) { filtered = filtered.filter(p => activeCategories.includes(p.category)); }
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
  }, [initialProducts, activeBrands, activePresentations, activeUnits, activeCategories, priceRange, sortBy]);

  // Productos destacados (los más populares)
  const featuredProducts = useMemo(() => {
    return [...initialProducts]
      .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
      .slice(0, 12);
  }, [initialProducts]);

  const totalFilteredProducts = sortedAndFilteredProducts.length;
  const totalPages = Math.ceil(totalFilteredProducts / productsPerPage);
  const paginatedProducts = sortedAndFilteredProducts.slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage);

  // Breadcrumbs
  const breadcrumbItems = [
    { label: 'Inicio', href: '/' },
    { label: 'Marcas', href: '/' }, // Podrías crear una página de listado de marcas
    { label: brandName, active: true }
  ];

  // Componente Sidebar
  const Sidebar = () => (
    <aside className="lg:col-span-1 bg-white p-4 rounded-lg shadow h-fit sticky top-32">
      <div className="space-y-2">
        <div className="flex justify-between items-center px-2 pb-2 border-b">
          <h3 className="text-xl font-semibold">Filtros</h3>
          <button onClick={clearFilters} className="text-sm text-blue-600 hover:underline font-semibold">Limpiar todo</button>
        </div>

        {/* Filtro de Precio con el nuevo PriceFilter */}
        <details className="filter-accordion" open>
          <summary>Precio</summary>
          <div className="p-4">
            {maxPrice > minPrice && (
              <PriceFilter
                minPrice={minPrice}
                maxPrice={maxPrice}
                value={priceRange}
                onChange={handlePriceChange}
                productsCount={totalFilteredProducts}
                totalProducts={initialProducts.length}
                allProducts={initialProducts}
              />
            )}
          </div>
        </details>

        {/* NUEVO: Filtro rápido por categorías de la marca */}
        {availableCategories.length > 1 && (
          <details className="filter-accordion" open>
            <summary className="flex items-center gap-2">
              <FaThLarge />
              Categorías
            </summary>
            <div className="p-4">
              <div className="filter-options-container space-y-2">
                {availableCategories.map(category => {
                  const categoryCount = initialProducts.filter(p => p.category === category).length;
                  return (
                    <label key={category} className="filter-checkbox-label">
                      <input 
                        type="checkbox" 
                        checked={activeCategories.includes(category)} 
                        onChange={() => handleCategoryChange(category)} 
                      />
                      <span className="filter-checkbox-span">
                        <FaCheck />
                      </span>
                      <span className="flex-1">{category}</span>
                      <span className="text-xs text-gray-500">({categoryCount})</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </details>
        )}

        <details className="filter-accordion">
          <summary>Marca / Laboratorio</summary>
          <div className="p-4">
            <input 
              id="brand-search-input" 
              type="text" 
              value={brandSearchTerm} 
              onChange={e => setBrandSearchTerm(e.target.value)} 
              placeholder="Buscar marca..." 
            />
            <div className="filter-options-container space-y-2 mt-3">
              {filteredBrands.map(brand => (
                <label key={brand} className="filter-checkbox-label">
                  <input type="checkbox" checked={activeBrands.includes(brand)} onChange={() => handleBrandChange(brand)} />
                  <span className="filter-checkbox-span"><FaCheck /></span>
                  {brand}
                </label>
              ))}
            </div>
          </div>
        </details>

        <details className="filter-accordion">
          <summary>Presentación</summary>
          <div className="p-4">
            <div className="filter-options-container space-y-2">
              {availablePresentations.map(pres => (
                <label key={pres} className="filter-checkbox-label">
                  <input type="checkbox" checked={activePresentations.includes(pres)} onChange={() => handlePresentationChange(pres)} />
                  <span className="filter-checkbox-span"><FaCheck /></span>
                  {pres}
                </label>
              ))}
            </div>
          </div>
        </details>

        <details className="filter-accordion">
          <summary>Contenido</summary>
          <div className="p-4">
            <div className="filter-options-container space-y-2">
              {availableUnits.map(unit => (
                <label key={unit} className="filter-checkbox-label">
                  <input type="checkbox" checked={activeUnits.includes(unit)} onChange={() => handleUnitChange(unit)} />
                  <span className="filter-checkbox-span"><FaCheck /></span>
                  {unit}
                </label>
              ))}
            </div>
          </div>
        </details>
      </div>
    </aside>
  );

  return (
    <>
      {/* Breadcrumbs */}
      <div className="mb-6">
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      {/* Botón de filtros móviles */}
      <div className="flex items-center justify-end mb-6 lg:hidden">
        <button onClick={() => setIsFilterOpen(!isFilterOpen)} className="bg-white border border-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg flex items-center gap-2">
          <FaFilter />
          <span>{isFilterOpen ? 'Ocultar Filtros' : 'Mostrar Filtros'}</span>
        </button>
      </div>

      {/* Hero Section con logo, stats y descripción */}
      <BrandHero 
        brandName={brandName}
        productsCount={initialProducts.length}
        minPrice={minPrice}
        maxPrice={maxPrice}
        bannerImages={bannerImages}
      />

      {/* Sección de productos destacados de la marca */}
      {featuredProducts.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 flex items-center gap-2">
            <FaFire className="text-orange-500" />
            Los Más Vendidos de {brandName}
          </h2>
          <ProductCarousel 
            products={featuredProducts}
            carouselClassName="featured-brand-carousel"
            nextButtonClassName="featured-brand-next"
            prevButtonClassName="featured-brand-prev"
          />
        </div>
      )}

      {/* Título de todos los productos */}
      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
          <FaBoxes className="text-blue-600" />
          Todos los Productos {brandName}
          <span className="text-lg font-normal text-gray-600">({initialProducts.length})</span>
        </h2>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className={`lg:block ${isFilterOpen ? 'block' : 'hidden'}`}>
          <Sidebar />
        </div>
        
        <div className="lg:col-span-3">
          <div className="flex justify-between items-center mb-6">
            <span className="text-sm text-gray-600">
              Mostrando <span className="font-bold">{totalFilteredProducts}</span> productos
            </span>
            <select 
              value={sortBy} 
              onChange={(e) => { setCurrentPage(1); setSortBy(e.target.value); }} 
              className="border-gray-300 rounded-md shadow-sm text-sm"
            >
              <option value="popularity">Más populares</option>
              <option value="price-asc">Precio: más bajo a más alto</option>
              <option value="price-desc">Precio: más alto a más bajo</option>
              <option value="name-az">Nombre: A-Z</option>
            </select>
          </div>

          {paginatedProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-2">
                {paginatedProducts.map(product => (
                  <TarjetaProducto key={product.id} product={product} />
                ))}
              </div>
              <Pagination 
                currentPage={currentPage} 
                totalPages={totalPages} 
                onPageChange={(page) => setCurrentPage(page)} 
              />
            </>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <FaSearch className="text-6xl text-gray-300 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No se encontraron productos
              </h3>
              <p className="text-gray-500 mb-4">
                Intenta ajustar los filtros para ver más resultados
              </p>
              <button 
                onClick={clearFilters}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Limpiar filtros
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
