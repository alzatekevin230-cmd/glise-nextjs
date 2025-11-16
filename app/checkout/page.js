"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Select from 'react-select'; // ¡IMPORTANTE! Importamos la nueva librería
import { useCarrito } from '@/contexto/ContextoCarrito';
import { useAuth } from '@/contexto/ContextoAuth';
import { useModal } from '@/contexto/ContextoModal';
import { useRouter } from 'next/navigation';
import { getFunctions, httpsCallable } from "firebase/functions";
import { doc, getDoc } from "firebase/firestore";
import { app, db } from '@/lib/firebaseClient';
import toast from 'react-hot-toast';
import Breadcrumbs from '@/components/Breadcrumbs';
import { FaShippingFast, FaChevronDown, FaLock, FaUsers, FaStar, FaShieldAlt, FaCheckCircle, FaTrashAlt, FaSpinner, FaExclamationTriangle, FaCheck } from 'react-icons/fa';

// (El resto de tus componentes auxiliares no cambian)
const formatPrice = (price) => `$${Math.round(price).toLocaleString('es-CO')}`;
const BarraEnvioGratis = ({ subtotal }) => {
    const envioGratisDesde = 250000;
    if (subtotal >= envioGratisDesde) {
        return (
            <div className="my-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl text-center border border-green-200 shadow-sm">
                <div className="flex items-center justify-center gap-2">
                    <FaCheck className="text-green-600 text-lg" />
                    <p className="text-lg font-bold text-green-700">¡Felicidades! Tienes envío gratis.</p>
                </div>
            </div>
        );
    }
    const restante = envioGratisDesde - subtotal;
    const progreso = Math.min((subtotal / envioGratisDesde) * 100, 100);
    return (
        <div className="my-6 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl shadow-sm">
            <p className="text-sm font-semibold text-center text-gray-800 mb-3">
                ¡Agrega <span className="font-bold text-blue-600 text-lg">{formatPrice(restante)}</span> y obtén envío gratis!
            </p>
            <div className="w-full bg-gray-300 rounded-full h-3 overflow-hidden shadow-inner">
                <div
                    className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full transition-all duration-700 ease-out shadow-sm"
                    style={{ width: `${progreso}%` }}
                ></div>
            </div>
            <p className="text-xs text-gray-600 text-center mt-2">{Math.round(progreso)}% completado</p>
        </div>
    );
};
const PoliticasEnvioAccordion = () => (
    <div className="mt-6">
        <details className="group bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
            <summary className="flex items-center justify-between cursor-pointer list-none p-4 font-semibold text-gray-800 hover:text-blue-700 transition-colors">
                <div className="flex items-center gap-3">
                    <FaShippingFast className="text-blue-600 text-xl flex-shrink-0" />
                    <span className="text-base">Ver nuestra Política de Envío</span>
                </div>
                <FaChevronDown className="text-blue-600 transition-transform duration-300 group-open:rotate-180 flex-shrink-0" />
            </summary>
            <div className="px-4 pb-4 pt-2 border-t border-blue-200 bg-white">
                <div className="space-y-4 text-sm text-gray-700">
                    <p className="font-semibold text-gray-800">¡Queremos que recibas tu pedido lo antes posible!</p>
                    <p className="text-gray-600">A continuación, te presentamos nuestros tiempos de entrega estimados una vez que tu pago ha sido aprobado:</p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li><strong className="text-gray-800">Envío Local (Palmira):</strong> 1-2 días hábiles.</li>
                        <li><strong className="text-gray-800">Envío Regional (Valle del Cauca):</strong> 2-3 días hábiles.</li>
                        <li><strong className="text-gray-800">Envío Nacional (Ciudades Principales):</strong> 3-5 días hábiles.</li>
                        <li><strong className="text-gray-800">Envío Zonal (Ciudades Intermedias):</strong> 4-7 días hábiles.</li>
                        <li><strong className="text-gray-800">Otras Ciudades:</strong> 5-10 días hábiles.</li>
                        <li><strong className="text-gray-800">Destinos Especiales:</strong> 8-15 días hábiles.</li>
                    </ul>
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                        <p className="font-semibold text-gray-800 mb-2">Recuerda:</p>
                        <ul className="list-disc pl-5 space-y-1 text-gray-600">
                            <li>Los tiempos son estimados y pueden variar por factores externos a Glisé.</li>
                            <li>Los días hábiles no incluyen sábados, domingos ni festivos.</li>
                            <li>Las compras realizadas después de las 2:00 PM serán procesadas al siguiente día hábil.</li>
                        </ul>
                    </div>
                    <div className="mt-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                        <p className="font-bold text-green-700 text-center">¡Obtén <strong>envío GRATIS</strong> en compras superiores a $250,000!</p>
                    </div>
                </div>
            </div>
        </details>
    </div>
);

