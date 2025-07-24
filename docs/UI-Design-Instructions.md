# 🎨 UI Design AI Instructions - Coffee Roaster Game

## Context
You are an AI designer creating UI elements for a professional coffee roasting simulation game. The target audience includes coffee professionals, enthusiasts, and educational institutions.

## Design Mission
Create industry-grade UI components that reflect the professionalism of commercial coffee roasting while maintaining educational value and accessibility.

---

## 🎯 Immediate Design Tasks

### Priority 1: Core Game UI Components

#### Coffee Market Interface
```
Component: Bean Selection Cards
Requirements:
- Card size: 280x320px minimum
- Background: Dark coffee brown gradient (#3E2723 to #2E1A17)
- Border: 2px solid coffee medium (#8D6E63), gold on hover (#D4AF37)
- Content hierarchy:
  * Bean image: 200x140px, top center
  * Bean name: 18px Playfair Display Bold, white
  * Origin: 14px Roboto Regular, light gray
  * Price: 16px Roboto Bold, gold color
  * Quality indicators: Star rating system
  * Add to cart button: Primary button style

Interactive States:
- Default: Subtle shadow, medium border
- Hover: Gold border, lifted shadow, scale 1.02
- Selected: Gold background accent, strong shadow
- Loading: Shimmer animation overlay

Professional Details:
- Include origin country flag icons
- Seasonal price indicators (up/down arrows)
- Roast difficulty badges (Beginner/Expert)
- Flavor profile preview icons
```

#### Roasting Lab Control Panel
```
Component: Professional Roasting Controls
Layout: Grid-based, industrial design

Temperature Control:
- Analog-style gauge: 200x200px circular dial
- Range: 0-300°C with color zones
- Colors: Blue (0-100°C), Orange (100-200°C), Red (200-300°C)
- Digital readout: 32px Roboto Mono, white on dark
- Slider control: Temperature gradient background
- Warning indicators: Flashing red at danger levels

Timing Control:
- Digital stopwatch display: 48px Roboto Mono
- Format: MM:SS.ms with precision
- Start/Stop buttons: Large, accessible (60x60px minimum)
- Phase indicators: Progress bar with phase names
- Background: Professional dark panel (#1E1E1E)

Drum Control:
- RPM display: Circular gauge, 0-60 RPM
- Rotation animation: Visual drum with beans
- Speed slider: Horizontal, industrial style
- On/off toggle: Large prominent switch
- Visual feedback: Rotating animation when active
```

#### Quality Analysis Dashboard
```
Component: Professional Cupping Interface
Layout: Scientific analysis design

Quality Score Display:
- Large circular progress indicator: 200x200px
- Score: 0-100 with color coding
- Professional cupping terminology
- Breakdown by attributes (Aroma, Flavor, Body, etc.)

Flavor Profile Wheel:
- Interactive circular chart
- Coffee industry standard categories
- Hover details for each flavor note
- Visual intensity indicators
- Professional color coding

Roast Analysis:
- Timeline visualization of roast progression
- Temperature curve overlay
- Phase markers (First crack, etc.)
- Quality impact indicators
- Comparison with optimal parameters
```

### Priority 2: Navigation and Layout

#### Main Navigation Menu
```
Design: Professional sidebar navigation
Width: 280px, collapsible to 60px icons only
Background: Dark gradient (#1E1E1E to #333333)
Items:
- Home/Dashboard: House icon + "Dashboard"
- Coffee Market: Shopping cart + "Bean Market"  
- Roasting Lab: Fire icon + "Roasting Lab"
- Analytics: Chart icon + "Analytics"
- Settings: Gear icon + "Settings"

Each item:
- Height: 60px
- Typography: 16px Roboto Medium
- Icon: 24x24px, gold color
- Hover: Background highlight, gold accent line
- Active: Strong gold background, white text
```

#### Header Bar
```
Design: Fixed top header, professional appearance
Height: 80px
Background: Dark with subtle gradient
Content:
- Logo: Left side, coffee roaster icon + "Coffee Roaster Pro"
- Player money: Right side, coin icon + amount
- Current time/date: Center, professional clock
- Notifications: Bell icon with badge counter
- User profile: Avatar + name dropdown

Styling:
- Typography: Logo 24px Playfair Display, other text 16px Roboto
- Colors: Gold accents on dark background
- Shadows: Subtle drop shadow for depth
```

### Priority 3: Interactive Elements

#### Professional Sliders and Controls
```
Temperature Slider:
- Track: 300px wide, 8px height
- Background: Gradient from blue to red
- Handle: 24px circle, white with gold border
- Labels: Temperature marks every 50°C
- Precision: Show exact temperature on drag

Quality Meter:
- Style: Professional gauge with needle
- Range: 0-100 with color zones
- Green: 80-100 (Excellent)
- Yellow: 60-79 (Good)  
- Orange: 40-59 (Average)
- Red: 0-39 (Poor)
- Animation: Smooth needle movement

Progress Indicators:
- Roasting progress: Linear bar with phase markers
- Loading states: Coffee bean bouncing animation
- Success states: Green checkmark with coffee steam
- Error states: Red warning with coffee cup icon
```

#### Modal Dialogs and Overlays
```
Modal Design:
- Background: Dark overlay (rgba(0,0,0,0.7))
- Content panel: Rounded corners (12px)
- Width: 600px maximum, responsive
- Shadow: Strong depth shadow
- Close button: X in top right corner

Purchase Confirmation:
- Bean image and details
- Price calculation breakdown
- Confirm/Cancel buttons
- Professional receipt-style layout

Settings Modal:
- Tabbed interface (Audio, Video, Gameplay)
- Professional form styling
- Save/Reset buttons
- Real-time preview where applicable
```

