# JobBoard Platform - Design System

## Brand Identity

### Brand Name: **TalentFlow**
**Tagline**: "Where great careers begin"

### Brand Personality
- **Professional**: Trustworthy and reliable
- **Modern**: Clean, contemporary design
- **Approachable**: Friendly but not casual
- **Premium**: High-quality, attention to detail
- **Intelligent**: AI-powered, smart matching

---

## 🎨 Color System

### Primary Colors
```css
/* Brand Blue - Primary */
--color-primary-50: #eff6ff
--color-primary-100: #dbeafe
--color-primary-200: #bfdbfe
--color-primary-300: #93c5fd
--color-primary-400: #60a5fa
--color-primary-500: #3b82f6  /* Main brand color */
--color-primary-600: #2563eb
--color-primary-700: #1d4ed8
--color-primary-800: #1e40af
--color-primary-900: #1e3a8a

/* Success Green */
--color-success-50: #ecfdf5
--color-success-100: #d1fae5
--color-success-200: #a7f3d0
--color-success-300: #6ee7b7
--color-success-400: #34d399
--color-success-500: #10b981
--color-success-600: #059669
--color-success-700: #047857
--color-success-800: #065f46
--color-success-900: #064e3b

/* Warning Orange */
--color-warning-50: #fffbeb
--color-warning-100: #fef3c7
--color-warning-200: #fde68a
--color-warning-300: #fcd34d
--color-warning-400: #fbbf24
--color-warning-500: #f59e0b
--color-warning-600: #d97706
--color-warning-700: #b45309
--color-warning-800: #92400e
--color-warning-900: #78350f

/* Error Red */
--color-error-50: #fef2f2
--color-error-100: #fee2e2
--color-error-200: #fecaca
--color-error-300: #fca5a5
--color-error-400: #f87171
--color-error-500: #ef4444
--color-error-600: #dc2626
--color-error-700: #b91c1c
--color-error-800: #991b1b
--color-error-900: #7f1d1d
```

### Neutral Colors
```css
/* Gray Scale */
--color-gray-50: #f9fafb
--color-gray-100: #f3f4f6
--color-gray-200: #e5e7eb
--color-gray-300: #d1d5db
--color-gray-400: #9ca3af
--color-gray-500: #6b7280
--color-gray-600: #4b5563
--color-gray-700: #374151
--color-gray-800: #1f2937
--color-gray-900: #111827

/* Pure Colors */
--color-white: #ffffff
--color-black: #000000
```

### Background Colors
```css
/* Light Theme */
--bg-primary: #ffffff
--bg-secondary: #f9fafb
--bg-tertiary: #f3f4f6
--bg-accent: #eff6ff

/* Dark Theme */
--bg-primary-dark: #111827
--bg-secondary-dark: #1f2937
--bg-tertiary-dark: #374151
--bg-accent-dark: #1e3a8a
```

---

## 📝 Typography

### Font Stack
```css
/* Primary Font - Inter (Modern, readable) */
--font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

/* Secondary Font - JetBrains Mono (Code/Data) */
--font-mono: 'JetBrains Mono', 'SF Mono', Monaco, 'Cascadia Code', monospace;
```

### Type Scale
```css
/* Headings */
--text-xs: 0.75rem;     /* 12px */
--text-sm: 0.875rem;    /* 14px */
--text-base: 1rem;      /* 16px */
--text-lg: 1.125rem;    /* 18px */
--text-xl: 1.25rem;     /* 20px */
--text-2xl: 1.5rem;     /* 24px */
--text-3xl: 1.875rem;   /* 30px */
--text-4xl: 2.25rem;    /* 36px */
--text-5xl: 3rem;       /* 48px */
--text-6xl: 3.75rem;    /* 60px */

/* Font Weights */
--font-light: 300;
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
--font-extrabold: 800;

/* Line Heights */
--leading-tight: 1.25;
--leading-normal: 1.5;
--leading-relaxed: 1.75;
```

---

## 📏 Spacing System

### Spacing Scale (Based on 4px)
```css
--space-0: 0;
--space-1: 0.25rem;  /* 4px */
--space-2: 0.5rem;   /* 8px */
--space-3: 0.75rem;  /* 12px */
--space-4: 1rem;     /* 16px */
--space-5: 1.25rem;  /* 20px */
--space-6: 1.5rem;   /* 24px */
--space-8: 2rem;     /* 32px */
--space-10: 2.5rem;  /* 40px */
--space-12: 3rem;    /* 48px */
--space-16: 4rem;    /* 64px */
--space-20: 5rem;    /* 80px */
--space-24: 6rem;    /* 96px */
--space-32: 8rem;    /* 128px */
--space-40: 10rem;   /* 160px */
--space-48: 12rem;   /* 192px */
--space-56: 14rem;   /* 224px */
--space-64: 16rem;   /* 256px */
```

---

