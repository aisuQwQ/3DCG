import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

let tLoader = new THREE.TextureLoader();
let gLoader = new GLTFLoader();

let renderer;
let scene;
let camera;
let orgM, cubeA, cubeB; 
let flag=1;
let ball;
let core;
let me;

let axisX;
let axisY;

let AngleDiff=0.1;

let key=new Array(26).fill(false);
let mymouse=new class{
	x=-1;
	y=-1;
	px=0;
	py=0;
	difx=0;
	dify=0;
	lookx=0;
	looky=0;
}
let speed=0.1;

main();
// createOrgModel();

function createWorld(){
	floor = createFloor();
	floor.receiveShadow = true;
}


function main(){
	createRender();
	scene = new THREE.Scene(); 
	createCamera(0,0,10);

	createFloor();
	let mob1=createCube();
	mob1.position.set(2,0,-2);

	core=createBall();
	// core.visible=false;
		me=createCube();
		core.add(me);
		axisY=createCube();
		axisY.visible=false;
		core.add(axisY);
			axisX=createCube();
			axisX.visible=false;
			axisY.add(axisX);
				ball=createBall();
				ball.position.z=3;
				axisX.add(camera);
				axisX.rotation.x=-0.1;

	gLoader.load('./molcar.glb', function(gltf){
		me=gltf.scene;
		core.add(me);
	})


	createSky();
	let panel=createPlane();

	let dLight=createDLight(-1,1,0.5); 
	dLight.castShadow=true;
	let aLight=createALight(-1,1,0.5); 
	 
	renderer.shadowMap.enabled = true;

	run();
}
function run() {
	if(flag==1){

		if(key['i'.charCodeAt(0)-'a'.charCodeAt(0)]==true)
		{
			axisX.rotateX(-0.1);
			console.log(axisX.rotation.x);
			if(axisX.rotation.x<=-Math.PI/2)
				axisX.rotation.x=-Math.PI/2+0.001;
		}
		if(key['k'.charCodeAt(0)-'a'.charCodeAt(0)]==true)
		{
			axisX.rotateX(0.1);
			console.log(axisX.rotation.x);
			if(axisX.rotation.x>=-0.1)
				axisX.rotation.x=-0.1;
		}
		if(key['j'.charCodeAt(0)-'a'.charCodeAt(0)]==true)
		{
			axisY.rotation.y+=0.1;
		}
		if(key['l'.charCodeAt(0)-'a'.charCodeAt(0)]==true)
		{
			axisY.rotation.y-=0.1;
		}


		//set between 0~2pi
		me.rotation.y=(me.rotation.y+2*Math.PI)%(2*Math.PI);
		axisY.rotation.y=(axisY.rotation.y+2*Math.PI)%(2*Math.PI);

		if(key['w'.charCodeAt(0)-97]==true)
		{
			me.rotation.y=axisY.rotation.y;
			core.position.z-=speed*Math.cos(me.rotation.y)
			core.position.x-=speed*Math.sin(me.rotation.y)
		}
		if(key['s'.charCodeAt(0)-97]==true)
		{
			me.rotation.y=axisY.rotation.y+Math.PI;
			core.position.z-=speed*Math.cos(me.rotation.y)
			core.position.x-=speed*Math.sin(me.rotation.y)
		}
		if(key['a'.charCodeAt(0)-97]==true)
		{
			me.rotation.y=axisY.rotation.y+Math.PI/2;
			core.position.z-=speed*Math.cos(me.rotation.y)
			core.position.x-=speed*Math.sin(me.rotation.y)
		}
		if(key['d'.charCodeAt(0)-97]==true)
		{
			me.rotation.y=axisY.rotation.y-Math.PI/2;
			core.position.z-=speed*Math.cos(me.rotation.y)
			core.position.x-=speed*Math.sin(me.rotation.y)
		}



		axisY.rotation.y+=mymouse.difx/100;
		mymouse.difx=0;
		axisX.rotation.x+=mymouse.dify/100;
		mymouse.dify=0;
		if(axisX.rotation.x<=-Math.PI/2)
			axisX.rotation.x=-Math.PI/2+0.001;
		if(axisX.rotation.x>=-0.1)
				axisX.rotation.x=-0.1;
	}
	renderer.render(scene, camera);
	requestAnimationFrame(run);
}
document.onkeydown=function(e){
	if(e.key.length==1)//a-z
	{
		let tmp=e.key.toLowerCase().charCodeAt(0)-97;
		if(0<=tmp&&tmp<=25)
			key[tmp]=true;
	}
	if(e.key=='Shift')
		speed=0.2;
};
document.onkeyup=function(e){
	if(e.key.length==1)//a-z
	{
		let tmp=e.key.toLowerCase().charCodeAt(0)-97;
		if(0<=tmp&&tmp<=25)
			key[tmp]=false;
	}	
	if(e.key=='Shift')
		
		speed=0.1;
}


