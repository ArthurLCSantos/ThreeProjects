import '../styleModelos.css'

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { randInt } from 'three/src/math/MathUtils.js';

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
controls.target.set(0,0,-20)

const light = new THREE.AmbientLight(0xffffff, 1)
scene.add(light)

function createSphere(radius=1, color=0x0066FF) {
    const geometry = new THREE.SphereGeometry(radius)
    const material = new THREE.MeshLambertMaterial( { color: color } )
    const ball = new THREE.Mesh(geometry, material)
    return ball
}
function createTorus(radius, tubeRadius, color=0xffffff) {
    const material = new THREE.MeshLambertMaterial(  {
            color: color,
            transparent: true,
            opacity: 0.3,
        } )
    const geometry = new THREE.TorusGeometry(radius, tubeRadius, 30, 100)
    const ring = new THREE.Mesh(geometry, material)

    return ring
}

const eletrosfera = [[],[],[],[],[],[],[]]
const eletroGroup = new THREE.Group()
function createEletrosfera(padCenter) {
    for (let i=0; i<eletrosfera.length; i++) {
        eletroGroup.add(createTorus(padCenter+i+1.5, 0.02))
        const dist = padCenter+i+1.55
        const numSpheres = randInt(1,4)
        const esp = randInt(1, 180)
        for (let j=0; j <= numSpheres; j++){
            const b = createSphere(0.2)
            const angleRad = (j / numSpheres) * Math.PI * 2 + esp;
            b.position.x = Math.cos(angleRad) * dist;
            b.position.y = Math.sin(angleRad) * dist;
            eletrosfera[i].push(
                {
                    mesh: b,
                    angleOffset: angleRad,
                    distance: dist,
                }
            )
            eletroGroup.add(b)
        }
    }
}
createEletrosfera(1)
eletroGroup.position.z = -20

scene.add(eletroGroup)

function createNucleo(numParticles = 100, radius = 1) {
    const nucleo = new THREE.Group();
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

        const color = i > numParticles*0.5 ? 0xff0000 : 0xffff00;
        const sphere = createSphere(0.3, color)
        sphere.position.copy(position);

        nucleo.add(sphere);
    }

    return nucleo;
}
scene.add(createNucleo())

function animate(t = 0) {
    const time = t * 0.001

    for (let n in eletrosfera) {
        eletrosfera[n].forEach(
            (e)=>{
                const mesh = e.mesh
                const speed = 0.5 + n * 0.001;
                const angle = time *speed + e.angleOffset
                mesh.position.x = Math.cos(angle)*e.distance
                mesh.position.y = Math.sin(angle)*e.distance
        })
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