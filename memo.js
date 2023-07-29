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
	x=0;
	y=0;
	px=0;
	py=0;
	difx=0;
	dify=0;
	lookx=0;
	looky=0;
}

main();

function createWorld(){
	floor = createFloor();
	floor.receiveShadow = true;
}


function main(){
	createRender();
	scene = new THREE.Scene(); 
	createCamera(0,0,10);

	createFloor();
	mob1=createCube();
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


	orgM=createOrgModel();
	orgM.position.x=10;
		cubeA=createCube();
		orgM.add(cubeA);
		cubeA.position.x=2;
		cubeA.castShadow=true;
			cubeB=createCube();
			cubeA.add(cubeB);
			cubeB.position.set(2,2,2);
			cubeB.castShadow=true;

	dLight=createDLight(-1,1,0.5); 
	dLight.castShadow=true;
	 
	renderer.shadowMap.enabled = true;
	run();
}
function run() {
	if(flag==1){
		orgM.rotation.y+=0.01;
		cubeA.rotation.z+=0.01;

		//set between 0~2pi
		me.rotation.y=(me.rotation.y+2*Math.PI)%(2*Math.PI);
		axisY.rotation.y=(axisY.rotation.y+2*Math.PI)%(2*Math.PI);
		console.log(axisY.rotation.y);
		console.log(me.rotation.y);

		if(key['w'.charCodeAt(0)-'a'.charCodeAt(0)]==true)
		{
			if(Math.abs(axisY.rotation.y-me.rotation.y)>Math.PI)
			{
				if(me.rotation.y>axisY.rotation.y)
					me.rotation.y+=AngleDiff;
				else
					me.rotation.y-=AngleDiff;
			}
			else
			{
				if(me.rotation.y>axisY.rotation.y)
					me.rotation.y+=AngleDiff;
				else
					me.rotation.y-=AngleDiff;
			}
			// if(axisY.rotation.y-me.rotation.y<=Math.PI)
			// {
			// 	me.rotation.y=(me.rotation.y+AngleDiff)%(2*Math.PI);
			// 	if(me.rotation.y>axisY.rotation.y)
			// 		me.rotation.y=axisY.rotation.y;
			// }
			// else
			// {
			// 	me.rotation.y=(me.rotation.y-AngleDiff)%(2*Math.PI);
			// 	if(me.rotation.y+(2*Math.PI)<axisY.rotation.y)
			// 		me.rotation.y=axisY.rotation.y;
			// }
			// if(me.rotation.y<axisY.rotation.y)
			// {
			// 	if(me.rotation.y+AngleDiff>axisY.rotation.y)
			// 		me.rotation.y=axisY.rotation.y;
			// 	else
			// 		me.rotation.y+=AngleDiff;
			// }	
			// me.rotation.y=me.rotation.y*2/3+axisY.rotation.y/3;
			core.position.z-=0.1*Math.cos(me.rotation.y)
			core.position.x-=0.1*Math.sin(me.rotation.y)
		}
		if(key['s'.charCodeAt(0)-'a'.charCodeAt(0)]==true)
		{
			if(axisY.rotation.y+Math.PI-me.rotation.y<=Math.PI)
			{
				me.rotation.y+=AngleDiff;
				if(me.rotation.y>axisY.rotation.y+Math.PI)
					me.rotation.y=axisY.rotation.y+Math.PI;
			}
			else
			{
				me.rotation.y-=AngleDiff;
				if(me.rotation.y<axisY.rotation.y+Math.PI)
					me.rotation.y=axisY.rotation.y+Math.PI;
			}
			core.position.z-=0.1*Math.cos(me.rotation.y)
			core.position.x-=0.1*Math.sin(me.rotation.y)
		}
		if(key['a'.charCodeAt(0)-'a'.charCodeAt(0)]==true)
		{
			if(me.rotation.y-(axisY.rotation.y+Math.PI)%(2*Math.PI)<Math.PI)
			{
				if(me.rotation.y+AngleDiff>axisY.rotation.y+Math.PI)
					me.rotation.y=axisY.rotation.y+Math.PI;
				else
					me.rotation.y+=AngleDiff;
			}	
			// me.rotation.y=axisY.rotation.y+Math.PI/2;
			core.position.z-=0.1*Math.cos(me.rotation.y)
			core.position.x-=0.1*Math.sin(me.rotation.y)
		}
		if(key['d'.charCodeAt(0)-'a'.charCodeAt(0)]==true)
		{
			me.rotation.y=axisY.rotation.y-Math.PI/2;
			core.position.z-=0.1*Math.cos(me.rotation.y)
			core.position.x-=0.1*Math.sin(me.rotation.y)
		}

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
			axisY.rotation.y-=0.1;
		}
		if(key['l'.charCodeAt(0)-'a'.charCodeAt(0)]==true)
		{
			axisY.rotation.y+=0.1;

			// axisY.rotateY(0.1);
		}
		// console.log(me.rotation.y);




		// ball.rotation.x=mymouse.lookx;
		//camera.rotateX(mymouse.dify/1000);
		// camera.rotation.x=mymouse.lookx;
		//camera.position.applyAxisAngle(new THREE.Vector3(0, 0, 1), 0.01);

		mymouse.dify=0;

		// ball.rotateY(mymouse.difx/100);
		// camera.rotateY(mymouse.difx/1000);

		//camera.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), mymouse.difx);
		//camera.rotateY+=mymouse.difx/100;
		mymouse.difx=0;
	}
	renderer.render(scene, camera);
	requestAnimationFrame(run);
}
document.onkeydown=function(e){
	if(!e) e=window.event;

	key[e.key.charCodeAt(0)-97]=true;
};
document.onkeyup=function(e){
	if(!e) e=window.event;
	
	key[e.key.charCodeAt(0)-97]=false;
}