document.onmousemove=function(e){
	if(mymouse.x==-1)
	{
		mymouse.x=e.clientX;
		mymouse.y=e.clientY;
	}		

	mymouse.px=mymouse.x;
	mymouse.py=mymouse.y;
	mymouse.x=e.clientX;
	mymouse.y=e.clientY;

	mymouse.difx+=(mymouse.px-mymouse.x);
	mymouse.dify+=(mymouse.py-mymouse.y);

	mymouse.lookx+=mymouse.difx/100;
	if(mymouse.lookx>=1)
		mymouse.lookx=1;
	if(mymouse.lookx<=-1)
		mymouse.lookx=-1;
	mymouse.looky+=mymouse.dify;
};


function createDLight(x,y,z){
	let light = new THREE.DirectionalLight();  
	light.intensity=0.7;
	light.position.set(x,y,z);   
	
	scene.add(light);
	return light
}
function createALight(x,y,z){
	let color = new THREE.Color("rgb(255,255,255)");
	let light = new THREE.AmbientLight();  
	light.color.set(color);
	light.intensity=0.3;
	light.position.set(x,y,z);  
	scene.add(light);
	return light
}
function createSLight(x,y,z){
	color = new THREE.Color("rgb(100,255,100)");
	light = new THREE.SpotLight();  
	light.color.set(color);
	light.intensity=0.9;
	light.position.set(x,y,z);  
	light.angle= Math.PI/4;
	scene.add(light);
	return light
}
function createPLight(x,y,z){
	let color = new THREE.Color("rgb(100,100,255)");
	light = new THREE.PointLight();  
	
	light.color.set(color);
	light.intensity=0.9;
	light.position.set(x,y,z);   
	
	scene.add(light);
	return light
}

function createCube(){
	let geome = new THREE.BoxGeometry(1, 1, 1);
	let material = new THREE.MeshPhongMaterial( ); 

	let loader = new THREE.TextureLoader();
	let texture = loader.load('20004.jpg');
	material.map = texture;

	let cube = new THREE.Mesh( geome, material );
	scene.add( cube );
	return cube;
}

function createSky(){
	let geome=new THREE.SphereGeometry(512,32);
	let material=new THREE.MeshPhongMaterial();
	material.side=THREE.DoubleSide;
	// material.color=new THREE.Color(0x00FFFF);
	let texture=tLoader.load('3sky001.jpg');
	material.map=texture;
	let sky=new THREE.Mesh(geome, material);
	scene.add(sky);
}

function createPlane(){
	let geome=new THREE.PlaneGeometry(2,2);
	let material=new THREE.MeshPhongMaterial();
	let loader = new THREE.TextureLoader();
	let texture = loader.load('suzu2.jpg');
	material.map=texture;
	geome.theteStart=Math.PI;
	material.side=THREE.DoubleSide;
	let plane=new THREE.Mesh( geome, material );
	plane.position.set(5,1,0);
	// plane.rotation.x=-Math.PI/2;
	scene.add( plane );
}


function createFloor(){
	let geome = new THREE.PlaneGeometry(190, 100);
	let material = new THREE.MeshPhongMaterial( ); 
	let texture=tLoader.load('grand.png');
	material.map=texture;
	let plane = new THREE.Mesh( geome, material );
	plane.rotation.x=-Math.PI/2;
	scene.add( plane );
	plane.scale.set(0.5,0.5,0.5);
	return plane;
}
function createCamera(x,y,z){
	camera = new THREE.PerspectiveCamera(45, 
		window.innerWidth / window.innerHeight, 1, 10000);
	camera.position.set(x,y,z);
}
function createBall(){
	let geome = new THREE.SphereGeometry(0.5, 30, 30);
	let material = new THREE.MeshPhongMaterial( ); 
	let ball = new THREE.Mesh( geome, material );
	scene.add( ball ); 
	return ball;
}
function createRender(){
	let container = document.getElementById('container');
	renderer = new THREE.WebGLRenderer();             
	renderer.setSize(window.innerWidth, window.innerHeight); 
	container.appendChild(renderer.domElement);  
}
