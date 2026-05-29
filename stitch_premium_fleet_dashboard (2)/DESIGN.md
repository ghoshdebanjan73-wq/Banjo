---
name: Fleet Precision
colors:
  surface: '#f8f9fa'
  surface-dim: '#d9dadb'
  surface-bright: '#f8f9fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f5'
  surface-container: '#edeeef'
  surface-container-high: '#e7e8e9'
  surface-container-highest: '#e1e3e4'
  on-surface: '#191c1d'
  on-surface-variant: '#444650'
  inverse-surface: '#2e3132'
  inverse-on-surface: '#f0f1f2'
  outline: '#757682'
  outline-variant: '#c5c6d2'
  surface-tint: '#435b9f'
  primary: '#00113a'
  on-primary: '#ffffff'
  primary-container: '#002366'
  on-primary-container: '#758dd5'
  inverse-primary: '#b3c5ff'
  secondary: '#4b53bc'
  on-secondary: '#ffffff'
  secondary-container: '#8991fe'
  on-secondary-container: '#1b218f'
  tertiary: '#00171f'
  on-tertiary: '#ffffff'
  tertiary-container: '#002d3a'
  on-tertiary-container: '#5099b4'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b3c5ff'
  on-primary-fixed: '#00174a'
  on-primary-fixed-variant: '#2a4386'
  secondary-fixed: '#e0e0ff'
  secondary-fixed-dim: '#bfc2ff'
  on-secondary-fixed: '#00006e'
  on-secondary-fixed-variant: '#3239a3'
  tertiary-fixed: '#baeaff'
  tertiary-fixed-dim: '#89d0ed'
  on-tertiary-fixed: '#001f29'
  on-tertiary-fixed-variant: '#004d62'
  background: '#f8f9fa'
  on-background: '#191c1d'
  surface-variant: '#e1e3e4'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 57px
    fontWeight: '700'
    lineHeight: 64px
    letterSpacing: -0.25px
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
  title-lg:
    fontFamily: Inter
    fontSize: 22px
    fontWeight: '500'
    lineHeight: 28px
  title-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '500'
    lineHeight: 24px
    letterSpacing: 0.15px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0.5px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0.25px
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.1px
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.5px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  margin-mobile: 24px
  gutter-mobile: 16px
  card-padding: 20px
  section-gap: 32px
---

## Brand & Style

This design system is engineered for high-end enterprise fleet management, emphasizing trust, operational clarity, and premium craftsmanship. The aesthetic follows a **Corporate / Modern** approach with a strong influence from Material 3 principles, adapted for a luxury SaaS feel. 

The target audience consists of logistics directors and fleet managers who require high-density information presented with zero friction. The UI evokes a sense of "controlled velocity"—fast, reliable, and professional. We prioritize generous whitespace (breathing room) to offset the complexity of logistics data, using subtle glassmorphism for secondary overlays to maintain a sense of depth and modernity.

## Colors

The palette is anchored in professional authority and technical precision.
- **Primary (Royal Blue):** Used for key actions, active states, and branding. It provides a sense of reliability.
- **Secondary (Deep Navy):** Reserved for navigation rails, top app bars, and high-level structural elements to ground the UI.
- **Tertiary (Sky Blue):** An accent for informational badges, progress indicators, and interactive highlights.
- **Surfaces:** A combination of pure White for cards and Light Gray for the background creates a "layered" effect, essential for visual hierarchy in a data-heavy SaaS environment.

## Typography

We utilize **Inter** across all levels for its exceptional legibility on high-resolution Android displays. 
- **Headlines:** Use Semi-Bold (600) weights to establish clear section anchors.
- **Body:** Standardized at 16px for primary reading to ensure accessibility on 6.7-inch devices.
- **Numerical Data:** For fleet metrics (fuel, mileage), use `title-lg` with a slightly tighter letter spacing to emphasize the data as a focal point.

## Layout & Spacing

The layout is optimized for a 6.7-inch vertical form factor using a **12-column fluid grid** for tablets and a **4-column grid** for mobile. 
- **Margins:** A generous 24px side margin is enforced to provide a premium, spacious feel and prevent thumb-clutter.
- **Rhythm:** An 8px linear scale is used. Components are separated by `section-gap` (32px) to ensure the UI feels uncluttered.
- **Safe Areas:** Adhere strictly to the Android status bar and gesture navigation cutouts, ensuring content is centered within the "active" zone of the large screen.

## Elevation & Depth

Hierarchy is achieved through **Tonal Layering** and **Ambient Shadows**.
- **Level 0 (Background):** Light Gray (#F8F9FA).
- **Level 1 (Cards):** White surfaces with a very soft, highly diffused shadow (8% opacity, 12px blur, 4px Y-offset).
- **Level 2 (Modals/Menus):** White surfaces with a 12% opacity shadow and a 1px soft-gray border to define edges without adding visual weight.
- **Interactive Depth:** When a user interacts with a card, elevation increases slightly using a "lift" animation, increasing shadow spread to provide tactile feedback.

## Shapes

To align with the high-end SaaS requirement, we use a consistent **Rounded** language. 
- **Standard Components:** Buttons and input fields use a 12px radius.
- **Containers:** Main dashboard cards and fleet status modules use a **24px radius** (`rounded-xl`) to create a soft, modern containerized look.
- **Icons:** Use the "Rounded" variant of system icons to match the component geometry.

## Components

- **Buttons:** Primary buttons use the Royal Blue fill with white text. Height is set to 56px for optimal touch targets on large screens. Use `title-md` for button labels.
- **Input Fields:** Outlined style with a 1px light gray border. On focus, the border transitions to Royal Blue (2px). Use a subtle Light Gray fill for the inactive state to distinguish from the card background.
- **Cards:** The core of the dashboard. Every card must have a 24px corner radius and include a 20px internal padding. Title areas in cards should be separated by a subtle horizontal divider.
- **Chips:** Used for "Vehicle Status" (e.g., In Transit, Maintenance). These use the `label-sm` type and a 10% opacity tint of the status color (Green for active, Red for alert) to keep the UI clean.
- **Navigation:** A bottom navigation bar for mobile, featuring the Primary color for active states and a semi-transparent blur (Glassmorphism) when scrolled over content.
- **Lists:** Fleet lists should use high-density layouts with 72px row heights, utilizing the `body-md` for secondary details like VIN or driver name.