// Badges de confianza mejorados
const TrustBadges = () => (
    <div className="my-6 p-4 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border border-blue-200 rounded-xl shadow-sm">
        <p className="text-center text-sm font-bold text-gray-800 mb-4 flex items-center justify-center gap-2">
            <FaShieldAlt className="text-blue-600" />
            Compra 100% segura
        </p>
        <div className="grid grid-cols-4 gap-3">
            <div className="flex flex-col items-center text-center p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <FaLock className="text-xl text-green-600 mb-2" />
                <p className="text-xs font-semibold text-gray-700">SSL</p>
                <p className="text-[10px] text-gray-500">Encriptado</p>
            </div>
            <div className="flex flex-col items-center text-center p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <FaUsers className="text-xl text-blue-600 mb-2" />
                <p className="text-xs font-semibold text-gray-700">+5K</p>
                <p className="text-[10px] text-gray-500">Clientes</p>
            </div>
            <div className="flex flex-col items-center text-center p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <FaStar className="text-xl text-yellow-500 mb-2" />
                <p className="text-xs font-semibold text-gray-700">4.8/5</p>
                <p className="text-[10px] text-gray-500">Calificación</p>
            </div>
            <div className="flex flex-col items-center text-center p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <FaShieldAlt className="text-xl text-purple-600 mb-2" />
                <p className="text-xs font-semibold text-gray-700">Garantía</p>
                <p className="text-[10px] text-gray-500">30 días</p>
            </div>
        </div>
    </div>
);


