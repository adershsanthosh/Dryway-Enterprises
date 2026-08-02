import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import { AuthContext } from '../context/AuthContext';
import { LanguageContext } from '../context/LanguageContext';
import { API_BASE_URL } from '../config';
import {
  ArrowLeft,
  ShoppingBag,
  Truck,
  RotateCcw,
  AlertTriangle,
  Plus,
  Minus,
  Heart,
  Star,
  MessageSquare,
  Send,
  User,
  CheckCircle2,
} from 'lucide-react';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qty, setQty] = useState(1);

  // Review & Q&A state
  const [userRating, setUserRating] = useState(5);
  const [userComment, setUserComment] = useState('');
  const [reviewMsg, setReviewMsg] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);

  const [questionText, setQuestionText] = useState('');
  const [questionMsg, setQuestionMsg] = useState('');
  const [questionLoading, setQuestionLoading] = useState(false);

  const { addToCart } = useContext(CartContext);
  const { toggleWishlist, isInWishlist } = useContext(WishlistContext);
  const { userInfo } = useContext(AuthContext);
  const { t } = useContext(LanguageContext);

  const isFav = product ? isInWishlist(product._id) : false;

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
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!userInfo) {
      alert('Please log in to leave a review.');
      return;
    }
    setReviewLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/products/${id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({ rating: userRating, comment: userComment }),
      });
      const data = await res.json();
      if (res.ok) {
        setReviewMsg('Thank you! Review posted.');
        setProduct(data.product);
        setUserComment('');
        setTimeout(() => setReviewMsg(''), 4000);
      } else {
        alert(data.message || 'Review failed');
      }
    } catch (err) {
      alert(err.message);
    }
    setReviewLoading(false);
  };

  const handleQuestionSubmit = async (e) => {
    e.preventDefault();
    setQuestionLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/products/${id}/questions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: userInfo?.name || 'Customer',
          question: questionText,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setQuestionMsg('Question submitted!');
        setProduct(data.product);
        setQuestionText('');
        setTimeout(() => setQuestionMsg(''), 4000);
      }
    } catch (err) {
      alert(err.message);
    }
    setQuestionLoading(false);
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
        <ArrowLeft size={16} /> Back to Shop Catalog
      </Link>

      <div className="checkout-grid" style={{ gap: '4rem', marginBottom: '4rem' }}>
        {/* Left: Product Images */}
        <div style={{ position: 'relative' }}>
          <img
            src={product.images[0]}
            alt={product.title}
            style={{
              width: '100%',
              maxHeight: '480px',
              objectFit: 'cover',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--glass-shadow)',
            }}
          />

          {/* Offer Tag */}
          {product.isOffer && (
            <span
              style={{
                position: 'absolute',
                top: '20px',
                left: '20px',
                background: 'var(--accent)',
                color: '#fff',
                fontWeight: 700,
                fontSize: '0.85rem',
                padding: '0.35rem 0.85rem',
                borderRadius: 'var(--radius-full)',
              }}
            >
              {product.offerTag || 'SPECIAL OFFER'}
            </span>
          )}

          {/* Wishlist Floating Button */}
          <button
            onClick={() => toggleWishlist(product)}
            title={isFav ? 'Remove from Wishlist' : 'Add to Wishlist'}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'rgba(0, 0, 0, 0.65)',
              border: '1px solid var(--border-color)',
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: isFav ? '#ef4444' : '#fff',
            }}
          >
            <Heart size={22} fill={isFav ? '#ef4444' : 'none'} />
          </button>
        </div>

        {/* Right: Product Meta & Purchase Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--accent)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {product.category}
            </span>
            <h1 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-headings)', color: '#fff', marginTop: '0.2rem', lineHeight: 1.2 }}>
              {product.title}
            </h1>
          </div>

          {/* Star Rating Overview */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ display: 'flex', color: '#facc15' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={18}
                  fill={star <= Math.round(product.rating || 4.8) ? '#facc15' : 'none'}
                />
              ))}
            </div>
            <span style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>{product.rating || 4.8}</span>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              ({product.numReviews || product.reviews?.length || 2} customer reviews)
            </span>
          </div>

          {/* Price display */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', marginTop: '0.5rem' }}>
            <span style={{ fontSize: '2.25rem', fontWeight: 800, color: '#fff' }}>
              ₹{product.offerPrice || product.price}
            </span>
            {product.isOffer && (
              <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                ₹{product.price}
              </span>
            )}
          </div>

          {/* Description */}
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: '1.7' }}>
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
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

              <div style={{ flex: 1, minWidth: '200px', alignSelf: 'flex-end' }}>
                <button className="btn btn-primary" onClick={handleAddToBag} style={{ width: '100%', padding: '1rem', background: 'linear-gradient(135deg, #ea580c 0%, #d91d49 100%)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <ShoppingBag size={18} />
                  {t('addToBag')}
                </button>
              </div>
            </div>
          )}

          {/* Selling points */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginTop: '1rem', background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
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

      {/* Customer Reviews & Q&A Sections */}
      <div className="checkout-grid" style={{ gap: '3rem' }}>
        {/* Customer Reviews */}
        <div className="glass-card" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-headings)', color: '#fff', marginBottom: '1.5rem' }}>
            {t('customerReviews')}
          </h3>

          {reviewMsg && (
            <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', border: '1px solid var(--success)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 size={16} />
              <span>{reviewMsg}</span>
            </div>
          )}

          {/* Review List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
            {(!product.reviews || product.reviews.length === 0) ? (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontStyle: 'italic' }}>
                No reviews yet. Be the first to write a review for this product!
              </p>
            ) : (
              product.reviews.map((rev) => (
                <div key={rev._id} style={{ background: 'var(--bg-primary)', padding: '1rem 1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <User size={16} style={{ color: 'var(--accent)' }} />
                      <strong style={{ color: '#fff', fontSize: '0.9rem' }}>{rev.name}</strong>
                    </div>
                    <div style={{ display: 'flex', color: '#facc15' }}>
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} size={14} fill={s <= rev.rating ? '#facc15' : 'none'} />
                      ))}
                    </div>
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.5 }}>
                    {rev.comment}
                  </p>
                </div>
              ))
            )}
          </div>

          {/* Write Review Form */}
          <form onSubmit={handleReviewSubmit} style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
            <h4 style={{ fontSize: '1rem', color: '#fff', marginBottom: '1rem' }}>
              {t('writeReview')}
            </h4>

            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label">Rating</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setUserRating(star)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.2rem', color: '#facc15' }}
                  >
                    <Star size={22} fill={star <= userRating ? '#facc15' : 'none'} />
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Your Review Comment</label>
              <textarea
                required
                className="input-field"
                rows="3"
                placeholder="Share your experience with this product..."
                style={{ resize: 'vertical' }}
                value={userComment}
                onChange={(e) => setUserComment(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={reviewLoading}
              style={{ width: '100%', padding: '0.8rem' }}
            >
              Submit Review
            </button>
          </form>
        </div>

        {/* Product Q&A */}
        <div className="glass-card" style={{ padding: '2rem', background: 'var(--bg-secondary)' }}>
          <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-headings)', color: '#fff', marginBottom: '1.5rem' }}>
            {t('questionsAnswers')}
          </h3>

          {questionMsg && (
            <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', border: '1px solid var(--success)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 size={16} />
              <span>{questionMsg}</span>
            </div>
          )}

          {/* Q&A List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
            {(!product.questions || product.questions.length === 0) ? (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontStyle: 'italic' }}>
                No questions asked yet. Ask a question about ingredients, preparation, or storage below!
              </p>
            ) : (
              product.questions.map((q) => (
                <div key={q._id} style={{ background: 'var(--bg-primary)', padding: '1rem 1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                  <p style={{ fontWeight: 600, color: '#fff', fontSize: '0.9rem', marginBottom: '0.3rem' }}>
                    Q: {q.question}
                  </p>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', paddingLeft: '0.8rem', borderLeft: '2px solid var(--accent)' }}>
                    A: {q.answer}
                  </p>
                </div>
              ))
            )}
          </div>

          {/* Ask Question Form */}
          <form onSubmit={handleQuestionSubmit} style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
            <h4 style={{ fontSize: '1rem', color: '#fff', marginBottom: '1rem' }}>
              {t('askQuestion')}
            </h4>

            <div className="form-group">
              <textarea
                required
                className="input-field"
                rows="3"
                placeholder="What would you like to know about this item?"
                style={{ resize: 'vertical' }}
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="btn btn-secondary"
              disabled={questionLoading}
              style={{ width: '100%', padding: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
            >
              <Send size={16} /> Post Question
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
