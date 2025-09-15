// components/ArticulosBlog.jsx
"use client";

import { useEffect } from 'react';
import Link from 'next/link';
import Swiper from 'swiper';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

export default function ArticulosBlog({ posts }) {
  useEffect(() => {
    const blogSwiper = new Swiper('.blog-carousel', {
      modules: [Navigation, Autoplay],
      loop: true,
      slidesPerView: 1,
      spaceBetween: 16,
      observer: true,
      observeParents: true,
      autoplay: { delay: 5500, disableOnInteraction: false },
      navigation: { nextEl: '.blog-next', prevEl: '.blog-prev' },
      breakpoints: {
        640: { slidesPerView: 2, spaceBetween: 20 },
        1024: { slidesPerView: 3, spaceBetween: 20 }
      }
    });

    return () => {
      if (blogSwiper && !blogSwiper.destroyed) {
        blogSwiper.destroy(true, true);
      }
    };
  }, [posts]);

  return (
    <section className="mb-4 md:mb-12">
      <div className="container mx-auto px-4 sm:px-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">Artículos de nuestro Blog</h2>
        {/* 1. AÑADIMOS LA CLASE "group" AL CONTENEDOR */}
        <div className="relative group">
          <div className="swiper-container blog-carousel overflow-hidden">
            <div className="swiper-wrapper">
              {posts.map(post => {
                const postLink = `/blog/${post.slug || post.id}`;
                return (
                  <div key={post.id} className="swiper-slide h-auto">
                    <div className="blog-post-card bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full">
                      <Link href={postLink} className="block">
                        <div className="aspect-video w-full bg-gray-100">
                          <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" loading="lazy" />
                        </div>
                      </Link>
                      <div className="p-6 flex flex-col flex-grow">
                        <span className="text-blue-600 font-semibold text-sm uppercase">{post.category}</span>
                        <h3 className="!mt-2 text-xl font-bold text-gray-800 flex-grow">
                          <Link href={postLink} className="hover:text-blue-600">
                            {post.title}
                          </Link>
                        </h3>
                        <p className="text-gray-600 mt-2 text-sm mb-4">{post.description}</p>
                        <Link href={postLink} className="text-blue-600 font-semibold mt-auto inline-block text-sm">
                          Leer más →
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          {/* 2. AÑADIMOS CLASES PARA OCULTAR Y MOSTRAR LAS FLECHAS */}
          <div className="swiper-button-next blog-next opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="swiper-button-prev blog-prev opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      </div>
    </section>
  );
}