import * as THREE from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import RAPIER from 'https://cdn.skypack.dev/@dimforge/rapier3d-compat@0.11.2';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

await RAPIER.init();
const gravity = {x: 0.0, y: -10, z:0.0}
const world = new RAPIER.World(gravity);

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const controls = new OrbitControls(camera, renderer.domElement);

function groundFunction() {
    const size = 1000
    const boxGeo = new THREE.BoxGeometry( size, 1, size );
    const boxMat = new THREE.MeshStandardMaterial( {
        color: 0x00ffff,
        side: THREE.DoubleSide,
    })
    const boxMesh = new THREE.Mesh( boxGeo, boxMat );
    boxMesh.position.y = -5

    let rigidBodyDescBOX = RAPIER.RigidBodyDesc.fixed().setTranslation(boxMesh.position.x, boxMesh.position.y, boxMesh.position.z);
    let rigidBOX = world.createRigidBody(rigidBodyDescBOX);
    let colliderDescBOX = RAPIER.ColliderDesc.cuboid(size/2, 0.5, size/2)
    .setDensity(400)
    .setFriction(0.01)
    world.createCollider(colliderDescBOX, rigidBOX)
    return {mesh: boxMesh, rigidBOX}
}
const ground = groundFunction();
scene.add(ground.mesh)

function getSpheres()
{
    const size = 0.5
    const density = size * 1;
    const range = 20
    const geometry = new THREE.IcosahedronGeometry( size, 1 );
    const material = new THREE.MeshStandardMaterial(  
        {
            color: 0xffffff,
            flatShading: true,
            side: THREE.DoubleSide 
        });
    const mesh = new THREE.Mesh( geometry, material );

    const wireMat = new THREE.MeshBasicMaterial(
        {
            color: 0xff0000,
            wireframe: true,
        }
    )
    const wireMesh = new THREE.Mesh( geometry, wireMat );

    mesh.add(wireMesh)

    let x0 = Math.random() * range - range*3;
    let y0 = Math.random() * range - range + 10;
    let z0 = Math.random() * range - range*3;

    let rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic()
        .setTranslation(x0, y0, z0)
        .setRotation({w: 1.0, x: 0.0, y: 0.0, z:0.0}, true)
    let rigid = world.createRigidBody(rigidBodyDesc);
    let colliderDesc = RAPIER.ColliderDesc.ball(size)
        .setDensity(density)
        .setRestitution(0.7)
        .setRestitutionCombineRule(RAPIER.CoefficientCombineRule.Max)
        .setFriction(1)
    world.createCollider(colliderDesc, rigid)

    function update() {
        rigid.resetForces(true);
        let {x, y, z} = rigid.translation();
        let pos = new THREE.Vector3(x, y, z);

        //let dirTra = pos.clone().sub(gravity).normalize();
        //rigid.addForce(dirTra.setScalar(1), true);

        mesh.position.set(x,y,z);
        mesh.rotation.set(pos.x, pos.y, pos.z);

    }
    return { mesh, rigid, update }
    
}
const numBalls = 500
const balls = []
for (let i=0; i < numBalls; i++)
{
    const body = getSpheres()
    balls.push(body)
    scene.add(body.mesh)
}

const sunLight = new THREE.HemisphereLight(0xffffff, 0x000000)
scene.add(sunLight)

camera.position.z = 50;

function animate(t=0) {
    requestAnimationFrame( animate );

    world.step();
    balls.forEach((b)=>{b.update()});

    controls.update();
	renderer.render( scene, camera );

}
animate();

function windowResize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    camera.aspect = w/h

    renderer.setSize(w, h)
}

window.addEventListener('resize', windowResize)