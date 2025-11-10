// components/Breadcrumbs.jsx
import Link from 'next/link';
import { FaChevronRight } from 'react-icons/fa';

export default function Breadcrumbs({ items }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-2 text-sm">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          
          return (
            <li key={index} className="flex items-center gap-2">
              {!isLast ? (
                <>
                  <Link 
                    href={item.href} 
                    className="text-blue-600 hover:text-blue-800 hover:underline transition-colors font-medium"
                  >
                    {item.label}
                  </Link>
                  <FaChevronRight className="text-gray-400 text-xs" />
                </>
              ) : (
                <span className="text-gray-600 font-semibold" aria-current="page">
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

