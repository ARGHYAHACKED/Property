# 🎨 Property Details Page - Visual Design Reference

## 📐 Page Layout Structure

### Desktop Layout (1024px+)
```
┌──────────────────────────────────────────────────────────┐
│                     NAVIGATION BAR                        │
│  [Back] 55acre                          [Search] [Menu]   │
├──────────────────────────────────────────────────────────┤
│  ┌──────────────────────┐  ┌──────────────────────────┐   │
│  │                      │  │   QUICK INFO (STICKY)    │   │
│  │  MAIN IMAGE          │  │  ┌────────────────────┐  │   │
│  │  [Large Property     │  │  │ Property Title     │  │   │
│  │   Photo]             │  │  │ ₹XXXX (Price)      │  │   │
│  │                      │  │  ├────────────────────┤  │   │
│  │  [◀ Controls ▶]      │  │  │ Location Info      │  │   │
│  │  Counter: 1/12       │  │  │ with map pin       │  │   │
│  │                      │  │  ├────────────────────┤  │   │
│  │  [Thumbnail Strip]   │  │  │ Area | Age         │  │   │
│  │  ▢▢▢▢▢▢▢▢▢▢▢▢       │  │  ├────────────────────┤  │   │
│  │  ▔▔▔▔▔▔▔▔▔▔▔▔       │  │  │ [Contact Agent]    │  │   │
│  │                      │  │  │ [Send Message]     │  │   │
│  │ [♡] [Share]         │  │  ├────────────────────┤  │   │
│  └──────────────────────┘  │  │ [Request Papers]   │  │   │
│                            │  └────────────────────┘  │   │
└────────────────────────────┴──────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│  ┌─────────────────────────┐  ┌──────────────────────┐   │
│  │ ABOUT PROPERTY          │  │ KEY HIGHLIGHTS       │   │
│  │ ─────────────────────   │  │ ──────────────────   │   │
│  │ Full description text   │  │ ✓ Prime Location     │   │
│  │ Lorem ipsum dolor sit   │  │ ✓ Verified Listing   │   │
│  │ amet consectetur...     │  │ ✓ Best Price         │   │
│  │                         │  │ ✓ Expert Support     │   │
│  │ [Details Grid]          │  │                      │   │
│  │ ┌──────┐ ┌──────┐      │  │                      │   │
│  │ │Area  │ │Price │      │  │                      │   │
│  │ │X ac. │ │₹Y/ac │      │  │                      │   │
│  │ └──────┘ └──────┘      │  │                      │   │
│  │ ┌──────┐ ┌──────┐      │  │                      │   │
│  │ │Type  │ │Age   │      │  │                      │   │
│  │ │Res.  │ │X yrs │      │  │                      │   │
│  │ └──────┘ └──────┘      │  │                      │   │
│  │                         │  │                      │   │
│  │ AMENITIES               │  │                      │   │
│  │ ✓ Feature 1             │  │                      │   │
│  │ ✓ Feature 2             │  │                      │   │
│  │ ✓ Feature 3             │  │                      │   │
│  │ ✓ Feature 4             │  │                      │   │
│  └─────────────────────────┘  └──────────────────────┘   │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│  MORE PROPERTIES IN [LOCATION]                           │
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐                 │
│  │ [1]  │  │ [2]  │  │ [3]  │  │ [4]  │                 │
│  │      │  │      │  │      │  │      │                 │
│  │ $$$  │  │ $$$  │  │ $$$  │  │ $$$  │                 │
│  └──────┘  └──────┘  └──────┘  └──────┘                 │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│                       FOOTER                             │
└──────────────────────────────────────────────────────────┘
```

