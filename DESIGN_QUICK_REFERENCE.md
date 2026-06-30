# Vote Monitor Design System - Quick Reference

## Color Palette

```
Primary:              #1e293b  (Dark Slate)
Primary Foreground:   #f8fafc  (Off-white)
Accent:               #3b82f6  (Blue)
Secondary:            #e2e8f0  (Light Gray)
Muted:                #e2e8f0  (Light Gray)
Muted Foreground:     #64748b  (Slate)
Background:           #ffffff  (White)
Foreground:           #1e293b  (Dark Slate)
Border:               #e2e8f0  (Light Gray)
Destructive:          #ef4444  (Red)
```

## Status Badge Colors

| Status | Background | Text |
|--------|-----------|------|
| Active | `#f0fdf4` | `#047857` |
| Pending | `#fffbeb` | `#b45309` |
| Suspended | `#f1f5f9` | `#475569` |

## Typography Scale

| Usage | Size | Weight | Line Height |
|-------|------|--------|-------------|
| Display/Page Title | 24px | 700 | 1.2 |
| Section Header | 20px | 700 | 1.2 |
| Body Text | 14px | 400 | 1.6 |
| Meta/Label | 12px | 500 | 1.4 |
| Badge | 12px | 600 | 1.2 |

## Spacing Scale (8px base)

| Name | Value | Tailwind |
|------|-------|----------|
| xs | 4px | `gap-1`, `p-1` |
| sm | 8px | `gap-2`, `p-2` |
| md | 12px | `gap-3`, `p-3` |
| lg | 16px | `gap-4`, `p-4` |
| xl | 24px | `gap-6`, `p-6` |
| 2xl | 32px | `gap-8`, `p-8` |

## Common Tailwind Classes

### Colors
```tsx
// Backgrounds
bg-primary          // Primary brand color
bg-secondary        // Hover/disabled states
bg-accent          // Accent color
bg-background      // White base

// Text
text-foreground           // Primary text (dark)
text-muted-foreground     // Secondary text (gray)
text-primary-foreground   // Light text on primary bg

// Borders
border-border      // Subtle gray border
ring-accent        // Focus ring indicator
```

### Spacing
```tsx
// Padding
p-4, p-6           // Standard padding
px-4, py-6         // Horizontal/vertical
pt-2, pb-4         // Top/bottom

// Gaps (flexbox/grid)
gap-2, gap-4       // Spacing between items
gap-x-2, gap-y-4   // X/Y specific

// Margins (rarely used)
my-6, mx-4         // Vertical/horizontal
m-0                // Remove margins
```

### Sizing
```tsx
h-8, h-9, h-10     // Heights for buttons (32px, 36px, 40px)
w-full, w-1/2      // Widths
rounded-md         // Border radius (8px)
```

### Responsive
```tsx
block              // Mobile (< 640px)
sm:flex            // Small (≥ 640px)
md:grid            // Medium (≥ 768px)
lg:block           // Large (≥ 1024px)
```

## Component Examples

### Button
```tsx
// Primary button
<Button>Save Changes</Button>

// Secondary button
<Button variant='secondary'>Cancel</Button>

// Ghost button (minimal)
<Button variant='ghost'>Learn More</Button>

// Small button
<Button size='sm'>Quick Action</Button>

// Destructive button
<Button variant='destructive'>Delete</Button>
```

### Badge
```tsx
// Default badge
<Badge>Active</Badge>

// Variant badges
<Badge variant='secondary'>Pending</Badge>
<Badge variant='destructive'>Error</Badge>
<Badge variant='outline'>Draft</Badge>

// With close button
<Badge variant='outline' className='gap-2'>
  Label
  <button onClick={onClose}>
    <XMarkIcon className='w-3' />
  </button>
</Badge>
```

### Layout
```tsx
// Page layout
<Layout title='Page Title' subtitle='Description'>
  <div>Content here</div>
</Layout>

// With actions
<Layout 
  title='Editor'
  actions={<Button>Save</Button>}
>
  <div>Editor content</div>
</Layout>
```

### Card
```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Subtitle</CardDescription>
  </CardHeader>
  <CardContent>Content</CardContent>
  <CardFooter>Footer</CardFooter>
</Card>
```

## Layout Structure

