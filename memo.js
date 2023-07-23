let renderer;
let scene;
let camera;
let orgM, cubeA, cubeB; 
let flag=1;
let ball;
let me;

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
	createCamera(0,1.6,10);

	createFloor();
	
	me=createBall();
		ball=createCube();
		ball.position.x=0;
		ball.add(me);
		me.position.z=-3;

		ball.add(camera);

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
	
		if(key['x'.charCodeAt(0)-'a'.charCodeAt(0)]==true)
		{
			camera.rotation.x=0;
			camera.rotation.y=0;
			camera.rotation.z=0;
		}

		camera.lookAt(me.position);

		y=Math.cos(-ball.rotation.x)
		z=Math.sin(-ball.rotation.x)
		axis=new THREE.Vector3(0,1,-1);
		if(key['w'.charCodeAt(0)-'a'.charCodeAt(0)]==true)
			ball.rotateOnAxis(axis, 0.01);
			// ball.rotateZ(0.1);
		//camera.position.z-=0.1;
		if(key['s'.charCodeAt(0)-'a'.charCodeAt(0)]==true)
			camera.position.z+=0.1;
		if(key['a'.charCodeAt(0)-'a'.charCodeAt(0)]==true)
			camera.position.x-=0.1;
		if(key['d'.charCodeAt(0)-'a'.charCodeAt(0)]==true)
			ball.rotateX(0.1);
			// camera.position.x+=0.1;
		
		if(ball.rotation.y==0)
			ball.rotation.y=0;



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

	//���_
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
	geome = new THREE.SphereGeometry(1, 30, 30);
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
