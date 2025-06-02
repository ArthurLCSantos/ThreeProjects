import '../styleModelos.css'

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { randInt, randFloat } from 'three/src/math/MathUtils.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.z = 10
let isMobile = window.innerWidth < 480

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const controls = new OrbitControls(camera, renderer.domElement);

controls.enableDamping = false;
controls.dampingFactor = 0.05;
controls.autoRotate = true;
controls.enableZoom = false;
controls.minDistance = 5;
controls.maxDistance = 50;
controls.target.set(0,0,-20)
controls.update();

const light = new THREE.AmbientLight(0xffffff, 1)
scene.add(light)

function createSphere(radius=1, color=0x0066FF, x, y, z) {
    const geometry = new THREE.SphereGeometry(radius)
    const material = new THREE.MeshLambertMaterial( { color: color } )
    const ball = new THREE.Mesh(geometry, material)
    ball.position.set(x,y,z)
    return ball
}

function createAtom(x,y,z) {
    const atom = new THREE.Group()
    const spheres = []
    atom.add(createSphere(2, 0xff0000, x, y, z))
    const numSpheres = 30;
    for (let i = 0; i <= numSpheres; i++) {
        let x1, y1, z1;
        let collision = true;
        let tries = 0;

        while (collision && tries < 1000) {
            const u = Math.random();
            const v = Math.random();
            const theta = u * 2 * Math.PI;
            const phi = Math.acos(2 * v - 1);

            const radius = 2
            x1 = radius * Math.sin(phi) * Math.cos(theta);
            y1 = radius * Math.sin(phi) * Math.sin(theta);
            z1 = radius * Math.cos(phi);

            collision = spheres.some(s => {
                const dx = x1 - s.x;
                const dy = y1 - s.y;
                const dz = z1 - s.z;
                const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
                return dist < 1;
            });

            tries++;
        }

        if (tries >= 1000) {
            continue;
        }

        atom.add(createSphere(0.2, 0x0066ff, x1+x, y1+y, z1+z));
        spheres.push({ x:x1, y:y1, z:z1 });
    }
    return atom
}

const numAtom = randInt(50,100)
const atoms = []
for (let i = 0; i <= numAtom; i++) {
    let x1, y1, z1;
    let collision = true;
    let tries = 0;

    while (collision && tries < 1000) {
        const u = Math.random();
        const v = Math.random();
        const theta = u * 2 * Math.PI;
        const phi = Math.acos(2 * v - 1);

        const radius = 50
        x1 = radius * Math.sin(phi) * Math.cos(theta);
        y1 = radius * Math.sin(phi) * Math.sin(theta);
        z1 = radius * Math.cos(phi);

        collision = atoms.some(s => {
            const dx = x1 - s.x;
            const dy = y1 - s.y;
            const dz = z1 - s.z;
            const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
            return dist < 10;
        });

        tries++;
    }

    if (tries >= 100) {
        continue;
    }
    scene.add(createAtom(x1,y1,z1))
    atoms.push({ x:x1, y:y1, z:z1 });
}

scene.add(createAtom(0,0,-20))

function animate(t = 0) {
    const time = t * 0.001
    //atom.rotation.y = time
    if (!isMobile){controls.update();}
    
	renderer.render( scene, camera );
}
renderer.setAnimationLoop( animate );

function windowResize(){
    const w = window.innerWidth;
    const h = window.innerHeight;
    isMobile = window.innerWidth < 480

    camera.aspect = w / h;
    camera.updateProjectionMatrix();

    renderer.setSize(w, h);
    renderer.setPixelRatio(window.devicePixelRatio); // opcional para melhor qualidade
}
window.addEventListener("resize", windowResize);