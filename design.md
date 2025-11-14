# 🎨 Visual Design System & Style Guide

## Design Philosophy

This platform embodies a **modern, premium music label aesthetic** — sophisticated yet approachable, with emphasis on audio-first experiences. The design should feel like a high-end recording studio: clean, professional, and focused on the craft.

---

## 🎨 Color Palette

### Primary Colors
- **Background:** `#0A0A0A` (Near black) — Main background
- **Surface:** `#161616` (Dark gray) — Cards, modals, elevated surfaces
- **Surface Elevated:** `#1F1F1F` — Hover states, active elements

### Accent Colors
- **Primary Accent:** `#8B5CF6` (Purple) — CTAs, links, active states
- **Primary Hover:** `#7C3AED` — Hover state for primary accent
- **Success:** `#10B981` (Emerald) — Approved status, success messages
- **Warning:** `#F59E0B` (Amber) — In-review status, warnings
- **Error:** `#EF4444` (Red) — Rejected status, errors, validation
- **Info:** `#3B82F6` (Blue) — Pending status, informational elements

### Text Colors
- **Primary Text:** `#FFFFFF` — Headings, important content
- **Secondary Text:** `#A1A1AA` (Gray 400) — Body text, descriptions
- **Tertiary Text:** `#71717A` (Gray 500) — Metadata, timestamps, subtle text
- **Muted Text:** `#52525B` (Gray 600) — Placeholders, disabled text

### Borders & Dividers
- **Border Default:** `#27272A` (Gray 800) — Subtle borders
- **Border Emphasis:** `#3F3F46` (Gray 700) — Emphasized borders, focus states

---

## 📐 Typography

### Font Family
- **Primary:** `Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
- **Monospace (for BPM, keys, metadata):** `"JetBrains Mono", "Fira Code", Consolas, monospace`

### Type Scale

**Display (Hero sections)**
- Font size: `3.5rem` (56px)
- Font weight: `700` (Bold)
- Line height: `1.1`
- Letter spacing: `-0.02em`

**H1 (Page titles)**
- Font size: `2.5rem` (40px)
- Font weight: `700`
- Line height: `1.2`
- Letter spacing: `-0.01em`

**H2 (Section headers)**
- Font size: `2rem` (32px)
- Font weight: `600`
- Line height: `1.3`

**H3 (Card titles, subsections)**
- Font size: `1.5rem` (24px)
- Font weight: `600`
- Line height: `1.4`

**H4 (Form labels, small headers)**
- Font size: `1.125rem` (18px)
- Font weight: `600`
- Line height: `1.5`

**Body Large**
- Font size: `1.125rem` (18px)
- Font weight: `400`
- Line height: `1.6`

**Body (Default)**
- Font size: `1rem` (16px)
- Font weight: `400`
- Line height: `1.6`

**Body Small**
- Font size: `0.875rem` (14px)
- Font weight: `400`
- Line height: `1.5`

**Caption (Metadata, timestamps)**
- Font size: `0.75rem` (12px)
- Font weight: `500`
- Line height: `1.4`
- Color: Tertiary Text
- Text transform: `uppercase` (when appropriate)
- Letter spacing: `0.05em`

---

## 🧩 Component Patterns

### Cards
- Background: Surface (`#161616`)
- Border: `1px solid` Border Default
- Border radius: `12px`
- Padding: `24px`
- Hover: Subtle lift with `shadow-lg`, border color shifts to Border Emphasis
- Transition: `all 150ms ease-in-out`

### Buttons

**Primary**
- Background: Primary Accent (`#8B5CF6`)
- Text: White
- Padding: `12px 24px`
- Border radius: `8px`
- Font weight: `600`
- Hover: Background shifts to Primary Hover, subtle scale `scale-[1.02]`

**Secondary**
- Background: Surface Elevated (`#1F1F1F`)
- Text: Primary Text
- Border: `1px solid` Border Emphasis
- Hover: Border color brightens, background shifts to `#252525`

**Ghost**
- Background: Transparent
- Text: Secondary Text
- Hover: Background `#1F1F1F`, text shifts to Primary Text

**Destructive**
- Background: Error (`#EF4444`)
- Text: White
- Same padding/radius as primary

### Form Inputs
- Background: Surface Elevated (`#1F1F1F`)
- Border: `1px solid` Border Default
- Border radius: `8px`
- Padding: `12px 16px`
- Font size: Body
- Focus state: Border color Primary Accent, subtle glow `ring-2 ring-purple-500/20`
- Placeholder: Muted Text
- Transition: `all 150ms ease`

### Status Badges
- Border radius: `6px`
- Padding: `4px 12px`
- Font size: Caption
- Font weight: `600`
- Text transform: `uppercase`

**Pending:** Background `#3B82F6/10`, Text `#3B82F6`, Border `1px solid #3B82F6/20`
**In Review:** Background `#F59E0B/10`, Text `#F59E0B`, Border `1px solid #F59E0B/20`
**Approved:** Background `#10B981/10`, Text `#10B981`, Border `1px solid #10B981/20`
**Rejected:** Background `#EF4444/10`, Text `#EF4444`, Border `1px solid #EF4444/20`

