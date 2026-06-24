import React from 'react';

const TypographyPreview = () => {
  return (
    <div style={{ maxWidth: '780px', margin: '0 auto', padding: '60px 20px', fontFamily: '-apple-system,BlinkMacSystemFont,Segoe UI,Inter,sans-serif' }}>
      <h1 style={{ margin: '0 0 6px', fontSize: '26px', fontWeight: '800', color: 'var(--navy)', letterSpacing: '-.5px' }}>
        Modern text styles for AVANZA
      </h1>
      <p style={{ margin: '0 0 28px', fontSize: '14px', color: '#5d6b7a', lineHeight: '1.55' }}>
        The headline looks trending on landing pages right now — each rendered using your real copy. Numbers 04 and 09 are animated; reload the page to see the reveal.
      </p>

      {/* 01 */}
      <div style={{ background: '#ffffff', border: '1px solid #e7ebef', borderRadius: '16px', padding: '28px', marginBottom: '16px', overflow: 'hidden' }}>
        <div style={{ display: 'inline-block', fontSize: '10.5px', fontWeight: '700', letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--amber)', marginBottom: '16px' }}>
          01 · Editorial serif
        </div>
        <div className="s-serif">Your degree already counts.<br/>We just make Europe <em>see it.</em></div>
        <div style={{ fontSize: '12.5px', color: '#5d6b7a', marginTop: '14px', lineHeight: '1.55' }}>
          Big serif headlines feel premium and human — strong for a brand built on a personal story.
        </div>
      </div>

      {/* 02 */}
      <div style={{ background: '#ffffff', border: '1px solid #e7ebef', borderRadius: '16px', padding: '28px', marginBottom: '16px', overflow: 'hidden' }}>
        <div style={{ display: 'inline-block', fontSize: '10.5px', fontWeight: '700', letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--amber)', marginBottom: '16px' }}>
          02 · Oversized tight sans
        </div>
        <div className="s-big">Move forward.</div>
        <div style={{ fontSize: '12.5px', color: '#5d6b7a', marginTop: '14px', lineHeight: '1.55' }}>
          Heavy weight, tight spacing, minimal line gap. Confident — the dominant hero style today.
        </div>
      </div>

      {/* 03 */}
      <div style={{ background: '#ffffff', border: '1px solid #e7ebef', borderRadius: '16px', padding: '28px', marginBottom: '16px', overflow: 'hidden' }}>
        <div style={{ display: 'inline-block', fontSize: '10.5px', fontWeight: '700', letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--amber)', marginBottom: '16px' }}>
          03 · Gradient fill
        </div>
        <div className="s-grad">Grades, European-ready</div>
        <div style={{ fontSize: '12.5px', color: '#5d6b7a', marginTop: '14px', lineHeight: '1.55' }}>
          Brand colors flow through the letters. Energy without an image. Use one per page.
        </div>
      </div>

      {/* 04 */}
      <div style={{ background: '#ffffff', border: '1px solid #e7ebef', borderRadius: '16px', padding: '28px', marginBottom: '16px', overflow: 'hidden' }}>
        <div style={{ display: 'inline-block', fontSize: '10.5px', fontWeight: '700', letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--amber)', marginBottom: '16px' }}>
          04 · Animated shimmer
        </div>
        <div className="s-shimmer">From your transcript to Europe</div>
        <div style={{ fontSize: '12.5px', color: '#5d6b7a', marginTop: '14px', lineHeight: '1.55' }}>
          Same gradient, gently animated. Subtle motion that catches the eye without shouting.
        </div>
      </div>

      {/* 05 */}
      <div style={{ background: '#ffffff', border: '1px solid #e7ebef', borderRadius: '16px', padding: '28px', marginBottom: '16px', overflow: 'hidden' }}>
        <div style={{ display: 'inline-block', fontSize: '10.5px', fontWeight: '700', letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--amber)', marginBottom: '16px' }}>
          05 · Weight contrast
        </div>
        <div className="s-mix">We didn't study the problem.<br/><b>We lived it.</b></div>
        <div style={{ fontSize: '12.5px', color: '#5d6b7a', marginTop: '14px', lineHeight: '1.55' }}>
          Mixing thin and bold in one headline creates rhythm and points the eye at the key phrase.
        </div>
      </div>

      {/* 06 */}
      <div style={{ background: '#ffffff', border: '1px solid #e7ebef', borderRadius: '16px', padding: '28px', marginBottom: '16px', overflow: 'hidden' }}>
        <div style={{ display: 'inline-block', fontSize: '10.5px', fontWeight: '700', letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--amber)', marginBottom: '16px' }}>
          06 · Highlight marker
        </div>
        <div className="s-mark">Built by people who <span>crossed borders</span> too.</div>
        <div style={{ fontSize: '12.5px', color: '#5d6b7a', marginTop: '14px', lineHeight: '1.55' }}>
          A hand-drawn highlight in your amber. Friendly and approachable — good for trust sections.
        </div>
      </div>

      {/* 07 */}
      <div style={{ background: '#ffffff', border: '1px solid #e7ebef', borderRadius: '16px', padding: '28px', marginBottom: '16px', overflow: 'hidden' }}>
        <div style={{ display: 'inline-block', fontSize: '10.5px', fontWeight: '700', letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--amber)', marginBottom: '16px' }}>
          07 · Outline + solid
        </div>
        <div className="s-outline">Your <b>roadmap</b> to Italy</div>
        <div style={{ fontSize: '12.5px', color: '#5d6b7a', marginTop: '14px', lineHeight: '1.55' }}>
          Outlined letters with one solid keyword. Editorial and distinctive for section dividers.
        </div>
      </div>

      {/* 08 */}
      <div style={{ background: '#ffffff', border: '1px solid #e7ebef', borderRadius: '16px', padding: '28px', marginBottom: '16px', overflow: 'hidden' }}>
        <div style={{ display: 'inline-block', fontSize: '10.5px', fontWeight: '700', letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--amber)', marginBottom: '16px' }}>
          08 · Mono kicker + bold head
        </div>
        <div className="s-mono-kicker">// recognition, simplified</div>
        <div className="s-mono-h">One platform. Every step.</div>
        <div style={{ fontSize: '12.5px', color: '#5d6b7a', marginTop: '14px', lineHeight: '1.55' }}>
          A small monospace label above a bold headline reads modern and techy — fits an AI product.
        </div>
      </div>

      {/* 09 */}
      <div style={{ background: '#ffffff', border: '1px solid #e7ebef', borderRadius: '16px', padding: '28px', marginBottom: '16px', overflow: 'hidden' }}>
        <div style={{ display: 'inline-block', fontSize: '10.5px', fontWeight: '700', letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--amber)', marginBottom: '16px' }}>
          09 · Word-by-word reveal
        </div>
        <div className="s-reveal">
          <span className="word">Move&nbsp;</span><span className="word">forward,&nbsp;</span><span className="word">not&nbsp;</span><span className="word">backward.</span>
        </div>
        <div style={{ fontSize: '12.5px', color: '#5d6b7a', marginTop: '14px', lineHeight: '1.55' }}>
          Words rise in one at a time on load. Adds life to a hero — keep it fast so it never feels slow.
        </div>
      </div>
    </div>
  );
};

export default TypographyPreview;
