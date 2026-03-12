// components/Pagination.jsx
"use client";
import Link from 'next/link';

export default function Pagination({ currentPage, totalPages, onPageChange, getHref }) {
  if (totalPages <= 1) return null;

  const handlePageChange = (e, page) => {
    // Si hay getHref, Link maneja la navegación, pero podemos prevenir default si queremos SPA behavior estricto
    // o simplemente dejar que Next.js Link haga su trabajo (que es client-side navigation).
    // Si NO hay getHref, usamos el comportamiento de botón antiguo.
    if (!getHref) {
      e.preventDefault();
      onPageChange(page);
      requestAnimationFrame(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  };

  const getPaginationItems = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (currentPage > 3) {
        pages.push('...');
      }
      if (currentPage > 2) {
        pages.push(currentPage - 1);
      }
      if (currentPage !== 1 && currentPage !== totalPages) {
        pages.push(currentPage);
      }
      if (currentPage < totalPages - 1) {
        pages.push(currentPage + 1);
      }
      if (currentPage < totalPages - 2) {
        pages.push('...');
      }
      pages.push(totalPages);
    }
    return [...new Set(pages)];
  };

  const paginationItems = getPaginationItems();

  const renderPageItem = (item, index) => {
    if (item === '...') {
      return <span key={`ellipsis-${index}`} className="pagination-ellipsis">...</span>;
    }

    const isCurrent = currentPage === item;
    const className = `pagination-btn ${isCurrent ? 'active' : ''}`;

    if (getHref) {
      return (
        <Link
          key={item}
          href={getHref(item)}
          className={className}
          scroll={true} // Scroll al top automático al cambiar de página
        >
          {item}
        </Link>
      );
    }

    return (
      <button
        key={item}
        onClick={(e) => handlePageChange(e, item)}
        className={className}
      >
        {item}
      </button>
    );
  };

  return (
    <div className="flex justify-center items-center mt-12 space-x-1">
      {/* Botón Anterior */}
      {currentPage > 1 ? (
        getHref ? (
          <Link href={getHref(currentPage - 1)} className="pagination-btn" scroll={true}>
            &laquo; Ant
          </Link>
        ) : (
          <button onClick={(e) => handlePageChange(e, currentPage - 1)} className="pagination-btn">
             &laquo; Ant
          </button>
        )
      ) : (
        <button disabled className="pagination-btn opacity-50 cursor-not-allowed">
           &laquo; Ant
        </button>
      )}

      {/* Números de página */}
      {paginationItems.map((item, index) => renderPageItem(item, index))}

      {/* Botón Siguiente */}
      {currentPage < totalPages ? (
        getHref ? (
          <Link href={getHref(currentPage + 1)} className="pagination-btn" scroll={true}>
            Sig &raquo;
          </Link>
        ) : (
          <button onClick={(e) => handlePageChange(e, currentPage + 1)} className="pagination-btn">
            Sig &raquo;
          </button>
        )
      ) : (
        <button disabled className="pagination-btn opacity-50 cursor-not-allowed">
          Sig &raquo;
        </button>
      )}
    </div>
  );
}