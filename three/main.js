import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const controls = new OrbitControls( camera, renderer.domElement );

let width = window.innerWidth;
let height = window.innerHeight;
let aspect = width/height;


scene = new THREE.Scene();

camera = new THREE.PerspectiveCamera( 45, aspect, 1, 1000 );
camera.position.set(0, 0, 100);

renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight);
document.body.appendChild( renderer.domElement );

const light = new THREE.DirectionalLight( 0xffffff, 3);
light.position.set( 1, 1, 1).normalize();
scene.add( light );


let [quantCubeColumn, quantCubeRow] = [6, 6];
let [Xmax, Ymax] = [10,10]

const material = new THREE.MeshStandardMaterial( {color: 0x004848})

for (let y=0; y < quantCubeRow; y++)
{
    for (let x=0; x < quantCubeColumn; x++)
    {
        const geometry = new THREE.BoxGeometry( 1, 1, 1 )
        const edges = new THREE.EdgesGeometry( geometry );
        const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial( { color: 0x000000 } ) );
        const cube = new THREE.Mesh( geometry, material );
        cube.add(line)

        cube.position.y = ((y/quantCubeRow)*Ymax)-Ymax/2
        cube.position.x = ((x/quantCubeColumn)*Xmax)-Xmax/2

        scene.add(cube)
    }
}
camera.position.z = 10;


function animate()
{
    renderer();
    controls.update();

    
}

renderer.setAnimationLoop( animate );
