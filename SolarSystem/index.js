import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import { getFresnelMat } from './src/getFresnelMat.js';

const scene = new THREE.Scene();
const cameraPlanets = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight,
    0.1, 100000 );

const cameraTop = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight,
    0.1, 10000000000 );

const renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;

const loader = new THREE.TextureLoader();
const controls = new OrbitControls( cameraTop, renderer.domElement );


function scaleTamanho(tamReal) {return (tamReal/3185.5)*(100/100)}
function scaleDistancia(disReal) { return (disReal/128133)*(70/100)}
function scaleVelocidade(velReal) {return (velReal/20)*(100/100)}

const planetas = []
let atualPlanet = 0
let cameraDirection = new THREE.Vector3();

document.onkeydown = function(evt) {
    if (evt.key == 'ArrowLeft') {
        atualPlanet != planetas.length-1 ? atualPlanet++ : atualPlanet
    } else if (evt.key == 'ArrowRight') {
        atualPlanet != 0 ? atualPlanet-- : atualPlanet
    }
    updateCameraToCurrentPlanet();
}

controls.addEventListener('change', () => {
    updateCameraDirection();
});

const sunLightTarget = new THREE.Object3D();
scene.add(sunLightTarget);

const sunLight = new THREE.DirectionalLight( { color: 0xffffff }, 3)
sunLight.position.set(0,0,0)
sunLight.target = sunLightTarget;
scene.add(sunLight);

function createPlanets(tamanho, url) {
    const Geo = new THREE.SphereGeometry( scaleTamanho(tamanho), 100, 100 );
    const Mat = new THREE.MeshLambertMaterial( {
        map: loader.load(url),
    });
    const Mesh = new THREE.Mesh( Geo, Mat );
    return Mesh
}

function createSun() {
    const group = new THREE.Group()

    const Geo = new THREE.SphereGeometry( scaleTamanho(696350), 100, 100 );
    const Mat = new THREE.MeshBasicMaterial( {
        map: loader.load("./img/2k_sun.jpg"),
    });
    const Mesh = new THREE.Mesh( Geo, Mat );

    group.add(Mesh)
    const SunFresnel = getFresnelMat({rimHex:0xffffff, facingHex:0xffffff})
    const sunGlow = new THREE.Mesh( Geo, SunFresnel)
    group.add(sunGlow)
    sunGlow.scale.setScalar(1.01)

    return group
}
//Sol
const sun = createSun();
planetas.push({body:sun, distance:0})

//Mercúrio
const mercury = createPlanets(2439.7, "./img/planets/mercury/2k_mercury.jpg");
planetas.push({body:mercury, distance:57909227, velocity: 47.9})

function createVenus() {
    const group = new THREE.Group();
    const Geo = new THREE.SphereGeometry( scaleTamanho(6052), 100, 100 );
    const Mat = new THREE.MeshStandardMaterial( {
        map: loader.load("./img/planets/venus/2k_venus_surface.jpg"),
    });
    const Mesh = new THREE.Mesh( Geo, Mat );
    group.add(Mesh)
    const atmosphere = new THREE.MeshStandardMaterial(
    {
        map: loader.load("./img/planets/venus/2k_venus_atmosphere.jpg"),
        opacity:0.9,
        blending: THREE.AdditiveBlending
    })
    const venusAtmosphere = new THREE.Mesh( Geo, atmosphere )
    group.add(venusAtmosphere)
    venusAtmosphere.scale.setScalar(1.01)
    return group
}
//Vênus
const venus = createVenus();
planetas.push({body: venus, distance:108209475, velocity: 35})

function createEarth() {
    const group = new THREE.Group();
    //earth
    const earthGeo = new THREE.SphereGeometry( scaleTamanho(6371), 100, 100 );
    const earthMat = new THREE.MeshPhongMaterial( {
        map: loader.load("./img/planets/earth/2k_earth.jpg"),
        specularMap: loader.load("./img/planets/earth/2k_earth_specular_map.tif")
    });
    const earthMesh = new THREE.Mesh( earthGeo, earthMat );
    group.add(earthMesh)

    //lights
    const lightsMat = new THREE.MeshBasicMaterial(
        {
            map: loader.load("./img/planets/earth/2k_earth_night.jpg"),
            blending: THREE.AdditiveBlending,
        })
    const earthLights = new THREE.Mesh( earthGeo, lightsMat )
    group.add(earthLights)

    //clouds
    const cloudsMat = new THREE.MeshPhongMaterial(
        {
            map: loader.load("./img/planets/earth/2k_earth_clouds.jpg"),
            opacity:0.7,
            blending: THREE.AdditiveBlending,
        })
    const cloudsMesh = new THREE.Mesh( earthGeo, cloudsMat )
    group.add(cloudsMesh)
    cloudsMesh.scale.setScalar(1.01)

    const fresnelMat = getFresnelMat();
    const glowMesh = new THREE.Mesh( earthGeo, fresnelMat );
    group.add(glowMesh)
    glowMesh.scale.setScalar(1.001)

    return group
}
//Terra
const earth = createEarth();
earth.rotation.z = -23.4 * Math.PI / 180;
planetas.push({body:earth, distance:149600000, velocity:27.8})