## 🔧 Border Radius
```css
--radius-none: 0;
--radius-sm: 0.125rem;   /* 2px */
--radius-base: 0.25rem;  /* 4px */
--radius-md: 0.375rem;   /* 6px */
--radius-lg: 0.5rem;     /* 8px */
--radius-xl: 0.75rem;    /* 12px */
--radius-2xl: 1rem;      /* 16px */
--radius-3xl: 1.5rem;    /* 24px */
--radius-full: 9999px;   /* Fully rounded */
```

---

## 🎭 Shadows
```css
/* Elevation System */
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-base: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
--shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.25);

/* Special Shadows */
--shadow-inner: inset 0 2px 4px 0 rgb(0 0 0 / 0.05);
--shadow-outline: 0 0 0 3px rgb(59 130 246 / 0.15);
--shadow-glow: 0 0 20px rgb(59 130 246 / 0.3);
```

---

## 🏗️ Layout Grid
```css
/* Container Sizes */
--container-sm: 640px;
--container-md: 768px;
--container-lg: 1024px;
--container-xl: 1280px;
--container-2xl: 1536px;

/* Grid System */
--grid-cols-12: repeat(12, minmax(0, 1fr));
--grid-gap: 1.5rem; /* 24px */

/* Breakpoints */
--bp-sm: 640px;
--bp-md: 768px;
--bp-lg: 1024px;
--bp-xl: 1280px;
--bp-2xl: 1536px;
```

---

## 🎯 Component Specifications

### Buttons
```css
/* Primary Button */
.btn-primary {
  background: var(--color-primary-500);
  color: var(--color-white);
  border-radius: var(--radius-lg);
  padding: var(--space-3) var(--space-6);
  font-weight: var(--font-medium);
  transition: all 0.2s ease;
  box-shadow: var(--shadow-sm);
}

.btn-primary:hover {
  background: var(--color-primary-600);
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}

/* Button Sizes */
.btn-sm { padding: var(--space-2) var(--space-4); font-size: var(--text-sm); }
.btn-md { padding: var(--space-3) var(--space-6); font-size: var(--text-base); }
.btn-lg { padding: var(--space-4) var(--space-8); font-size: var(--text-lg); }
```

### Cards
```css
.card {
  background: var(--bg-primary);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-base);
  border: 1px solid var(--color-gray-200);
  padding: var(--space-6);
  transition: all 0.2s ease;
}

.card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}

.card-job {
  border-left: 4px solid var(--color-primary-500);
}
```

### Forms
```css
.input {
  width: 100%;
  padding: var(--space-3) var(--space-4);
  border: 1px solid var(--color-gray-300);
  border-radius: var(--radius-lg);
  font-size: var(--text-base);
  transition: all 0.2s ease;
}

.input:focus {
  outline: none;
  border-color: var(--color-primary-500);
  box-shadow: var(--shadow-outline);
}

.input-error {
  border-color: var(--color-error-500);
}
```

---

## 🖼️ Visual Elements

### Icons
- **Icon Library**: Lucide React (consistent, modern, open source)
- **Icon Sizes**: 16px, 20px, 24px, 32px, 48px
- **Icon Style**: Outline style, 2px stroke width

### Illustrations
- **Style**: Modern, minimalist line art
- **Colors**: Primary brand colors with gradients
- **Usage**: Empty states, onboarding, error pages

### Images
- **Aspect Ratios**: 16:9 (hero), 4:3 (cards), 1:1 (avatars)
- **Border Radius**: Consistent with component system
- **Loading**: Skeleton states with shimmer effect

---

## ✨ Animation & Micro-interactions

### Timing Functions
```css
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in: cubic-bezier(0.4, 0, 1, 1);

/* Durations */
--duration-fast: 150ms;
--duration-normal: 300ms;
--duration-slow: 500ms;
```

### Common Animations
- **Hover**: Subtle lift (2px translateY) + shadow increase
- **Focus**: Outline glow with brand color
- **Loading**: Pulse animation on skeletons
- **Page Transitions**: Fade in with slight slide up
- **Modals**: Scale + fade animation

---

## 📱 Responsive Design

### Mobile-First Approach
1. **Mobile (320px+)**: Single column, touch-friendly
2. **Tablet (768px+)**: Two columns, larger touch targets
3. **Desktop (1024px+)**: Multi-column, hover states
4. **Large Desktop (1440px+)**: Max width containers

### Key Breakpoints
- **sm**: 640px - Small tablets, large phones
- **md**: 768px - Tablets
- **lg**: 1024px - Small laptops
- **xl**: 1280px - Laptops, desktops
- **2xl**: 1536px - Large desktops

---

## 🎨 Brand Applications

### Logo Variations
1. **Full Logo**: "TalentFlow" with icon
2. **Icon Only**: For favicons, app icons
3. **Wordmark**: Text only version
4. **Monochrome**: Single color versions

### Color Usage Guidelines
- **Primary Blue**: CTAs, links, brand elements
- **Success Green**: Job matches, successful actions
- **Warning Orange**: Attention, pending items
- **Error Red**: Errors, dangerous actions
- **Gray Scale**: Text hierarchy, backgrounds

This design system provides a solid foundation for creating a modern, professional job board platform. Ready to implement specific components?