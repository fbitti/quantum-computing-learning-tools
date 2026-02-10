# Bloch Sphere Explorer

## Overview
Interactive 3D Bloch sphere visualization for quantum computing education. Students can apply Rx, Ry, Rz rotation gates using drag-to-rotate crank controls and preset angle buttons. Supports verifying gate equivalences like H = Rz(π/2) Rx(π/2) Rz(π/2).

## Architecture
- Frontend-only app (no database needed)
- Three.js via @react-three/fiber for 3D rendering
- Quaternion-based rotation math in `client/src/lib/quantum.ts`
- Shadcn UI components for control panel

## Key Files
- `client/src/lib/quantum.ts` - Quaternion math, Bloch coordinates, formatting utilities
- `client/src/components/BlochSphere.tsx` - Three.js 3D Bloch sphere canvas
- `client/src/components/CrankControl.tsx` - Drag-to-rotate crank UI
- `client/src/components/ControlPanel.tsx` - All controls: state display, presets, history, gate sequences
- `client/src/pages/BlochSpherePage.tsx` - Main page composing all components

## Running
`npm run dev` starts Express + Vite on port 5000.
