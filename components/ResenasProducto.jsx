// components/ResenasProducto.jsx
"use client";

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexto/ContextoAuth';
import { getFunctions, httpsCallable } from "firebase/functions";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { app } from '@/lib/firebaseClient';
import toast from 'react-hot-toast';
import Image from 'next/image';
import { useModal } from '@/contexto/ContextoModal';

const Estrellas = ({ rating }) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) stars.push(<i key={i} className="fas fa-star text-amber-400"></i>);
        else stars.push(<i key={i} className="far fa-star text-amber-400"></i>);
    }
    return <div className="flex">{stars}</div>;
};

export default function ResenasProducto({ productId }) {
    const functions = getFunctions(app);
    const storage = getStorage(app);
    const { currentUser } = useAuth();
    const { openLightbox } = useModal();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [rating, setRating] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imageFile, setImageFile] = useState(null);

    const fetchReviews = useCallback(async () => {
        setLoading(true);
        try {
            const getReviewsFunc = httpsCallable(functions, 'getReviews');
            const result = await getReviewsFunc({ productId });
            setReviews(result.data);
        } catch (error) {
            toast.error("No se pudieron cargar las opiniones.");
        } finally {
            setLoading(false);
        }
    }, [productId, functions]);

    useEffect(() => {
        fetchReviews();
    }, [fetchReviews]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const { name, text } = e.target.elements;

        if (rating === 0) {
            toast.error('Por favor, selecciona una calificación de estrellas.');
            setIsSubmitting(false);
            return;
        }

        let imageUrl = null;
        try {
            if (imageFile) {
                const storageRef = ref(storage, `reviews/${productId}/${Date.now()}-${imageFile.name}`);
                const snapshot = await uploadBytes(storageRef, imageFile);
                imageUrl = await getDownloadURL(snapshot.ref);
            }

            const addReview = httpsCallable(functions, 'addReview');
            await addReview({
                productId: Number(productId),
                rating: rating,
                name: name.value,
                text: text.value,
                imageUrl: imageUrl,
            });

            toast.success('¡Gracias por tu opinión! Será visible en breve.');
            setShowForm(false);
            setRating(0);
            setImageFile(null);
            e.target.reset();
            await fetchReviews();
        } catch (error) {
            toast.error('Hubo un error al enviar tu opinión.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const summary = {
        total: reviews.length,
        average: reviews.length > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : "0.0",
    };

    return (
        <div className="mt-12 pt-8 border-t">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-8">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-bold">Opiniones de Clientes</h2>
                    <div className="flex items-center gap-4 mt-2">
                        <div className="flex text-2xl text-amber-500"><Estrellas rating={summary.average} /></div>
                        <div className="text-lg">
                            <span className="font-bold">{summary.average}</span> de 5
                        </div>
                    </div>
                    <p className="text-gray-600 mt-1">Basado en {summary.total} opiniones</p>
                </div>
                <div className="text-center md:text-right">
                    <button onClick={() => setShowForm(!showForm)} className="bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition">
                        {showForm ? 'Cancelar' : 'Escribir una Opinión'}
                    </button>
                </div>
            </div>

            {showForm && (
                <div className="my-8 p-6 bg-gray-50 rounded-lg border animate-fade-in">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="font-semibold text-gray-700">Tu calificación *</label>
                            <div className="flex text-3xl text-gray-300 cursor-pointer mt-2">
                                {[...Array(5)].map((_, index) => {
                                    const ratingValue = index + 1;
                                    return <label key={ratingValue}><input type="radio" name="rating" value={ratingValue} onClick={() => setRating(ratingValue)} className="hidden" /><i className={`fas fa-star transition-colors ${ratingValue <= rating ? 'text-amber-400' : 'hover:text-amber-300'}`}></i></label>;
                                })}
                            </div>
                        </div>
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Tu nombre *</label>
                            <input type="text" id="name" defaultValue={currentUser?.displayName || ''} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                        </div>
                        <div>
                            <label htmlFor="text" className="block text-sm font-medium text-gray-700">Tu opinión *</label>
                            <textarea id="text" rows="4" required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"></textarea>
                        </div>
                         <div>
                            <label htmlFor="review-image" className="block text-sm font-medium text-gray-700">Sube una foto (opcional)</label>
                            <input type="file" id="review-image" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} className="mt-1 block w-full text-sm" />
                        </div>
                        <button type="submit" disabled={isSubmitting} className="w-full sm:w-auto bg-green-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-green-700 transition disabled:bg-gray-400">
                            {isSubmitting ? 'Enviando...' : 'Enviar Opinión'}
                        </button>
                    </form>
                </div>
            )}

            <div className="space-y-6">
                {loading && <p className="text-center py-8">Cargando opiniones...</p>}
                {!loading && reviews.length === 0 && <p className="py-8 text-center text-gray-500 bg-gray-50 rounded-lg">Aún no hay opiniones para este producto. ¡Sé el primero!</p>}
                {reviews.map(review => (
                    <div key={review.id} className="border-b pb-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <span className="font-bold">{review.name}</span>
                                {review.isVerified && <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-semibold">Compra Verificada</span>}
                            </div>
                            <span className="text-sm text-gray-500">{new Date(review.createdAt).toLocaleDateString('es-CO')}</span>
                        </div>
                        <div className="flex my-2"><Estrellas rating={review.rating} /></div>
                        <p className="text-gray-700">{review.text}</p>
                        {review.imageUrl && (
                            <div className="relative w-24 h-24 mt-4 rounded-md overflow-hidden cursor-pointer" onClick={() => openLightbox(review.imageUrl)}>
                                <Image src={review.imageUrl} alt="Imagen de reseña" fill className="object-cover" />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}