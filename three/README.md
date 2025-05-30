# 🌐 Cube Grid in Three.js

This project is a basic example using **Three.js** to render a 3D grid of cubes with highlighted edges and orbit controls. It's ideal for educational purposes or as a foundation for more advanced WebGL graphics projects.

## 📸 Demo

Renders a grid of cubes (6x6) evenly distributed across a 2D plane with a fixed Z depth. The cubes have visible edge lines and are illuminated by a directional light. The camera can be freely manipulated with the mouse (panning, zooming, and rotating).

## 🧰 Technologies Used

- https://threejs.org/
- WebGL (via `WebGLRenderer`)
- OrbitControls (for mouse navigation)
- https://vitejs.dev/ (for fast local development)

## 📦 How to Run

1. Install dependencies and run the project with Vite:
```bash
npx vite
```
## 🧠 Code Structure

- Camera: Initially positioned at `(0, 0, 100)`, then adjusted to `(0, 0, 10)`.
- Light: A `DirectionalLight` illuminating the scene.
- Objects: 3D cubes arranged in a 6x6 grid, spaced proportionally to the area defined by `Xmax` and `Ymax`.
- Controls: The user can interact with the camera using the mouse (Zoom, Pan, and Orbit) thanks to `OrbitControls`.

## 📌 Notes

- The code uses a custom-colored `MeshStandardMaterial`.
- Each cube is outlined with `EdgesGeometry` for visual emphasis.
- `renderer.setAnimationLoop(animate)` ensures the scene continuously renders and stays interactive.

## 🧹 Possible Improvements

- Make the number of cubes configurable via a user interface.
- Add interactivity to the cubes (e.g., hover, click).
- Animate the cubes (rotation, scaling, etc.).