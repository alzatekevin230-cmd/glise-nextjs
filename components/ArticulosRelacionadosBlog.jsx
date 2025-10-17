// app/components/ArticulosRelacionadosBlog.jsx
"use client";

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { processBlogImageUrl } from '@/lib/imageUtils';
import Swiper from 'swiper';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

export default function ArticulosRelacionadosBlog({ posts }) {
  const swiperRef = useRef(null);

  useEffect(() => {
    if (swiperRef.current) swiperRef.current.destroy(true, true);

    swiperRef.current = new Swiper('.related-blog-carousel', {
      modules: [Navigation, Autoplay],
      loop: posts.length > 3,
      spaceBetween: 8,
      slidesPerView: 1,
      autoplay: { delay: 5000, disableOnInteraction: false },
      navigation: { nextEl: '.related-blog-button-next', prevEl: '.related-blog-button-prev' },
      breakpoints: {
        640: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
      }
    });

    return () => { if (swiperRef.current) swiperRef.current.destroy(true, true); };
  }, [posts]);

  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <section className="mb-0 md:mb-12 mt-16 pt-8 border-t">
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">Artículos Relacionados</h2>
      <div className="container mx-auto px-2 sm:px-6 relative group">
        <div className="swiper-container related-blog-carousel overflow-hidden">
          <div className="swiper-wrapper">
            {posts.map(post => {
              const imageUrl = processBlogImageUrl(post.imageUrl);
              const postLink = `/blog/${post.slug || post.id}`;

              return (
                <div key={post.id} className="swiper-slide h-auto">
                  {/* --- EL ENLACE AHORA ENVUELVE TODO --- */}
                  <Link href={postLink} className="blog-post-card bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full">
                    <div className="aspect-video relative w-full">
                      <Image src={imageUrl} alt={post.title} fill className="object-cover" />
                    </div>
                    <div className="p-4 flex flex-col flex-grow">
                      <span className="text-blue-600 font-semibold text-sm uppercase">{post.category}</span>
                      <h3 className="!mt-2 text-xl font-bold text-gray-800 flex-grow">{post.title}</h3>
                      <p className="text-blue-600 font-semibold mt-auto inline-block text-sm">Leer más →</p>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
        <div className="swiper-button-next related-blog-button-next opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="swiper-button-prev related-blog-button-prev opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
    </section>
  );
}