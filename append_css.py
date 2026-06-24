import os

css_to_append = """

/* ==== MODERN TEXT STYLES ==== */
:root {
  --navy: #1A3A5C;
  --amber: #F4A832;
  --ink: #16202b;
}

.s-serif {
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 40px;
  font-weight: 700;
  line-height: 1.05;
  letter-spacing: -0.5px;
  color: var(--navy);
}
.s-serif em {
  font-style: italic;
  color: var(--amber);
}

.s-big {
  font-size: 50px;
  font-weight: 800;
  line-height: 0.98;
  letter-spacing: -2px;
  color: var(--navy);
}

.s-grad {
  font-size: 44px;
  font-weight: 800;
  line-height: 1.02;
  letter-spacing: -1px;
  background: linear-gradient(95deg, var(--accent-color) 10%, var(--accent-red) 90%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}

.s-shimmer {
  font-size: 44px;
  font-weight: 800;
  line-height: 1.02;
  letter-spacing: -1px;
  background: linear-gradient(100deg, var(--accent-color), var(--accent-red), var(--accent-color));
  background-size: 220% auto;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
  animation: shimmer 4s linear infinite;
}
@keyframes shimmer {
  to { background-position: 220% center; }
}

.s-mix {
  font-size: 42px;
  line-height: 1.05;
  letter-spacing: -1px;
  color: var(--navy);
  font-weight: 300;
}
.s-mix b { font-weight: 800; }

.s-mark {
  font-size: 38px;
  font-weight: 700;
  line-height: 1.3;
  letter-spacing: -0.5px;
  color: var(--navy);
}
.s-mark span {
  background: linear-gradient(transparent 55%, rgba(244,168,50,.55) 55%);
  padding: 0 4px;
}

.s-outline {
  font-size: 50px;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -1.5px;
  color: transparent;
  -webkit-text-stroke: 1.5px var(--navy);
}
.s-outline b {
  color: var(--navy);
  -webkit-text-stroke: 0;
}

.s-mono-kicker {
  font-family: 'SFMono-Regular', Consolas, 'Courier New', monospace;
  font-size: 12px;
  letter-spacing: 0.1em;
  color: var(--amber);
  text-transform: uppercase;
  margin-bottom: 8px;
}
.s-mono-h {
  font-size: 40px;
  font-weight: 800;
  line-height: 1.05;
  letter-spacing: -1px;
  color: var(--navy);
}

.s-reveal {
  font-size: 44px;
  font-weight: 800;
  line-height: 1.02;
  letter-spacing: -1px;
  color: var(--navy);
}
.s-reveal .word {
  display: inline-block;
  opacity: 0;
  transform: translateY(18px);
  animation: rise 0.6s forwards;
}
.s-reveal .word:nth-child(1) { animation-delay: .05s }
.s-reveal .word:nth-child(2) { animation-delay: .18s }
.s-reveal .word:nth-child(3) { animation-delay: .31s }
.s-reveal .word:nth-child(4) { animation-delay: .44s }
@keyframes rise {
  to { opacity: 1; transform: translateY(0); }
}

@media(max-width: 600px) {
  .s-serif, .s-grad, .s-shimmer, .s-mix, .s-reveal { font-size: 30px; }
  .s-big, .s-outline { font-size: 36px; letter-spacing: -1px; }
  .s-mark, .s-mono-h { font-size: 27px; }
}
"""

with open(r'c:\Users\rifat\.gemini\antigravity-backup\scratch\avanza-landing\src\index.css', 'a') as f:
    f.write(css_to_append)

print("CSS appended successfully.")
