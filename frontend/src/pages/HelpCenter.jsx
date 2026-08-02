import React, { useState, useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';
import { HelpCircle, ChevronDown, ChevronUp, Mail, Send, ShieldCheck, Award, Truck, CheckCircle2 } from 'lucide-react';

const HelpCenter = () => {
  const { t } = useContext(LanguageContext);

  const [openIndex, setOpenIndex] = useState(0);
  const [supportName, setSupportName] = useState('');
  const [supportEmail, setSupportEmail] = useState('');
  const [supportMessage, setSupportMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const faqs = [
    {
      q: 'How does the Loyalty Points system work?',
      a: 'You earn 1 Loyalty Point for every ₹100 spent on net order totals. You can redeem your points during checkout at 1 point = ₹1 discount!',
    },
    {
      q: 'How are Dryway food products packaged and shipped?',
      a: 'All our dehydrated products and Ready to Cook kits are processed in clean room conditions and packed in 100% airtight food-grade moisture barrier pouches to ensure peak shelf life and natural flavor without artificial preservatives.',
    },
    {
      q: 'What payment methods do you support?',
      a: 'We support all major Credit/Debit Cards, UPI, Net Banking, and Stripe online payments. We also feature a secure checkout process.',
    },
    {
      q: 'How can I track my order delivery?',
      a: 'You can view real-time shipment progress in your account under "My Orders" or click "View Details" on any order receipt.',
    },
    {
      q: 'What is your return or replacement policy?',
      a: 'If any package arrives damaged or corrupted, contact support within 48 hours for a 100% hassle-free replacement or refund credit.',
    },
  ];

  const handleSupportSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setSupportName('');
    setSupportEmail('');
    setSupportMessage('');
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '3rem 1rem' }}>
      <div style={{ textAlignment: 'center', marginBottom: '3rem', textAlign: 'center' }}>
        <HelpCircle size={44} style={{ color: 'var(--accent)', marginBottom: '0.8rem' }} />
        <h1 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-headings)', color: '#fff' }}>
          {t('helpCenter')}
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '600px', margin: '0.5rem auto 0' }}>
          Have questions about Dryway products, loyalty points, or shipping? We are here to help!
        </p>
      </div>

      <div className="checkout-grid">
        {/* Left: FAQs Accordion */}
        <div className="glass-card" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-headings)', color: '#fff', marginBottom: '1.5rem' }}>
            {t('faqs')}
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {faqs.map((faq, index) => (
              <div
                key={index}
                style={{
                  background: 'var(--bg-primary)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-color)',
                  overflow: 'hidden',
                }}
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                  style={{
                    width: '100%',
                    padding: '1rem 1.25rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    color: '#fff',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    textAlign: 'left',
                    cursor: 'pointer',
                  }}
                >
                  <span>{faq.q}</span>
                  {openIndex === index ? (
                    <ChevronUp size={18} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                  ) : (
                    <ChevronDown size={18} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                  )}
                </button>

                {openIndex === index && (
                  <div
                    style={{
                      padding: '0 1.25rem 1.25rem',
                      color: 'var(--text-secondary)',
                      fontSize: '0.9rem',
                      lineHeight: 1.6,
                      borderTop: '1px solid rgba(255,255,255,0.05)',
                      paddingTop: '0.75rem',
                    }}
                  >
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right: Contact Form */}
        <div className="glass-card" style={{ padding: '2rem', background: 'var(--bg-secondary)' }}>
          <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-headings)', color: '#fff', marginBottom: '0.5rem' }}>
            {t('contactSupport')}
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            Send us a message and our support team will respond within 24 hours.
          </p>

          {submitted && (
            <div
              style={{
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid var(--success)',
                color: 'var(--success)',
                padding: '0.8rem 1rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '1.5rem',
              }}
            >
              <CheckCircle2 size={16} />
              <span>Thank you! Your inquiry has been sent.</span>
            </div>
          )}

          <form onSubmit={handleSupportSubmit}>
            <div className="form-group">
              <label className="form-label">Your Name</label>
              <input
                type="text"
                required
                className="input-field"
                placeholder="Jane Doe"
                value={supportName}
                onChange={(e) => setSupportName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                required
                className="input-field"
                placeholder="jane@example.com"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Message / Query</label>
              <textarea
                required
                className="input-field"
                rows="4"
                placeholder="How can we help you?"
                style={{ resize: 'vertical' }}
                value={supportMessage}
                onChange={(e) => setSupportMessage(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.85rem', marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            >
              <Send size={16} /> Submit Query
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
