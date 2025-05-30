# 🌌 THREE.js Experiments Collection

This repository contains a collection of interactive 3D projects built with [Three.js](https://threejs.org/). Each subfolder represents a self-contained visual or physics-based experience, showcasing different aspects of 3D web development.

---

## 📁 Included Projects

### 💠 [`octahedrons/`](./octahedrons/README.md)

A dynamic 3D scene with animated icosahedrons and spheres moving along a smooth central spline. Features include:

- Multiple wireframed and shaded icosahedrons  
- Spheres animated along a `CatmullRomCurve3` path  
- A tube geometry following the spline path  
- Hemisphere lighting and responsive resizing  
- Built with ES6 modules and `Three.js`

### 🧪 [`rapier/`](./rapier/README.md)

A real-time physics sandbox using [Rapier3D](https://rapier.rs/) (via WASM) integrated with `Three.js`, simulating hundreds of falling spheres. Includes:

- Rapier3D physics simulation  
- Wireframed icosahedrons as falling bodies  
- Static ground collider  
- OrbitControls for camera interaction  
- Uses WebAssembly and ES6 modules  

### 🌞 [`SolarSystem/`](./SolarSystem/README.md)

An interactive simulation of the Solar System with textured planets, orbital animations, and camera navigation. Highlights:

- Realistic representations of the Sun and planets  
- Orbiting Earth’s Moon  
- Starfield background  
- Keyboard and mouse navigation  
- Custom shaders for glowing effects  

### 🧊 [`cube-grid/`](./cube-grid/README.md)

A simple and interactive 3D cube grid demo using `Three.js`, perfect as a base for UI or simulation visualizations. Features:

- 6x6 grid of cubes rendered in 3D space  
- Edge-highlighted cubes with `EdgesGeometry`  
- Directional lighting and camera orbit controls  
- Responsive scene rendering using `renderer.setAnimationLoop`  
- Built with `Three.js` and `Vite`

---

## 🚀 Getting Started

Install dependencies and run a local development server with Vite:

```bash
npm install
cd <project-folder>
npx vite
```
Replace project-folder with the name of the project you want to run.