### Tablet Layout (768px)
```
┌──────────────────────────────┐
│     NAVIGATION BAR            │
├──────────────────────────────┤
│ MAIN IMAGE  │  QUICK INFO     │
│             │  ─────────────  │
│  [Large     │  Title          │
│   Photo]    │  Price          │
│             │  Location       │
│  [◀ ▶]      │  Area | Age     │
│  Counter    │  [Buttons]      │
│             │                 │
│  [Thumbs]   │                 │
│                               │
├──────────────────────────────┤
│ ABOUT          │ HIGHLIGHTS    │
│ ──────         │ ──────────    │
│ Description    │ Features      │
│ Details Grid   │ Benefits      │
│ Amenities      │               │
├──────────────────────────────┤
│ RELATED PROPERTIES            │
│ [1]      [2]                 │
│ [3]      [4]                 │
└──────────────────────────────┘
```

### Mobile Layout (375px)
```
┌──────────────┐
│  Nav Bar     │
├──────────────┤
│ MAIN IMAGE   │
│ [Large]      │
│              │
│ [◀  ▶]       │
│ Counter      │
│              │
│ [Thumbnails] │
├──────────────┤
│ QUICK INFO   │
│ Title        │
│ Price        │
│ Location     │
│ Area | Age   │
│ [Buttons]    │
├──────────────┤
│ ABOUT        │
│ Description  │
│ Details      │
│ Amenities    │
├──────────────┤
│ HIGHLIGHTS   │
│ Features     │
├──────────────┤
│ RELATED [1]  │
│ RELATED [2]  │
│ RELATED [3]  │
│ RELATED [4]  │
├──────────────┤
│ FOOTER       │
└──────────────┘
```

---

## 🎨 Color Application

### Background Colors
```
Page Background:           White (#FFFFFF)
Card Backgrounds:          White (#FFFFFF)
Section Backgrounds:       Light Gray (#F3F4F6)
Input Backgrounds:         Gray (#F3F4F6)
Border Colors:            Medium Gray (#E5E7EB) or Black (#000000)
```

### Text Colors
```
Headings (H1, H2, H3):     Black (#000000)
Body Text:                 Dark Gray (#374151)
Secondary Text:            Gray (#6B7280)
Labels:                    Gray (#6B7280)
Light Text (on dark):      White (#FFFFFF)
```

### Interactive Colors
```
Primary Buttons:           Black (#000000)
Button Hover:              Dark Gray (#1F2937)
Button Text:               White (#FFFFFF)
Borders (Active):          Black (#000000)
Borders (Inactive):        Gray (#E5E7EB)
Links (Hover):             Dark Gray (#1F2937)
```

### Accent Colors
```
Success:                   Green (#10B981)
Warning:                   Orange (#F97316)
Error:                     Red (#EF4444)
Info:                      Blue (#3B82F6)
Icon Colors:               Black (#000000)
```

---

## 📐 Typography System

### Font Family
```
Primary:    -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif
Fallback:   Helvetica, Arial, sans-serif
```

### Size Scale
```
Display:    text-5xl, text-6xl, text-7xl   (40px-112px)
Heading 1:  text-4xl                       (36px)
Heading 2:  text-3xl                       (30px)
Heading 3:  text-2xl                       (24px)
Heading 4:  text-xl                        (20px)
Body:       text-base, text-lg             (16px-18px)
Small:      text-sm, text-xs               (14px-12px)
```

### Font Weights
```
Bold:       font-bold (700)    - Headings, CTAs, labels
Semibold:   font-semibold (600) - Subheadings
Regular:    font-normal (400)  - Body text
Light:      font-light (300)   - Secondary text
```

---

## 🔲 Component Dimensions

### Main Image
```
Desktop:   h-500px or h-600px   (620px-750px height)
Tablet:    h-400px              (500px height)
Mobile:    h-300px              (375px height)
Aspect:    16:9 or 4:3
Border:    rounded-2xl
```

### Thumbnail Gallery
```
Desktop:   w-24 h-24            (6rem x 6rem)
Tablet:    w-20 h-20            (5rem x 5rem)
Mobile:    w-16 h-16            (4rem x 4rem)
Border:    rounded-lg, border-2
```

### Cards
```
Width:     full (100%)
Border:    2px, rounded-xl
Padding:   p-6, p-8
Shadow:    shadow-md, hover:shadow-2xl
```

