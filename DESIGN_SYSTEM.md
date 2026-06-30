# Vote Monitor - Design System

This document outlines the modern design system aligned with shadcn/ui and Vercel design standards.

## Overview

The design system has been refined to ensure:
- **Compact information hierarchy** - Dense but readable layouts
- **Modern aesthetics** - Clean, professional appearance
- **Accessibility** - Semantic HTML, ARIA labels, keyboard navigation
- **Consistency** - Unified color tokens, spacing, and typography

---

## Color System

### Primary Palette

- **Primary**: `#1e293b` (dark slate) - Main brand color for CTAs and primary actions
- **Primary Foreground**: `#f8fafc` (off-white) - Text on primary backgrounds
- **Accent**: `#3b82f6` (blue) - Secondary actions, focus states, highlights
- **Background**: `#ffffff` (white) - Base layout color
- **Foreground**: `#1e293b` (dark slate) - Primary text color

### Secondary Palette

- **Secondary**: `#e2e8f0` (light gray) - Hover states, disabled states
- **Secondary Foreground**: `#1e293b` (dark slate) - Text on secondary backgrounds
- **Muted**: `#e2e8f0` (light gray) - De-emphasized text
- **Muted Foreground**: `#64748b` (slate) - Secondary text color

### Status Colors

- **Active Badge**: Emerald green (`#f0fdf4` background, `#047857` text)
- **Pending Badge**: Amber (`#fffbeb` background, `#b45309` text)
- **Suspended Badge**: Slate (`#f1f5f9` background, `#475569` text)
- **Destructive**: Red (`#ef4444`) - Dangerous actions, errors

### Token Implementation

All colors are defined in `src/styles/tailwind.css` using CSS custom properties:

```css
--primary: 222.2 47.4% 11.2%;
--accent: 217.2 91.2% 59.8%;
```

Use these tokens with Tailwind classes: `bg-primary`, `text-foreground`, `hover:bg-secondary`

---

## Typography

### Font Families

- **Sans (Body)**: System stack or configured font
- **Mono**: For code/technical content

### Scale

- **Display**: 24px / font-bold (page titles, headers)
- **Headline**: 20px / font-bold (section headers)
- **Body**: 14px / font-normal (standard text)
- **Small**: 12px / font-medium (meta, labels)
- **XS**: 11px / font-semibold (badges, small labels)

### Line Height

- **Body text**: `leading-relaxed` (1.6) for readability
- **Headings**: `leading-tight` (1.2) for impact
- **Labels**: `leading-none` for compact labels

---

## Spacing

### Scale (8px base)

- **xs**: 4px - Micro spacing
- **sm**: 8px - Small gaps
- **md**: 12px - Standard spacing
- **lg**: 16px - Large sections
- **xl**: 24px - Major sections
- **2xl**: 32px - Page sections

### Application

- **Padding**: Cards `p-6`, sections `py-6`
- **Gap**: Flex layouts `gap-4`, grid layouts `gap-6`
- **Margin**: Section breaks `my-6`, rarely used for layouts

---

## Components

### Header

- **Height**: 56px (compact)
- **Sticky**: Positioned at top with z-50
- **Navigation**: Horizontal tabs with accent highlight
- **Mobile**: Collapsible menu with clear organization

**Key Classes**:
```tsx
className='border-b border-border/50 bg-background sticky top-0 z-50'
```

### Buttons

- **Default**: Primary color, rounded corners
- **Sizes**: `default` (36px), `sm` (32px), `lg` (40px), `icon` (36px)
- **Variants**: default, destructive, outline, secondary, ghost, link
- **States**: Hover (darker/lighter), focus (ring), disabled (opacity-50)

**Key Classes**:
```tsx
className='bg-primary text-primary-foreground hover:bg-primary/90 rounded-md h-9 px-4'
```

### Badges

- **Shape**: Rounded rectangle (md radius)
- **Padding**: 8px horizontal, 4px vertical (compact)
- **Variants**: default, secondary, destructive, outline
- **Font**: 12px semibold

**Usage**:
```tsx
<Badge variant='outline'>Active</Badge>
```

### Cards

- **Padding**: 24px
- **Border**: 1px subtle border
- **Shadow**: Minimal shadow-sm
- **Corner radius**: 8px

**Structure**:
```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Subtitle</CardDescription>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>
```

### Layout

- **Container**: Max-width 1280px, centered
- **Header padding**: `py-6` (24px vertical)
- **Main padding**: `py-6` (24px vertical)
- **Responsive**: Full width mobile, contained desktop