//Lua
const moon = createPlanets(1737.4, "./img/planets/earth/moon/2k_moon.jpg");
earth.add(moon)
moon.position.set(3, 3, 3)

//Marte
const mars = createPlanets(3389.5, "./img/planets/mars/2k_mars.jpg");
planetas.push({body:mars,distance:227940000, velocity:24.1})

//Júpiter
const jupiter = createPlanets(69910, "./img/planets/jupiter/2k_jupiter.jpg");
planetas.push({body:jupiter,distance:778330000, velocity:13})

function createSaturn() {
    const group = new THREE.Group()

    const Mesh = createPlanets(58230, "./img/planets/saturn/2k_saturn.jpg")
    Mesh.rotation.z = -23.4 * Math.PI / 180;
    group.add(Mesh)

    const geo = new THREE.TorusGeometry( scaleTamanho(100000), 5, 2, 100 ); 
    const mat = new THREE.MeshStandardMaterial( 
        { 
            map: loader.load("./img/planets/saturn/2k_saturn_ring_alpha.png"), 
        }); 
    const torus = new THREE.Mesh( geo, mat )
    torus.rotation.z = -23.4 * Math.PI / 180;
    torus.rotation.x =  Math.PI / 2;
    group.add(torus)

    return group;
}

//Saturno
const saturn = createSaturn();
saturn.rotation.z = -23.4 * Math.PI / 180;
planetas.push({body:saturn, distance:1429400000, velocity:9.6})


//Urano
const uranus = createPlanets(25362, "./img/planets/uranus/2k_uranus.jpg");
planetas.push({body:uranus,distance:2870990000, velocity:6.8})

//Netuno
const neptune = createPlanets(24622, "./img/planets/neptune/2k_neptune.jpg");
planetas.push({body:neptune,distance:4504300000, velocity:5.4})

planetas.forEach((p)=>scene.add(p.body))

function createStars(){
    const starsGeo = new THREE.SphereGeometry( scaleDistancia(10**(20)) );
    const starsMat = new THREE.MeshBasicMaterial( 
        {
            map: loader.load("./img/stars.jpg"),
            side: THREE.DoubleSide,
        })

    const starsMesh = new THREE.Mesh( starsGeo, starsMat )

    return starsMesh
}
const stars = createStars();
scene.add(stars)

function updateCameraToCurrentPlanet() {
    const currentPlanet = planetas[atualPlanet].body;

    // Raio do planeta
    const radius = currentPlanet.geometry
        ? currentPlanet.geometry.parameters.radius
        : currentPlanet.children[0].geometry.parameters.radius;

    // Usa a direção atual (mantida pelo usuário)
    const newPosition = currentPlanet.position.clone().add(cameraDirection.clone().multiplyScalar(radius * 4));
    cameraTop.position.copy(newPosition);

    controls.target.copy(currentPlanet.position);
    controls.update();
}

function updateCameraDirection() {
    const currentPlanet = planetas[atualPlanet].body;
    cameraDirection.copy(cameraTop.position).sub(currentPlanet.position).normalize();
}

function moving(t) {
    const time = t * 0.0001;

    //distâncais dos planetas ao sol
    const rangeMoon = scaleDistancia(384400*2);
    sunLightTarget.position.copy(planetas[atualPlanet].body.position);

    planetas.forEach((planeta)=>{
        if (planeta.distance != 0)
        {
            planeta.body.position.x = scaleDistancia(planeta.distance) * Math.cos( time * scaleVelocidade(planeta.velocity) );
            planeta.body.position.z = scaleDistancia(planeta.distance) * Math.sin( time * scaleVelocidade(planeta.velocity) );

            planeta.body.rotation.y += 0.001
        }
    })
    updateCameraToCurrentPlanet()

    //const firstPlanet = planetas[atualPlanet].body;
    //const dist = firstPlanet.geometry ? firstPlanet.geometry.parameters.radius : firstPlanet.children[0].geometry.parameters.radius;
    //cameraTop.position.set(0, dist * 5, dist * 5); // câmera olhando de cima e afastada
    //controls.target.copy(firstPlanet.position);

    moon.position.x = rangeMoon * Math.cos( 2 * time )
    moon.position.z = rangeMoon * Math.sin( time )
    moon.rotation.y += 0.01

    const zoomMin = 2
    const zoomMax = 5

    //if (planetas[atualPlanet].body.children.length == 0)
    //{
    //controls.maxDistance = planetas[atualPlanet].body.geometry.parameters.radius*zoomMax
    //controls.minDistance = planetas[atualPlanet].body.geometry.parameters.radius*zoomMin
    //} else {
    //controls.maxDistance = planetas[atualPlanet].body.children[0].geometry.parameters.radius*zoomMax
    //controls.minDistance = planetas[atualPlanet].body.children[0].geometry.parameters.radius*zoomMin
    //}  
    
    earth.children[2].rotation.y += 0.001
    venus.children[0].rotation.y += 0.001

}

function animate(t=0){
    renderer.setClearColor( 0xffffff )

    moving(t);

    controls.update();
    renderer.render( scene, cameraTop );
}
renderer.setAnimationLoop( animate );