### Buttons
```
Height:    h-12, h-10, h-9      (48px, 40px, 36px)
Padding:   px-6, py-3           (24px x 12px)
Border:    rounded-lg
Width:     full, auto
```

---

## 🎬 Animation & Transitions

### Image Carousel
```
Transition:    smooth (300ms)
Effect:        Fade between images
Thumbnails:    Highlight current
Arrows:        Fade in on hover
```

### Cards & Hovering
```
Scale:         hover:scale-105
Shadow:        shadow-md → shadow-2xl
Border:        border-gray-200 → border-black
Duration:      300ms
Timing:        ease-in-out
```

### Buttons
```
Background:    smooth color transition
Scale:         slight scale on hover
Shadow:        increased on hover
Duration:      200ms
```

### Modals
```
Backdrop:      bg-black/50 (opacity 50%)
Dialog:        Scale up from center
Duration:      300ms
Exit:          Scale down
```

---

## 📏 Spacing System

### Padding (Inside elements)
```
p-2:   8px
p-3:   12px
p-4:   16px
p-6:   24px
p-8:   32px
```

### Margin (Between elements)
```
mb-2:  8px (margin-bottom)
mb-4:  16px
mb-6:  24px
mb-8:  32px
mt-2:  8px (margin-top)
```

### Gap (In grids/flex)
```
gap-2:  8px
gap-3:  12px
gap-4:  16px
gap-6:  24px
gap-8:  32px
```

---

## 🔲 Component Specifications

### Button Styles

#### Primary Button
```
Background:    Black (#000000)
Text:          White (#FFFFFF)
Border:        None
Hover:         Dark Gray (#1F2937)
Size:          h-12 px-8 (48px height)
Radius:        rounded-lg
Shadow:        Hover shadow
Weight:        Bold
```

#### Secondary Button
```
Background:    White (#FFFFFF)
Text:          Black (#000000)
Border:        2px Black (#000000)
Hover:         Light Gray (#F3F4F6)
Size:          h-12 px-8
Radius:        rounded-lg
```

#### Ghost Button
```
Background:    Transparent
Text:          Black (#000000)
Border:        2px Gray (#E5E7EB)
Hover:         Light Gray (#F3F4F6)
Size:          h-10 px-4
Radius:        rounded-lg
```

### Card Styles

#### Property Card
```
Background:    White (#FFFFFF)
Border:        2px Gray (#E5E7EB)
Radius:        rounded-xl
Padding:       p-6
Shadow:        shadow-md
Hover Shadow:  shadow-2xl
Hover Border:  Black (#000000)
```

#### Info Card
```
Background:    Light Gray (#F3F4F6)
Border:        2px Gray or Black
Radius:        rounded-lg
Padding:       p-3 or p-4
Shadow:        None
```

### Input Styles
```
Background:    White (#FFFFFF)
Border:        2px Gray (#E5E7EB)
Focus Border:  2px Black (#000000)
Focus Ring:    ring-2 ring-black
Radius:        rounded-lg
Padding:       px-4 py-3
Text Color:    Gray (#374151)
Placeholder:   Gray (#9CA3AF)
```

---

## 🎯 Interactive States

### Button States
```
Normal:        Black background, white text
Hover:         Darker background, shadow
Active:        Darker color
Disabled:      Gray background, gray text
Focus:         Outline or ring
```

### Card States
```
Normal:        Light gray border
Hover:         Black border, increased shadow
Selected:      Black border, darker background
Disabled:      Grayed out, low opacity
```

### Image States
```
Loading:       Gray placeholder
Loaded:        Full image, sharp
Hover:         Zoom effect (scale-110)
Active:        Highlighted border
```

### Modal States
```
Closed:        Hidden, opacity-0
Open:          Visible, opacity-100
Focus:         Focused elements highlighted
Submitting:    Disabled buttons, loading state
```

---

## 📱 Breakpoints & Responsive

### Screen Sizes
```
Mobile:        0px - 639px      (sm)
Tablet:        640px - 1023px   (md, lg)
Desktop:       1024px+          (xl, 2xl)
```

