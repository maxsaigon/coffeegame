# 🎨 AI Design Guidelines - Coffee Roaster Game

## Project Overview
Professional coffee roasting simulation game focused on authentic coffee education and realistic industry practices. Target audience: Coffee enthusiasts, professionals, and educational institutions.

---

## 🎯 Design Philosophy

### Core Principles
- **Authenticity**: All elements must reflect real coffee industry standards
- **Professionalism**: High-quality, industry-grade visual design
- **Education**: Visual design supports learning objectives
- **Accessibility**: WCAG AA compliance for inclusive design
- **Performance**: Optimized for 60fps on mid-range devices

### Visual Theme
- **Primary Theme**: Modern industrial coffee roastery
- **Secondary Theme**: Scientific laboratory precision
- **Mood**: Professional, warm, inviting, educational
- **Style**: Clean modern interface with industrial coffee elements

---

## 🖼️ UI Design Guidelines

### Color Palette

#### Primary Colors
```css
/* Coffee Roasting Palette */
--coffee-brown-dark: #3E2723    /* Primary dark brown */
--coffee-brown-medium: #5D4037   /* Medium roast brown */
--coffee-brown-light: #8D6E63    /* Light roast brown */
--coffee-bean-green: #4CAF50     /* Green bean color */
--coffee-cream: #F5F5DC          /* Cream/milk color */

/* Professional UI Colors */
--primary-gold: #D4AF37          /* Professional gold accents */
--ui-dark: #1E1E1E               /* Dark UI background */
--ui-medium: #333333             /* Medium UI elements */
--ui-light: #666666              /* Light UI elements */
--text-primary: #FFFFFF          /* Primary text */
--text-secondary: #CCCCCC        /* Secondary text */

/* Temperature Colors */
--temp-cold: #00BCD4             /* Cold/cooling blue */
--temp-medium: #FF9800           /* Medium temperature orange */
--temp-hot: #F44336              /* High temperature red */
--temp-extreme: #D32F2F          /* Danger/extreme red */

/* Quality Colors */
--quality-excellent: #4CAF50     /* 90-100% quality */
--quality-good: #8BC34A          /* 70-89% quality */
--quality-average: #FFC107       /* 50-69% quality */
--quality-poor: #FF9800          /* 30-49% quality */
--quality-bad: #F44336           /* 0-29% quality */
```

