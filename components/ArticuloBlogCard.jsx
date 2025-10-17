// components/ArticuloBlogCard.jsx
import Link from 'next/link';
import Image from 'next/image';
import { processBlogImageUrl } from '@/lib/imageUtils';

export default function ArticuloBlogCard({ post }) {
  const imageUrl = processBlogImageUrl(post.imageUrl);

  // Creamos una única variable para el enlace correcto
  const postLink = `/blog/${post.slug || post.id}`;

  return (
    <div className="blog-post-card bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full">
      {/* --- ENLACE CORREGIDO --- */}
      <Link href={postLink} className="block">
        <div className="relative aspect-video w-full">
          <Image 
            src={imageUrl} 
            alt={post.title} 
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 hover:scale-105" 
          />
        </div>
      </Link>
      <div className="p-6 flex flex-col flex-grow">
        <span className="text-blue-600 font-semibold text-sm uppercase">{post.category}</span>
        <h3 className="!mt-2 text-xl font-bold text-gray-800 flex-grow">
          {/* --- ENLACE CORREGIDO --- */}
          <Link href={postLink} className="hover:text-blue-600 transition-colors">
            {post.title}
          </Link>
        </h3>
        <p className="text-gray-600 mt-2 text-sm mb-4">{post.description}</p>
        {/* --- ENLACE CORREGIDO --- */}
        <Link href={postLink} className="text-blue-600 font-semibold mt-auto inline-block text-sm">
          Leer más →
        </Link>
      </div>
    </div>
  );
}