### Grid Columns
```
Mobile:        grid-cols-1
Tablet:        grid-cols-2
Desktop:       grid-cols-3, grid-cols-4
```

### Display Changes
```
Mobile:        Hidden elements shown
               Simplified layouts
               Full-width elements
               
Tablet:        Two-column layouts
               Balanced spacing
               
Desktop:       Three-column layouts
               Sticky elements
               Full features
```

---

## 🖼️ Image Gallery Details

### Main Image Container
```
Dimensions:    w-full, h-600px
Border:        rounded-2xl
Shadow:        shadow-2xl
Overflow:      hidden
Position:      relative (for overlays)
```

### Image Display
```
Object-Fit:    cover (crops to fit)
Object-Pos:    center
Transform:     group-hover:scale-110
Duration:      300ms
```

### Overlay Controls
```
Position:      absolute (overlay)
Background:    Black with opacity
Duration:      300ms fade
Arrows:        Visible on hover
Counter:       Always visible
```

### Thumbnail Display
```
Border:        2px, active = black, others = gray
Size:          w-24 h-24
Radius:        rounded-lg
Cursor:        pointer
Transition:    300ms
Hover:         Shadow increase
```

---

## 📋 Form & Modal Styling

### Modal Dialog
```
Background:    White (#FFFFFF)
Border:        None (shadow only)
Border-Radius: rounded-2xl
Padding:       p-8
Shadow:        shadow-2xl
Position:      Fixed, centered
Width:         Max-w-md (448px)
```

### Modal Header
```
Heading:       text-2xl font-bold
Margin:        mb-6
Close Button:  Absolute top-right
Color:         Black (#000000)
```

### Modal Body
```
Text:          text-gray-700
Padding:       mb-6
Background:    Light gray highlight box
Border:        Left border 4px black
```

### Modal Footer
```
Button Layout: Flex gap-3
Button Size:   Full width each
Spacing:       mt-6 (top margin)
```

### Checkbox Styling
```
Size:          w-5 h-5
Color:         Accent black
Cursor:        pointer
Label:         Inline text-gray-700
Spacing:       gap-3
```

---

## 🔗 Navigation Elements

### Back Button
```
Layout:        Flex with gap-2
Icon:          ChevronLeft w-5 h-5
Text:          Font-semibold
Color:         Black (#000000)
Hover:         text-gray-600
Position:      Sticky top (z-50)
Background:    White with border-bottom
Padding:       py-4
```

### Breadcrumbs (if used)
```
Separator:     / or >
Color:         Gray (#6B7280)
Active:        Black (#000000)
Hover:         Darker gray
Font:          text-sm
```

---

## 🌟 Special Effects

### Hover Effects
```
Cards:         Scale 1.05 + shadow increase
Images:        Zoom (scale-110) + overlay
Buttons:       Color change + shadow
Text Links:    Underline + color change
Icons:         Color change + scale
```

### Loading States
```
Spinner:       Animated circle
Color:         Black with border-t-2
Size:          h-12 w-12
Text:          "Loading..." message
```

### Empty States
```
Icon:          Larger gray icon
Text:          "No items found"
Color:         Gray (#6B7280)
Spacing:       Centered with margin
```

---

## ✨ Visual Hierarchy

### Emphasis Order
```
1st:  Main heading (Property title) - largest, boldest
2nd:  Price - large, prominent
3rd:  Subheadings - medium size
4th:  Body text - normal size
5th:  Labels - small, gray
```

### Visual Weight
```
Heavy:    Large bold black text
Medium:   Regular black or gray text
Light:    Small gray text
```

### Whitespace
```
Large:    Between major sections
Medium:   Between cards/elements
Small:    Within cards
```

---

## 🎊 Summary

The Property Details page uses:
- **Color Scheme**: Premium black/white/gray
- **Typography**: Clear size hierarchy
- **Spacing**: Consistent padding/margins
- **Components**: Reusable, styled blocks
- **Responsiveness**: Mobile-first design
- **Interactions**: Smooth animations
- **Accessibility**: High contrast, clear labels

All styled with Tailwind CSS classes for easy customization!