**Key Classes**:
```tsx
className='container py-6 flex flex-col flex-1'
```

---

## Responsive Design

### Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

### Strategy

1. **Mobile first** - Base styles for mobile
2. **Progressive enhancement** - Add features for larger screens
3. **Touch targets** - Min 44x44px for mobile
4. **Horizontal scroll** - Prevent for mobile layouts

**Example**:
```tsx
className='flex flex-col sm:flex-row sm:items-center sm:justify-between'
```

---

## Accessibility

### Semantic HTML

- Use `<header>`, `<main>`, `<nav>` elements
- Use `<button>` for actions, not `<div>`
- Use proper heading hierarchy (h1, h2, h3)

### ARIA Labels

- `aria-label` for icon-only buttons
- `aria-current='page'` for active nav items
- `role='alert'` for notifications
- `sr-only` class for screen reader text

### Keyboard Navigation

- Tab order follows visual flow
- Escape closes modals/dropdowns
- Enter submits forms
- Arrow keys in menus/tabs

**Example**:
```tsx
<button aria-label="Close menu" onClick={handleClose}>
  <XMarkIcon className='w-5 h-5' />
</button>
```

---

## States & Interactions

### Hover

- **Light backgrounds**: Darker shadow or background tint
- **Buttons**: 10% darker background
- **Links**: Underline or color change
- **Cards**: Subtle shadow increase

### Focus

- **Ring**: `ring-2 ring-accent ring-offset-2`
- **Color**: Use accent color
- **Visibility**: Always visible for keyboard users

### Active

- **Navigation**: `bg-accent text-accent-foreground`
- **Toggles**: Different background and/or icon
- **Tabs**: Underline or background highlight

### Disabled

- **Opacity**: 50% opacity
- **Cursor**: `not-allowed`
- **Pointer events**: `none`

---

## Compact Information Display

### Tables

- **Row height**: 44px minimum
- **Cell padding**: 12px
- **Font size**: 14px body, 12px secondary
- **Borders**: Subtle row separators only

### Lists

- **Item padding**: 12px vertical, 16px horizontal
- **Gaps**: 8px between items
- **Typography**: Hierarchy through font weight, not size

### Forms

- **Input height**: 36px
- **Label**: 12px semibold, 4px spacing below
- **Spacing**: 16px between fields
- **Validation**: Inline errors below field

---

## Implementation Guidelines

### Naming Conventions

- **Tokens**: `--{property}` (e.g., `--primary`, `--border`)
- **Utilities**: Tailwind class names (e.g., `text-foreground`, `bg-secondary`)
- **Components**: PascalCase (e.g., `CardHeader`, `Badge`)

### Color Overrides

Never hardcode colors. Always use token variables:

```tsx
// ❌ Avoid
className='bg-purple-900 text-white'

// ✅ Correct
className='bg-primary text-primary-foreground'
```

### Consistency Checklist

- [ ] Using design tokens for all colors
- [ ] Proper spacing scale (no arbitrary values)
- [ ] Semantic HTML elements
- [ ] ARIA labels on interactive elements
- [ ] Focus styles visible
- [ ] Mobile responsive
- [ ] Consistent button styles
- [ ] Proper heading hierarchy

---

## Recent Updates (Frontend Rewrite)

### Changes Made

1. **Color System**: Updated from purple-based to modern slate/blue palette
2. **Header**: Reduced height from 64px to 56px, refined navigation styling
3. **Layout**: Added border-top separators, improved spacing consistency
4. **Badges**: Changed from full-radius pills to rounded rectangles, updated colors
5. **Buttons**: Refined sizes and hover states for better consistency
6. **Root Layout**: Removed excessive bottom padding, set proper background

### Files Modified

- `src/styles/tailwind.css` - Color tokens and badge styles
- `src/components/layout/Layout.tsx` - Header improvements, compact spacing
- `src/components/layout/Header/Header.tsx` - Navigation refinement, responsive menu
- `src/components/ui/badge.tsx` - Shape and color updates
- `src/components/ui/button.tsx` - Size and variant refinement
- `src/routes/__root.tsx` - Root layout cleanup

---

## Next Steps

### Future Enhancements

- [ ] Dark mode support with CSS variables
- [ ] Animation transitions for interactions
- [ ] Micro-interactions for feedback
- [ ] Advanced form validation patterns
- [ ] Skeleton loading states
- [ ] Empty state illustrations

### Component Library

Consider creating a Storybook or component showcase for:
- Button variants and states
- Form patterns
- Data display components
- Modals and dialogs
- Notification patterns

---

## References

- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Vercel Design](https://vercel.com)
- [Web Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
