import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const tLoader = new THREE.TextureLoader();
const gLoader = new GLTFLoader();

const container = document.getElementById('container');
const arrow=document.getElementById("arrow");


let renderer;
let scene;
let camera;

let core;
let me;
let axisX;
let axisY;

let AngleDiff=0.05;
let sensitivity=0.005;
let speed=0.1;

let flag=0;
let key=new Array(26).fill(false);
let mymouse=new class{
	x=-1;
	y=-1;
	px=0;
	py=0;
	difx=0;
	dify=0;
}


main();

//PC or Mobile
let touchStart='mousedown';
let touchEnd='mouseup';
if(navigator.userAgent.match(/(iPhone|iPod|Android.*Mobile)/i)){
	touchStart='touchstart';
	touchEnd='touchend';
	arrow.style.visibility='visible';
	console.log(navigator.userAgent);
}else{
	console.log(navigator.userAgent);
}


async function main(){
	createRender();
	scene = new THREE.Scene(); 
	createCamera(0,0,10);

	createFloor();
	createSky();

	core=createBall(0);
		axisY=createCube();
		axisY.visible=false;
		core.add(axisY);
			axisX=createCube();
			axisX.visible=false;
			axisY.add(axisX);
				axisX.add(camera);
				axisX.rotation.x=-0.1;
		gLoader.load('./molcar.glb', function(gltf){
			me=gltf.scene;
			core.add(me);
			flag=1;
		})

	let dLight=createDLight(-1,1,0.5); 
	dLight.castShadow=true;
	let aLight=createALight(-1,1,0.5); 
	 
	renderer.shadowMap.enabled = true;

	run();
}

function run() {
	if(flag)
	{
		//set between 0~2pi
		me.rotation.y=(me.rotation.y+2*Math.PI)%(2*Math.PI);
		axisY.rotation.y=(axisY.rotation.y+2*Math.PI)%(2*Math.PI);
		//本体移動
		let d=key['w'.charCodeAt(0)-97]*1+key['s'.charCodeAt(0)-97]*2+key['d'.charCodeAt(0)-97]*4+key['a'.charCodeAt(0)-97]*8;
		if(d>0)
		{
			let direction=0;
			if(d==1||d==13) direction=0;
			if(d==5) direction=-Math.PI/4;
			if(d==4||d==7) direction=-Math.PI/2;
			if(d==6) direction=-3*Math.PI/4
			if(d==2||d==14) direction=Math.PI;
			if(d==10) direction=3*Math.PI/4;
			if(d==8||d==11) direction=Math.PI/2;
			if(d==9) direction=Math.PI/4;

			direction=(axisY.rotation.y+direction+2*Math.PI)%(2*Math.PI);

			if((me.rotation.y<direction)^(Math.abs(me.rotation.y-direction)<Math.PI))
			{
				if(me.rotation.y<direction)
				{
					if((me.rotation.y-AngleDiff+2*Math.PI)<direction)
						me.rotation.y=direction;
					else
						me.rotation.y-=AngleDiff;
				}
				else
				{
					if((me.rotation.y-AngleDiff)<direction)
						me.rotation.y=direction;
					else
						me.rotation.y-=AngleDiff;
				}
			}
			else
			{
				if(me.rotation.y>direction)
				{
					if((me.rotation.y+AngleDiff)>(direction+2*Math.PI))
						me.rotation.y=direction;
					else
						me.rotation.y+=AngleDiff;
				}
				else
				{
					if((me.rotation.y+AngleDiff)>direction)
						me.rotation.y=direction;
					else
						me.rotation.y+=AngleDiff;
				}
			}
			core.position.z-=speed*Math.cos(me.rotation.y)
			core.position.x-=speed*Math.sin(me.rotation.y)
		}

		//視点移動
		axisY.rotation.y+=mymouse.difx*sensitivity;
		mymouse.difx=0;
		axisX.rotation.x+=mymouse.dify*sensitivity;
		mymouse.dify=0;
		if(axisX.rotation.x<=-Math.PI/2)
			axisX.rotation.x=-Math.PI/2+0.001;
		if(axisX.rotation.x>=-0.1)
				axisX.rotation.x=-0.1;
	}
	renderer.render(scene, camera);
	requestAnimationFrame(run);
}
//WASD
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
//WASDmobile
arrow.addEventListener(touchStart, (e)=>{
	const target=e.target.parentNode.id;
	if(target=='left') key[0]=true;
	if(target=='right') key[3]=true;
	if(target=='up') key[22]=true;
	if(target=='down') key[18]=true;
});
arrow.addEventListener(touchEnd, (e)=>{
	const target=e.target.parentNode.id;
	if(target=='left') key[0]=false;
	if(target=='right') key[3]=false;
	if(target=='up') key[22]=false;
	if(target=='down') key[18]=false;
});

//視点移動mobile
container.addEventListener('touchmove', (e)=>{
	let index;
	for(let i=0; i<e.touches.length; ++i) {
		if(e.touches[i].target==renderer.domElement) {
			index=i;
			break;
		}
	}
	
	if(mymouse.x==-1)
	{
		mymouse.x=e.touches[index].pageX;
		mymouse.y=e.touches[index].pageY;
	}		

	mymouse.px=mymouse.x;
	mymouse.py=mymouse.y;
	mymouse.x=e.touches[index].pageX;
	mymouse.y=e.touches[index].pageY;

	mymouse.difx+=(mymouse.px-mymouse.x);
	mymouse.dify+=(mymouse.py-mymouse.y);
});
container.addEventListener('touchend', ()=>{
	mymouse.x=-1;
});

container.onmousemove=function(e){
	if(document.pointerLockElement==container)//pointer lock on
	{
		mymouse.difx-=e.movementX;
		mymouse.dify-=e.movementY;
	}
	else//pointer lock off
	{
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
	}
};
//ポインタロック
container.onclick=function(){
	container.requestPointerLock();
}

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

	let cube = new THREE.Mesh( geome, material );
	scene.add( cube );
	return cube;
}

function createSky(){
	let geome=new THREE.SphereGeometry(512,32);
	let material=new THREE.MeshPhongMaterial();
	material.side=THREE.DoubleSide;
	let texture=tLoader.load('3sky001.jpg');
	material.map=texture;
	let sky=new THREE.Mesh(geome, material);
	scene.add(sky);
	sky.rotation.z+=Math.PI/2;
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
function createBall(r){
	let geome = new THREE.SphereGeometry(r, 30, 30);
	let material = new THREE.MeshPhongMaterial( ); 
	let ball = new THREE.Mesh( geome, material );
	scene.add( ball ); 
	return ball;
}
function createRender(){
	renderer = new THREE.WebGLRenderer();             
	renderer.setSize(window.innerWidth, window.innerHeight); 
	container.appendChild(renderer.domElement);  
}
