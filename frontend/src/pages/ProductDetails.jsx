import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { API_BASE_URL } from '../config';
import { ArrowLeft, ShoppingBag, Truck, RotateCcw, AlertTriangle, Plus, Minus } from 'lucide-react';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qty, setQty] = useState(1);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/products/${id}`);
        if (!res.ok) throw new Error('Product not found');
        const data = await res.json();
        setProduct(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToBag = () => {
    if (product) {
      addToCart(product, qty);
      // Let's redirect to shop or keep them on the page
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div style={{ width: '32px', height: '32px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '1rem' }}>We couldn't find that product.</h2>
        <Link to="/" className="btn btn-secondary">
          <ArrowLeft size={16} /> Back to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in" style={{ padding: '3rem 1rem' }}>
      <Link
        to="/"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          color: 'var(--text-secondary)',
          marginBottom: '2.5rem',
          fontSize: '0.95rem',
        }}
      >
        <ArrowLeft size={16} /> Back to Catalog
      </Link>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '4rem', alignItems: 'start' }}>
        {/* Left Side: Product Gallery */}
        <div style={{ position: 'relative' }}>
          <img
            src={product.images[0]}
            alt={product.title}
            style={{
              width: '100%',
              maxHeight: '550px',
              objectFit: 'cover',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-color)',
            }}
          />
        </div>

        {/* Right Side: Details & Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <span
              style={{
                fontSize: '0.8rem',
                color: 'var(--accent)',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              {product.category}
            </span>
            <h1
              style={{
                fontSize: '3rem',
                lineHeight: '1.1',
                marginTop: '0.5rem',
                marginBottom: '1rem',
                fontFamily: 'var(--font-headings)',
                color: '#fff',
              }}
            >
              {product.title}
            </h1>
            <p style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--accent)' }}>
              ₹{product.price}
            </p>
          </div>

          <div
            style={{
              borderTop: '1px solid var(--border-color)',
              borderBottom: '1px solid var(--border-color)',
              padding: '1.5rem 0',
            }}
          >
            <h3 style={{ fontSize: '1rem', color: '#fff', marginBottom: '0.5rem' }}>Product Description</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.7' }}>
              {product.description}
            </p>
          </div>

          {/* Status Indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span
              style={{
                fontSize: '0.9rem',
                fontWeight: 600,
                color: product.countInStock > 0 ? 'var(--success)' : 'var(--error)',
              }}
            >
              {product.countInStock > 0 ? '✓ In Stock & Fresh' : '✗ Out of Stock'}
            </span>
            {product.countInStock > 0 && product.countInStock <= 5 && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem', color: '#f59e0b', fontSize: '0.85rem', fontWeight: 600 }}>
                <AlertTriangle size={14} /> Only {product.countInStock} left!
              </span>
            )}
          </div>

          {/* Quantity and Purchase Control */}
          {product.countInStock > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Quantity</span>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    background: 'var(--bg-secondary)',
                    padding: '0.4rem 1rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-color)',
                  }}
                >
                  <button
                    disabled={qty <= 1}
                    onClick={() => setQty(qty - 1)}
                    style={{ cursor: 'pointer', color: qty <= 1 ? 'var(--text-muted)' : '#fff' }}
                  >
                    <Minus size={16} />
                  </button>
                  <span style={{ fontSize: '1rem', width: '24px', textAlign: 'center', fontWeight: 600 }}>{qty}</span>
                  <button
                    disabled={qty >= product.countInStock}
                    onClick={() => setQty(qty + 1)}
                    style={{ cursor: 'pointer', color: qty >= product.countInStock ? 'var(--text-muted)' : '#fff' }}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              <div style={{ flex: 1, alignSelf: 'flex-end' }}>
                <button className="btn btn-primary" onClick={handleAddToBag} style={{ width: '100%', padding: '1rem', background: 'linear-gradient(135deg, #ea580c 0%, #d91d49 100%)', border: 'none' }}>
                  <ShoppingBag size={18} />
                  Add to Cart
                </button>
              </div>
            </div>
          )}

          {/* Selling points */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginTop: '1.5rem', background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <Truck size={16} style={{ color: '#ea580c' }} />
              <span>Free Pan-India Delivery on orders over ₹499</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <RotateCcw size={16} style={{ color: '#ea580c' }} />
              <span>100% Pure & Natural • No Artificial Preservatives or Colors</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
