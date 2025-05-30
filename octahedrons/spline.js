import * as THREE from "three";

const curvePath = [
	new THREE.Vector3(210, 442, -34),
	new THREE.Vector3(81, 365, -189),
	new THREE.Vector3(-93, 436, -278),
	new THREE.Vector3(-315, 345, -235),
	new THREE.Vector3(-377, 437, -10),
	new THREE.Vector3(-310, 340, 155),
	new THREE.Vector3(-111, 443, 258),
	new THREE.Vector3(111, 339, 185),
	new THREE.Vector3(210, 442, -34)]


const points = [];
const len = curvePath.length;

const valores = [[], [], []];

for (let i=0; i < len; i++)
{
	valores[0].push( curvePath[i].x );
	valores[1].push( curvePath[i].y );
	valores[2].push( curvePath[i].z )
}

const maximos = [0, 0, 0];
const minimos = [Infinity, Infinity, Infinity];
const medias =  [];

for (let eixo=0; eixo < 3; eixo++)
{
	for (let i=0; i < len; i++)
	{
		const coord = valores[eixo][i]

		if (coord > maximos[eixo])
		{
			maximos[eixo] = coord
		} else if (coord < minimos[eixo])
		{
			minimos[eixo] = coord
		}
	}

	medias.push( (maximos[eixo] + minimos[eixo])/2 )
}

const pointsCentralized = []
for (let i=0; i < len; i++)
{
	pointsCentralized.push(
		new THREE.Vector3(
			curvePath[i].x - medias[0],
			curvePath[i].y - medias[1],
			curvePath[i].z - medias[2]
		)
	)
}

/*
for (let i=0; i < len; i+=3)
{
    points.push(new THREE.Vector3(
        curvePath[i],
        curvePath[i+1],
        curvePath[i+2]
    ))
}*/

const spline = new THREE.CatmullRomCurve3(pointsCentralized);

export default spline;