#### Usage Guidelines
- **Backgrounds**: Use dark tones (#1E1E1E, #333333) for professional feel
- **Accents**: Gold (#D4AF37) for premium elements and highlights
- **Interactive Elements**: Coffee browns for buttons and controls
- **Status Indicators**: Temperature and quality color scales
- **Text**: High contrast white/cream on dark backgrounds

### Typography

#### Font Requirements
```
Primary Font: "Roboto" (Professional, Clean, Readable)
- Headers: Roboto Bold (24-48px)
- Body Text: Roboto Regular (14-18px)
- UI Labels: Roboto Medium (12-16px)
- Numbers/Data: Roboto Mono (for precise readings)

Secondary Font: "Playfair Display" (Elegant, Coffee Brand Feel)
- Game Title: Playfair Display Bold (36-72px)
- Section Headers: Playfair Display Regular (20-32px)
- Flavor Descriptions: Playfair Display Italic (16-20px)

Icon Font: "Material Design Icons" or "Coffee Icons"
- UI Controls: Material icons
- Coffee-specific: Custom coffee icons (beans, roaster, cups)
```

#### Typography Hierarchy
```
H1 (Game Title): 48px Playfair Display Bold, Gold
H2 (Scene Headers): 32px Playfair Display Regular, White
H3 (Section Headers): 24px Roboto Bold, Light Brown
H4 (Subsections): 20px Roboto Medium, White
Body Text: 16px Roboto Regular, Light Gray
UI Labels: 14px Roboto Medium, Medium Gray
Data/Numbers: 16px Roboto Mono, White
Small Text: 12px Roboto Regular, Gray
```

### UI Component Guidelines

#### Buttons
```css
/* Primary Action Button */
.button-primary {
  background: linear-gradient(135deg, #8D6E63, #5D4037);
  color: #FFFFFF;
  border: 2px solid #D4AF37;
  border-radius: 8px;
  padding: 12px 24px;
  font: 16px Roboto Medium;
  box-shadow: 0 4px 8px rgba(0,0,0,0.3);
  transition: all 0.3s ease;
}

.button-primary:hover {
  background: linear-gradient(135deg, #A1887F, #6D4C41);
  box-shadow: 0 6px 12px rgba(0,0,0,0.4);
  transform: translateY(-2px);
}

/* Secondary Button */
.button-secondary {
  background: transparent;
  color: #D4AF37;
  border: 2px solid #D4AF37;
  border-radius: 8px;
  padding: 10px 20px;
  font: 14px Roboto Medium;
}

/* Danger/Warning Button */
.button-danger {
  background: linear-gradient(135deg, #F44336, #D32F2F);
  color: #FFFFFF;
  border: none;
  border-radius: 8px;
}
```

#### Panels and Cards
```css
/* Main Panel */
.panel-main {
  background: rgba(30, 30, 30, 0.9);
  border: 1px solid #666666;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.5);
  backdrop-filter: blur(10px);
}

/* Coffee Bean Card */
.bean-card {
  background: linear-gradient(135deg, #3E2723, #2E1A17);
  border: 2px solid #8D6E63;
  border-radius: 16px;
  padding: 20px;
  transition: all 0.3s ease;
}

.bean-card:hover {
  border-color: #D4AF37;
  box-shadow: 0 8px 16px rgba(212, 175, 55, 0.3);
  transform: translateY(-4px);
}
```

#### Controls and Sliders
```css
/* Temperature Slider */
.slider-temperature {
  background: linear-gradient(90deg, #00BCD4, #FF9800, #F44336);
  height: 8px;
  border-radius: 4px;
  position: relative;
}

.slider-handle {
  width: 20px;
  height: 20px;
  background: #FFFFFF;
  border: 3px solid #D4AF37;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
}

/* Quality Indicator */
.quality-indicator {
  background: linear-gradient(90deg, #F44336, #FF9800, #4CAF50);
  height: 12px;
  border-radius: 6px;
  border: 2px solid #333333;
}
```

### Layout Principles

#### Grid System
- **Desktop**: 12-column grid with 24px gutters
- **Tablet**: 8-column grid with 20px gutters  
- **Mobile**: 4-column grid with 16px gutters
- **Responsive Breakpoints**: 1200px, 768px, 480px

#### Spacing Scale
```
Micro: 4px    (tight spacing)
Small: 8px    (component padding)
Base: 16px    (standard spacing)
Medium: 24px  (section spacing)
Large: 32px   (major sections)
XLarge: 48px  (page sections)
XXL: 64px     (page margins)
```

#### Component Positioning
- **Header**: Fixed top, 80px height
- **Navigation**: Left sidebar, 280px width (collapsible)
- **Main Content**: Centered, max-width 1200px
- **Footer**: Sticky bottom, 60px height

---

## 🖼️ Image Asset Guidelines

### Image Style Requirements

#### Photography Style
```
Style: High-quality, professional coffee photography
Lighting: Natural, warm lighting with soft shadows
Color Treatment: Slightly desaturated with brown/gold tint
Composition: Clean, minimal backgrounds
Quality: Minimum 2048x2048px for scalability
Format: PNG with transparency for UI elements, JPG for backgrounds
```

#### Coffee Bean Assets
```
Required Angles: Top view, side view, cross-section
Bean States: Green, light roast, medium roast, dark roast, burnt
File Naming: bean_[variety]_[roast-level]_[angle].png
Resolution: 512x512px minimum
Background: Transparent PNG
Detail Level: High-resolution with visible bean texture
```

#### Equipment and Tools
```
Roasting Drum: 
- Closed and open states
- Multiple angles (front, side, 3/4 view)
- Different sizes (small, medium, large capacity)
- Materials: Stainless steel, copper, cast iron

Temperature Gauge:
- Analog and digital versions
- Range: 0-300°C display
- Warning states (yellow, red zones)
- Professional industrial design

Scales and Measuring Tools:
- Digital precision scales
- Measuring cups and spoons
- Bean sampling tools
- Professional cupping equipment
```

#### UI Decorative Elements
```
Coffee Steam: Animated sprite sheets, 64x64px frames
Coffee Splashes: Vector graphics, scalable
Texture Overlays: Subtle paper, canvas, metal textures
Background Patterns: Coffee bean patterns, industrial textures
Icons: 32x32px, 64x64px, 128x128px (multiple resolutions)
```

### Icon Design Specifications

#### Icon Style Guide
```
Style: Modern flat design with subtle depth
Line Weight: 2-3px consistent stroke
Corner Radius: 4px for rounded elements
Color: Single color with opacity variations
Size: 24x24px base grid, scalable vector
Format: SVG with PNG fallbacks
```

#### Required Icon Set
```
Coffee-Specific Icons:
☕ Coffee Cup, 🫘 Coffee Bean, 🔥 Roaster, 🌡️ Temperature
⏰ Timer, 🥁 Drum, ⚖️ Scale, 🔬 Analysis, 📊 Chart
🛒 Shopping Cart, 💰 Money, ⭐ Quality, ⚠️ Warning

UI Navigation Icons:
🏠 Home, ⚙️ Settings, 📈 Analytics, 📚 Tutorial
🔄 Refresh, ✅ Confirm, ❌ Cancel, ℹ️ Info
▶️ Play, ⏸️ Pause, ⏹️ Stop, 🔄 Reset

Business Icons:
👤 Customer, 📦 Inventory, 💼 Business, 🏆 Achievement
📝 Order, 💳 Payment, 📊 Report, 🎯 Goal
```

---

## 🎵 Audio Design Guidelines

### Audio Style Direction

#### Overall Audio Theme
```
Genre: Ambient industrial with warm coffee shop atmosphere
Mood: Professional, focused, calming, educational
Instrumentation: Subtle electronic, acoustic elements, real coffee sounds
Quality: 44.1kHz, 16-bit minimum, compressed for web delivery
Dynamic Range: Moderate compression for consistent levels
```

#### Coffee-Specific Sound Categories

#### Roasting Process Sounds
```
Bean Dropping: Real coffee beans falling into drum
- Duration: 2-3 seconds
- Volume: Medium
- Frequency: Rich low-mid tones
- File: bean_drop_[intensity].wav

Drum Rotation: Mechanical rotation with subtle bean movement
- Duration: Loopable 5-10 seconds
- Volume: Low background level
- Frequency: Low rumble with occasional bean ticks
- File: drum_rotation_[speed].wav

Temperature Changes: Subtle electronic beeps for alerts
- Duration: 0.5-1 second
- Volume: Medium
- Frequency: Mid-range, non-jarring
- File: temp_alert_[level].wav

First Crack: Real coffee bean cracking sounds
- Duration: 15-30 seconds
- Volume: Medium-high
- Frequency: Sharp crack sounds over background
- File: first_crack_[intensity].wav

Second Crack: More intense cracking with sizzling
- Duration: 10-20 seconds
- Volume: High
- Frequency: Sharper, more frequent cracks
- File: second_crack_[intensity].wav
```

#### User Interface Sounds
```
Button Clicks: Subtle mechanical clicks
- Duration: 0.1-0.2 seconds
- Volume: Low-medium
- Style: Satisfying, premium feel
- File: ui_click_[type].wav

Success/Achievement: Pleasant coffee-themed chimes
- Duration: 1-2 seconds
- Volume: Medium
- Style: Warm, rewarding
- File: success_[level].wav

Warning/Error: Gentle warning tones
- Duration: 0.5-1 second
- Volume: Medium
- Style: Attention-getting but not harsh
- File: warning_[severity].wav

Page Transitions: Subtle whoosh or coffee pour sounds
- Duration: 0.5-1 second
- Volume: Low
- Style: Smooth, professional
- File: transition_[direction].wav
```

#### Ambient Background Music
```
Coffee Market: Upbeat, commercial coffee shop atmosphere
- Tempo: 110-120 BPM
- Instruments: Acoustic guitar, light percussion, ambient pads
- Mood: Energetic but not distracting
- Duration: 3-5 minute loops
- File: bg_market_[variation].ogg

Roasting Lab: Focused, scientific atmosphere
- Tempo: 80-90 BPM
- Instruments: Subtle electronic, ambient textures, minimal percussion
- Mood: Concentrated, professional
- Duration: 5-8 minute loops
- File: bg_roasting_[variation].ogg

Quality Analysis: Contemplative, educational
- Tempo: 70-80 BPM
- Instruments: Soft piano, strings, ambient textures
- Mood: Thoughtful, analytical
- Duration: 3-4 minute loops
- File: bg_analysis_[variation].ogg
```

### Audio Implementation Specifications

#### File Formats and Compression
```
Music: OGG Vorbis, 128kbps, stereo
Sound Effects: WAV uncompressed for quality, MP3 128kbps for web
Naming Convention: [category]_[name]_[variation].[ext]
Organization: /assets/audio/[music|sfx|voice]/
Fallback Support: MP3 for older browsers
```

#### Volume Mixing Guidelines
```
Master Volume: 0dB reference
Music: -12dB to -18dB (background level)
UI SFX: -6dB to -12dB (clear but not dominant)
Process SFX: -3dB to -9dB (important game feedback)
Warning Sounds: -3dB to 0dB (attention-critical)
Voice: -6dB to -3dB (clear speech)
```

---

## 🔤 Font Implementation Guidelines

### Web Font Loading Strategy

#### Font Loading Optimization
```html
<!-- Preload critical fonts -->
<link rel="preload" href="/fonts/Roboto-Regular.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/Roboto-Bold.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/PlayfairDisplay-Regular.woff2" as="font" type="font/woff2" crossorigin>

<!-- Font face declarations with fallbacks -->
@font-face {
  font-family: 'Roboto';
  src: url('/fonts/Roboto-Regular.woff2') format('woff2'),
       url('/fonts/Roboto-Regular.woff') format('woff'),
       url('/fonts/Roboto-Regular.ttf') format('truetype');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
```

#### Font Fallback Stack
```css
/* Primary Font Stack */
font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', 
             'Helvetica Neue', Arial, sans-serif;

/* Elegant Header Stack */
font-family: 'Playfair Display', Georgia, 'Times New Roman', serif;

/* Monospace Data Stack */
font-family: 'Roboto Mono', 'Consolas', 'Monaco', monospace;
```

### Typography Accessibility

#### Readability Requirements
```
Minimum Font Size: 14px on mobile, 16px on desktop
Line Height: 1.4-1.6 for body text, 1.2-1.3 for headers
Letter Spacing: 0.01em for body text, 0.02em for all caps
Contrast Ratio: Minimum 4.5:1 for normal text, 3:1 for large text
Max Line Length: 60-80 characters for optimal readability
```

#### Responsive Typography Scale
```css
/* Mobile First Approach */
:root {
  --font-size-xs: 0.75rem;   /* 12px */
  --font-size-sm: 0.875rem;  /* 14px */
  --font-size-base: 1rem;    /* 16px */
  --font-size-lg: 1.125rem;  /* 18px */
  --font-size-xl: 1.25rem;   /* 20px */
  --font-size-2xl: 1.5rem;   /* 24px */
  --font-size-3xl: 1.875rem; /* 30px */
  --font-size-4xl: 2.25rem;  /* 36px */
}

/* Tablet Scaling */
@media (min-width: 768px) {
  :root {
    --font-size-3xl: 2.25rem;  /* 36px */
    --font-size-4xl: 3rem;     /* 48px */
  }
}

/* Desktop Scaling */
@media (min-width: 1024px) {
  :root {
    --font-size-4xl: 3.75rem;  /* 60px */
  }
}
```

---

## 🎮 Game-Specific Design Requirements

### Coffee Education Integration

#### Visual Learning Elements
```
Infographic Style: Clean, modern educational graphics
Color Coding: Consistent color system for different concepts
Data Visualization: Charts, graphs, progress indicators
Interactive Elements: Hover states reveal additional information
Animation: Subtle transitions that support learning
```

#### Professional Coffee Terminology
```
Roast Levels: Visual gradient from green to black
Temperature Scales: Color-coded temperature ranges
Quality Metrics: Professional cupping score visualization
Bean Origins: World map with origin indicators
Flavor Wheels: Interactive circular flavor profile charts
```

### Accessibility Standards

#### Visual Accessibility
```
Color Blindness: Never rely solely on color for important information
High Contrast Mode: Alternative high contrast theme available
Text Scaling: Support 200% zoom without horizontal scrolling
Focus Indicators: Clear keyboard navigation indicators
Screen Reader: Proper ARIA labels and semantic HTML
```

#### Motor Accessibility
```
Click Targets: Minimum 44px x 44px for touch interfaces
Keyboard Navigation: Full game playable without mouse
Gesture Alternatives: Mouse alternatives for all touch gestures
Timeout Handling: No critical time limits, or adjustable timers
```

---

## 📱 Platform-Specific Guidelines

### Web Browser Optimization

#### Performance Requirements
```
Asset Loading: Progressive loading with placeholders
Image Optimization: WebP with JPG/PNG fallbacks
Font Loading: Critical font subset loading
CSS/JS: Minified and compressed for production
Caching: Aggressive caching for static assets
```

#### Responsive Breakpoints
```
Mobile: 320px - 767px (touch-first interface)
Tablet: 768px - 1023px (hybrid interface)
Desktop: 1024px+ (mouse/keyboard interface)
Large Desktop: 1440px+ (enhanced interface)
```

### Mobile-Specific Considerations

#### Touch Interface Design
```
Touch Targets: Minimum 44px with 8px spacing
Gesture Support: Tap, long press, swipe, pinch
Haptic Feedback: Subtle vibration for important actions
Orientation: Support both portrait and landscape
Safe Areas: Respect device safe areas and notches
```

#### Mobile Performance
```
Image Sizes: Multiple resolutions for different pixel densities
Animation: 60fps smooth animations, reduced motion option
Battery Life: Efficient rendering, minimal background processing
Network: Graceful handling of poor connections
Storage: Minimal local storage usage
```

---

## 🔧 Technical Implementation

### Asset Organization Structure

#### Directory Structure
```
/assets/
  /images/
    /ui/
      /buttons/
      /icons/
      /backgrounds/
    /coffee/
      /beans/
      /equipment/
      /process/
    /characters/
    /environments/
  /audio/
    /music/
    /sfx/
    /voice/
  /fonts/
    /roboto/
    /playfair/
    /icons/
  /data/
    /sprites/
    /animations/
```

#### File Naming Conventions
```
Images: [category]_[name]_[state]_[size].ext
Audio: [category]_[name]_[variation].ext
Fonts: [family]-[weight][style].ext
Sprites: [object]_[animation]_[frame].png
```

### Design Token System

#### CSS Custom Properties
```css
:root {
  /* Colors */
  --color-coffee-dark: #3E2723;
  --color-coffee-medium: #5D4037;
  --color-gold: #D4AF37;
  --color-background: #1E1E1E;
  
  /* Spacing */
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;
  --space-xl: 2rem;
  
  /* Typography */
  --font-family-primary: 'Roboto', sans-serif;
  --font-family-display: 'Playfair Display', serif;
  --font-weight-normal: 400;
  --font-weight-bold: 700;
  
  /* Shadows */
  --shadow-sm: 0 2px 4px rgba(0,0,0,0.1);
  --shadow-md: 0 4px 8px rgba(0,0,0,0.2);
  --shadow-lg: 0 8px 16px rgba(0,0,0,0.3);
  
  /* Transitions */
  --transition-fast: 0.15s ease;
  --transition-normal: 0.3s ease;
  --transition-slow: 0.5s ease;
}
```

---

## 📋 Asset Creation Checklist

### UI Design Checklist
- [ ] Color palette implemented consistently
- [ ] Typography hierarchy established
- [ ] Button states designed (normal, hover, active, disabled)
- [ ] Form elements styled consistently
- [ ] Loading states and animations
- [ ] Error and success message styles
- [ ] Modal and overlay designs
- [ ] Navigation components
- [ ] Responsive layouts tested
- [ ] Accessibility compliance verified

### Image Asset Checklist
- [ ] Coffee bean varieties in all roast states
- [ ] Equipment illustrations (roaster, scales, tools)
- [ ] UI icons in required sizes
- [ ] Background textures and patterns
- [ ] Character illustrations (if applicable)
- [ ] Progress indicators and status graphics
- [ ] High-resolution source files maintained
- [ ] Optimized web formats generated
- [ ] Sprite sheets for animations
- [ ] Responsive image variants

### Audio Asset Checklist
- [ ] Background music loops for each scene
- [ ] UI interaction sound effects
- [ ] Coffee roasting process sounds
- [ ] Alert and notification sounds
- [ ] Success and failure audio feedback
- [ ] Ambient environment sounds
- [ ] Volume levels properly mixed
- [ ] Multiple format exports (OGG, MP3, WAV)
- [ ] Looping points set correctly
- [ ] Fallback audio files created

### Font Implementation Checklist
- [ ] Web fonts properly loaded
- [ ] Fallback fonts defined
- [ ] Font display optimization
- [ ] Typography scale responsive
- [ ] Line height and spacing optimized
- [ ] Font loading performance tested
- [ ] Icon fonts or SVG icons implemented
- [ ] Text accessibility verified
- [ ] Multi-language support considered
- [ ] Font licensing compliance

---

## 🎯 Quality Assurance

### Design Review Criteria

#### Visual Quality Standards
- Consistent visual hierarchy throughout application
- Professional coffee industry appearance
- High contrast and readability
- Smooth animations at 60fps
- Proper color usage for accessibility
- Consistent spacing and alignment
- Professional typography implementation
- Responsive design across all breakpoints

#### User Experience Standards
- Intuitive navigation and information architecture
- Clear visual feedback for all interactions
- Consistent interaction patterns
- Accessible to users with disabilities
- Fast loading times and smooth performance
- Graceful error handling and recovery
- Educational value integrated seamlessly
- Professional learning experience

#### Technical Standards
- Optimized asset sizes and loading
- Cross-browser compatibility
- Mobile-responsive implementation
- SEO-friendly markup and metadata
- Performance metrics within targets
- Security best practices followed
- Maintainable and scalable code structure
- Documentation for all design systems

---

This comprehensive guide provides AI systems with detailed specifications for creating professional, accessible, and educational design assets for the Coffee Roaster Game. All elements should work together to create an immersive, educational experience that reflects the professionalism and authenticity of the coffee roasting industry.
