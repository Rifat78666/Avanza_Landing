---
name: Avanza
description: Immigration and Degree Recognition Specialists
colors:
  primary: "#009246"
  primary-hover: "#007a3c"
  secondary: "#ce2b37"
  bg: "#ffffff"
  surface: "#f8faf8"
  text-primary: "#0d0d0d"
  text-secondary: "#5e5e5e"
  border: "#e5e7eb"
  error: "#ef4444"
typography:
  display:
    fontFamily: "'Inter', sans-serif"
    fontWeight: 800
  headline:
    fontFamily: "'Inter', sans-serif"
    fontWeight: 700
  body:
    fontFamily: "'Inter', sans-serif"
    fontWeight: 400
    lineHeight: 1.6
rounded:
  sm: "6px"
  md: "10px"
spacing:
  md: "1.5rem"
  lg: "3rem"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#ffffff"
    rounded: "{rounded.sm}"
    padding: "0.75rem 1.5rem"
  button-outline:
    textColor: "{colors.text-primary}"
    rounded: "{rounded.sm}"
    padding: "0.75rem 1.5rem"
  input-field:
    backgroundColor: "{colors.bg}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.md}"
    padding: "0.85rem 1.2rem"
---

# Design System: Avanza

## 1. Overview

**Creative North Star: "The Welcoming Consulate"**

AVANZA combines professional authority with warm accessibility. It rejects the dense, intimidating nature of traditional government portals, replacing it with a clear, guided, and highly trustworthy experience. The design is airy, crisp, and definitively tied to Italy without falling into caricatures. It explicitly rejects generic SaaS startup templates and cluttered bureaucratic interfaces.

**Key Characteristics:**
- High contrast, exceptionally legible typography
- Intentional use of the Italian flag colors (Green #009246, Red #ce2b37) to anchor the identity
- Tactile components that invite interaction
- Clear pathways and generous whitespace

## 2. Colors

A crisp, high-contrast palette anchored by bold Italian heritage colors.

### Primary
- **Italian Green** (#009246): The core brand color. Used for primary actions, success states, and key navigational elements.
- **Deep Green** (#007a3c): Hover state for primary actions.

### Secondary
- **Italian Red** (#ce2b37): Used for accents, urgent notifications, and highlighting premium/alternative options (like the Premium Strategy Session).

### Neutral
- **Pure White** (#ffffff): Main background.
- **Warm Surface** (#f8faf8): A very subtle tint for cards and secondary sections to create soft separation from the white background.
- **Ink Black** (#0d0d0d): Primary text.
- **Muted Gray** (#5e5e5e): Secondary text and metadata.
- **Border Gray** (#e5e7eb): Structural dividers and input borders.

### Named Rules
**The Flag Anchor Rule.** Green is for progress and primary actions; Red is for premium contrast or alerts. Never mix them indiscriminately; their usage must feel deliberate and structural.

## 3. Typography

**Display Font:** Inter (sans-serif)
**Body Font:** Inter (sans-serif)

**Character:** Highly legible, modern, and pragmatic.

### Hierarchy
- **Display** (800, clamp(2.2rem, 4vw, 3.2rem), tight line-height): Hero headlines.
- **Headline** (700, 1.8rem): Section headers.
- **Title** (600, 1.25rem): Card titles and component headers.
- **Body** (400, 1rem, 1.6): Paragraphs and general UI text.
- **Label** (600, 0.9rem): Form labels and small metadata.

### Named Rules
**The Legibility First Rule.** All body text must sit at a high contrast ratio. Never use light gray for body copy; the user is reading complex immigration information and needs perfect clarity.

## 4. Elevation

The system uses a hybrid approach: flat by default for structure, with soft, diffuse shadows reserved strictly for interactive elements.

### Shadow Vocabulary
- **Action Glow** (`0 4px 14px 0 rgba(0, 146, 70, 0.2)`): The default shadow for primary buttons to make them lift off the page.
- **Action Hover** (`0 6px 20px 0 rgba(0, 146, 70, 0.3)`): Deeper glow when hovering primary buttons.
- **Input Focus** (`0 0 0 2px rgba(0, 146, 70, 0.1)`): A soft focus ring.

### Named Rules
**The Intentional Lift Rule.** Shadows are only used to indicate interactivity or current state (like a selected card or a primary button). Structural containers remain flat.

## 5. Components

### Buttons
- **Shape:** Softly rounded (6px).
- **Primary:** Italian Green background with white text, accompanied by the Action Glow shadow.
- **Hover / Focus:** Lifts up (`translateY(-2px)`) with a deepened shadow and slightly darker green background.
- **Secondary / Ghost:** Outline style with border-gray, turning softly green on hover.

### Cards / Containers
- **Corner Style:** Medium radius (10px to 16px).
- **Background:** White or Warm Surface (`#f8faf8`).
- **Shadow Strategy:** Flat by default with a delicate 1px border.
- **Internal Padding:** Generous (1.5rem to 2rem).

### Inputs / Fields
- **Style:** 1px gray border, pure white background, 10px radius.
- **Focus:** Border turns Italian Green with a soft green focus ring.

## 6. Do's and Don'ts

### Do:
- **Do** use Italian Green (#009246) for the primary path forward.
- **Do** ensure all body text has strong contrast against its background.
- **Do** emphasize human elements (like founder avatars) to build trust.

### Don't:
- **Don't** use generic SaaS startup templates that feel disconnected from human services.
- **Don't** create cluttered, bureaucratic interfaces that increase cognitive load.
- **Don't** use gradient text or side-stripe borders as decorative accents.
- **Don't** animate images on hover (e.g. no scale or rotate on images).
