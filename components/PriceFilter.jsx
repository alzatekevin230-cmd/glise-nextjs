// components/PriceFilter.jsx
"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';

const formatPrice = (price) => `$${Math.round(price).toLocaleString('es-CO')}`;

export default function PriceFilter({ 
  minPrice, 
  maxPrice, 
  value, 
  onChange,
  productsCount = 0,
  totalProducts = 0,
  allProducts = []
}) {
  const [localRange, setLocalRange] = useState(value || [minPrice, maxPrice]);
  const [minInput, setMinInput] = useState('');
  const [maxInput, setMaxInput] = useState('');
  const [isEditingMin, setIsEditingMin] = useState(false);
  const [isEditingMax, setIsEditingMax] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const minThumbRef = useRef(null);
  const maxThumbRef = useRef(null);

  // Sincronizar con prop value
  useEffect(() => {
    setLocalRange(value || [minPrice, maxPrice]);
  }, [value, minPrice, maxPrice]);

  // Calcular estadísticas
  const stats = useMemo(() => {
    if (!allProducts || allProducts.length === 0) {
      return { average: 0, lowest: 0, highest: 0, percentUnder50k: 0 };
    }

    const prices = allProducts.map(p => p.price);
    const average = Math.round(prices.reduce((sum, p) => sum + p, 0) / prices.length);
    const lowest = Math.min(...prices);
    const highest = Math.max(...prices);
    const under50k = prices.filter(p => p <= 50000).length;
    const percentUnder50k = Math.round((under50k / prices.length) * 100);

    return { average, lowest, highest, percentUnder50k };
  }, [allProducts]);

  // Presets de precio
  const presets = useMemo(() => {
    const range = maxPrice - minPrice;
    
    if (range <= 0) return [];

    if (maxPrice <= 50000) {
      return [
        { label: '< $10k', range: [minPrice, 10000] },
        { label: '$10k-20k', range: [10000, 20000] },
        { label: '$20k-30k', range: [20000, 30000] },
        { label: '> $30k', range: [30000, maxPrice] },
      ];
    } else if (maxPrice <= 150000) {
      return [
        { label: '< $20k', range: [minPrice, 20000] },
        { label: '$20k-50k', range: [20000, 50000] },
        { label: '$50k-100k', range: [50000, 100000] },
        { label: '> $100k', range: [100000, maxPrice] },
      ];
    } else {
      return [
        { label: '< $50k', range: [minPrice, 50000] },
        { label: '$50k-100k', range: [50000, 100000] },
        { label: '$100k-200k', range: [100000, 200000] },
        { label: '> $200k', range: [200000, maxPrice] },
      ];
    }
  }, [minPrice, maxPrice]);

  // minDistance dinámico (2% del rango)
  const minDistance = useMemo(() => {
    const range = maxPrice - minPrice;
    return Math.max(1000, Math.round(range * 0.02));
  }, [minPrice, maxPrice]);

  // Handler del slider
  const handleMinChange = useCallback((e) => {
    const newMin = parseInt(e.target.value);
    const newMax = localRange[1];
    
    if (newMin <= newMax - minDistance) {
      const newRange = [newMin, newMax];
      setLocalRange(newRange);
      onChange(newRange);
    }
  }, [localRange, minDistance, onChange]);

  const handleMaxChange = useCallback((e) => {
    const newMax = parseInt(e.target.value);
    const newMin = localRange[0];
    
    if (newMax >= newMin + minDistance) {
      const newRange = [newMin, newMax];
      setLocalRange(newRange);
      onChange(newRange);
    }
  }, [localRange, minDistance, onChange]);

  // Handler de presets
  const handlePresetClick = useCallback((presetRange) => {
    const adjustedRange = [
      Math.max(minPrice, presetRange[0]),
      Math.min(maxPrice, presetRange[1])
    ];
    setLocalRange(adjustedRange);
    onChange(adjustedRange);
  }, [minPrice, maxPrice, onChange]);

  // Handler de inputs numéricos
  const handleMinInputChange = useCallback((e) => {
    const value = e.target.value.replace(/\D/g, '');
    setMinInput(value);
  }, []);

  const handleMaxInputChange = useCallback((e) => {
    const value = e.target.value.replace(/\D/g, '');
    setMaxInput(value);
  }, []);

  const applyMinInput = useCallback(() => {
    const numValue = parseInt(minInput) || minPrice;
    const clampedValue = Math.max(minPrice, Math.min(numValue, localRange[1] - minDistance));
    const newRange = [clampedValue, localRange[1]];
    setLocalRange(newRange);
    onChange(newRange);
    setIsEditingMin(false);
    setMinInput('');
  }, [minInput, minPrice, localRange, minDistance, onChange]);

  const applyMaxInput = useCallback(() => {
    const numValue = parseInt(maxInput) || maxPrice;
    const clampedValue = Math.min(maxPrice, Math.max(numValue, localRange[0] + minDistance));
    const newRange = [localRange[0], clampedValue];
    setLocalRange(newRange);
    onChange(newRange);
    setIsEditingMax(false);
    setMaxInput('');
  }, [maxInput, maxPrice, localRange, minDistance, onChange]);

  // Reset
  const handleReset = useCallback(() => {
    const fullRange = [minPrice, maxPrice];
    setLocalRange(fullRange);
    onChange(fullRange);
    setMinInput('');
    setMaxInput('');
  }, [minPrice, maxPrice, onChange]);

  const percentage = totalProducts > 0 ? Math.round((productsCount / totalProducts) * 100) : 0;
  const isFullRange = localRange[0] === minPrice && localRange[1] === maxPrice;

  // Calcular porcentajes para el track
  const minPercent = ((localRange[0] - minPrice) / (maxPrice - minPrice)) * 100;
  const maxPercent = ((localRange[1] - minPrice) / (maxPrice - minPrice)) * 100;

  if (maxPrice <= minPrice) {
    return (
      <div className="p-4 text-center text-gray-500 text-sm">
        No hay rango de precios disponible
      </div>
    );
  }

  return (
    <div className="space-y-4">
      
      {/* Header con contador */}
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
          💰 Precio
          <span className="inline-flex items-center justify-center min-w-[2rem] h-6 px-2 bg-blue-600 text-white text-xs font-bold rounded-full">
            {productsCount}
          </span>
        </h4>
        {!isFullRange && (
          <button
            onClick={handleReset}
            className="text-xs text-blue-600 hover:text-blue-800 font-semibold transition-colors"
          >
            Resetear
          </button>
        )}
      </div>

      {/* Rango disponible */}
      <div className="text-xs text-gray-600 bg-gray-50 rounded-lg p-2">
        <span className="font-semibold">Rango disponible:</span> {formatPrice(minPrice)} - {formatPrice(maxPrice)}
      </div>

      {/* Botones de preset */}
      <div className="grid grid-cols-2 gap-2">
        {presets.map((preset) => (
          <button
            key={preset.label}
            onClick={() => handlePresetClick(preset.range)}
            className="text-xs font-semibold py-2 px-3 rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 text-gray-700 hover:text-blue-700"
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Inputs numéricos */}
      <div className="grid grid-cols-2 gap-3">
        {/* Input Desde */}
        <div>
          <label className="text-xs font-semibold text-gray-700 block mb-1">Desde:</label>
          {isEditingMin ? (
            <input
              type="text"
              value={minInput}
              onChange={handleMinInputChange}
              onBlur={applyMinInput}
              onKeyPress={(e) => e.key === 'Enter' && applyMinInput()}
              placeholder={formatPrice(localRange[0])}
              className="w-full text-sm px-2 py-2 border-2 border-blue-500 rounded-lg focus:outline-none"
              autoFocus
            />
          ) : (
            <button
              onClick={() => setIsEditingMin(true)}
              className="w-full text-sm font-semibold px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-left transition-colors"
            >
              {formatPrice(localRange[0])}
            </button>
          )}
        </div>

        {/* Input Hasta */}
        <div>
          <label className="text-xs font-semibold text-gray-700 block mb-1">Hasta:</label>
          {isEditingMax ? (
            <input
              type="text"
              value={maxInput}
              onChange={handleMaxInputChange}
              onBlur={applyMaxInput}
              onKeyPress={(e) => e.key === 'Enter' && applyMaxInput()}
              placeholder={formatPrice(localRange[1])}
              className="w-full text-sm px-2 py-2 border-2 border-blue-500 rounded-lg focus:outline-none"
              autoFocus
            />
          ) : (
            <button
              onClick={() => setIsEditingMax(true)}
              className="w-full text-sm font-semibold px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-left transition-colors"
            >
              {formatPrice(localRange[1])}
            </button>
          )}
        </div>
      </div>

      {/* Slider Dual Range con input nativo */}
      <div className="pt-2 pb-4">
        <div className="relative h-8">
          {/* Track de fondo */}
          <div className="absolute top-1/2 -translate-y-1/2 w-full h-2 bg-gray-200 rounded-full"></div>
          
          {/* Track activo (entre los dos thumbs) */}
          <div 
            className="absolute top-1/2 -translate-y-1/2 h-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-150"
            style={{
              left: `${minPercent}%`,
              right: `${100 - maxPercent}%`
            }}
          ></div>

          {/* Input range MIN */}
          <input
            ref={minThumbRef}
            type="range"
            min={minPrice}
            max={maxPrice}
            value={localRange[0]}
            onChange={handleMinChange}
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => setIsDragging(false)}
            onTouchStart={() => setIsDragging(true)}
            onTouchEnd={() => setIsDragging(false)}
            className="absolute w-full h-8 appearance-none bg-transparent pointer-events-none cursor-grab active:cursor-grabbing"
            style={{ zIndex: localRange[0] > maxPrice - 100 ? 5 : 3 }}
          />

          {/* Input range MAX */}
          <input
            ref={maxThumbRef}
            type="range"
            min={minPrice}
            max={maxPrice}
            value={localRange[1]}
            onChange={handleMaxChange}
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => setIsDragging(false)}
            onTouchStart={() => setIsDragging(true)}
            onTouchEnd={() => setIsDragging(false)}
            className="absolute w-full h-8 appearance-none bg-transparent pointer-events-none cursor-grab active:cursor-grabbing"
            style={{ zIndex: 4 }}
          />
        </div>

        {/* Valores debajo del slider */}
        <div className="flex justify-between mt-3 text-xs font-semibold text-gray-700">
          <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded">{formatPrice(localRange[0])}</span>
          <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded">{formatPrice(localRange[1])}</span>
        </div>
      </div>

      {/* Resultados */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 border border-blue-100">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-bold text-gray-900">
            ✅ {productsCount} de {totalProducts} productos
          </span>
          <span className="text-xs font-bold text-blue-600">
            {percentage}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>

      {/* Estadísticas */}
      {stats.average > 0 && (
        <details className="text-xs text-gray-600 bg-gray-50 rounded-lg">
          <summary className="cursor-pointer p-2 font-semibold hover:bg-gray-100 rounded-lg transition-colors">
            📊 Estadísticas de precio
          </summary>
          <div className="p-3 pt-2 space-y-1">
            <div className="flex justify-between">
              <span>Precio promedio:</span>
              <span className="font-bold text-gray-900">{formatPrice(stats.average)}</span>
            </div>
            <div className="flex justify-between">
              <span>Más barato:</span>
              <span className="font-bold text-green-600">{formatPrice(stats.lowest)}</span>
            </div>
            <div className="flex justify-between">
              <span>Más caro:</span>
              <span className="font-bold text-red-600">{formatPrice(stats.highest)}</span>
            </div>
            <div className="flex justify-between">
              <span>Productos bajo $50k:</span>
              <span className="font-bold text-blue-600">{stats.percentUnder50k}%</span>
            </div>
          </div>
        </details>
      )}
    </div>
  );
}
