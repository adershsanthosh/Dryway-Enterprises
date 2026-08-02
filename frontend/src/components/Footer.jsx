import React from 'react';
import { ExternalLink, Leaf } from 'lucide-react';

const Footer = () => {
  return (
    <footer
      style={{
        borderTop: '1px solid var(--border-color)',
        padding: '4rem 0 2rem 0',
        backgroundColor: '#0c1017',
        marginTop: '6rem',
        color: 'var(--text-secondary)',
        fontSize: '0.9rem',
      }}
    >
      <div
        className="container"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '2.5rem',
          marginBottom: '3rem',
        }}
      >
        <div>
          <h4
            style={{
              color: '#fff',
              fontSize: '1.4rem',
              fontWeight: 800,
              fontFamily: 'var(--font-headings)',
              marginBottom: '0.6rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            DRY<span style={{ color: '#ea580c' }}>WAY</span>
          </h4>
          <p style={{ fontSize: '0.85rem', lineHeight: '1.6', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
            The Dry Way – Delicious & Yummy 100% pure natural dehydrated fruits, kitchen masalas & powders, ready-to-cook meal kits, superfood wellness powders, and handcrafted chocolates.
          </p>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#22c55e', fontSize: '0.8rem', fontWeight: 600 }}>
            <Leaf size={14} /> 100% Preservative Free & Chemical Free
          </div>
        </div>

        <div>
          <h5 style={{ color: '#fff', fontWeight: 700, marginBottom: '1rem', fontSize: '0.95rem' }}>
            Product Ranges
          </h5>
          <ul
            style={{
              listStyle: 'none',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              fontSize: '0.85rem',
            }}
          >
            <li>Healthy Snacks & Dry Fruits</li>
            <li>Kitchen Revolution Flakes & Masalas</li>
            <li>Ready to Cook Meal Kits</li>
            <li>Wellness & Superfood Powders</li>
            <li>Chocolates & Healthy Energy Bars</li>
          </ul>
        </div>

        <div>
          <h5 style={{ color: '#fff', fontWeight: 700, marginBottom: '1rem', fontSize: '0.95rem' }}>
            Official Brand & Support
          </h5>
          <ul
            style={{
              listStyle: 'none',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              fontSize: '0.85rem',
            }}
          >
            <li>
              <a 
                href="https://thedryway.com" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ color: '#f97316', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontWeight: 600 }}
              >
                thedryway.com <ExternalLink size={12} />
              </a>
            </li>
            <li>Contact & Support</li>
            <li>Shipping & Return Policy</li>
            <li>Privacy & Terms</li>
          </ul>
        </div>
      </div>

      <div className="container" style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', fontSize: '0.8rem' }}>
        <p>© {new Date().getFullYear()} The Dry Way. All rights reserved.</p>
        <p style={{ color: 'var(--text-muted)' }}>
          Powered by Dryway MERN Stack E-Commerce Platform
        </p>
      </div>
    </footer>
  );
};

export default Footer;
