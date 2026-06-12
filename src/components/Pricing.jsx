import React, { useState } from 'react';

const CHECK_ICON = (
  <svg
    width="17"
    height="17"
    viewBox="0 0 17 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ flexShrink: 0, marginTop: '1px' }}
  >
    <path
      d="M3.5 8.5L6.5 11.5L13.5 4.5"
      stroke="#009246"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const plans = [
  {
    id: 'basic',
    label: 'BASIC ROADMAP',
    price: '€0',
    period: 'forever',
    features: [
      '8-question quiz',
      'Recognition pathway & documents',
      'Free training matches',
    ],
    highlight: false,
    cta: 'Get Started Free',
    ctaStyle: 'outline',
  },
  {
    id: 'premium',
    label: 'PREMIUM EVALUATION',
    price: '€14.99',
    period: 'one-time',
    features: [
      'Everything in Basic',
      'Live job matches, refreshed',
      'Checklists, deadlines & reminders',
      'Roadmap updates when rules change',
    ],
    highlight: true,
    badge: 'MOST POPULAR',
    cta: 'Get Premium',
    ctaStyle: 'primary',
  },
  {
    id: 'b2b',
    label: 'EMPLOYERS & CAFs',
    price: 'B2B',
    period: 'plans',
    features: [
      'For hospitals, CAFs & schools',
      'Access to recognition-ready talent',
      'Bulk onboarding & dashboards',
      'Embedded quiz at the front desk',
    ],
    highlight: false,
    cta: 'Contact Us',
    ctaStyle: 'outline',
  },
];

const Pricing = ({ onGetStarted }) => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [hoveredBtn, setHoveredBtn] = useState(null);

  return (
    <section
      id="pricing"
      className="section container"
      style={{ position: 'relative', zIndex: 10 }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <p
          style={{
            fontSize: '0.8rem',
            fontWeight: '600',
            letterSpacing: '0.12em',
            color: 'var(--text-secondary)',
            textTransform: 'uppercase',
            marginBottom: '0.75rem',
          }}
        >
          PRICING
        </p>
        <h2
          style={{
            fontSize: 'clamp(1.8rem, 3vw, 2.5rem)',
            fontWeight: '700',
            color: 'var(--text-primary)',
            letterSpacing: '-0.5px',
            marginBottom: 0,
            lineHeight: '1.2',
          }}
        >
          Free to start.{' '}
          <span style={{ color: 'var(--text-primary)' }}>
            Priced for what it saves.
          </span>
        </h2>
      </div>

      {/* Cards */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1.5rem',
          justifyContent: 'center',
          alignItems: 'stretch',
        }}
      >
        {plans.map((plan) => {
          const isHovered = hoveredCard === plan.id;
          const isHighlight = plan.highlight;

          return (
            <div
              key={plan.id}
              onMouseEnter={() => setHoveredCard(plan.id)}
              onMouseLeave={() => setHoveredCard(null)}
              style={{
                position: 'relative',
                flex: '1 1 260px',
                maxWidth: '320px',
                minWidth: '240px',
                background: '#ffffff',
                border: isHighlight
                  ? '2px solid #f59e0b'
                  : '1px solid var(--border-color)',
                borderRadius: '12px',
                padding: isHighlight ? '2rem 1.75rem 1.75rem' : '1.75rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem',
                transition: 'box-shadow 0.25s ease, transform 0.25s ease',
                boxShadow: isHovered
                  ? isHighlight
                    ? '0 8px 28px rgba(245,158,11,0.18)'
                    : '0 4px 14px rgba(0,146,70,0.12)'
                  : 'none',
                transform: isHovered ? 'translateY(-3px)' : 'translateY(0)',
                cursor: 'default',
              }}
            >
              {/* Most Popular Badge */}
              {isHighlight && (
                <div
                  style={{
                    position: 'absolute',
                    top: '-14px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: '#f59e0b',
                    color: '#ffffff',
                    fontSize: '0.7rem',
                    fontWeight: '700',
                    letterSpacing: '0.1em',
                    padding: '4px 14px',
                    borderRadius: '20px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {plan.badge}
                </div>
              )}

              {/* Plan label */}
              <p
                style={{
                  fontSize: '0.72rem',
                  fontWeight: '700',
                  letterSpacing: '0.1em',
                  color: 'var(--text-secondary)',
                  textTransform: 'uppercase',
                  margin: 0,
                }}
              >
                {plan.label}
              </p>

              {/* Price */}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
                <span
                  style={{
                    fontSize: plan.id === 'b2b' ? '2.8rem' : '2.6rem',
                    fontWeight: '800',
                    color: 'var(--text-primary)',
                    lineHeight: 1,
                    letterSpacing: '-1px',
                  }}
                >
                  {plan.price}
                </span>
                <span
                  style={{
                    fontSize: '0.9rem',
                    color: 'var(--text-secondary)',
                    fontWeight: '400',
                  }}
                >
                  {plan.period}
                </span>
              </div>

              {/* Divider */}
              <div
                style={{
                  height: '1px',
                  background: 'var(--border-color)',
                  margin: '0.25rem 0',
                }}
              />

              {/* Features */}
              <ul
                style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                  flex: 1,
                }}
              >
                {plan.features.map((feat) => (
                  <li
                    key={feat}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.6rem',
                      fontSize: '0.95rem',
                      color: 'var(--text-primary)',
                      lineHeight: '1.45',
                    }}
                  >
                    {CHECK_ICON}
                    {feat}
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <button
                onMouseEnter={() => setHoveredBtn(plan.id)}
                onMouseLeave={() => setHoveredBtn(null)}
                onClick={() => onGetStarted && onGetStarted('register')}
                style={{
                  marginTop: '0.5rem',
                  padding: '0.75rem 1.25rem',
                  borderRadius: '6px',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  border: plan.ctaStyle === 'primary' ? 'none' : '1.5px solid var(--border-color)',
                  background:
                    plan.ctaStyle === 'primary'
                      ? hoveredBtn === plan.id
                        ? '#007a3c'
                        : '#009246'
                      : hoveredBtn === plan.id
                      ? '#f8faf8'
                      : '#ffffff',
                  color:
                    plan.ctaStyle === 'primary'
                      ? '#ffffff'
                      : 'var(--text-primary)',
                  boxShadow:
                    plan.ctaStyle === 'primary'
                      ? hoveredBtn === plan.id
                        ? '0 6px 20px rgba(0,146,70,0.3)'
                        : '0 4px 14px rgba(0,146,70,0.2)'
                      : 'none',
                  transform:
                    hoveredBtn === plan.id ? 'translateY(-1px)' : 'translateY(0)',
                }}
              >
                {plan.cta}
              </button>
            </div>
          );
        })}
      </div>

      {/* Footer note */}
      <p
        style={{
          marginTop: '2.5rem',
          fontSize: '0.9rem',
          color: 'var(--text-secondary)',
          maxWidth: '680px',
          lineHeight: '1.65',
          textAlign: 'center',
          margin: '2.5rem auto 0',
        }}
      >
        Generic AI tools charge €10 for a basic evaluation. AVANZA charges{' '}
        <strong style={{ color: 'var(--text-primary)' }}>€14.99</strong> for a
        full Italy-specific career roadmap — and our real revenue engine is{' '}
        <strong style={{ color: '#f59e0b' }}>B2B employer placements.</strong>
      </p>
    </section>
  );
};

export default Pricing;
