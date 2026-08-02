import React, { useState, useEffect } from 'react';
import { Sparkles, Leaf, ArrowRight } from 'lucide-react';

const SplashIntro = ({ onComplete }) => {
  const [fading, setFading] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Show splash screen on opening website
    const hasSeenSplash = sessionStorage.getItem('dryway_splash_shown');
    if (hasSeenSplash) {
      setVisible(false);
      if (onComplete) onComplete();
      return;
    }

    const timer = setTimeout(() => {
      handleClose();
    }, 2800);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setFading(true);
    sessionStorage.setItem('dryway_splash_shown', 'true');
    setTimeout(() => {
      setVisible(false);
      if (onComplete) onComplete();
    }, 600);
  };

  if (!visible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: 'linear-gradient(135deg, #0b0f17 0%, #1e1b4b 50%, #0f172a 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#ffffff',
        textAlign: 'center',
        padding: '2rem',
        opacity: fading ? 0 : 1,
        transition: 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        pointerEvents: fading ? 'none' : 'auto',
      }}
    >
      {/* Background Animated Particles Glow */}
      <div
        style={{
          position: 'absolute',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(225, 29, 72, 0.25) 0%, rgba(249, 115, 22, 0.15) 50%, rgba(0,0,0,0) 70%)',
          borderRadius: '50%',
          filter: 'blur(40px)',
          animation: 'pulseGlow 2.5s infinite alternate',
        }}
      />

      {/* Main Animated Intro Card */}
      <div style={{ position: 'relative', zIndex: 10, maxWidth: '500px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Animated Brand Emblem */}
        <div
          style={{
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, #e11d48 0%, #f97316 100%)',
            borderRadius: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.5rem',
            boxShadow: '0 10px 30px rgba(225, 29, 72, 0.4)',
            animation: 'bounceIn 1s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          }}
        >
          <Leaf size={42} style={{ color: '#ffffff' }} />
        </div>

        {/* Animated Title */}
        <h1
          style={{
            fontSize: '2.5rem',
            fontWeight: 900,
            fontFamily: 'var(--font-headings)',
            letterSpacing: '0.04em',
            marginBottom: '0.6rem',
            animation: 'fadeInUp 0.8s ease forwards',
          }}
        >
          THE DRY <span style={{ background: 'linear-gradient(135deg, #f97316 0%, #e11d48 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>WAY</span>
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontSize: '1rem',
            color: '#cbd5e1',
            fontWeight: 500,
            marginBottom: '2rem',
            letterSpacing: '0.02em',
            animation: 'fadeInUp 1s ease forwards',
          }}
        >
          100% Pure Natural Dehydrated Foods & Superfoods
        </p>

        {/* Progress Bar Animation */}
        <div
          style={{
            width: '200px',
            height: '4px',
            background: 'rgba(255, 255, 255, 0.15)',
            borderRadius: '10px',
            overflow: 'hidden',
            marginBottom: '2rem',
          }}
        >
          <div
            style={{
              width: '100%',
              height: '100%',
              background: 'linear-gradient(90deg, #f97316, #e11d48)',
              animation: 'progressFill 2.5s ease-in-out forwards',
            }}
          />
        </div>

        {/* Enter Site Button */}
        <button
          onClick={handleClose}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.65rem 1.4rem',
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: '#ffffff',
            borderRadius: '9999px',
            fontSize: '0.85rem',
            fontWeight: 600,
            cursor: 'pointer',
            backdropFilter: 'blur(8px)',
            transition: 'all 0.2s ease',
          }}
        >
          <span>Enter Website</span>
          <ArrowRight size={15} />
        </button>
      </div>

      <style>{`
        @keyframes pulseGlow {
          0% { transform: scale(0.9); opacity: 0.6; }
          100% { transform: scale(1.2); opacity: 0.9; }
        }
        @keyframes bounceIn {
          0% { transform: scale(0); opacity: 0; }
          60% { transform: scale(1.15); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes progressFill {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  );
};

export default SplashIntro;
