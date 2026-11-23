"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Select from 'react-select';
import { useCarrito } from '@/contexto/ContextoCarrito';
import { useAuth } from '@/contexto/ContextoAuth';
import { useModal } from '@/contexto/ContextoModal';
import { useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebaseClient';
import toast from 'react-hot-toast';
import {
  FiLock,
  FiChevronLeft,
  FiShoppingBag,
  FiShield,
  FiTruck,
  FiRotateCw,
  FiAlertCircle,
  FiCheck,
  FiTrash2,
} from 'react-icons/fi';
import { FaCcVisa, FaCcMastercard, FaCcAmex } from 'react-icons/fa';

const INITIAL_FORM_DATA = {
  firstName: '',
  lastName: '',
  state: '',
  city: '',
  cityCode: '',
  address: '',
  neighborhood: '',
  phone: '',
  email: '',
  orderNotes: '',
};

const formatPrice = (price) => `$${Math.round(price).toLocaleString('es-CO')}`;

export default function CheckoutPage() {
  const { cart, updateQuantity, removeFromCart } = useCarrito();
  const { currentUser } = useAuth();
  const { openModal } = useModal();
  const router = useRouter();

  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const hasLoadedStorage = useRef(false);

  const [shippingCost, setShippingCost] = useState(0);
  const [realShippingCost, setRealShippingCost] = useState(0);
  const [deliveryDays, setDeliveryDays] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);
  const [shippingCalculated, setShippingCalculated] = useState(false);
  const [shippingError, setShippingError] = useState(false);
  const [errors, setErrors] = useState({});
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [allCities, setAllCities] = useState([]);
  const [touched, setTouched] = useState({});
  const [showOrderNotes, setShowOrderNotes] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('checkoutFormData');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          setFormData((prev) => ({ ...prev, ...parsed }));
          if (parsed.orderNotes) setShowOrderNotes(true);
        }
      }
    } catch {
      localStorage.removeItem('checkoutFormData');
    } finally {
      hasLoadedStorage.current = true;
    }
  }, []);

  useEffect(() => {
    if (!hasLoadedStorage.current) return;
    try {
      localStorage.setItem('checkoutFormData', JSON.stringify(formData));
    } catch {
      // Ignorar si el almacenamiento está bloqueado
    }
  }, [formData]);

  useEffect(() => {
    const isNavigatingBack = sessionStorage.getItem('isNavigatingBack');
    if (isNavigatingBack) {
      sessionStorage.removeItem('isNavigatingBack');
      return;
    }
    if (cart.length === 0 && !isProcessing) {
      router.push('/');
    }
  }, [cart, isProcessing, router]);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/shipping/cities')
      .then((res) => {
        if (!res.ok) throw new Error('Error al cargar ciudades');
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        if (Array.isArray(data)) {
          setAllCities(data);
        } else {
          throw new Error('Formato inválido de ciudades');
        }
      })
      .catch(() => {
        if (!cancelled) {
          toast.error('No se pudieron cargar las ciudades. Recarga la página.');
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (currentUser && !currentUser.isAnonymous) {
      const autofill = async () => {
        try {
          const userRef = doc(db, `users/${currentUser.uid}`);
          const docSnap = await getDoc(userRef);
          const profileData = docSnap.exists() ? docSnap.data() : {};
          const fullName = profileData.name || currentUser.displayName || '';
          const nameParts = fullName.trim().split(' ').filter(Boolean);
          const firstNameFromProfile = nameParts.shift() || '';
          const lastNameFromProfile = nameParts.join(' ');

          setFormData((prev) => ({
            ...prev,
            email: prev.email || currentUser.email || '',
            firstName: prev.firstName || firstNameFromProfile,
            lastName: prev.lastName || lastNameFromProfile,
            phone: prev.phone || profileData.phone || '',
          }));
        } catch {
          // Continuar sin bloquear si falla lectura
        }
      };
      autofill();
    }
  }, [currentUser]);

  const departmentOptions = useMemo(() => {
    if (allCities.length === 0) return [];
    const uniqueDepartments = [...new Set(allCities.map((c) => c.department))].sort();
    return uniqueDepartments.map((d) => ({ value: d, label: d }));
  }, [allCities]);

  const cityOptions = useMemo(() => {
    if (!formData.state || allCities.length === 0) return [];
    return allCities
      .filter((c) => c.department === formData.state)
      .map((c) => ({ value: c.code, label: c.name }));
  }, [formData.state, allCities]);

  const calculateShipping = useCallback(
    async (cityCode, signal) => {
      if (!cityCode || cart.length === 0) {
        setShippingCost(0);
        setRealShippingCost(0);
        setDeliveryDays(null);
        setShippingCalculated(false);
        setShippingError(false);
        setIsCalculatingShipping(false);
        return;
      }

      setIsCalculatingShipping(true);
      setShippingCalculated(false);
      setShippingError(false);

      try {
        const response = await fetch('/api/shipping/quote', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ destinationCityCode: cityCode, cartItems: cart }),
          signal,
        });

        if (!response.ok) throw new Error('Error en cotización');

        const data = await response.json();
        setShippingCost(data.shippingCost);
        setRealShippingCost(data.realShippingCost ?? data.shippingCost);
        setDeliveryDays(data.deliveryDays);
        setShippingCalculated(true);
        setShippingError(false);
      } catch (error) {
        if (error.name === 'AbortError') return;
        console.error('Error al calcular envío:', error);
        setShippingCost(0);
        setRealShippingCost(0);
        setDeliveryDays(null);
        setShippingCalculated(false);
        setShippingError(true);
        toast.error('No se pudo calcular el envío. Intenta nuevamente.');
      } finally {
        if (!signal?.aborted) {
          setIsCalculatingShipping(false);
        }
      }
    },
    [cart]
  );

  useEffect(() => {
    if (!formData.cityCode || cart.length === 0) return;
    const controller = new AbortController();
    const timer = setTimeout(() => {
      calculateShipping(formData.cityCode, controller.signal);
    }, 300);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [cart, formData.cityCode, calculateShipping]);

  const handleSelectChange = (fieldName, selectedOption) => {
    if (fieldName === 'state') {
      setFormData((prev) => ({
        ...prev,
        state: selectedOption ? selectedOption.value : '',
        city: '',
        cityCode: '',
      }));
      setTouched((prev) => ({ ...prev, state: true }));
      setErrors((prev) => ({ ...prev, state: undefined }));
      setShippingCost(0);
      setRealShippingCost(0);
      setDeliveryDays(null);
      setShippingCalculated(false);
      setShippingError(false);
    }

    if (fieldName === 'city') {
      setFormData((prev) => ({
        ...prev,
        city: selectedOption ? selectedOption.label : '',
        cityCode: selectedOption ? selectedOption.value : '',
      }));
      setTouched((prev) => ({ ...prev, cityCode: true }));
      setErrors((prev) => ({ ...prev, cityCode: undefined }));
      if (!selectedOption) {
        setShippingCost(0);
        setRealShippingCost(0);
        setDeliveryDays(null);
        setShippingCalculated(false);
        setShippingError(false);
      }
    }
  };

  const handleInputChange = useCallback((e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => (prev[id] ? { ...prev, [id]: undefined } : prev));
  }, []);

  const inputClass = (fieldName) => {
    const hasError = touched[fieldName] && errors[fieldName];
    return `w-full h-[46px] bg-white rounded-md px-3.5 text-sm text-gray-900 placeholder:text-gray-400 border transition-colors focus:outline-none ${
      hasError
        ? 'border-red-500 ring-1 ring-red-500'
        : 'border-gray-300 hover:border-gray-400 focus:border-cyan-700 focus:ring-1 focus:ring-cyan-700'
    }`;
  };

  const validateForm = () => {
    const fieldsToValidate = ['email', 'phone', 'firstName', 'lastName', 'state', 'cityCode', 'address'];
    const newTouchedState = {};
    fieldsToValidate.forEach((field) => {
      newTouchedState[field] = true;
    });
    setTouched((prev) => ({ ...prev, ...newTouchedState }));

    const newErrors = {};
    fieldsToValidate.forEach((field) => {
      const value = formData[field];
      if (!value || !String(value).trim()) {
        newErrors[field] = 'Campo obligatorio';
      } else if (field === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
        newErrors[field] = 'Ingresa un correo válido';
      } else if (field === 'phone') {
        const digits = String(value).replace(/\D/g, '');
        if (digits.length < 10) {
          newErrors[field] = 'Ingresa un celular de 10 dígitos';
        }
      }
    });

    if (!termsAccepted) {
      newErrors.terms = 'Debes aceptar los términos y condiciones para continuar.';
    }

    setErrors(newErrors);
    return { isValid: Object.keys(newErrors).length === 0, newErrors };
  };

  const scrollToFirstError = (newErrors) => {
    const order = ['email', 'phone', 'firstName', 'lastName', 'state', 'cityCode', 'address', 'terms'];
    const firstKey = order.find((key) => newErrors[key]);
    if (!firstKey) return;
    const targetId = firstKey === 'cityCode' ? 'city-field' : `${firstKey}-field`;
    const el = document.getElementById(targetId) || document.getElementById(firstKey);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );
  const totalItemsCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );
  const finalShippingCost = shippingCalculated ? shippingCost : 0;
  const total = subtotal + finalShippingCost;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { isValid, newErrors } = validateForm();
    if (!isValid) {
      const firstMessage =
        Object.keys(newErrors).length === 1 && newErrors.terms
          ? newErrors.terms
          : 'Revisa los campos marcados en rojo.';
      toast.error(firstMessage);
      scrollToFirstError(newErrors);
      return;
    }

    if (isCalculatingShipping) {
      toast.error('Espera un segundo mientras calculamos el envío...');
      return;
    }

    if (!shippingCalculated || shippingCost < 0) {
      toast.error('Calcula primero el envío seleccionando tu ciudad.');
      const cityEl = document.getElementById('city-field');
      if (cityEl) cityEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setIsProcessing(true);
    const totalInCents = Math.round((subtotal + shippingCost) * 100);
    const reference = `${Date.now()}`;
    const orderPayload = {
      orderId: reference,
      customerDetails: formData,
      items: cart,
      subtotal,
      shippingCost,
      realShippingCost,
      total: subtotal + shippingCost,
      orderNotes: formData.orderNotes,
    };

    try {
      const response = await fetch('/api/orders/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderData: orderPayload,
          totalInCents,
          reference,
          userId: currentUser?.uid || 'anonymous',
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Error al procesar la orden');
      }

      const { signature, publicKey, totalInCents: verifiedTotalInCents } = await response.json();
      const wompiUrl = `https://checkout.wompi.co/p/?public-key=${publicKey}&currency=COP&amount-in-cents=${verifiedTotalInCents}&reference=${reference}&signature:integrity=${signature}&redirect-url=https://glise.com.co/gracias`;

      sessionStorage.setItem('pendingOrderReference', reference);
      window.location.href = wompiUrl;
    } catch (error) {
      console.error('Error al procesar la orden:', error);
      toast.error(error.message || 'No pudimos iniciar el pago. Intenta nuevamente.');
      setIsProcessing(false);
    }
  };

  if (cart.length === 0 && !isProcessing) return null;

  const customSelectStyles = {
    control: (provided, state) => {
      const fieldName = state.selectProps.inputId === 'state' ? 'state' : 'cityCode';
      const hasError = touched[fieldName] && errors[fieldName];
      const borderColor = hasError
        ? '#ef4444'
        : state.isFocused
        ? '#0e7490'
        : '#d1d5db';

      return {
        ...provided,
        minHeight: '46px',
        height: '46px',
        borderRadius: '0.375rem',
        borderColor,
        borderWidth: '1px',
        boxShadow: hasError
          ? '0 0 0 1px #ef4444'
          : state.isFocused
          ? '0 0 0 1px #0e7490'
          : 'none',
        '&:hover': {
          borderColor: hasError ? '#ef4444' : state.isFocused ? '#0e7490' : '#9ca3af',
        },
        backgroundColor: state.isDisabled ? '#f9fafb' : '#ffffff',
        fontSize: '14px',
      };
    },
    valueContainer: (provided) => ({ ...provided, padding: '0 12px' }),
    placeholder: (provided) => ({ ...provided, color: '#9ca3af', fontSize: '14px' }),
    singleValue: (provided) => ({ ...provided, color: '#111827', fontSize: '14px' }),
    input: (provided) => ({ ...provided, fontSize: '15px', margin: 0, padding: 0 }),
    indicatorSeparator: () => ({ display: 'none' }),
    menu: (provided) => ({
      ...provided,
      borderRadius: '0.5rem',
      border: '1px solid #e5e7eb',
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
      zIndex: 50,
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#0e7490' : state.isFocused ? '#f0fdfa' : '#ffffff',
      color: state.isSelected ? '#ffffff' : '#111827',
      fontSize: '14px',
      padding: '10px 14px',
      cursor: 'pointer',
    }),
  };

  // Resumen completo del pedido (visible en escritorio a la derecha Y siempre abierto en móvil antes de pagar)
  const renderOrderSummary = () => (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <FiShoppingBag size={18} className="text-cyan-700" />
          <span>Resumen del pedido</span>
        </h2>
        <span className="text-xs font-medium text-gray-500">
          {totalItemsCount} {totalItemsCount === 1 ? 'producto' : 'productos'}
        </span>
      </div>

      {/* Lista completa de productos */}
      <div className="space-y-4">
        {cart.map((item) => (
          <div key={item.id} className="flex items-start gap-3.5">
            <div className="relative flex-shrink-0">
              <div className="relative w-16 h-16 bg-white rounded-lg border border-gray-200 overflow-hidden">
                <Image
                  src={item.image || item.images?.[0] || 'https://placehold.co/100x100'}
                  alt={item.name}
                  fill
                  sizes="64px"
                  className="object-contain p-1"
                />
              </div>
              <span className="absolute -top-2 -right-2 min-w-[20px] h-5 px-1.5 rounded-full bg-gray-700 text-white text-[11px] font-semibold flex items-center justify-center">
                {item.quantity}
              </span>
            </div>

            <div className="flex-1 min-w-0 pt-0.5">
              <p className="text-sm font-medium text-gray-900 leading-snug line-clamp-2">
                {item.name}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">{formatPrice(item.price)} c/u</p>

              <div className="flex items-center gap-3 mt-2">
                <div className="inline-flex items-center border border-gray-300 rounded-md bg-white overflow-hidden">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    className="w-7 h-7 !p-0 !min-w-0 !min-h-0 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-35 text-sm font-semibold"
                    aria-label="Disminuir cantidad"
                  >
                    −
                  </button>
                  <span className="w-7 text-center text-xs font-semibold text-gray-900">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-7 h-7 !p-0 !min-w-0 !min-h-0 flex items-center justify-center text-gray-600 hover:bg-gray-100 text-sm font-semibold"
                    aria-label="Aumentar cantidad"
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => removeFromCart(item.id)}
                  className="text-xs text-gray-400 hover:text-red-600 inline-flex items-center gap-1 transition-colors !p-0 !min-w-0 !min-h-0"
                  aria-label={`Eliminar ${item.name}`}
                >
                  <FiTrash2 size={13} />
                  <span>Quitar</span>
                </button>
              </div>
            </div>

            <p className="text-sm font-semibold text-gray-900 pt-0.5 whitespace-nowrap">
              {formatPrice(item.price * item.quantity)}
            </p>
          </div>
        ))}
      </div>

      {/* Desglose completo: Subtotal + Envío + Total */}
      <div className="border-t border-gray-200 pt-4 space-y-2.5 text-sm">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal</span>
          <span className="font-medium text-gray-900">{formatPrice(subtotal)}</span>
        </div>

        <div className="flex justify-between items-start gap-2 text-gray-600">
          <div>
            <span>Envío</span>
            {shippingCalculated && deliveryDays && shippingCost > 0 && (
              <p className="text-xs text-gray-400">Coordinadora • {deliveryDays} días hábiles aprox.</p>
            )}
            {shippingCalculated && shippingCost === 0 && (
              <p className="text-xs text-emerald-700">Envío local en {formData.city}</p>
            )}
          </div>
          {shippingCalculated && shippingCost === 0 ? (
            <span className="font-semibold text-emerald-700">Gratis</span>
          ) : isCalculatingShipping ? (
            <span className="text-xs text-cyan-700 font-medium">Calculando...</span>
          ) : shippingCalculated ? (
            <span className="font-medium text-gray-900">{formatPrice(shippingCost)}</span>
          ) : (
            <span className="text-xs text-gray-400">Selecciona tu ciudad</span>
          )}
        </div>
      </div>

      <div className="border-t border-gray-300 pt-4 flex items-baseline justify-between">
        <div>
          <span className="text-base font-bold text-gray-900 block">Total</span>
          {!shippingCalculated && (
            <span className="text-[11px] text-gray-500">Falta sumar envío según ciudad</span>
          )}
        </div>
        <div className="text-right">
          <span className="text-xs text-gray-500 mr-1.5">COP</span>
          <span className="text-2xl font-bold text-gray-900">{formatPrice(total)}</span>
        </div>
      </div>

      {/* Garantías discretas */}
      <div className="border-t border-gray-200 pt-3.5 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500">
        <span className="inline-flex items-center gap-1.5">
          <FiLock size={13} className="text-cyan-700" />
          Pago encriptado SSL
        </span>
        <span className="inline-flex items-center gap-1.5">
          <FiShield size={13} className="text-cyan-700" />
          100% Originales
        </span>
        <span className="inline-flex items-center gap-1.5">
          <FiTruck size={13} className="text-cyan-700" />
          Envío asegurado
        </span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white lg:bg-[linear-gradient(to_right,#ffffff_55%,#fafafa_55%)]">
      {/* Barra superior minimalista */}
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link
            href="/categoria/all"
            className="inline-flex items-center gap-1 text-xs sm:text-sm font-medium text-gray-600 hover:text-cyan-700 transition-colors"
          >
            <FiChevronLeft size={16} />
            <span>Volver a la tienda</span>
          </Link>
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500">
            <FiLock size={13} className="text-emerald-600" />
            <span>Pago seguro</span>
          </span>
        </div>
      </div>

      {/* Contenedor 2 columnas */}
      <main className="max-w-6xl mx-auto">
        <form
          onSubmit={handleSubmit}
          noValidate
          className="grid grid-cols-1 lg:grid-cols-12"
        >
          {/* ================= COLUMNA IZQUIERDA: FORMULARIO ================= */}
          <div className="lg:col-span-7 bg-white px-4 sm:px-8 lg:pr-12 lg:pl-6 py-7 sm:py-10">
            {/* 1. CONTACTO */}
            <section className="mb-8">
              <div className="flex items-baseline justify-between mb-3.5">
                <h2 className="text-lg font-semibold text-gray-900">Contacto</h2>
                {!currentUser || currentUser.isAnonymous ? (
                  <button
                    type="button"
                    onClick={() => openModal('auth')}
                    className="text-xs sm:text-sm font-medium text-cyan-700 hover:text-cyan-800 underline underline-offset-2 !p-0 !min-w-0 !min-h-0"
                  >
                    Iniciar sesión
                  </button>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700">
                    <FiCheck size={14} />
                    Sesión iniciada ({currentUser.displayName?.split(' ')[0] || 'Cliente'})
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div id="email-field">
                  <label htmlFor="email" className="block text-xs font-medium text-gray-600 mb-1">
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    id="email"
                    autoComplete="email"
                    placeholder="tu@correo.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
                    className={inputClass('email')}
                  />
                  {touched.email && errors.email && (
                    <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                      <FiAlertCircle size={12} /> {errors.email}
                    </p>
                  )}
                </div>

                <div id="phone-field">
                  <label htmlFor="phone" className="block text-xs font-medium text-gray-600 mb-1">
                    Celular / WhatsApp
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    autoComplete="tel"
                    inputMode="numeric"
                    placeholder="300 123 4567"
                    value={formData.phone}
                    onChange={handleInputChange}
                    onBlur={() => setTouched((prev) => ({ ...prev, phone: true }))}
                    className={inputClass('phone')}
                  />
                  {touched.phone && errors.phone && (
                    <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                      <FiAlertCircle size={12} /> {errors.phone}
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* 2. ENTREGA */}
            <section className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-3.5">Entrega</h2>

              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div id="firstName-field">
                    <label htmlFor="firstName" className="block text-xs font-medium text-gray-600 mb-1">
                      Nombre
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="given-name"
                      autoComplete="given-name"
                      placeholder="Nombre"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      onBlur={() => setTouched((prev) => ({ ...prev, firstName: true }))}
                      className={inputClass('firstName')}
                    />
                    {touched.firstName && errors.firstName && (
                      <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                        <FiAlertCircle size={12} /> {errors.firstName}
                      </p>
                    )}
                  </div>

                  <div id="lastName-field">
                    <label htmlFor="lastName" className="block text-xs font-medium text-gray-600 mb-1">
                      Apellidos
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="family-name"
                      autoComplete="family-name"
                      placeholder="Apellidos"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      onBlur={() => setTouched((prev) => ({ ...prev, lastName: true }))}
                      className={inputClass('lastName')}
                    />
                    {touched.lastName && errors.lastName && (
                      <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                        <FiAlertCircle size={12} /> {errors.lastName}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div id="state-field">
                    <label htmlFor="state" className="block text-xs font-medium text-gray-600 mb-1">
                      Departamento
                    </label>
                    <Select
                      instanceId="checkout-state-select"
                      inputId="state"
                      name="state"
                      options={departmentOptions}
                      value={formData.state ? { value: formData.state, label: formData.state } : null}
                      onChange={(opt) => handleSelectChange('state', opt)}
                      placeholder="Selecciona departamento"
                      isClearable
                      isSearchable
                      styles={customSelectStyles}
                      noOptionsMessage={() => 'Sin resultados'}
                    />
                    {touched.state && errors.state && (
                      <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                        <FiAlertCircle size={12} /> {errors.state}
                      </p>
                    )}
                  </div>

                  <div id="city-field">
                    <label htmlFor="city" className="block text-xs font-medium text-gray-600 mb-1">
                      Ciudad / Municipio
                    </label>
                    <Select
                      instanceId="checkout-city-select"
                      inputId="city"
                      name="city"
                      options={cityOptions}
                      value={formData.cityCode ? { value: formData.cityCode, label: formData.city } : null}
                      onChange={(opt) => handleSelectChange('city', opt)}
                      placeholder="Selecciona ciudad"
                      isDisabled={!formData.state}
                      isClearable
                      isSearchable
                      styles={customSelectStyles}
                      noOptionsMessage={() =>
                        formData.state ? 'Sin ciudades disponibles' : 'Elige un departamento'
                      }
                    />
                    {touched.cityCode && errors.cityCode && (
                      <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                        <FiAlertCircle size={12} /> {errors.cityCode}
                      </p>
                    )}
                  </div>
                </div>

                <div id="address-field">
                  <label htmlFor="address" className="block text-xs font-medium text-gray-600 mb-1">
                    Dirección exacta
                  </label>
                  <input
                    type="text"
                    id="address"
                    autoComplete="street-address"
                    placeholder="Calle, carrera, número, apto o casa"
                    value={formData.address}
                    onChange={handleInputChange}
                    onBlur={() => setTouched((prev) => ({ ...prev, address: true }))}
                    className={inputClass('address')}
                  />
                  {touched.address && errors.address && (
                    <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                      <FiAlertCircle size={12} /> {errors.address}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="neighborhood" className="block text-xs font-medium text-gray-600 mb-1">
                    Barrio, conjunto o punto de referencia <span className="text-gray-400">(opcional)</span>
                  </label>
                  <input
                    type="text"
                    id="neighborhood"
                    autoComplete="address-level3"
                    placeholder="Ej: Barrio El Prado, Torre 2"
                    value={formData.neighborhood}
                    onChange={handleInputChange}
                    className={inputClass('neighborhood')}
                  />
                </div>

                {!showOrderNotes ? (
                  <button
                    type="button"
                    onClick={() => setShowOrderNotes(true)}
                    className="text-xs font-medium text-cyan-700 hover:text-cyan-800 underline underline-offset-2 pt-1 !p-0 !min-w-0 !min-h-0"
                  >
                    + Agregar nota de entrega (opcional)
                  </button>
                ) : (
                  <div>
                    <label htmlFor="orderNotes" className="block text-xs font-medium text-gray-600 mb-1">
                      Nota de entrega <span className="text-gray-400">(opcional)</span>
                    </label>
                    <textarea
                      id="orderNotes"
                      value={formData.orderNotes}
                      onChange={handleInputChange}
                      rows="2"
                      placeholder="Ej: Dejar en portería, llamar al llegar..."
                      className="w-full bg-white rounded-md px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 border border-gray-300 focus:outline-none focus:border-cyan-700 focus:ring-1 focus:ring-cyan-700 resize-none"
                    />
                  </div>
                )}
              </div>
            </section>

            {/* 3. MÉTODO DE ENVÍO */}
            <section className="mb-8">
              <div className="flex items-baseline justify-between mb-3">
                <h2 className="text-lg font-semibold text-gray-900">Método de envío</h2>
                <Link
                  href="/politicas-de-envio"
                  target="_blank"
                  className="text-xs text-gray-500 hover:text-cyan-700 underline underline-offset-2"
                >
                  Ver tiempos estimados
                </Link>
              </div>

              {!formData.cityCode ? (
                <div className="rounded-lg bg-gray-50 border border-gray-200 px-4 py-4 text-sm text-gray-500">
                  Selecciona tu departamento y ciudad arriba para ver el costo y tiempo de envío.
                </div>
              ) : isCalculatingShipping ? (
                <div className="rounded-lg bg-gray-50 border border-gray-200 px-4 py-4 text-sm text-gray-600 flex items-center gap-2.5">
                  <span className="w-4 h-4 border-2 border-cyan-600 border-t-transparent rounded-full animate-spin" />
                  <span>Calculando tarifa de envío para {formData.city}...</span>
                </div>
              ) : shippingError ? (
                <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3.5 text-sm text-red-700 flex items-center justify-between gap-3">
                  <span>No pudimos cotizar el envío a esta ciudad.</span>
                  <button
                    type="button"
                    onClick={() => calculateShipping(formData.cityCode)}
                    className="inline-flex items-center gap-1.5 font-semibold text-cyan-800 hover:underline whitespace-nowrap !p-0 !min-w-0 !min-h-0"
                  >
                    <FiRotateCw size={14} /> Reintentar
                  </button>
                </div>
              ) : shippingCalculated ? (
                <div className="rounded-lg border border-cyan-700 bg-cyan-50/30 px-4 py-3.5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="w-4 h-4 rounded-full border-[5px] border-cyan-700 bg-white flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {shippingCost === 0 ? 'Envío local Glisé' : 'Envío estándar • Coordinadora'}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {deliveryDays
                          ? `Entrega estimada: ${deliveryDays} días hábiles`
                          : 'Entrega rápida a domicilio'}
                      </p>
                    </div>
                  </div>
                  <span className={`text-sm font-semibold ${shippingCost === 0 ? 'text-emerald-700' : 'text-gray-900'}`}>
                    {shippingCost === 0 ? 'Gratis' : formatPrice(shippingCost)}
                  </span>
                </div>
              ) : null}
            </section>

            {/* 4. PAGO */}
            <section className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-1">Pago</h2>
              <p className="text-xs text-gray-500 mb-3.5">
                Todas las transacciones son seguras y están encriptadas.
              </p>

              <div className="rounded-lg border border-cyan-700 overflow-hidden">
                <div className="flex items-center justify-between gap-2 bg-cyan-50/30 px-4 py-3.5 border-b border-gray-200">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-4 h-4 rounded-full border-[5px] border-cyan-700 bg-white flex-shrink-0" />
                    <span className="text-sm font-medium text-gray-900 truncate">
                      Tarjeta, PSE, Nequi y Bancolombia
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <FaCcVisa className="text-[24px] text-[#1A1F71]" />
                    <FaCcMastercard className="text-[24px] text-[#EB001B]" />
                    <FaCcAmex className="text-[24px] text-[#006FCF]" />
                    <span className="text-[10px] font-bold tracking-tight px-1.5 py-0.5 rounded border border-gray-300 bg-white text-gray-700">
                      PSE
                    </span>
                  </div>
                </div>

                <div className="bg-[#f9fafb] px-5 py-6 text-center">
                  <svg
                    width="116"
                    height="56"
                    viewBox="0 0 116 56"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="mx-auto mb-3.5 text-gray-400"
                    aria-hidden="true"
                  >
                    <rect x="6" y="6" width="76" height="44" rx="4" stroke="currentColor" strokeWidth="1.6" />
                    <line x1="6" y1="16" x2="82" y2="16" stroke="currentColor" strokeWidth="1.6" />
                    <circle cx="13" cy="11" r="1.5" fill="currentColor" />
                    <circle cx="19" cy="11" r="1.5" fill="currentColor" />
                    <circle cx="25" cy="11" r="1.5" fill="currentColor" />
                    <path d="M88 28H110M110 28L104 22M110 28L104 34" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <p className="text-xs sm:text-[13px] text-gray-600 max-w-sm mx-auto leading-relaxed">
                    Después de hacer clic en <strong>&quot;Pagar ahora&quot;</strong>, serás redirigido a la pasarela de pago segura para completar tu compra con tarjeta, PSE, Nequi, Daviplata o Bancolombia.
                  </p>
                </div>
              </div>
            </section>

            {/* 5. RESUMEN COMPLETO SIEMPRE ABIERTO EN MÓVIL (JUSTO ANTES DE PAGAR) */}
            <section className="lg:hidden mb-6 rounded-xl bg-[#fafafa] border border-gray-200 p-4 sm:p-5">
              {renderOrderSummary()}
            </section>

           {/* TÉRMINOS */}
            <div id="terms-field" className="mb-5">
              <label
                htmlFor="terms"
                className="flex items-center gap-2.5 text-xs sm:text-sm text-gray-600 cursor-pointer"
              >
                <input
                  type="checkbox"
                  id="terms"
                  checked={termsAccepted}
                  onChange={(e) => {
                    setTermsAccepted(e.target.checked);
                    if (e.target.checked) {
                      setErrors((prev) => ({ ...prev, terms: undefined }));
                    }
                  }}
                  className="h-4 w-4 !min-h-0 !min-w-0 !p-0 accent-cyan-700 text-cyan-700 border-gray-300 rounded focus:ring-cyan-700 flex-shrink-0"
                />
                <span className="leading-snug">
                  Acepto los{' '}
                  <Link
                    href="/politicas"
                    className="!inline !py-0 text-cyan-700 font-medium underline underline-offset-2"
                  >
                    términos y condiciones
                  </Link>
                  .
                </span>
              </label>
              {errors.terms && (
                <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1">
                  <FiAlertCircle size={12} /> {errors.terms}
                </p>
              )}
            </div>

            {/* BOTÓN PRINCIPAL */}
            <button
              type="submit"
              disabled={isProcessing || isCalculatingShipping}
              className="w-full h-14 bg-cyan-700 hover:bg-cyan-800 active:bg-cyan-900 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold text-base rounded-lg transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Procesando pedido...</span>
                </>
              ) : isCalculatingShipping ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Calculando envío...</span>
                </>
              ) : (
                <span>Pagar ahora</span>
              )}
            </button>

            {/* Footer discreto */}
            <div className="mt-8 pt-4 border-t border-gray-200 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-gray-500">
              <Link href="/politicas-de-envio" className="hover:text-cyan-700 underline underline-offset-2">
                Política de envío
              </Link>
              <Link href="/politicas" className="hover:text-cyan-700 underline underline-offset-2">
                Política de privacidad
              </Link>
              <Link href="/politicas" className="hover:text-cyan-700 underline underline-offset-2">
                Términos del servicio
              </Link>
            </div>
          </div>

          {/* ================= COLUMNA DERECHA: RESUMEN FIJO (ESCRITORIO) ================= */}
          <aside className="hidden lg:block lg:col-span-5 bg-[#fafafa] border-l border-gray-200 px-8 py-10">
            <div className="sticky top-8">
              {renderOrderSummary()}
            </div>
          </aside>
        </form>
      </main>
    </div>
  );
}