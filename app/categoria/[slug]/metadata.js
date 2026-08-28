export function generateOfferSchema(products, categoryName) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": `Productos de ${categoryName}`,
    "itemListElement": products.slice(0, 10).map((product, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Product",
        "name": product.name,
        "image": product.image,
        "offers": {
          "@type": "Offer",
          "price": product.price,
          "priceCurrency": "COP",
          "availability": "https://schema.org/InStock",
          "url": `https://glise.com.co/producto/${product.slug}`
        }
      }
    }))
  };
}