export default function CheckoutPage() {
    const functions = getFunctions(app);
    const { cart, clearCart, updateQuantity, removeFromCart } = useCarrito();
    const { currentUser } = useAuth();
    const { openModal } = useModal();
    const router = useRouter();

    const [formData, setFormData] = useState(() => {
        const savedData = typeof window !== 'undefined' ? localStorage.getItem('checkoutFormData') : null;
        return savedData ? JSON.parse(savedData) : { firstName: '', lastName: '', state: '', city: '', cityCode: '', address: '', neighborhood: '', phone: '', email: '', orderNotes: '' };
    });

    const [shippingCost, setShippingCost] = useState(0);
    const [deliveryDays, setDeliveryDays] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);
    const [shippingCalculated, setShippingCalculated] = useState(false);
    const [errors, setErrors] = useState({});
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [allCities, setAllCities] = useState([]);
    const [touched, setTouched] = useState({});

    // Obtenemos las ciudades y las guardamos
    useEffect(() => {
        const getCities = httpsCallable(functions, 'getCoordinadoraCities');
        getCities().then(result => setAllCities(result.data)).catch(err => {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error al cargar ciudades:", err);
            }
            toast.error("No se pudieron cargar las ciudades.");
        });
    }, [functions]);

    // Lógica para memorizar y transformar las listas de departamentos y ciudades
    const departmentOptions = useMemo(() => {
        if (allCities.length === 0) return [];
        const uniqueDepartments = [...new Set(allCities.map(c => c.department))].sort();
        return uniqueDepartments.map(d => ({ value: d, label: d }));
    }, [allCities]);

    const cityOptions = useMemo(() => {
        if (!formData.state || allCities.length === 0) return [];
        return allCities
            .filter(c => c.department === formData.state)
            .map(c => ({ value: c.code, label: c.name }));
    }, [formData.state, allCities]);


    const calculateShipping = useCallback(async (cityCode) => {
        if (!cityCode || cart.length === 0) {
            setShippingCost(0);
            setDeliveryDays(null);
            setShippingCalculated(false);
            setIsCalculatingShipping(false);
            return;
        }
        setIsCalculatingShipping(true);
        setShippingCalculated(false);
        const getQuote = httpsCallable(functions, 'getCoordinadoraQuote');
        try {
            const result = await getQuote({ destinationCityCode: cityCode, cartItems: cart });
            setShippingCost(result.data.shippingCost);
            setDeliveryDays(result.data.deliveryDays);
            setShippingCalculated(true);
        } catch (error) {
            console.error("Error al calcular envío:", error);
            toast.error("No se pudo calcular el costo de envío. Por favor, intenta de nuevo.");
            setShippingCost(0);
            setDeliveryDays(null);
            setShippingCalculated(false);
        } finally {
            setIsCalculatingShipping(false);
        }
    }, [cart, functions]);

    useEffect(() => { localStorage.setItem('checkoutFormData', JSON.stringify(formData)); }, [formData]);
    useEffect(() => {
        const isNavigatingBack = sessionStorage.getItem('isNavigatingBack');
        if (isNavigatingBack) { sessionStorage.removeItem('isNavigatingBack'); return; }
        if (cart.length === 0 && !isProcessing) { router.push('/'); }
    }, [cart, isProcessing, router]);

    useEffect(() => {
        if (currentUser && !currentUser.isAnonymous) {
            const autofill = async () => {
                const userRef = doc(db, `users/${currentUser.uid}`);
                const docSnap = await getDoc(userRef);
                const profileData = docSnap.exists() ? docSnap.data() : {};
                const fullName = profileData.name || currentUser.displayName || '';
                const nameParts = fullName.split(' ');
                setFormData(prev => ({
                    ...prev,
                    email: currentUser.email || '',
                    firstName: prev.firstName || nameParts.shift() || '',
                    lastName: prev.lastName || nameParts.join(' ') || '',
                    phone: prev.phone || profileData.phone || ''
                }));
            };
            autofill();
        }
    }, [currentUser]);
    
    useEffect(() => {
        if (formData.cityCode) {
            calculateShipping(formData.cityCode);
        }
    }, [cart, formData.cityCode, calculateShipping]);

    const handleSelectChange = (fieldName, selectedOption) => {
        if (fieldName === 'state') {
            setFormData(prev => ({
                ...prev,
                state: selectedOption ? selectedOption.value : '',
                city: '',
                cityCode: ''
            }));
            setTouched(prev => ({ ...prev, state: true }));
            setShippingCost(0);
            setDeliveryDays(null);
            setShippingCalculated(false);
        }
        if (fieldName === 'city') {
            setFormData(prev => ({
                ...prev,
                city: selectedOption ? selectedOption.label : '',
                cityCode: selectedOption ? selectedOption.value : ''
            }));
            setTouched(prev => ({ ...prev, cityCode: true }));
        }
    };
    
    const handleInputChange = useCallback((e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    }, []);

    // Función helper para obtener las clases de borde según el estado del campo
    const getFieldBorderClasses = (fieldName, isSelect = false) => {
        const hasError = touched[fieldName] && errors[fieldName];
        const hasValue = formData[fieldName] && String(formData[fieldName]).trim();
        const isValid = touched[fieldName] && hasValue && !hasError;
        
        if (hasError) {
            return isSelect ? 'border-red-500' : 'border-red-500 border-2';
        } else if (isValid) {
            return isSelect ? 'border-green-500' : 'border-green-500 border-2';
        }
        return 'border-gray-300';
    };

    const validateForm = () => { /* ... tu función de validación no cambia ... */ 
        const fieldsToValidate = ['firstName', 'lastName', 'address', 'phone', 'email', 'state', 'cityCode'];
        const newTouchedState = {};
        fieldsToValidate.forEach(field => newTouchedState[field] = true);
        setTouched(newTouchedState);
        
        const newErrors = {};
        fieldsToValidate.forEach(field => {
            const value = formData[field];
            if (!value || !String(value).trim()) {
                newErrors[field] = 'Este campo es obligatorio.';
            } else if (field === 'email' && !/\S+@\S+\.\S+/.test(value)) {
                newErrors[field] = 'El formato del correo no es válido.';
            }
        });

        if (!termsAccepted) newErrors.terms = 'Debes aceptar los términos y condiciones.';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    
    const handleSubmit = async (e) => { 
        e.preventDefault();
        if (!validateForm()) {
            toast.error(errors.terms || 'Por favor, completa todos los campos obligatorios.');
            return;
        }
        
        const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        npm
        // Validación crítica: Si el subtotal es menor a 250000, el envío DEBE estar calculado
        if (subtotal < 250000) {
            if (!formData.cityCode) {
                toast.error('Por favor, selecciona una ciudad para calcular el costo de envío.');
                return;
            }
            if (isCalculatingShipping) {
                toast.error('Espera mientras calculamos el costo de envío...');
                return;
            }
            if (!shippingCalculated) {
                toast.error('El costo de envío aún no se ha calculado. Por favor, espera unos segundos o selecciona otra ciudad.');
                return;
            }
            if (shippingCost <= 0) {
                toast.error('El costo de envío no es válido. Por favor, intenta seleccionar otra ciudad o contacta a soporte.');
                return;
            }
        }
        
        setIsProcessing(true);
        const finalShippingCost = subtotal >= 250000 ? 0 : shippingCost;
        const total = subtotal + finalShippingCost;
        const totalInCents = Math.round(total * 100);
        const reference = `${Date.now()}`;
        const orderPayload = { orderId: reference, customerDetails: formData, items: cart, subtotal, shippingCost: finalShippingCost, total, orderNotes: formData.orderNotes };
        try {
            const processOrder = httpsCallable(functions, 'processOrder');
            const result = await processOrder({ orderData: orderPayload, totalInCents, reference });
            const { signature, publicKey } = result.data;
            const wompiUrl = `https://checkout.wompi.co/p/?public-key=${publicKey}&currency=COP&amount-in-cents=${totalInCents}&reference=${reference}&signature:integrity=${signature}&redirect-url=https://glise.com.co/gracias`;
            clearCart();
            localStorage.removeItem('checkoutFormData');
            window.location.href = wompiUrl;
        } catch (error) {
            console.error("Error al procesar la orden:", error);
            toast.error("Hubo un error al procesar tu pedido. Inténtalo de nuevo.");
            setIsProcessing(false);
        }
    };

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const finalShippingCost = subtotal >= 250000 ? 0 : shippingCost;
    const total = subtotal + finalShippingCost;
    
    // Determinar si el botón debe estar deshabilitado
    // Si subtotal >= 250000, envío es gratis, no necesita calcularse
    // Si subtotal < 250000, DEBE tener ciudad seleccionada Y envío calculado Y shippingCost > 0
    const canSubmit = !isProcessing && 
                      !isCalculatingShipping && 
                      (subtotal >= 250000 || (formData.cityCode && shippingCalculated && shippingCost > 0));

    if (cart.length === 0 && !isProcessing) return null;

    // Estilos mejorados para react-select con validación visual
    const getSelectBorderColor = (fieldName) => {
        const hasError = touched[fieldName] && errors[fieldName];
        const hasValue = formData[fieldName] && String(formData[fieldName]).trim();
        const isValid = touched[fieldName] && hasValue && !hasError;
        
        if (hasError) return '#ef4444'; // red-500
        if (isValid) return '#22c55e'; // green-500
        return '#d1d5db'; // gray-300
    };

    const customSelectStyles = {
        control: (provided, state) => {
            const fieldName = state.selectProps.inputId === 'state' ? 'state' : 'cityCode';
            const borderColor = getSelectBorderColor(fieldName);
            const hasError = touched[fieldName] && errors[fieldName];
            const hasValue = formData[fieldName] && String(formData[fieldName]).trim();
            const isValid = touched[fieldName] && hasValue && !hasError;
            const borderWidth = (hasError || isValid) ? '2px' : '1px';
            
            return {
                ...provided,
                borderColor: borderColor,
                borderWidth: borderWidth,
                borderRadius: '0.5rem',
                boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                '&:hover': {
                    borderColor: borderColor,
                    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                },
                minHeight: '48px',
                backgroundColor: 'white',
                fontSize: '14px',
                transition: 'all 0.2s ease-in-out',
            };
        },
        placeholder: (provided) => ({
            ...provided,
            color: '#9ca3af',
            fontSize: '14px'
        }),
        singleValue: (provided) => ({
            ...provided,
            color: '#374151',
            fontSize: '14px'
        }),
        input: (provided) => ({
            ...provided,
            fontSize: '14px'
        }),
        menu: (provided) => ({
            ...provided,
            borderRadius: '0.5rem',
            border: '1px solid #e5e7eb',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            zIndex: 9999,
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected ? '#3b82f6' : state.isFocused ? '#eff6ff' : 'white',
            color: state.isSelected ? 'white' : '#374151',
            fontSize: '14px',
            padding: '12px 16px',
            cursor: 'pointer',
            '&:active': {
                backgroundColor: state.isSelected ? '#2563eb' : '#dbeafe',
            },
        }),
    };

    const breadcrumbItems = [
        { label: 'Inicio', href: '/' },
        { label: 'Tienda', href: '/categoria/all' },
        { label: 'Checkout', href: '/checkout' }
    ];

    return (
        <>
            <main className="container mx-auto px-2 sm:px-6 py-8">
                <Breadcrumbs items={breadcrumbItems} />
                <h1 className="text-3xl font-bold text-center mb-8 mt-6">Finalizar Compra</h1>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-12" noValidate>
                    <div>
                        {/* ... Tu JSX de bienvenida no cambia ... */}
                        {!currentUser || currentUser.isAnonymous ? (
                            <div className="p-4 mb-6 bg-blue-50 border border-blue-200 rounded-lg text-center">
                                <p className="text-sm text-gray-700">¿Ya tienes una cuenta?
                                    <button type="button" onClick={() => openModal('auth')} className="font-bold text-blue-600 hover:underline ml-1">
                                        Inicia sesión aquí
                                    </button> 
                                </p>
                            </div>
                        ) : (
                            <div className="p-4 mb-6 bg-green-50 border border-green-200 rounded-lg text-center">
                                <p className="text-sm text-green-800 font-semibold flex items-center justify-center gap-2">
                                    <FaCheckCircle />
                                    ¡Bienvenido de nuevo, {currentUser.displayName?.split(' ')[0]}!
                                </p>
                            </div>
                        )}
                        <h3 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                            <FaCheck className="text-blue-600" />
                            Detalles de facturación
                        </h3>
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700">
                                        Nombre *
                                    </label>
                                    <input
                                        type="text"
                                        id="firstName"
                                        name="given-name"
                                        autoComplete="given-name"
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                        onBlur={() => setTouched(prev => ({ ...prev, firstName: true }))}
                                        className={`block w-full border rounded-lg shadow-sm px-4 py-3 focus:outline-none transition-colors ${getFieldBorderClasses('firstName')}`}
                                        placeholder="Ingresa tu nombre"
                                    />
                                    {touched.firstName && errors.firstName && (
                                        <span className="text-red-600 text-sm flex items-center gap-1">
                                            <FaExclamationTriangle />
                                            {errors.firstName}
                                        </span>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700">
                                        Apellidos *
                                    </label>
                                    <input
                                        type="text"
                                        id="lastName"
                                        name="family-name"
                                        autoComplete="family-name"
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                        onBlur={() => setTouched(prev => ({ ...prev, lastName: true }))}
                                        className={`block w-full border rounded-lg shadow-sm px-4 py-3 focus:outline-none transition-colors ${getFieldBorderClasses('lastName')}`}
                                        placeholder="Ingresa tus apellidos"
                                    />
                                    {touched.lastName && errors.lastName && (
                                        <span className="text-red-600 text-sm flex items-center gap-1">
                                            <FaExclamationTriangle />
                                            {errors.lastName}
                                        </span>
                                    )}
                                </div>
                            </div>
                            
                            {/* CAMPO DE DEPARTAMENTO CON REACT-SELECT */}
                            <div className="space-y-2">
                                <label htmlFor="state" className="block text-sm font-semibold text-gray-700">
                                    Departamento *
                                </label>
                                <Select
                                    inputId="state"
                                    name="state"
                                    options={departmentOptions}
                                    value={formData.state ? { value: formData.state, label: formData.state } : null}
                                    onChange={selectedOption => handleSelectChange('state', selectedOption)}
                                    placeholder="Selecciona un departamento..."
                                    isClearable
                                    isSearchable
                                    styles={customSelectStyles}
                                    noOptionsMessage={() => "No hay departamentos"}
                                />
                                {touched.state && errors.state && (
                                    <span className="text-red-600 text-sm flex items-center gap-1">
                                        <FaExclamationTriangle />
                                        {errors.state}
                                    </span>
                                )}
                            </div>

                            {/* CAMPO DE CIUDAD CON REACT-SELECT */}
                            <div className="space-y-2">
                                <label htmlFor="city" className="block text-sm font-semibold text-gray-700">
                                    Localidad / Ciudad *
                                </label>
                                <Select
                                    inputId="city"
                                    name="city"
                                    options={cityOptions}
                                    value={formData.cityCode ? { value: formData.cityCode, label: formData.city } : null}
                                    onChange={selectedOption => handleSelectChange('city', selectedOption)}
                                    placeholder="Selecciona una ciudad..."
                                    isDisabled={!formData.state}
                                    isClearable
                                    isSearchable
                                    styles={customSelectStyles}
                                    noOptionsMessage={() => formData.state ? "No hay ciudades para este departamento" : "Selecciona un departamento primero"}
                                />
                                {touched.cityCode && errors.cityCode && (
                                    <span className="text-red-600 text-sm flex items-center gap-1">
                                        <FaExclamationTriangle />
                                        {errors.cityCode}
                                    </span>
                                )}
                            </div>
                            
                            {/* Dirección */}
                            <div className="space-y-2">
                                <label htmlFor="address" className="block text-sm font-semibold text-gray-700">
                                    Dirección *
                                </label>
                                <input
                                    type="text"
                                    id="address"
                                    autoComplete="street-address"
                                    placeholder="Ej: Calle 5 # 10-20, Apto 301"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    onBlur={() => setTouched(prev => ({ ...prev, address: true }))}
                                    className={`block w-full border rounded-lg shadow-sm px-4 py-3 focus:outline-none transition-colors ${getFieldBorderClasses('address')}`}
                                />
                                {touched.address && errors.address && (
                                    <span className="text-red-600 text-sm flex items-center gap-1">
                                        <FaExclamationTriangle />
                                        {errors.address}
                                    </span>
                                )}
                            </div>

                            {/* Barrio */}
                            <div className="space-y-2">
                                <label htmlFor="neighborhood" className="block text-sm font-semibold text-gray-700">
                                    Barrio (opcional)
                                </label>
                                <input
                                    type="text"
                                    id="neighborhood"
                                    autoComplete="address-level3"
                                    placeholder="Ej: El Prado"
                                    value={formData.neighborhood}
                                    onChange={handleInputChange}
                                    className="block w-full border border-gray-300 rounded-lg shadow-sm px-4 py-3 focus:outline-none transition-colors"
                                />
                            </div>

                            {/* Teléfono */}
                            <div className="space-y-2">
                                <label htmlFor="phone" className="block text-sm font-semibold text-gray-700">
                                    Teléfono *
                                </label>
                                <input
                                    type="tel"
                                    id="phone"
                                    autoComplete="tel"
                                    placeholder="Ingresa tu número de teléfono"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    onBlur={() => setTouched(prev => ({ ...prev, phone: true }))}
                                    className={`block w-full border rounded-lg shadow-sm px-4 py-3 focus:outline-none transition-colors ${getFieldBorderClasses('phone')}`}
                                />
                                {touched.phone && errors.phone && (
                                    <span className="text-red-600 text-sm flex items-center gap-1">
                                        <FaExclamationTriangle />
                                        {errors.phone}
                                    </span>
                                )}
                            </div>

                            {/* Correo electrónico */}
                            <div className="space-y-2">
                                <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                                    Correo electrónico *
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    autoComplete="email"
                                    placeholder="tu@email.com"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    onBlur={() => setTouched(prev => ({ ...prev, email: true }))}
                                    className={`block w-full border rounded-lg shadow-sm px-4 py-3 focus:outline-none transition-colors ${getFieldBorderClasses('email')}`}
                                />
                                {touched.email && errors.email && (
                                    <span className="text-red-600 text-sm flex items-center gap-1">
                                        <FaExclamationTriangle />
                                        {errors.email}
                                    </span>
                                )}
                            </div>

                            {/* Notas del pedido */}
                            <div className="space-y-2">
                                <label htmlFor="orderNotes" className="block text-sm font-semibold text-gray-700">
                                    Notas del pedido (opcional)
                                </label>
                                <textarea
                                    id="orderNotes"
                                    value={formData.orderNotes}
                                    onChange={handleInputChange}
                                    rows="4"
                                    placeholder="Notas sobre tu pedido, ej. Dejar en portería, etc."
                                    className="block w-full border border-gray-300 rounded-lg shadow-sm px-4 py-3 focus:outline-none transition-colors resize-none"
                                />
                            </div>
                            <PoliticasEnvioAccordion />
                        </div>
                    </div>
                    
                    {/* Resumen de pedido mejorado */}
                    <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl shadow-xl border border-gray-200">
                        <h3 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                            <FaLock className="text-green-600" />
                            Tu pedido
                        </h3>

                        {/* Lista de productos mejorada */}
                        <div className="space-y-4 mb-6">
                            {cart.map(item => (
                                <div key={item.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 transition-all hover:shadow-md">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-start gap-4 flex-grow">
                                            <div className="relative aspect-square w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                                <Image
                                                    src={item.image || item.images?.[0]}
                                                    alt={item.name}
                                                    fill
                                                    className="object-contain"
                                                />
                                            </div>
                                            <div className="flex-grow min-w-0">
                                                <p className="font-semibold text-gray-800 leading-tight text-sm line-clamp-2">{item.name}</p>
                                                <p className="text-sm text-gray-600 mt-1">{formatPrice(item.price)}</p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeFromCart(item.id)}
                                            className="text-gray-400 hover:text-red-600 text-lg transition-colors flex-shrink-0 ml-2 p-1 hover:bg-red-50 rounded"
                                            aria-label={`Eliminar ${item.name}`}
                                        >
                                            <FaTrashAlt />
                                        </button>
                                    </div>

                                    {/* Controles de cantidad mejorados */}
                                    <div className="flex items-center justify-between mt-4">
                                        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                                            <button
                                                type="button"
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                disabled={item.quantity <= 1}
                                                className="px-3 py-2 text-lg font-semibold text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                aria-label="Disminuir cantidad"
                                            >
                                                -
                                            </button>
                                            <span className="px-4 py-2 font-semibold text-center min-w-[3rem] bg-gray-50">{item.quantity}</span>
                                            <button
                                                type="button"
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="px-3 py-2 text-lg font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
                                                aria-label="Aumentar cantidad"
                                            >
                                                +
                                            </button>
                                        </div>
                                        <p className="font-bold text-gray-900">{formatPrice(item.price * item.quantity)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Resumen de costos mejorado */}
                        <div className="border-t border-gray-200 pt-4 space-y-3">
                            <div className="flex justify-between text-gray-700">
                                <span>Subtotal</span>
                                <span className="font-semibold">{formatPrice(subtotal)}</span>
                            </div>

                            <div className="pb-4 border-b border-gray-200">
                                {subtotal >= 250000 ? (
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium text-gray-800">Envío</span>
                                        <span className="font-bold text-green-600">¡Gratis!</span>
                                    </div>
                                ) : formData.cityCode ? (
                                    shippingCost > 0 ? (
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <span className="font-medium text-gray-800">Envío con Coordinadora</span>
                                                <p className="text-sm text-gray-500">{deliveryDays} días hábiles (aprox)</p>
                                            </div>
                                            <span className="font-semibold text-gray-900">{formatPrice(shippingCost)}</span>
                                        </div>
                                    ) : (
                                        <div className="flex justify-between items-center text-gray-500 animate-pulse">
                                            <span className="flex items-center gap-2">
                                                <FaSpinner className="animate-spin" />
                                                Calculando envío...
                                            </span>
                                        </div>
                                    )
                                ) : (
                                    <div className="flex justify-between items-center text-gray-500">
                                        <span>Envío</span>
                                        <span>Selecciona una ciudad</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-between text-xl font-bold pt-2 border-t border-gray-300">
                                <span>Total</span>
                                <span className="text-blue-600">{formatPrice(total)}</span>
                            </div>
                        </div>

                        <BarraEnvioGratis subtotal={subtotal} />

                        {/* Método de pago mejorado */}
                        <div className="mt-6 border-t pt-4">
                            <div className="p-4 border border-gray-200 rounded-xl bg-gradient-to-r from-gray-50 to-white shadow-sm">
                                <label className="font-bold flex items-center text-gray-800">
                                    <input type="radio" name="payment_method" value="wompi" className="mr-3 w-4 h-4 text-blue-600" defaultChecked />
                                    <span className="flex items-center gap-2">
                                        <FaLock className="text-green-600" />
                                        Wompi (Tarjetas, PSE, Nequi, etc.)
                                    </span>
                                </label>
                                <div className="mt-4 p-4 bg-white rounded-lg border border-gray-100">
                                    <p className="text-sm text-gray-600 mb-4">Paga con tu tarjeta de crédito, débito, PSE, Nequi, Bancolombia, Daviplata y más a través de Wompi. Tu pago es 100% seguro.</p>
                                    <Image
                                        src="/imagenespagina/logodewompi.webp"
                                        alt="Métodos de pago Wompi"
                                        width={400}
                                        height={80}
                                        className="w-full max-w-sm mx-auto object-contain rounded"
                                    />
                                </div>
                            </div>
                        </div>

                        <TrustBadges />

                        {/* Aviso de privacidad mejorado */}
                        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
                            <div className="flex items-start gap-2">
                                <FaExclamationTriangle className="text-blue-600 mt-0.5 flex-shrink-0" />
                                <p className="text-sm text-gray-700">
                                    Tus datos personales se utilizarán para procesar tu pedido, mejorar tu experiencia en esta web y otros propósitos descritos en nuestra{' '}
                                    <Link href="/politicas" className="text-blue-600 font-semibold hover:underline">
                                        política de privacidad
                                    </Link>.
                                </p>
                            </div>
                        </div>

                        {/* Términos y condiciones mejorados */}
                        <div className="mt-6">
                            <label htmlFor="terms" className="flex items-start text-sm cursor-pointer">
                                <input
                                    type="checkbox"
                                    id="terms"
                                    checked={termsAccepted}
                                    onChange={(e) => setTermsAccepted(e.target.checked)}
                                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:outline-none mt-0.5 mr-3 flex-shrink-0"
                                />
                                <span className="text-gray-700">
                                    He leído y estoy de acuerdo con los{' '}
                                    <Link href="/politicas" className="text-blue-600 font-semibold hover:underline">
                                        términos y condiciones
                                    </Link>{' '}
                                    de la web *
                                </span>
                            </label>
                            {errors.terms && <span className="text-red-600 text-sm mt-2 block">{errors.terms}</span>}
                        </div>

                        {/* Botón de pago mejorado */}
                        <button
                            type="submit"
                            disabled={!canSubmit}
                            className="w-full mt-6 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-4 px-6 rounded-xl hover:from-green-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-300 text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center justify-center gap-3"
                            title={!canSubmit && subtotal < 250000 && !shippingCalculated ? 'Espera mientras se calcula el costo de envío' : ''}
                        >
                            {isProcessing ? (
                                <>
                                    <FaSpinner className="animate-spin" />
                                    <span>Procesando pedido...</span>
                                </>
                            ) : isCalculatingShipping ? (
                                <>
                                    <FaSpinner className="animate-spin" />
                                    <span>Calculando envío...</span>
                                </>
                            ) : !canSubmit && subtotal < 250000 ? (
                                <>
                                    <FaSpinner className="animate-spin" />
                                    <span>Espera el cálculo...</span>
                                </>
                            ) : (
                                <>
                                    <FaLock />
                                    <span>REALIZAR PEDIDO</span>
                                </>
                            )}
                        </button>

                        {subtotal < 250000 && !shippingCalculated && formData.cityCode && (
                            <p className="text-sm text-amber-600 mt-3 text-center flex items-center justify-center gap-2">
                                <FaSpinner className="animate-spin" />
                                Calculando costo de envío...
                            </p>
                        )}
                    </div>
                </form>
                
                {/* Botón Sticky Móvil */}
                <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40 p-3">
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <p className="text-[10px] text-gray-500">Total</p>
                            <p className="text-lg font-bold text-gray-900">{formatPrice(total)}</p>
                        </div>
                        <button 
                            type="button" 
                            onClick={handleSubmit}
                            disabled={!canSubmit}
                            className="bg-green-500 text-white font-bold py-2 px-5 rounded-lg hover:bg-green-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center text-sm"
                        >
                            {isProcessing ? (
                                <><FaSpinner className="animate-spin mr-2" /><span>Procesando...</span></>
                            ) : isCalculatingShipping ? (
                                <><FaSpinner className="animate-spin mr-2" /><span>Calculando...</span></>
                            ) : !canSubmit && subtotal < 250000 ? (
                                <><FaSpinner className="animate-spin mr-2" /><span>Espera...</span></>
                            ) : (
                                <><FaLock className="mr-2" /><span>PAGAR</span></>
                            )}
                        </button>
                    </div>
                </div>
            </main>
        </>
    );
}