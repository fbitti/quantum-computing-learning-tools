# Quantum Computing Practice Tools

## Overview
Multi-tool platform for quantum computing education. Features interactive tools with a shared navigation layout. Currently includes the Bloch Sphere Explorer, with more tools planned.

## Architecture
- Frontend-only app (no database needed)
- Shared `Layout` component with site header, nav, and mobile menu
- `wouter` routing: Home, Bloch Sphere, About, Newsletter, Policies
- Three.js via @react-three/fiber for 3D rendering
- Quaternion-based rotation math in `client/src/lib/quantum.ts`
- Shadcn UI components throughout

## Key Files
- `client/src/App.tsx` - Router with all page routes wrapped in Layout
- `client/src/components/Layout.tsx` - Shared header/nav (desktop + mobile)
- `client/src/pages/HomePage.tsx` - Welcome page with tool cards
- `client/src/pages/BlochSpherePage.tsx` - Bloch Sphere tool (has its own sub-header with back button, reset, help)
- `client/src/pages/AboutPage.tsx` - Placeholder about page
- `client/src/pages/NewsletterPage.tsx` - Placeholder newsletter page
- `client/src/pages/PoliciesPage.tsx` - Placeholder policies page
- `client/src/lib/quantum.ts` - Quaternion math, Bloch coordinates, formatting utilities
- `client/src/components/BlochSphere.tsx` - Three.js 3D Bloch sphere canvas
- `client/src/components/CrankControl.tsx` - Drag-to-rotate crank UI
- `client/src/components/ControlPanel.tsx` - All controls: state display, presets, history, gate sequences

## Design Notes
- Coordinate mapping: Bloch(x,y,z) → Three.js(x,z,y) to make Z vertical
- Animation: 400ms per rotation with ease-in-out, 100ms pause between sequence steps
- crankOffsets state tracks cumulative rotations; cranks sync with presets/gates
- Mobile: h-[100dvh] layout, 40vh sphere height, collapsible mobile nav menu
- Help text: collapsible banner, defaults to closed

## Running
`npm run dev` starts Express + Vite on port 5000.
