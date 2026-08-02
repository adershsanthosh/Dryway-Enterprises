import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { WishlistContext } from '../context/WishlistContext';
import { CartContext } from '../context/CartContext';
import { LanguageContext } from '../context/LanguageContext';
import { Heart, ShoppingBag, Trash2, Eye, ArrowLeft } from 'lucide-react';

const Wishlist = () => {
  const { wishlistItems, removeFromWishlist, clearWishlist } = useContext(WishlistContext);
  const { addToCart } = useContext(CartContext);
  const { t } = useContext(LanguageContext);

  return (
    <div className="container animate-fade-in" style={{ padding: '3rem 1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Saved Favorites
          </span>
          <h1 style={{ fontSize: '2.25rem', fontFamily: 'var(--font-headings)', color: '#fff', marginTop: '0.2rem' }}>
            {t('wishlist')} ({wishlistItems.length})
          </h1>
        </div>

        {wishlistItems.length > 0 && (
          <button
            onClick={clearWishlist}
            className="btn btn-secondary"
            style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', color: 'var(--error)', borderColor: 'rgba(239,68,68,0.3)' }}
          >
            Clear Wishlist
          </button>
        )}
      </div>

      {wishlistItems.length === 0 ? (
        <div
          className="glass-card"
          style={{
            padding: '4rem 2rem',
            textAlign: 'center',
            background: 'var(--bg-secondary)',
          }}
        >
          <Heart size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-headings)', color: '#fff', marginBottom: '0.5rem' }}>
            Your Wishlist is Empty
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '2rem', maxWidth: '400px', margin: '0 auto 2rem' }}>
            Explore our catalog and click the ❤️ icon on any item to save your favorite healthy snacks and ready kits!
          </p>
          <Link to="/" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem' }}>
            Explore Catalog
          </Link>
        </div>
      ) : (
        <div className="grid-responsive">
          {wishlistItems.map((product) => (
            <div
              key={product._id}
              className="glass-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              <button
                onClick={() => removeFromWishlist(product._id)}
                title="Remove from Wishlist"
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  zIndex: 10,
                  background: 'rgba(0, 0, 0, 0.6)',
                  color: 'var(--error)',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  border: '1px solid var(--border-color)',
                }}
              >
                <Trash2 size={16} />
              </button>

              <img
                src={product.images[0]}
                alt={product.title}
                style={{
                  width: '100%',
                  height: '220px',
                  objectFit: 'cover',
                }}
              />

              <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                  {product.category}
                </span>

                <h3 style={{ fontSize: '1.1rem', color: '#fff', marginBottom: '0.5rem', fontWeight: 600 }}>
                  {product.title}
                </h3>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.25rem' }}>
                  <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>
                    ₹{product.offerPrice || product.price}
                  </span>
                  {product.isOffer && (
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                      ₹{product.price}
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                  <button
                    onClick={() => addToCart(product, 1)}
                    className="btn btn-primary"
                    style={{ flex: 1, padding: '0.6rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
                  >
                    <ShoppingBag size={15} /> {t('addToBag')}
                  </button>

                  <Link
                    to={`/product/${product._id}`}
                    className="btn btn-secondary"
                    style={{ padding: '0.6rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <Eye size={16} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
