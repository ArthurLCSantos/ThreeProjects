import * as THREE from "three";
import spline from "./spline.js"

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

function createIcosahedron(){
    const size = 1;
    const detail = 1;

    let x, y, z;

    const range = 100
    x = Math.random()* range - range/2;
    y = Math.random()* range - range/2;
    z = Math.random()* range - range/2;

    const geometry = new THREE.IcosahedronGeometry( size, detail );
    const material = new THREE.MeshStandardMaterial( { color: 0x00ff00, flatShading: true }
    );
    const icosahedron = new THREE.Mesh( geometry, material );

    const lineMat = new THREE.MeshStandardMaterial( { color: 0x888888, wireframe:true });
    const edges = new THREE.Mesh(geometry, lineMat)
    edges.scale.setScalar(1.4)
    icosahedron.add(edges)

    icosahedron.position.set(x, y, z)
    return icosahedron
}

const numIcosa = 100
const icosas = []
for (let i=0; i <= numIcosa; i++)
{
    const body = createIcosahedron();
    icosas.push(body)
    scene.add(body)
}

const tubeGeo = new THREE.TubeGeometry( spline, 100, 10, 20, true )
const tubeMat = new THREE.MeshStandardMaterial( {
    color: 0x00ff00
})
const tubeMesh = new THREE.Mesh( tubeGeo, tubeMat )
scene.add(tubeMesh)
function createSphere() {
    const latheGeo = new THREE.SphereGeometry( 20, 3, 4, Math.PI*2, Math.PI*2, Math.PI*2, Math.PI*2 )
    const latheMat = new THREE.MeshStandardMaterial( {
    color: 0x00ff00,
    side: THREE.DoubleSide
    })
    const latheMesh = new THREE.Mesh( latheGeo, latheMat )
    return latheMesh
}

const numSpheres = 5
const spheres = []
for (let i=0; i <= numSpheres; i++)
{
    const body = createSphere();
    spheres.push({id: i, mesh: body})
    scene.add(body)
}

const sunLight = new THREE.HemisphereLight( 0xffffff, 0x000000)
scene.add(sunLight)

function updateLathePosition(t, latheMesh, id){
    const time = t*0.5;
    const loopTime = 8 * 1000 + id*1000;
    const p = (time % loopTime)/ loopTime;

    const pos = tubeGeo.parameters.path.getPointAt(p);
    const lookAt = tubeGeo.parameters.path.getPointAt((p + 0.03) % 1);
    latheMesh.position.copy(pos);
    latheMesh.lookAt(lookAt)
}

function animate(t = 0) {
    renderer.setClearColor( "#bfe3dd", 0 )

    icosas.forEach((icosa) =>
    {
        icosa.rotation.y += 0.01
        icosa.children.at(0).rotation.y += 0.0125
    })

    spheres.forEach((sphere) =>
    {
        updateLathePosition(t, sphere.mesh, sphere.id);
    })
    camera.rotation.y += 0.001

	renderer.render( scene, camera );
}
renderer.setAnimationLoop( animate );

function windowResize(){
    const w = window.innerWidth;
    const h = window.innerHeight;
    camera.aspect = w/h 
    renderer.setSize(w, h)
}
window.addEventListener("resize", windowResize())