### Audio Player Controls
- Use circular buttons with icon-only interface
- Size: `40px × 40px` for primary controls
- Background: Surface Elevated with Border Emphasis border
- Icon color: Primary Text
- Hover: Background lightens to `#252525`, icon color to Primary Accent
- Active state: Primary Accent background, White icon

### Progress Bars
- Background: Surface Elevated (`#1F1F1F`)
- Fill: Primary Accent with gradient `from-purple-600 to-purple-500`
- Height: `8px`
- Border radius: `9999px` (fully rounded)
- Animate: Smooth width transitions `transition-all duration-300`

### Modals & Overlays
- Backdrop: `rgba(0, 0, 0, 0.75)` with backdrop blur `backdrop-blur-sm`
- Modal background: Surface (`#161616`)
- Border: `1px solid` Border Emphasis
- Border radius: `16px`
- Max width: `600px` (forms), `900px` (content-heavy)
- Padding: `32px`
- Shadow: `shadow-2xl`

---

## 🎼 Audio-Specific UI Elements

### Waveform Visualization
- Background: Surface Elevated
- Waveform color: Primary Accent with reduced opacity `#8B5CF6/30`
- Progress overlay: Primary Accent full opacity
- Height: `80px` for inline players, `120px` for detail views
- Border radius: `8px`

### Track Metadata Display
- Use monospace font for: BPM, Key, Duration
- Format: **BPM:** in Caption style, value in Body Small monospace
- Group related metadata with subtle dividers (1px vertical lines)

### File Upload Zone
- Border: `2px dashed` Border Emphasis
- Background: Surface with subtle hover to Surface Elevated
- Border radius: `12px`
- Padding: `48px 24px`
- Hover: Border color shifts to Primary Accent
- Active (dragging): Background Primary Accent/5, border solid Primary Accent

---

## 📏 Spacing System

Use Tailwind's spacing scale consistently:
- **Tight:** `gap-2` (8px) — Related form elements
- **Default:** `gap-4` (16px) — Standard component spacing
- **Comfortable:** `gap-6` (24px) — Section spacing
- **Loose:** `gap-8` (32px) — Major section dividers
- **Spacious:** `gap-12` (48px) — Page-level spacing

**Container Padding:**
- Mobile: `px-4` (16px)
- Tablet: `px-6` (24px)
- Desktop: `px-8` (32px)

**Max Content Width:** `max-w-7xl` (1280px) with `mx-auto`

---

## ⚡ Animation & Transitions

### Default Transitions
- Duration: `150ms` for micro-interactions (hover, focus)
- Duration: `300ms` for larger state changes (modals, panels)
- Easing: `ease-in-out` for most, `ease-out` for entrances

### Hover Effects
- Scale: Subtle `scale-[1.02]` for cards and buttons
- Brightness: Never exceed `brightness-110`
- Shadow: Elevation changes with `shadow-md` → `shadow-lg`

### Loading States
- Use subtle pulse animation for skeleton loaders
- Spinner color: Primary Accent
- Spinner size: `24px` for inline, `40px` for full-page

---

## 📱 Responsive Behavior

### Breakpoints
- **Mobile:** `< 640px` — Single column, larger touch targets
- **Tablet:** `640px - 1024px` — 2-column grids, collapsible sidebar
- **Desktop:** `> 1024px` — Full layout, persistent sidebar

### Mobile Adjustments
- Font sizes scale down 10-15%
- Padding reduces by ~25%
- Buttons become full-width below 640px
- Tables convert to stacked cards

---

## 🎯 Key UI Principles

1. **Audio First:** Every page should feel centered around the music
2. **Clarity Over Decoration:** Information hierarchy is paramount
3. **Purposeful Motion:** Animations should guide attention, not distract
4. **Professional Polish:** Tight spacing, perfect alignment, smooth transitions
5. **Dark Mode Native:** Designed for dark environments, not adapted

---

## 🔤 Iconography

- **Library:** Lucide React (consistent with shadcn)
- **Size:** `16px` for inline icons, `20px` for buttons, `24px` for hero sections
- **Stroke width:** `2px` (default), `1.5px` for larger icons
- **Color:** Inherit from parent text color

---

## 🖼️ Example Component Compositions

### Submission Card
```
[Card with subtle border and shadow]
├─ Header: Artist name (H3) + Timestamp (Caption)
├─ Divider (1px, Border Default)
├─ Track list with mini waveforms
├─ Metadata row: Genre • BPM • Key (monospace)
├─ Status badge (top-right corner)
└─ Action buttons (Ghost style, right-aligned)
```

### Upload Progress
```
[Minimal card]
├─ Filename (Body) + File size (Caption)
├─ Progress bar (8px height, rounded)
├─ Percentage (Caption, right-aligned)
└─ Status icon (Success/Error on completion)
```

Use this guide as context for all component and page generation to ensure visual consistency throughout the platform.