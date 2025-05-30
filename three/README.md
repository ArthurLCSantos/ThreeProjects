# 🌐 Grade de Cubos em Three.js

Este projeto é um exemplo básico utilizando **Three.js** para renderizar uma grade 3D de cubos com bordas destacadas e controle de órbita. É ideal para fins educacionais ou como base para projetos gráficos mais avançados em WebGL.

## 📸 Demonstração

Renderiza uma grade de cubos (6x6) distribuídos uniformemente em um plano 2D com profundidade Z fixa. Os cubos possuem linhas de aresta visíveis e são iluminados com uma luz direcional. A câmera pode ser manipulada livremente com o mouse (panorâmica, zoom e rotação).

## 🧰 Tecnologias Utilizadas

- [Three.js](https://threejs.org/)
- WebGL (via `WebGLRenderer`)
- OrbitControls (para navegação com o mouse)
- [Vite](https://vitejs.dev/) (para desenvolvimento local rápido)

## 📦 Como Executar

1. Clone este repositório ou copie os arquivos para seu projeto.
2. Instale as dependências e execute com Vite:

```bash
npx vite
```
## 🧠 Estrutura do Código

- **Câmera:** Posição inicial em `(0, 0, 100)`, depois ajustada para `(0, 0, 10)`.
- **Luz:** Uma `DirectionalLight` iluminando a cena.
- **Objetos:** Cubos 3D organizados em uma grade 6x6, com espaçamento proporcional à área definida por `Xmax` e `Ymax`.
- **Controles:** O usuário pode interagir com a câmera usando o mouse (Zoom, Pan e Orbit) graças ao `OrbitControls`.

## 📌 Notas

- O código usa `MeshStandardMaterial` com cor personalizada.
- Cada cubo é envolvido por uma malha de arestas (`EdgesGeometry`) para realce visual.
- O uso de `renderer.setAnimationLoop(animate)` garante que a cena seja continuamente renderizada e interativa.

## 🧹 Melhorias Possíveis

- Tornar a quantidade de cubos configurável via interface.
- Adicionar interatividade aos cubos (ex: hover, click).
- Animar os cubos (rotação, escala etc).