document.onmousemove=function(e){
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


	mx=e.clientX;
	my=e.clientY;
	
	r=mymouse.px-mymouse.x;
	g=mymouse.y/600;

	orgM.material.color=new THREE.Color(r,g,0);
};
document.onclick=function(e){
	mx=e.clientX/800*6-3;
	my=e.clientY/600*6-3;

	orgM.position.x=mx;
	orgM.position.z=my;
}
function createOrgModel(){
	material=new THREE.MeshPhongMaterial();

	geome=new THREE.Geometry();

	//’¸“_
	geome.vertices.push(new THREE.Vector3(0,0,0));//0
	geome.vertices.push(new THREE.Vector3(2,0,0));//1
	geome.vertices.push(new THREE.Vector3(0,2,0));//2
	geome.vertices.push(new THREE.Vector3(0,0,2));//3

	geome.faces.push(new THREE.Face3(2,1,0));
	geome.faces.push(new THREE.Face3(3,2,0));
	geome.faces.push(new THREE.Face3(1,3,0));
	geome.faces.push(new THREE.Face3(2,3,1));

	geome.computeFaceNormals();
	geome.computeVertexNormals();

	org=new THREE.Mesh(geome, material);
	org.castShadow=true;
	scene.add(org);
	return org;
}


function createDLight(x,y,z){
	light = new THREE.DirectionalLight();  
	light.intensity=0.9;
	light.position.set(x,y,z);   
	
	scene.add(light);
	return light
}

function createCube(){
	geome = new THREE.BoxGeometry(1, 1, 1);
	material = new THREE.MeshPhongMaterial( ); 

	loader = new THREE.TextureLoader();
	texture = loader.load('20004.jpg');
	material.map = texture;

	cube = new THREE.Mesh( geome, material );
	scene.add( cube );
	return cube;
}

function createALight(){
	color = new THREE.Color("rgb(255,100,255)");
	light = new THREE.AmbientLight();  
	light.color.set(color);
	light.intensity=0.9;
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
	color = new THREE.Color("rgb(100,100,255)");
	light = new THREE.PointLight();  
	
	light.color.set(color);
	light.intensity=0.9;
	light.position.set(x,y,z);   
	
	scene.add(light);
	return light
}

function createFloor(){
	geome = new THREE.BoxGeometry(50, 0.01, 50);
	material = new THREE.MeshPhongMaterial( ); 
	plane = new THREE.Mesh( geome, material );
	scene.add( plane );
	return plane;
}
function createCamera(x,y,z){
	camera = new THREE.PerspectiveCamera(45, 
		window.innerWidth / window.innerHeight, 1, 10000);
	camera.position.set(x,y,z);
}
function createBall(){
	geome = new THREE.SphereGeometry(0.5, 30, 30);
	material = new THREE.MeshPhongMaterial( ); 
	ball = new THREE.Mesh( geome, material );
	scene.add( ball ); 
	return ball;
}
function createRender(){
	container = document.getElementById('container');
	renderer = new THREE.WebGLRenderer();             
	renderer.setSize(window.innerWidth, window.innerHeight); 
	container.appendChild(renderer.domElement);  
}
