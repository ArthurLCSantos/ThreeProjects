import '../styleModelos.css'

import * as THREE from 'three';
import { randInt, randFloat } from 'three/src/math/MathUtils.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const light = new THREE.AmbientLight(0xffffff, 1)
scene.add(light)


function createSphere(radius=1, color=0x0066FF, x, y, z) {
    const geometry = new THREE.SphereGeometry(radius)
    const material = new THREE.MeshLambertMaterial( { color: color } )
    const ball = new THREE.Mesh(geometry, material)
    ball.position.set(x,y,z)
    return ball
}
const numSpheres = 500
for (let i=0; i<numSpheres;i++) {
    const r = randFloat(0.01,1)
    const g = randFloat(0.01,1)
    const b = randFloat(0.01,1)
    const color = new THREE.Color().setRGB(r,g,b)
    console.log(color)
    scene.add(createSphere(1, color,
        randInt(-50,50),
        randInt(-50,50),
        randInt(-50,50)
    ))
}

function animate(t = 0) {
    const time = t * 0.001
    camera.rotation.y = time*0.1;
	renderer.render( scene, camera );
}
renderer.setAnimationLoop( animate );

function windowResize(){
    const w = window.innerWidth;
    const h = window.innerHeight;

    camera.aspect = w / h;
    camera.updateProjectionMatrix();

    renderer.setSize(w, h);
    renderer.setPixelRatio(window.devicePixelRatio); // opcional para melhor qualidade
}
window.addEventListener("resize", windowResize);