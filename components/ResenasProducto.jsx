// components/ResenasProducto.jsx
"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useAuth } from '@/contexto/ContextoAuth';
import toast from 'react-hot-toast';
import Image from 'next/image';
import { useModal } from '@/contexto/ContextoModal';
import SkeletonLoader from './SkeletonLoader';
import {
  FaStar, FaRegStar, FaTimes, FaCamera, FaThumbsUp, FaThumbsDown,
  FaCheckCircle, FaSpinner, FaCommentDots
} from 'react-icons/fa';

const TEXT_MAX_LEN = 1000;
const TEXT_MIN_LEN = 10;
const MAX_IMAGE_MB = 5;
const PAGE_SIZE = 5;
const VOTES_STORAGE_KEY = 'reviewVotes';

const Estrellas = ({ rating, size = 'text-base' }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.round(rating)) stars.push(<FaStar key={i} className={`text-amber-400 ${size}`} />);
    else stars.push(<FaRegStar key={i} className={`text-amber-400 ${size}`} />);
  }
  return <div className="flex gap-0.5">{stars}</div>;
};

const getInitial = (name) => (name?.trim()?.[0] || '?').toUpperCase();

const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('es-CO', {
  day: 'numeric', month: 'short', year: 'numeric',
});

function getVotedMap() {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem(VOTES_STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

function saveVote(reviewId, type) {
  const votes = getVotedMap();
  votes[reviewId] = type;
  localStorage.setItem(VOTES_STORAGE_KEY, JSON.stringify(votes));
}

// Selector de estrellas interactivo para el formulario (estilo Play Store: toca la estrella
// que quieras y se ajusta hasta ahí; si tocas una estrella ya encendida, se apaga solo esa
// -y las siguientes-, quedando en el valor anterior).
const StarPicker = ({ rating, onRate }) => {
  const [hover, setHover] = useState(0);
  const displayValue = hover || rating;

  const handlePick = (value) => {
    setHover(0); // en táctil no siempre llega el mouseleave; forzamos reset para que no "se pegue"
    onRate(value <= rating ? value - 1 : value);
  };

  return (
    <div className="flex gap-1.5" role="radiogroup" aria-label="Calificación">
      {[1, 2, 3, 4, 5].map((value) => {
        const active = value <= displayValue;
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={value === rating}
            aria-label={`${value} estrella${value > 1 ? 's' : ''}`}
            onMouseEnter={() => setHover(value)}
            onMouseLeave={() => setHover(0)}
            onClick={() => handlePick(value)}
            className="text-3xl transition-transform duration-150 hover:scale-125 active:scale-95"
          >
            {active ? <FaStar className="text-amber-400" /> : <FaRegStar className="text-gray-300" />}
          </button>
        );
      })}
    </div>
  );
};

// Barra de distribución de calificaciones (clicable para filtrar)
const RatingBar = ({ star, count, total, active, onClick }) => {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2 text-sm group ${active ? 'font-bold' : ''}`}
      aria-label={`Filtrar por ${star} estrellas`}
    >
      <span className={`w-8 text-right ${active ? 'text-cyan-700' : 'text-gray-600'}`}>{star}★</span>
      <span className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
        <span
          className={`block h-full rounded-full transition-all ${active ? 'bg-cyan-700' : 'bg-amber-400 group-hover:bg-amber-500'}`}
          style={{ width: `${pct}%` }}
        />
      </span>
      <span className="w-8 text-xs text-gray-500">{count}</span>
    </button>
  );
};

export default function ResenasProducto({ productId }) {
  const { currentUser } = useAuth();
  const { openLightbox } = useModal();

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [textLength, setTextLength] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const formRef = useRef(null);

  const [sortBy, setSortBy] = useState('recent');
  const [ratingFilter, setRatingFilter] = useState(0);
  const [onlyWithPhotos, setOnlyWithPhotos] = useState(false);
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [votedMap, setVotedMap] = useState({});

  useEffect(() => {
    setVotedMap(getVotedMap());
  }, []);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/reviews?productId=${productId}`);
      if (!response.ok) throw new Error('Error al cargar reseñas');
      const data = await response.json();
      setReviews(data);
    } catch (error) {
      toast.error("No se pudieron cargar las opiniones.");
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [sortBy, ratingFilter, onlyWithPhotos, onlyVerified]);

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('El archivo debe ser una imagen.');
      return;
    }
    if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
      toast.error(`La imagen no puede pesar más de ${MAX_IMAGE_MB}MB.`);
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const resetForm = () => {
    formRef.current?.reset();
    setRating(0);
    setTextLength(0);
    removeImage();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, text, website } = e.target.elements;

    // Honeypot: si un bot llena este campo invisible, se ignora el envío.
    if (website.value) {
      resetForm();
      return;
    }

    if (rating === 0) {
      toast.error('Por favor, selecciona una calificación de estrellas.');
      return;
    }
    if (text.value.trim().length < TEXT_MIN_LEN) {
      toast.error(`Tu opinión debe tener al menos ${TEXT_MIN_LEN} caracteres.`);
      return;
    }

    setIsSubmitting(true);
    let imageUrl = null;
    try {
      if (imageFile) {
        const uploadData = new FormData();
        uploadData.append('file', imageFile);
        uploadData.append('productId', String(productId));
        const uploadRes = await fetch('/api/reviews/upload-image', { method: 'POST', body: uploadData });
        const uploadResult = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(uploadResult.error || 'No se pudo subir la imagen.');
        imageUrl = uploadResult.imageUrl;
      }

      const headers = { 'Content-Type': 'application/json' };
      if (currentUser) {
        const token = await currentUser.getIdToken();
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          productId: Number(productId),
          rating,
          name: name.value,
          text: text.value,
          imageUrl,
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Error al enviar reseña');

      toast.success('¡Gracias por tu opinión!');
      if (result.review) {
        setReviews((prev) => [result.review, ...prev]);
      } else {
        await fetchReviews();
      }
      resetForm();
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Hubo un error al enviar tu opinión.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleHelpful = async (reviewId, type) => {
    if (votedMap[reviewId]) {
      toast('Ya calificaste esta opinión.', { icon: 'ℹ️' });
      return;
    }
    const field = type === 'yes' ? 'helpfulYes' : 'helpfulNo';
    setReviews((prev) => prev.map((r) => r.id === reviewId ? { ...r, [field]: (r[field] || 0) + 1 } : r));
    saveVote(reviewId, type);
    setVotedMap((prev) => ({ ...prev, [reviewId]: type }));
    try {
      await fetch(`/api/reviews/${reviewId}/helpful`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type }),
      });
    } catch (error) {
      console.error(error);
    }
  };

  const summary = useMemo(() => {
    const total = reviews.length;
    const average = total > 0 ? reviews.reduce((acc, r) => acc + r.rating, 0) / total : 0;
    const distribution = [5, 4, 3, 2, 1].map((star) => ({
      star,
      count: reviews.filter((r) => r.rating === star).length,
    }));
    return { total, average, distribution };
  }, [reviews]);

  const photos = useMemo(
    () => reviews.filter((r) => r.imageUrl).map((r) => r.imageUrl),
    [reviews]
  );

  const filteredSorted = useMemo(() => {
    let list = [...reviews];
    if (ratingFilter > 0) list = list.filter((r) => r.rating === ratingFilter);
    if (onlyWithPhotos) list = list.filter((r) => !!r.imageUrl);
    if (onlyVerified) list = list.filter((r) => r.isVerified);

    if (sortBy === 'top') list.sort((a, b) => b.rating - a.rating);
    else if (sortBy === 'low') list.sort((a, b) => a.rating - b.rating);
    else list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return list;
  }, [reviews, ratingFilter, onlyWithPhotos, onlyVerified, sortBy]);

  const visibleReviews = filteredSorted.slice(0, visibleCount);

  return (
    <div className="mt-12 pt-8 border-t border-gray-200">
      {/* Encabezado con resumen + distribución */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-center">
        <div className="md:col-span-2 text-center md:text-left">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Opiniones de Clientes</h2>
          <div className="flex items-center justify-center md:justify-start gap-3 mt-3">
            <span className="text-4xl font-bold text-cyan-700">
              {summary.average.toFixed(1)}
            </span>
            <div>
              <Estrellas rating={summary.average} size="text-lg" />
              <p className="text-sm text-gray-500 mt-0.5">{summary.total} opiniones</p>
            </div>
          </div>
        </div>

        {summary.total > 0 && (
          <div className="md:col-span-3 space-y-1.5 w-full">
            {summary.distribution.map(({ star, count }) => (
              <RatingBar
                key={star}
                star={star}
                count={count}
                total={summary.total}
                active={ratingFilter === star}
                onClick={() => setRatingFilter((prev) => (prev === star ? 0 : star))}
              />
            ))}
          </div>
        )}
      </div>

      {/* Formulario para escribir una opinión: siempre visible, sin modal */}
      <div className="mt-8 relative bg-white rounded-3xl border border-gray-100 shadow-lg shadow-cyan-900/5 p-6 sm:p-8 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-cyan-700" />

        <h3 className="text-lg font-bold text-gray-900 mb-5 relative">Comparte tu opinión</h3>

        <form ref={formRef} onSubmit={handleSubmit} className="space-y-5 relative">
          {/* Honeypot anti-spam, invisible para usuarios reales */}
          <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" />

          <div>
            <label className="font-semibold text-gray-700 text-sm">Tu calificación *</label>
            <div className="mt-2"><StarPicker rating={rating} onRate={setRating} /></div>
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Tu nombre *</label>
            <input
              type="text"
              id="name"
              name="name"
              defaultValue={currentUser?.displayName || ''}
              required
              maxLength={80}
              className="mt-1.5 block w-full border border-gray-200 rounded-xl px-3.5 py-2.5 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-700 focus:border-transparent transition-colors"
            />
          </div>

          <div>
            <div className="flex justify-between items-baseline">
              <label htmlFor="text" className="block text-sm font-medium text-gray-700">Tu opinión *</label>
              <span className="text-xs text-gray-400">{textLength}/{TEXT_MAX_LEN}</span>
            </div>
            <textarea
              id="text"
              name="text"
              rows="4"
              required
              maxLength={TEXT_MAX_LEN}
              onChange={(e) => setTextLength(e.target.value.length)}
              className="mt-1.5 block w-full border border-gray-200 rounded-xl px-3.5 py-2.5 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-700 focus:border-transparent transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Sube una foto (opcional)</label>
            {imagePreview ? (
              <div className="relative w-24 h-24">
                {/* img nativo: next/image no soporta bien blob: URLs de vista previa local */}
                <img src={imagePreview} alt="Vista previa" className="w-24 h-24 object-cover rounded-xl border border-gray-200" />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 bg-gray-800 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                  aria-label="Quitar imagen"
                >
                  <FaTimes />
                </button>
              </div>
            ) : (
              <label className="flex items-center gap-2 justify-center border-2 border-dashed border-gray-200 rounded-xl py-4 cursor-pointer text-gray-500 hover:border-cyan-700 hover:text-cyan-700 hover:bg-cyan-50/50 transition-colors bg-gray-50">
                <FaCamera /> <span className="text-sm">Agregar foto</span>
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto bg-cyan-700 text-white font-bold py-3 px-8 rounded-xl hover:bg-cyan-800 active:bg-cyan-900 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md"
          >
            {isSubmitting && <FaSpinner className="animate-spin" />}
            {isSubmitting ? 'Enviando...' : 'Enviar Opinión'}
          </button>
        </form>
      </div>

      {/* Fotos de clientes */}
      {photos.length > 0 && (
        <div className="mt-8">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Fotos de clientes ({photos.length})</h3>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {photos.map((url, i) => (
              <button
                key={url + i}
                onClick={() => openLightbox(url, photos)}
                className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border border-gray-200 hover:opacity-80 transition-opacity"
              >
                <Image src={url} alt="Foto de cliente" fill className="object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Filtros y orden */}
      {summary.total > 0 && (
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-cyan-700"
          >
            <option value="recent">Más recientes</option>
            <option value="top">Mejor calificadas</option>
            <option value="low">Peor calificadas</option>
          </select>
          <button
            onClick={() => setOnlyWithPhotos((v) => !v)}
            className={`text-sm px-3 py-2 rounded-full border transition-colors ${onlyWithPhotos ? 'bg-cyan-700 border-cyan-700 text-white' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}
          >
            Con fotos
          </button>
          <button
            onClick={() => setOnlyVerified((v) => !v)}
            className={`text-sm px-3 py-2 rounded-full border transition-colors ${onlyVerified ? 'bg-cyan-700 border-cyan-700 text-white' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}
          >
            Compra verificada
          </button>
          {ratingFilter > 0 && (
            <button
              onClick={() => setRatingFilter(0)}
              className="text-sm px-3 py-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
            >
              {ratingFilter}★ ✕
            </button>
          )}
        </div>
      )}

      {/* Lista de reseñas */}
      <div className="space-y-4 mt-6">
        {loading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-5 bg-white rounded-xl border border-gray-100 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 skeleton-shimmer flex-shrink-0" />
                  <SkeletonLoader type="title" />
                </div>
                <SkeletonLoader type="text" />
                <SkeletonLoader type="text" />
              </div>
            ))}
          </div>
        )}

        {!loading && filteredSorted.length === 0 && (
          <div className="py-12 text-center bg-gray-50 rounded-xl border border-gray-100">
            <FaCommentDots className="mx-auto text-3xl text-gray-300 mb-3" />
            <p className="text-gray-500">
              {summary.total === 0 ? 'Aún no hay opiniones para este producto. ¡Sé el primero!' : 'No hay opiniones que coincidan con este filtro.'}
            </p>
          </div>
        )}

        {visibleReviews.map((review) => {
          const voted = votedMap[review.id];
          return (
            <div key={review.id} className="p-4 sm:p-5 bg-white rounded-xl border border-gray-100 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 flex-shrink-0 rounded-full bg-cyan-700 text-white flex items-center justify-center font-bold">
                  {getInitial(review.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-gray-900">{review.name}</span>
                    {review.isVerified && (
                      <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-semibold">
                        <FaCheckCircle className="text-green-600" /> Compra verificada
                      </span>
                    )}
                    <span className="text-xs text-gray-400 ml-auto">{formatDate(review.createdAt)}</span>
                  </div>
                  <div className="my-1.5"><Estrellas rating={review.rating} size="text-sm" /></div>
                  <p className="text-gray-700 leading-relaxed">{review.text}</p>
                  {review.imageUrl && (
                    <button
                      onClick={() => openLightbox(review.imageUrl, photos)}
                      className="relative w-20 h-20 mt-3 rounded-lg overflow-hidden border border-gray-200 block"
                    >
                      <Image src={review.imageUrl} alt="Imagen de reseña" fill className="object-cover" />
                    </button>
                  )}
                  <div className="flex items-center gap-4 mt-3">
                    <span className="text-xs text-gray-500">¿Te fue útil?</span>
                    <button
                      onClick={() => handleHelpful(review.id, 'yes')}
                      disabled={!!voted}
                      className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border transition-colors disabled:cursor-not-allowed ${voted === 'yes' ? 'bg-cyan-700 border-cyan-700 text-white' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                    >
                      <FaThumbsUp /> {review.helpfulYes || 0}
                    </button>
                    <button
                      onClick={() => handleHelpful(review.id, 'no')}
                      disabled={!!voted}
                      className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border transition-colors disabled:cursor-not-allowed ${voted === 'no' ? 'bg-gray-700 border-gray-700 text-white' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                    >
                      <FaThumbsDown /> {review.helpfulNo || 0}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {filteredSorted.length > visibleCount && (
          <div className="text-center pt-2">
            <button
              onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
              className="text-sm font-semibold border border-gray-300 rounded-lg py-2.5 px-6 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Ver más opiniones ({filteredSorted.length - visibleCount} restantes)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}