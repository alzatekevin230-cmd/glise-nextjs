// components/TableOfContents.jsx
"use client";

import { useState, useEffect } from 'react';
import { FaListUl } from 'react-icons/fa';

export default function TableOfContents({ content }) {
  const [headings, setHeadings] = useState([]);
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    // Extraer h2 y h3 del contenido HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    
    const headingElements = tempDiv.querySelectorAll('h2, h3');
    const headingsData = Array.from(headingElements).map((heading, index) => {
      const id = `heading-${index}`;
      const text = heading.textContent;
      const level = heading.tagName.toLowerCase();
      
      return { id, text, level };
    });
    
    setHeadings(headingsData);

    // Observer para detectar qué heading está visible
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -80% 0px' }
    );

    // Observar todos los headings en el DOM
    setTimeout(() => {
      headingsData.forEach(({ id }) => {
        const element = document.getElementById(id);
        if (element) observer.observe(element);
      });
    }, 100);

    return () => observer.disconnect();
  }, [content]);

  const scrollToHeading = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth'
      });
    }
  };

  if (headings.length === 0) return null;

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 shadow-lg border border-blue-100 sticky top-24">
      <div className="flex items-center gap-2 mb-4">
        <FaListUl className="text-blue-600" />
        <h3 className="text-lg font-bold text-gray-900">Contenido del artículo</h3>
      </div>
      
      <nav>
        <ul className="space-y-2">
          {headings.map(({ id, text, level }) => (
            <li key={id}>
              <button
                onClick={() => scrollToHeading(id)}
                className={`text-left w-full transition-all duration-200 ${
                  level === 'h3' ? 'pl-4 text-sm' : 'font-semibold'
                } ${
                  activeId === id
                    ? 'text-blue-600 font-bold'
                    : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                {activeId === id && <span className="inline-block w-2 h-2 bg-blue-600 rounded-full mr-2"></span>}
                {text}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

