# UI Style Guide - Smartboard Screen Application

## Design Philosophy

The Smartboard Screen application uses a **glassmorphism/liquid glass** design aesthetic that prioritizes:

- **Visual depth** through layered transparency and blur effects
- **Contextual visibility** where background elements remain visible but de-emphasized
- **Smooth interactions** with subtle animations and transitions
- **Accessibility** with proper contrast ratios and focus states

## Core Visual Principles

### 1. Glassmorphism Components

All overlay components (settings panels, modals, dropdowns) should follow the liquid glass pattern:

```css
/* Standard glass panel styling */
background: rgba(255, 255, 255, 0.15);
backdrop-filter: blur(20px);
border-radius: 20px;
border: 1px solid rgba(255, 255, 255, 0.2);
box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
```

### 2. Backdrop Treatment

When overlays appear, the background should be:

- Blurred using `backdrop-filter: blur(8px)`
- Darkened with `rgba(0, 0, 0, 0.3)` overlay
- Still visible to maintain spatial context

### 3. Interactive Elements

#### Buttons and Controls

- **Hover states**: Increase background opacity from 0.1 to 0.2
- **Focus states**: Add visible focus ring with `outline` or `box-shadow`
- **Transitions**: All state changes use `transition: all 0.2s`

#### Close Buttons (X)

```css
/* Standard close button */
width: 40px;
height: 40px;
border-radius: 50%;
border: 1px solid rgba(255, 255, 255, 0.3);
background: rgba(255, 255, 255, 0.1);
color: white;
font-size: 24px;
transition: all 0.2s;
```

### 4. Typography

- **Headers**: White text with appropriate font-weight (600 for h1, 500 for h2)
- **Body text**: White text at full opacity
- **Placeholder/disabled text**: `rgba(255, 255, 255, 0.7)`
- **Font scaling**: Use relative units (rem, em) for responsiveness

### 5. Animations

#### Entry Animations

```css
@keyframes slideIn {
    from {
        opacity: 0;
        transform: translate(-50%, -60%);
    }
    to {
        opacity: 1;
        transform: translate(-50%, -50%);
    }
}
```

#### Hover Animations

- Opacity transitions: 200ms ease
- Scale transforms: subtle (1.02x maximum)
- Color transitions: 200ms ease

## Component-Specific Guidelines

### Settings Overlay

- **Position**: Fixed, centered with `transform: translate(-50%, -50%)`
- **Size**: `min(600px, 90vw)` width, `80vh` max height
- **Z-index**: Backdrop at 1000, panel at 1001
- **Padding**: 32px internal padding
- **Scrolling**: `overflow: auto` with custom scrollbar styling

### Form Controls

- **Checkboxes/Radio buttons**: Scale 1.2x for better touch targets
- **Labels**: Flex layout with 8px gap
- **Sections**: 32px bottom margin between sections

### Navigation Elements

- **Gear icon**: 0.3 opacity default, 1.0 on hover/focus
- **Icon size**: 32x32px standard
- **Positioning**: 16px from edges with `position: absolute`

## Responsive Considerations

### Mobile/Tablet Adaptations

- Settings panel: `90vw` width on small screens
- Touch targets: Minimum 44px for interactive elements
- Reduced blur: `blur(10px)` on lower-end devices

### High DPI Displays

- Use vector icons (SVG) for crisp rendering
- Canvas elements: Set proper pixel ratio scaling
- Test on 2x and 3x pixel density displays

## Accessibility Standards

### Color Contrast

- Ensure 4.5:1 contrast ratio minimum for text
- Use `rgba(255, 255, 255, 0.9)` for high contrast text
- Provide focus indicators with `outline` or `box-shadow`

### Keyboard Navigation

- All interactive elements must be focusable
- Visible focus states required
- Logical tab order maintained

### Screen Readers

- Proper ARIA labels on all controls
- Semantic HTML structure maintained
- Alternative text for visual elements

## Code Standards

### CSS Organization

```css
/* 1. Layout properties */
position: fixed;
top: 50%;
left: 50%;

/* 2. Box model */
width: min(600px, 90vw);
padding: 32px;
margin: 0;

/* 3. Visual styling */
background: rgba(255, 255, 255, 0.15);
border-radius: 20px;
backdrop-filter: blur(20px);

/* 4. Typography */
color: white;
font-size: 16px;

/* 5. Transitions/animations */
transition: all 0.2s;
animation: slideIn 0.3s ease-out;
```

### Component Props

Always support customization through props:

```typescript
interface GlassComponentProps {
    blur?: number; // Backdrop blur intensity
    opacity?: number; // Background opacity
    borderRadius?: number; // Corner radius
    onClose?: () => void; // Close handler
    className?: string; // Additional CSS classes
}
```

## Performance Considerations

### Backdrop Filters

- Use sparingly as they're GPU-intensive
- Limit to 2-3 active blur effects maximum
- Consider `will-change: backdrop-filter` for animations

### Animation Performance

- Prefer `transform` and `opacity` changes
- Use `will-change` property for animated elements
- Remove `will-change` after animations complete

## Browser Support

### Modern Features

- **Backdrop-filter**: Supported in all modern browsers
- **CSS Grid/Flexbox**: Full support required
- **CSS Custom Properties**: Used for theming

### Fallbacks

```css
/* Fallback for older browsers */
@supports not (backdrop-filter: blur(20px)) {
    background: rgba(255, 255, 255, 0.9);
}
```

## Future Considerations

### Dark Mode Support

- Prepare CSS custom properties for theme switching
- Test glass effects with dark backgrounds
- Maintain contrast ratios across themes

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
    * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
}
```

This style guide ensures consistent, accessible, and performant glassmorphism UI across the entire smartboard application.
