import '../styleModelos.css'

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { randInt, randFloat } from 'three/src/math/MathUtils.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.autoRotate = false;
controls.minDistance = 5;
controls.maxDistance = 50;
controls.target.set(0, 0, -20);


const light = new THREE.AmbientLight(0xffffff, 1)
scene.add(light)

function createSphere(radius=1, color=0x0066FF) {
    const geometry = new THREE.SphereGeometry(radius)
    const material = new THREE.MeshLambertMaterial( { color: color } )
    const ball = new THREE.Mesh(geometry, material)
    return ball
}
function createTorus(radius=1, tubeRadius=1, color=0xffffff) {
    const material = new THREE.MeshLambertMaterial( {color: color} )
    const geometry = new THREE.TorusGeometry(radius, tubeRadius, 30,100)
    const ring = new THREE.Mesh(geometry, material)
    ring.position.z = -20

    return ring
}

const eletrosfera = []
const eletroGroup = new THREE.Group()
const numSpheres = randInt(3,10)
function createEletrosfera(padCenter) {
    for (let i = 0; i <= numSpheres; i++) {
        const distx = padCenter + i + randFloat(0, 6);
        const disty = padCenter + i + randFloat(0, 6);

        const points = [];
        for (let a = 0; a <= 360; a += 5) {
            const rad = a * Math.PI / 180;
            points.push(new THREE.Vector3(Math.cos(rad) * distx, Math.sin(rad) * disty, 0));
        }

        const ellipse = new THREE.CatmullRomCurve3(points);
        ellipse.closed = true;

        const geometry = new THREE.TubeGeometry(ellipse, 100, 0.02, 10, true);
        const material = new THREE.MeshStandardMaterial( {
            color: 0xffffff,
            transparent: true,
            opacity: 0.3,
        });
        const torus = new THREE.Mesh(geometry, material);
        eletroGroup.add(torus);

        // Criação de elétron
        const b = createSphere(0.2);
        const angleRad = (i / numSpheres) * Math.PI * 2;
        b.position.x = Math.cos(angleRad) * distx;
        b.position.y = Math.sin(angleRad) * disty;

        eletrosfera.push({
            mesh: b,
            distx: distx,
            disty: disty,
            angleOffset: angleRad,
        });

        eletroGroup.add(b);
    }
}
createEletrosfera(1)
eletroGroup.position.z = -20
scene.add(eletroGroup)

function createNucleo(numParticles = 100, radius = 1) {
    const group = new THREE.Group();

    for (let i = 0; i < numParticles; i++) {
        // Tenta até achar uma posição não tão sobreposta
        let position;
        let tries = 0;
        do {
            const x = (Math.random() - 0.5) * 2 * radius;
            const y = (Math.random() - 0.5) * 2 * radius;
            const z = (Math.random() - 0.5) * 2 * radius;
            position = new THREE.Vector3(x, y, z);
            tries++;
        } while (position.length() > radius && tries < 10); // mantém dentro da esfera
        
        position.z -= 20

        const color = 0xff0000;
        const sphere = createSphere(0.3, color)
        sphere.position.copy(position);

        group.add(sphere);
    }

    return group;
}
scene.add(createNucleo())

function animate(t = 0) {
    const time = t * 0.001

    for (let e of eletrosfera) {
        const mesh = e.mesh;
        const speed = 0.5;
        const angle = time * speed + e.angleOffset;
        mesh.position.x = Math.cos(angle) * e.distx;
        mesh.position.y = Math.sin(angle) * e.disty;
    }
    controls.update();

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