---

## 🎨 Specific Design Requirements

### Color Application Rules
```
Background Hierarchy:
- Page background: #1E1E1E
- Panel backgrounds: #333333
- Card backgrounds: #3E2723
- Input backgrounds: #2E2E2E

Text Hierarchy:
- Primary headings: #FFFFFF
- Secondary text: #CCCCCC  
- Body text: #AAAAAA
- Disabled text: #666666

Interactive Elements:
- Primary buttons: Coffee brown gradient with gold border
- Secondary buttons: Transparent with gold border
- Links: Gold color (#D4AF37)
- Focus states: Gold outline

Status Colors:
- Success: #4CAF50 (green)
- Warning: #FF9800 (orange)
- Error: #F44336 (red)
- Info: #00BCD4 (cyan)
```

### Typography Implementation
```
Heading Styles:
h1: 36px Playfair Display Bold, gold color
h2: 28px Playfair Display Regular, white
h3: 22px Roboto Bold, white
h4: 18px Roboto Medium, light gray

Body Text Styles:
body: 16px Roboto Regular, light gray
small: 14px Roboto Regular, medium gray
caption: 12px Roboto Regular, dark gray

Special Text:
data: 16px Roboto Mono, white (for numbers/measurements)
labels: 14px Roboto Medium, medium gray
buttons: 16px Roboto Medium, varies by button type
```

### Spacing and Layout Rules
```
Component Spacing:
- Between major sections: 48px
- Between related components: 24px
- Between form fields: 16px
- Inside components: 12px
- Micro spacing: 8px

Grid System:
- Desktop: 12 columns, 24px gutters
- Tablet: 8 columns, 20px gutters
- Mobile: 4 columns, 16px gutters

Container Widths:
- Maximum content width: 1200px
- Centered with responsive margins
- Sidebar width: 280px (desktop)
- Mobile: Full width with 16px margins
```

---

## 🔧 Technical Implementation Guides

### CSS Component Architecture
```css
/* Component Base */
.component-card {
  background: var(--color-panel-bg);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  transition: var(--transition-normal);
}

.component-card:hover {
  border-color: var(--color-gold);
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}

/* Button System */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-sm) var(--space-lg);
  border-radius: var(--radius-md);
  font-family: var(--font-primary);
  font-weight: var(--font-weight-medium);
  text-decoration: none;
  transition: var(--transition-fast);
  cursor: pointer;
  border: none;
}

.btn-primary {
  background: linear-gradient(135deg, var(--color-coffee-medium), var(--color-coffee-dark));
  color: var(--color-text-primary);
  border: 2px solid var(--color-gold);
}

.btn-primary:hover {
  background: linear-gradient(135deg, var(--color-coffee-light), var(--color-coffee-medium));
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}
```

### Responsive Design Patterns
```css
/* Mobile First Approach */
.roasting-controls {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-md);
}

@media (min-width: 768px) {
  .roasting-controls {
    grid-template-columns: 1fr 1fr;
  }
}

@media (min-width: 1024px) {
  .roasting-controls {
    grid-template-columns: 1fr 1fr 1fr;
  }
}
```

### Animation Guidelines
```css
/* Subtle Interactions */
.interactive-element {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.interactive-element:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0,0,0,0.3);
}

/* Loading Animations */
@keyframes coffee-steam {
  0% { opacity: 0.3; transform: translateY(0) scale(1); }
  50% { opacity: 0.7; transform: translateY(-10px) scale(1.1); }
  100% { opacity: 0.3; transform: translateY(-20px) scale(1.2); }
}

.loading-steam {
  animation: coffee-steam 2s ease-in-out infinite;
}
```

---

## 📱 Responsive Design Requirements

### Mobile Interface Adaptations
```
Touch Targets:
- Minimum size: 44x44px
- Preferred size: 60x60px for primary actions
- Spacing: 8px minimum between targets

Mobile Navigation:
- Collapsible hamburger menu
- Full-screen overlay navigation
- Large, thumb-friendly buttons
- Swipe gestures for tabs

Control Adaptations:
- Larger sliders with bigger handles
- Tap instead of hover interactions
- Simplified multi-step flows
- Portrait and landscape support
```

### Tablet Optimizations
```
Layout:
- Hybrid mouse/touch interface
- Larger touch targets than desktop
- Maintain visual hierarchy
- Efficient use of larger screen space

Controls:
- Medium-sized interactive elements
- Support both mouse and touch
- Contextual menus and popover
- Multi-column layouts where appropriate
```

---

## ✅ Quality Checklist

### Design Validation
- [ ] Consistent color usage throughout
- [ ] Proper typography hierarchy implemented
- [ ] Interactive states clearly defined
- [ ] Responsive behavior tested
- [ ] Accessibility standards met (WCAG AA)
- [ ] Performance optimized (fast loading)
- [ ] Cross-browser compatibility verified
- [ ] Coffee industry authenticity maintained
- [ ] Educational value preserved
- [ ] Professional appearance achieved

### User Experience Validation
- [ ] Intuitive navigation flow
- [ ] Clear visual feedback
- [ ] Consistent interaction patterns
- [ ] Error prevention and recovery
- [ ] Efficient task completion
- [ ] Engaging visual design
- [ ] Educational content integration
- [ ] Professional learning experience

Remember: Every UI element should reflect the professionalism and precision of the commercial coffee roasting industry while maintaining accessibility and educational value.