### Page Layout
```tsx
<Layout title='Page Title' subtitle='Description'>
  {/* Main content */}
</Layout>

// Renders:
// <header className='container py-6 border-b border-border/50'>
//   <h1>Page Title</h1>
//   <p>Description</p>
// </header>
// <main className='container py-6 flex flex-col flex-1'>
//   {children}
// </main>
```

### Header
```
┌─────────────────────────────────────────────────────┐
│ Logo  Nav Item 1  Nav Item 2  [Election]  [User]   │  h-14 (56px)
└─────────────────────────────────────────────────────┘
```

### Spacing Standards
```
Page Title
16px
Subtitle text
24px (py-6)
─ Section Border ─
24px (py-6)
[Card] [Card]
  16px gap
[Card] [Card]
```

## Common Patterns

### Form Field
```tsx
<div className='space-y-2'>
  <Label htmlFor='email'>Email</Label>
  <Input id='email' type='email' placeholder='you@example.com' />
  <p className='text-xs text-muted-foreground'>Help text here</p>
</div>
```

### Card with Actions
```tsx
<Card>
  <CardHeader className='flex flex-row items-center justify-between space-y-0'>
    <CardTitle>Title</CardTitle>
    <Button variant='ghost' size='icon'>
      <MoreIcon />
    </Button>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>
```

### Responsive Grid
```tsx
<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
  {items.map(item => <Card key={item.id}>{item}</Card>)}
</div>
```

### Flex Between
```tsx
<div className='flex items-center justify-between'>
  <h2 className='text-xl font-bold'>Title</h2>
  <Button>Action</Button>
</div>
```

## Do's & Don'ts

### ✅ DO

```tsx
// Use design tokens
className='bg-primary text-primary-foreground'

// Use spacing scale
className='gap-4 p-6'

// Use semantic HTML
<button className='...'> not <div onClick='...'>

// Use Tailwind utilities
className='rounded-md border border-border'

// Group related spacing
className='space-y-2'  // for child spacing
```

### ❌ DON'T

```tsx
// Hardcode colors
className='bg-purple-900 text-white'

// Use arbitrary values
className='p-[15px] gap-[13px]'

// Mix margin and gap
className='gap-4 m-4'  // Choose one approach

// Create custom classes
className='custom-shadow'  // Use Tailwind utilities

// Ignore accessibility
<div onClick={...}>  // Use <button>
```

## Responsive Breakpoints

```
Mobile:   < 640px    (sm breakpoint)
Tablet:   640-1024px (md breakpoint)
Desktop:  > 1024px   (lg breakpoint)
```

## Focus States

All interactive elements should have visible focus:

```tsx
className='focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2'
```

## Accessibility Checklist

- [ ] Buttons have proper `type` attribute
- [ ] Icon-only buttons have `aria-label`
- [ ] Links use `<a>` tags
- [ ] Forms use `<label>` elements
- [ ] Active nav items have `aria-current='page'`
- [ ] Focus indicators visible
- [ ] Color contrast meets WCAG AA
- [ ] Mobile touch targets ≥ 44x44px

## File Locations

- Design System Docs: `DESIGN_SYSTEM.md`
- Improvements Guide: `DESIGN_IMPROVEMENTS.md`
- Color Tokens: `src/styles/tailwind.css`
- Layout Component: `src/components/layout/Layout.tsx`
- Header Component: `src/components/layout/Header/Header.tsx`
- UI Components: `src/components/ui/`

## Color Palette CSS

```css
:root {
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
  --accent: 217.2 91.2% 59.8%;
  --accent-foreground: 210 40% 98%;
  --secondary: 220 13% 91%;
  --secondary-foreground: 222.2 47.4% 11.2%;
  --muted: 220 13% 91%;
  --muted-foreground: 215.4 16.3% 46.9%;
  --background: 0 0% 100%;
  --foreground: 222.2 47.4% 11.2%;
  --border: 220 13% 91%;
  --input: 220 13% 91%;
  --ring: 217.2 91.2% 59.8%;
  --destructive: 0 84.2% 60.2%;
  --radius: 0.5rem;
}
```

## Need Help?

1. **Color questions?** Check the Color Palette section above
2. **Spacing questions?** Use the 8px spacing scale
3. **Component patterns?** See Component Examples
4. **Accessibility?** Review Accessibility Checklist
5. **Responsive design?** Use Responsive Breakpoints guide

---

Last Updated: 2026-06-30 | Vote Monitor Design System v1.0
