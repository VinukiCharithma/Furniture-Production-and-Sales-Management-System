export const getProductImageUrl = (imagePath) => {
  // Use absolute path from public folder
  const placeholder = `${process.env.PUBLIC_URL}/images/placeholder-product.jpg`;
  
  if (!imagePath) return placeholder;
  
  // If it's already a full URL or data URL, return as-is
  if (imagePath.startsWith('http') || imagePath.startsWith('data:')) {
    return imagePath;
  }
  
  // Remove any leading slashes
  const cleanPath = imagePath.replace(/^\/+/, '');
  
  // Handle cases where path might be malformed
  if (cleanPath.includes('images/products/')) {
    return `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/${cleanPath}`;
  }
  
  return `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/images/products/${cleanPath}`;
};

export const handleImageError = (e) => {
  // Create a base64 encoded SVG as ultimate fallback
  const svgPlaceholder = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgMjAwIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjYWFhIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';
  
  // If we're already showing the SVG, do nothing
  if (e.target.src === svgPlaceholder) return;
  
  console.error('Image failed to load:', e.target.src);
  
  // First try the regular placeholder
  if (!e.target.src.includes('placeholder-product.jpg')) {
    e.target.src = `${process.env.PUBLIC_URL}/images/placeholder-product.jpg`;
    e.target.style.objectFit = 'contain';
    return;
  }
  
  // If that fails, use the SVG fallback
  e.target.src = svgPlaceholder;
  e.target.style.objectFit = 'contain';
  
  // Remove error handler to prevent loops
  e.target.onerror = null;
};