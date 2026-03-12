// components/PaginaCategoriaCliente.jsx
"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import TarjetaProducto from '@/components/ProductCard.jsx';
import Pagination from '@/components/Pagination.jsx';
import Link from 'next/link';
import CategoryBanners from '@/components/CategoryBanners';
import PriceFilter from '@/components/PriceFilter';
import { FaCheck, FaFilter } from 'react-icons/fa';

const formatPrice = (price) => `$${Math.round(price).toLocaleString('es-CO')}`;


export default function PaginaCategoriaCliente({ initialProducts, categoryName }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  // ... (otros estados sin cambios)
  const [activeBrands, setActiveBrands] = useState([]);
  const [activePresentations, setActivePresentations] = useState([]);
  const [activeUnits, setActiveUnits] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 0]);
  const [brandSearchTerm, setBrandSearchTerm] = useState('');
  // Configuración de ordenamiento por defecto:
  // Si estamos en la categoría "Milenario", ordenamos por precio (menor a mayor) para mostrar ofertas primero.
  // Para el resto, usamos popularidad.
  const [sortBy, setSortBy] = useState(() => {
    if (categoryName && categoryName.toLowerCase() === 'milenario') {
      return 'price-asc';
    }
    return 'popularity';
  });
  
  // LEER PAGINA DE LA URL (Default 1)
  const pageParam = searchParams.get('page');
  const currentPage = pageParam ? parseInt(pageParam) : 1;
  const productsPerPage = 20;

  // Función para cambiar de página (Actualiza URL)
  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page);
    router.push(`${pathname}?${params.toString()}`, { scroll: true });
  };

  // Función para generar HREF para los Links de paginación (SEO)
  const getPageHref = (page) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page);
    return `${pathname}?${params.toString()}`;
  };

  // Función auxiliar para resetear a página 1 cuando cambian filtros
  const resetPage = () => {
    if (currentPage !== 1) {
      const params = new URLSearchParams(searchParams);
      params.set('page', 1);
      // Usamos replace para no llenar el historial con resets de página
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }
  };


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
  const handleBrandChange = (brandName) => { 
    resetPage(); 
    setActiveBrands(prev => prev.includes(brandName) ? prev.filter(b => b !== brandName) : [...prev, brandName]); 
  };
  const handlePresentationChange = (presentationName) => { 
    resetPage();
    setActivePresentations(prev => prev.includes(presentationName) ? prev.filter(p => p !== presentationName) : [...prev, presentationName]); 
  };
  const handleUnitChange = (unitName) => { 
    resetPage();
    setActiveUnits(prev => prev.includes(unitName) ? prev.filter(u => u !== unitName) : [...prev, unitName]); 
  };
  const clearFilters = () => {
    setActiveBrands([]);
    setActivePresentations([]);
    setActiveUnits([]);
    setPriceRange([minPrice, maxPrice]);
    setBrandSearchTerm('');
    setSortBy('popularity');
    // Resetear a página 1 (URL)
    const params = new URLSearchParams(searchParams);
    if (params.has('page')) {
        params.delete('page');
        router.replace(`${pathname}?${params.toString()}`);
    }
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
  // Handler optimizado del filtro de precio
  const handlePriceChange = useCallback((newRange) => {
    // Si cambia el precio, volvemos a página 1
    // NOTA: No podemos llamar a resetPage() directamente dentro de useCallback sin añadirlo a deps, 
    // lo cual podría causar loops. Mejor lo manejamos cuando el usuario suelta el slider o confirma.
    // Asumiremos que PriceFilter llama a esto frecuentemente? No, useCallback sugiere optimización.
    // Vamos a dejar que PriceFilter maneje la UI y aquí solo actualizamos estado.
    // PERO: necesitamos resetear la página. 
    // Para simplificar, asumimos que si el rango cambia drásticamente, el usuario querría ver desde el inicio.
    // Pero si es continuo, puede ser molesto.
    setPriceRange(newRange);
  }, []);
  
  // Efecto para resetear página cuando cambia precio (debounceado por el usuario o al soltar)
  // O simplemente lo hacemos en el onChange si no es continuo.
  // Dado que PriceFilter suele ser 'onChange', vamos a añadir un useEffect que vigile priceRange
  // para resetear página, PERO solo si no fue un cambio inicial.
  // Mmm, mejor simplificar: PriceFilter suele tener un botón o evento 'onAfterChange'.
  // Si es en tiempo real, resetear la URL a cada paso es malo.
  // Vamos a asumir que handlePriceChange se llama al final.
  
  useEffect(() => {
     // Cuando cambia el rango de precios, si no estamos en la página 1, ir a la 1.
     // Esto puede ser agresivo si el usuario solo ajusta un poco. 
     // Pero es lo correcto para no quedar en página vacía.
     if (currentPage !== 1) {
         // resetPage() - no podemos llamarlo directamente si depende de router/searchParams y estamos en effect
         // Lo haremos manual
         const params = new URLSearchParams(window.location.search); // Usamos window para evitar dep loops
         if (params.get('page') && params.get('page') !== '1') {
             params.set('page', 1);
             router.replace(`${pathname}?${params.toString()}`, { scroll: false });
         }
     }
  }, [priceRange]); 


  const Sidebar = () => (
    <aside className="lg:col-span-1 bg-white p-4 rounded-lg shadow h-fit sticky top-32">
      <div className="space-y-2">
        <div className="flex justify-between items-center px-2 pb-2 border-b">
          <h3 className="text-xl font-semibold">Filtros</h3>
          <button onClick={clearFilters} className="text-sm text-blue-600 hover:underline font-semibold">Limpiar todo</button>
        </div>
        
        {/* Nuevo Price Filter Component */}
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
         <details className="filter-accordion" open>
          <summary>Marca / Laboratorio</summary>
          <div className="p-4">
            <input id="brand-search-input" type="text" value={brandSearchTerm} onChange={e => setBrandSearchTerm(e.target.value)} placeholder="Buscar marca..." />
            <div className="filter-options-container space-y-2 mt-3">
              {filteredBrands.map(brand => (
                <label key={brand} className="filter-checkbox-label"><input type="checkbox" checked={activeBrands.includes(brand)} onChange={() => handleBrandChange(brand)} /><span className="filter-checkbox-span"><FaCheck /></span>{brand}</label>
              ))}
            </div>
          </div>
        </details>
        <details className="filter-accordion">
          <summary>Presentación</summary>
          <div className="p-4">
            <div className="filter-options-container space-y-2">
              {availablePresentations.map(pres => (
                <label key={pres} className="filter-checkbox-label"><input type="checkbox" checked={activePresentations.includes(pres)} onChange={() => handlePresentationChange(pres)} /><span className="filter-checkbox-span"><FaCheck /></span>{pres}</label>
              ))}
            </div>
          </div>
        </details>
        <details className="filter-accordion">
          <summary>Contenido</summary>
          <div className="p-4">
            <div className="filter-options-container space-y-2">
              {availableUnits.map(unit => (
                <label key={unit} className="filter-checkbox-label"><input type="checkbox" checked={activeUnits.includes(unit)} onChange={() => handleUnitChange(unit)} /><span className="filter-checkbox-span"><FaCheck /></span>{unit}</label>
              ))}
            </div>
          </div>
        </details>
      </div>
    </aside>
  );

  return (
    <>
      {/* Botón de filtros móvil */}
      <div className="flex items-center justify-end mb-6 lg:hidden">
        <button onClick={() => setIsFilterOpen(!isFilterOpen)} className="bg-white border border-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg flex items-center gap-2">
          <FaFilter />
          <span>{isFilterOpen ? 'Ocultar Filtros' : 'Mostrar Filtros'}</span>
        </button>
      </div>

      <div>
        <h1 className="text-3xl md:text-4xl font-bold mb-6">{categoryName === 'all' ? 'Tienda' : categoryName}</h1>
      </div>
      
      <CategoryBanners categoryName={categoryName} products={initialProducts} />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className={`lg:block ${isFilterOpen ? 'block' : 'hidden'}`}>
          <Sidebar />
        </div>
        
        <div className="lg:col-span-3">
          <div className="flex justify-end mb-6">
            <select value={sortBy} onChange={(e) => { 
                setSortBy(e.target.value); 
                // Resetear a página 1 (URL)
                const params = new URLSearchParams(searchParams);
                if (params.get('page') && params.get('page') !== '1') {
                  params.set('page', 1);
                  router.replace(`${pathname}?${params.toString()}`);
                }
            }} className="border-gray-300 rounded-md shadow-sm text-sm">
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
          <Pagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            onPageChange={handlePageChange} 
            getHref={getPageHref}
          />
        </div>
      </div>
    </>
  );
}