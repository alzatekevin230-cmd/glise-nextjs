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

// (El resto de tus componentes auxiliares no cambian)
const formatPrice = (price) => `$${Math.round(price).toLocaleString('es-CO')}`;
const BotonVolver = () => {
    const router = useRouter();
    const handleBackNavigation = () => {
        sessionStorage.setItem('isNavigatingBack', 'true');
        router.back();
    };
    return (
        <button type="button" onClick={handleBackNavigation} className="mb-8 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center">
            <i className="fas fa-arrow-left mr-2"></i> Volver
        </button>
    );
};
const BarraEnvioGratis = ({ subtotal }) => {
    const envioGratisDesde = 250000;
    if (subtotal >= envioGratisDesde) {
        return <div className="my-6 p-3 bg-green-50 rounded-lg text-center border border-green-200"><p className="text-sm font-semibold text-green-700">✅ ¡Felicidades! Tienes envío gratis.</p></div>;
    }
    const restante = envioGratisDesde - subtotal;
    const progreso = Math.min((subtotal / envioGratisDesde) * 100, 100);
    return (
        <div className="my-6 p-4 bg-gray-50 border rounded-lg">
            <p className="text-sm font-semibold text-center text-gray-800 mb-2">¡Agrega <span className="font-bold text-blue-600">{formatPrice(restante)}</span> y obtén envío gratis!</p>
            <div className="w-full bg-gray-300 rounded-full h-2.5"><div className="bg-yellow-400 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progreso}%` }}></div></div>
        </div>
    );
};
const PoliticasEnvioAccordion = () => (
    <div className="mt-4">
        <details className="shipping-policy-accordion"><summary className="shipping-policy-title"><i className="fas fa-shipping-fast mr-3 text-blue-600"></i><span>Ver nuestra Política de Envío</span><i className="fas fa-chevron-down icon-arrow"></i></summary><div className="shipping-policy-content"><p><strong>¡Queremos que recibas tu pedido lo antes posible!</strong> A continuación, te presentamos nuestros tiempos de entrega estimados una vez que tu pago ha sido aprobado.</p><ul><li><strong>Envío Local (Palmira):</strong> 1-2 días hábiles.</li><li><strong>Envío Regional (Valle del Cauca):</strong> 2-3 días hábiles.</li><li><strong>Envío Nacional (Ciudades Principales):</strong> 3-5 días hábiles.</li><li><strong>Envío Zonal (Ciudades Intermedias):</strong> 4-7 días hábiles.</li><li><strong>Otras Ciudades:</strong> 5-10 días hábiles.</li><li><strong>Destinos Especiales:</strong> 8-15 días hábiles.</li></ul><p className="mt-4"><strong>Recuerda:</strong></p><ul><li>Los tiempos son estimados y pueden variar por factores externos a Glisé.</li><li>Los días hábiles no incluyen sábados, domingos ni festivos.</li><li>Las compras realizadas después de las 2:00 PM serán procesadas al siguiente día hábil.</li></ul><p className="mt-4 font-semibold">¡Obtén <strong>envío GRATIS</strong> en compras superiores a $250,000!</p></div></details>
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
            return;
        }
        const getQuote = httpsCallable(functions, 'getCoordinadoraQuote');
        try {
            const result = await getQuote({ destinationCityCode: cityCode, cartItems: cart });
            setShippingCost(result.data.shippingCost);
            setDeliveryDays(result.data.deliveryDays);
        } catch (error) {
            console.error("Error al calcular envío:", error);
            toast.error("No se pudo calcular el costo de envío.");
            setShippingCost(0);
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
            setShippingCost(0);
            setDeliveryDays(null);
        }
        if (fieldName === 'city') {
            setFormData(prev => ({
                ...prev,
                city: selectedOption ? selectedOption.label : '',
                cityCode: selectedOption ? selectedOption.value : ''
            }));
        }
    };
    
    const handleInputChange = useCallback((e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    }, []);

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
    
    const handleSubmit = async (e) => { /* ... tu función de submit no cambia ... */ 
        e.preventDefault();
        if (!validateForm()) {
            toast.error(errors.terms || 'Por favor, completa todos los campos obligatorios.');
            return;
        }
        setIsProcessing(true);
        const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
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

    if (cart.length === 0 && !isProcessing) return null;

    // Estilos para que react-select se parezca a tus otros campos
    const customSelectStyles = {
        control: (provided, state) => ({
            ...provided,
            borderColor: state.isFocused ? '#60a5fa' : '#d1d5db',
            boxShadow: state.isFocused ? '0 0 0 2px #bfdbfe' : 'none',
            '&:hover': { borderColor: '#9ca3af' },
            minHeight: '42px',
        }),
        placeholder: (provided) => ({ ...provided, color: '#6b7280' }),
    };

    return (
        <>
            <main className="container mx-auto px-4 sm:px-6 py-8">
                <h1 className="text-3xl font-bold text-center mb-8">Finalizar Compra</h1>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-12" noValidate>
                    <div>
                        <BotonVolver />
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
                                <p className="text-sm text-green-800 font-semibold">
                                    <i className="fas fa-check-circle mr-2"></i>
                                    ¡Bienvenido de nuevo, {currentUser.displayName?.split(' ')[0]}!
                                </p>
                            </div>
                        )}
                        <h3 className="text-2xl font-semibold mb-6">Detalles de facturación</h3>
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">Nombre *</label>
                                    <input type="text" id="firstName" name="given-name" autoComplete="given-name" value={formData.firstName} onChange={handleInputChange} className="mt-1 block w-full border rounded-md shadow-sm p-2" />
                                    {touched.firstName && errors.firstName && <span className="text-red-600 text-sm mt-1">{errors.firstName}</span>}
                                </div>
                                <div>
                                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Apellidos *</label>
                                    <input type="text" id="lastName" name="family-name" autoComplete="family-name" value={formData.lastName} onChange={handleInputChange} className="mt-1 block w-full border rounded-md shadow-sm p-2" />
                                    {touched.lastName && errors.lastName && <span className="text-red-600 text-sm mt-1">{errors.lastName}</span>}
                                </div>
                            </div>
                            
                            {/* CAMPO DE DEPARTAMENTO CON REACT-SELECT */}
                            <div className="mt-1">
                                <label htmlFor="state" className="block text-sm font-medium text-gray-700">Departamento *</label>
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
                                {touched.state && errors.state && <span className="text-red-600 text-sm mt-1">{errors.state}</span>}
                            </div>

                            {/* CAMPO DE CIUDAD CON REACT-SELECT */}
                            <div className="mt-1">
                                <label htmlFor="city" className="block text-sm font-medium text-gray-700">Localidad / Ciudad *</label>
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
                                {touched.cityCode && errors.cityCode && <span className="text-red-600 text-sm mt-1">{errors.cityCode}</span>}
                            </div>
                            
                            {/* ... Resto de tu formulario no cambia ... */}
                            <div>
                                <label htmlFor="address" className="block text-sm font-medium text-gray-700">Dirección *</label>
                                <input type="text" id="address" autoComplete="street-address" placeholder="Ej: Calle 5 # 10-20, Apto 301" value={formData.address} onChange={handleInputChange} className="mt-1 block w-full border rounded-md shadow-sm p-2" />
                                {touched.address && errors.address && <span className="text-red-600 text-sm mt-1">{errors.address}</span>}
                            </div>
                            <div>
                                <label htmlFor="neighborhood" className="block text-sm font-medium text-gray-700">Barrio (opcional)</label>
                                <input type="text" id="neighborhood" autoComplete="address-level3" placeholder="Ej: El Prado" value={formData.neighborhood} onChange={handleInputChange} className="mt-1 block w-full border rounded-md shadow-sm p-2" />
                            </div>
                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Teléfono *</label>
                                <input type="tel" id="phone" autoComplete="tel" value={formData.phone} onChange={handleInputChange} className="mt-1 block w-full border rounded-md shadow-sm p-2" />
                                {touched.phone && errors.phone && <span className="text-red-600 text-sm mt-1">{errors.phone}</span>}
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo electrónico *</label>
                                <input type="email" id="email" autoComplete="email" value={formData.email} onChange={handleInputChange} className="mt-1 block w-full border rounded-md shadow-sm p-2" />
                                {touched.email && errors.email && <span className="text-red-600 text-sm mt-1">{errors.email}</span>}
                            </div>
                            <div>
                                <label htmlFor="orderNotes" className="block text-sm font-medium text-gray-700">Notas del pedido (opcional)</label>
                                <textarea id="orderNotes" value={formData.orderNotes} onChange={handleInputChange} rows="4" placeholder="Notas sobre tu pedido, ej. Dejar en portería, etc." className="mt-1 block w-full border rounded-md shadow-sm p-2"></textarea>
                            </div>
                            <PoliticasEnvioAccordion />
                        </div>
                    </div>
                    
                    {/* La columna de la derecha (resumen de pedido) no necesita cambios */}
                    <div className="bg-white p-6 rounded-lg shadow-lg border">
                        <h3 className="text-2xl font-semibold mb-6">Tu pedido</h3>
                        <div className="space-y-4">{cart.map(item=>(<div key={item.id} className="py-4 border-b"><div className="flex items-start justify-between gap-4"><div className="flex items-start gap-4 flex-grow"><div className="relative aspect-square w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0"><Image src={item.image||item.images?.[0]} alt={item.name} fill className="object-contain"/></div><div className="flex-grow"><p className="font-semibold text-gray-800 leading-tight text-sm">{item.name}</p><p className="text-sm text-gray-600 mt-1">{formatPrice(item.price)}</p></div></div><button type="button" onClick={()=>removeFromCart(item.id)} className="text-gray-400 hover:text-red-600 text-lg transition-colors flex-shrink-0 ml-2"><i className="fas fa-trash-alt"></i></button></div><div className="flex items-center justify-between mt-4"><div className="flex items-center border rounded-md"><button type="button" onClick={()=>updateQuantity(item.id,item.quantity-1)} disabled={item.quantity<=1} className="px-3 py-1 text-lg font-semibold text-gray-600 hover:bg-gray-100 rounded-l-md disabled:opacity-50">-</button><span className="px-3 py-1 font-semibold text-center w-10">{item.quantity}</span><button type="button" onClick={()=>updateQuantity(item.id,item.quantity+1)} className="px-3 py-1 text-lg font-semibold text-gray-600 hover:bg-gray-100 rounded-r-md">+</button></div><p className="font-semibold text-right">{formatPrice(item.price*item.quantity)}</p></div></div>))}</div>
                        <div className="mt-6 border-t pt-4 space-y-2"><div className="flex justify-between"><span>Subtotal</span><span className="font-semibold">{formatPrice(subtotal)}</span></div><div className="pb-4 border-b">{subtotal>=250000?(<div className="flex justify-between items-center shipping-cost-item"><span className="font-medium">Envío</span><span className="font-semibold text-green-600">Gratis</span></div>):formData.cityCode?(shippingCost>0?(<div className="flex justify-between items-center shipping-cost-item"><div><span className="font-medium text-gray-800">Envío con Coordinadora</span><p className="text-sm text-gray-500">{deliveryDays} días hábiles (aprox)</p></div><span className="font-semibold text-gray-900">{formatPrice(shippingCost)}</span></div>):(<div className="flex justify-between items-center text-gray-500 animate-pulse"><span><i className="fas fa-spinner fa-spin mr-2"></i>Calculando...</span></div>)):(<div className="flex justify-between items-center text-gray-500"><span>Envío</span><span>Selecciona una ciudad</span></div>)}</div><div className="flex justify-between text-xl font-bold pt-2 mt-2"><span>Total</span><span>{formatPrice(total)}</span></div></div>
                        <BarraEnvioGratis subtotal={subtotal}/>
                        <div className="mt-6 border-t pt-4"><div className="p-4 border rounded-lg bg-gray-50"><label className="font-semibold flex items-center"><input type="radio" name="payment_method" value="wompi" className="mr-2" defaultChecked/>Wompi (Tarjetas, PSE, Nequi, etc.)</label><div className="mt-3 p-4 bg-white rounded-md border"><p className="text-sm text-gray-600 mb-4">Paga con tu tarjeta de crédito, débito, PSE, Nequi, Bancolombia, Daviplata y más a través de Wompi. Tu pago es 100% seguro.</p><Image src="/imagenespagina/logodewompi.webp" alt="Métodos de pago Wompi" width={400} height={80} className="w-full max-w-sm mx-auto object-contain"/></div></div></div>
                        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg"><p className="text-sm text-gray-700">Tus datos personales se utilizarán para procesar tu pedido, mejorar tu experiencia en esta web y otros propósitos descritos en nuestra <Link href="/politicas" className="text-blue-600 font-semibold hover:underline">política de privacidad</Link>.</p></div>
                        <div className="mt-6"><label htmlFor="terms" className="flex items-center text-sm"><input type="checkbox" id="terms" checked={termsAccepted} onChange={(e)=>setTermsAccepted(e.target.checked)} className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"/><span className="ml-2 text-gray-700">He leído y estoy de acuerdo con los <Link href="/politicas" className="text-blue-600 hover:underline">términos y condiciones</Link> de la web *</span></label>{errors.terms&&<span className="text-red-600 text-sm mt-1">{errors.terms}</span>}</div>
                        <button type="submit" disabled={isProcessing} className="w-full mt-4 bg-green-500 text-white font-bold py-3 rounded-lg hover:bg-green-600 transition text-lg disabled:bg-gray-400 flex items-center justify-center">{isProcessing?(<><i className="fas fa-spinner fa-spin mr-2"></i><span>Procesando...</span></>):('REALIZAR EL PEDIDO')}</button>
                    </div>
                </form>
            </main>
        </>
    );
}