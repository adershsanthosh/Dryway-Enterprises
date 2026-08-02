import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { API_BASE_URL } from '../config';
import { 
  ShoppingBag, 
  Eye, 
  Search, 
  AlertCircle, 
  Sparkles, 
  CheckCircle2, 
  Flame, 
  HeartPulse, 
  Utensils, 
  ExternalLink,
  Award,
  Clock,
  Leaf
} from 'lucide-react';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/products`);
        if (!res.ok) throw new Error('Failed to load products');
        const data = await res.json();
        setProducts(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const categories = [
    'All',
    'Healthy Snacks & Dry Fruits',
    'Kitchen Revolution',
    'Ready to Cook Kits',
    'Wellness & Superfoods',
    'Chocolates & Healthy Bars'
  ];

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="animate-fade-in">
      {/* Official Website Top Banner */}
      <div 
        style={{ 
          background: 'linear-gradient(90deg, #d91d49 0%, #ea2b0f 100%)',
          color: '#fff', 
          padding: '0.65rem 1rem', 
          textAlign: 'center', 
          fontSize: '0.85rem', 
          fontWeight: 600,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '0.5rem',
          boxShadow: '0 2px 8px rgba(217, 29, 73, 0.25)'
        }}
      >
        <Sparkles size={16} />
        <span>Welcome to the Official Store of <strong>The Dry Way</strong> – Delicious & Yummy 100% Natural Dehydrated Foods!</span>
        <a 
          href="https://thedryway.com" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ 
            color: '#fff', 
            textDecoration: 'underline', 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.2rem',
            marginLeft: '0.5rem',
            fontWeight: 700
          }}
        >
          thedryway.com <ExternalLink size={12} />
        </a>
      </div>

      {/* Premium Hero Section */}
      <section
        style={{
          position: 'relative',
          padding: '4rem 0 5rem 0',
          background:
            'radial-gradient(circle at 70% 30%, rgba(217, 29, 73, 0.14) 0%, rgba(43, 190, 249, 0.05) 50%, transparent 80%)',
          borderBottom: '1px solid var(--border-color)',
          marginBottom: '3.5rem',
        }}
      >
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '3rem', alignItems: 'center' }}>
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'rgba(217, 29, 73, 0.12)',
                border: '1px solid rgba(217, 29, 73, 0.3)',
                padding: '0.4rem 1rem',
                borderRadius: 'var(--radius-full)',
                color: '#d91d49',
                fontSize: '0.825rem',
                fontWeight: 700,
                letterSpacing: '0.04em',
                marginBottom: '1.25rem',
              }}
            >
              <Leaf size={15} color="#22c55e" />
              100% PURE & NATURAL • ZERO PRESERVATIVES
            </div>
            <h1
              style={{
                fontSize: '3.5rem',
                lineHeight: 1.15,
                marginBottom: '1.25rem',
                fontFamily: 'var(--font-headings)',
                fontWeight: 800,
                color: '#fff'
              }}
            >
              Pure Dehydrated <br />
              <span style={{ background: 'linear-gradient(135deg, #d91d49 0%, #2bbef9 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Goodness & Healthy Snacks.
              </span>
            </h1>
            <p
              style={{
                color: 'var(--text-secondary)',
                fontSize: '1.05rem',
                marginBottom: '2rem',
                maxWidth: '520px',
                lineHeight: 1.6
              }}
            >
              Discover <strong>The Dry Way</strong> – From farm-fresh dehydrated fruits & gourmet chocolate nuts, to instant kitchen masalas, ready-to-cook meal kits & superfood wellness powders.
            </p>

            {/* Key USPs / Badges */}
            <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: '#e2e8f0' }}>
                <CheckCircle2 size={16} color="#22c55e" />
                <span>Zero Preservatives</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: '#e2e8f0' }}>
                <Clock size={16} color="#2bbef9" />
                <span>70% Faster Cooking</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: '#e2e8f0' }}>
                <Award size={16} color="#d91d49" />
                <span>Nutrient Locked-In</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <a href="#catalog" className="btn btn-primary" style={{ padding: '0.85rem 1.8rem' }}>
                Explore Products
              </a>
              <a href="https://thedryway.com" target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ padding: '0.85rem 1.8rem' }}>
                Official Website
              </a>
            </div>
          </div>

          {/* Hero Banner Visual Card */}
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
            <div
              style={{
                position: 'absolute',
                width: '320px',
                height: '320px',
                background: 'rgba(217, 29, 73, 0.22)',
                filter: 'blur(90px)',
                zIndex: 0,
              }}
            />
            <div
              className="glass-card"
              style={{
                width: '100%',
                maxWidth: '420px',
                padding: '1.25rem',
                position: 'relative',
                zIndex: 1,
                borderRadius: '16px',
                border: '1px solid rgba(217, 29, 73, 0.3)',
              }}
            >
              <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '12px', height: '240px', marginBottom: '1rem' }}>
                <img
                  src="https://images.unsplash.com/photo-1613478223719-2ab802602423?w=600&auto=format&fit=crop&q=80"
                  alt="Dry Way Dehydrated ABC Mix"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
                <span style={{ position: 'absolute', top: '12px', left: '12px', background: '#d91d49', color: '#fff', fontSize: '0.75rem', fontWeight: 800, padding: '0.25rem 0.6rem', borderRadius: '4px' }}>
                  FEATURED WELLNESS
                </span>
              </div>
              <div>
                <h3 style={{ fontFamily: 'var(--font-headings)', fontSize: '1.2rem', marginBottom: '0.3rem', color: '#fff' }}>
                  Dehydrated ABC Miracle Mix
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.8rem' }}>
                  Apple, Beetroot & Carrot pure power mix. 100% natural blood & immunity boost.
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#d91d49' }}>₹349.00</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '0.5rem', textDecoration: 'line-through' }}>₹450</span>
                  </div>
                  <a href="#catalog" className="btn btn-primary" style={{ padding: '0.4rem 0.9rem', fontSize: '0.8rem' }}>
                    View Catalog
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dry Way Product Collections Overview Banner */}
      <section className="container" style={{ marginBottom: '4rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
          <div 
            onClick={() => setSelectedCategory('Healthy Snacks & Dry Fruits')}
            style={{ 
              background: 'rgba(255, 255, 255, 0.03)', 
              border: '1px solid rgba(255, 255, 255, 0.08)',
              padding: '1.25rem',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
          >
            <div style={{ width: '40px', height: '40px', background: 'rgba(217, 29, 73, 0.15)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.8rem', color: '#d91d49' }}>
              <Flame size={20} />
            </div>
            <h4 style={{ color: '#fff', fontSize: '1rem', fontWeight: 700, marginBottom: '0.3rem' }}>Healthy Snacks</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Dehydrated Pineapple, Mango, Strawberry, Kiwi & Dragon Fruit.</p>
          </div>

          <div 
            onClick={() => setSelectedCategory('Kitchen Revolution')}
            style={{ 
              background: 'rgba(255, 255, 255, 0.03)', 
              border: '1px solid rgba(255, 255, 255, 0.08)',
              padding: '1.25rem',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
          >
            <div style={{ width: '40px', height: '40px', background: 'rgba(43, 190, 249, 0.15)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.8rem', color: '#2bbef9' }}>
              <Utensils size={20} />
            </div>
            <h4 style={{ color: '#fff', fontSize: '1rem', fontWeight: 700, marginBottom: '0.3rem' }}>Kitchen Revolution</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Onion flakes, Chilli flakes, Garam masala, Garlic & Turmeric powder.</p>
          </div>

          <div 
            onClick={() => setSelectedCategory('Ready to Cook Kits')}
            style={{ 
              background: 'rgba(255, 255, 255, 0.03)', 
              border: '1px solid rgba(255, 255, 255, 0.08)',
              padding: '1.25rem',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
          >
            <div style={{ width: '40px', height: '40px', background: 'rgba(34, 197, 94, 0.15)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.8rem', color: '#22c55e' }}>
              <Clock size={20} />
            </div>
            <h4 style={{ color: '#fff', fontSize: '1rem', fontWeight: 700, marginBottom: '0.3rem' }}>Ready to Cook</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Sambar Kit, Avial Kit, Carrot, Beetroot & Raw Jackfruit Thoran Kits.</p>
          </div>

          <div 
            onClick={() => setSelectedCategory('Wellness & Superfoods')}
            style={{ 
              background: 'rgba(255, 255, 255, 0.03)', 
              border: '1px solid rgba(255, 255, 255, 0.08)',
              padding: '1.25rem',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
          >
            <div style={{ width: '40px', height: '40px', background: 'rgba(217, 29, 73, 0.15)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.8rem', color: '#d91d49' }}>
              <HeartPulse size={20} />
            </div>
            <h4 style={{ color: '#fff', fontSize: '1rem', fontWeight: 700, marginBottom: '0.3rem' }}>Wellness Superfoods</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ABC mix, Moringa powder, Green Jackfruit flour, Spirulina & Sea Moss.</p>
          </div>
        </div>
      </section>

      {/* Catalog Search & Filtering */}
      <section id="catalog" className="container" style={{ marginBottom: '6rem' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1.5rem',
            marginBottom: '2rem',
            borderBottom: '1px solid var(--border-color)',
            paddingBottom: '1.5rem',
          }}
        >
          <div>
            <h2 style={{ fontSize: '2rem', fontFamily: 'var(--font-headings)', marginBottom: '0.4rem', color: '#fff' }}>
              The Dry Way Catalog ({filteredProducts.length} Items)
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Explore our complete range of dehydrated foods, kitchen essentials, and wellness products.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            {/* Search Input */}
            <div style={{ position: 'relative' }}>
              <Search
                size={18}
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                }}
              />
              <input
                type="text"
                placeholder="Search fruits, masalas, kits..."
                className="input-field"
                style={{ width: '280px', paddingLeft: '2.5rem', height: '42px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Category Pills Navigation */}
        <div 
          style={{ 
            display: 'flex', 
            gap: '0.6rem', 
            overflowX: 'auto', 
            paddingBottom: '1rem', 
            marginBottom: '2.5rem',
            scrollbarWidth: 'thin'
          }}
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '0.65rem 1.2rem',
                fontSize: '0.85rem',
                fontWeight: 600,
                borderRadius: '8px',
                whiteSpace: 'nowrap',
                background: selectedCategory === cat ? '#d91d49' : 'rgba(255, 255, 255, 0.05)',
                color: selectedCategory === cat ? '#fff' : 'var(--text-primary)',
                border: selectedCategory === cat ? '1px solid #d91d49' : '1px solid rgba(255, 255, 255, 0.1)',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: selectedCategory === cat ? '0 4px 14px rgba(217, 29, 73, 0.4)' : 'none'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Loading & Error States */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '30vh' }}>
            <div style={{ width: '36px', height: '36px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: '#d91d49', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          </div>
        ) : error ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.8rem',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid var(--error)',
              color: 'var(--error)',
              padding: '1.5rem',
              borderRadius: 'var(--radius-md)',
              maxWidth: '500px',
              margin: '0 auto',
            }}
          >
            <AlertCircle size={24} />
            <span>Database offline or API failed. Ensure Node backend is running.</span>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
            No products found matching "{search}" in {selectedCategory}.
          </div>
        ) : (
          /* Products Grid */
          <div className="grid-responsive" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: '1.75rem' }}>
            {filteredProducts.map((product) => (
              <div
                key={product._id}
                className="glass-card animate-fade-in"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  padding: '1.1rem',
                  borderRadius: '14px',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  background: 'rgba(19, 24, 34, 0.65)',
                  transition: 'transform 0.2s, box-shadow 0.2s'
                }}
              >
                {/* Product Image Panel */}
                <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '10px', height: '200px', marginBottom: '1rem' }}>
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  {product.isOffer && (
                    <span style={{ position: 'absolute', top: '10px', left: '10px', background: '#d91d49', color: '#fff', fontSize: '0.7rem', fontWeight: 800, padding: '0.2rem 0.5rem', borderRadius: '4px', textTransform: 'uppercase' }}>
                      {product.offerTag || 'OFFER'}
                    </span>
                  )}
                  <div
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      background: 'rgba(11, 15, 23, 0.88)',
                      backdropFilter: 'blur(6px)',
                      color: '#fff',
                      fontWeight: 800,
                      padding: '0.35rem 0.75rem',
                      borderRadius: '6px',
                      fontSize: '0.95rem',
                      border: '1px solid rgba(217, 29, 73, 0.4)'
                    }}
                  >
                    {product.isOffer ? (
                      <span>
                        <strong style={{ color: '#d91d49' }}>₹{product.offerPrice}</strong>{' '}
                        <small style={{ textDecoration: 'line-through', color: 'var(--text-muted)', fontSize: '0.75rem' }}>₹{product.price}</small>
                      </span>
                    ) : (
                      <strong style={{ color: '#d91d49' }}>₹{product.price}</strong>
                    )}
                  </div>
                </div>

                {/* Product Detail Text */}
                <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <span style={{ fontSize: '0.725rem', color: '#2bbef9', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
                    {product.category}
                  </span>
                  <h3 style={{ fontSize: '1.1rem', color: '#fff', marginBottom: '0.5rem', fontWeight: 600, lineHeight: 1.3 }}>
                    {product.title}
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', marginBottom: '1.25rem', flex: 1, lineHeight: 1.5 }}>
                    {product.description}
                  </p>

                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                    <Link to={`/product/${product._id}`} className="btn btn-secondary" style={{ flex: 1, padding: '0.65rem', fontSize: '0.85rem', justifyContent: 'center' }}>
                      <Eye size={16} />
                      Details
                    </Link>
                    <button
                      onClick={() => addToCart(product, 1)}
                      disabled={product.countInStock <= 0}
                      className="btn btn-primary"
                      style={{ flex: 1, padding: '0.65rem', fontSize: '0.85rem', justifyContent: 'center' }}
                    >
                      <ShoppingBag size={16} />
                      {product.countInStock > 0 ? 'Buy' : 'Out of Stock'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
      
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Home;
