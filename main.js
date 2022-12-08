
import * as THREE from 'https://cdn.skypack.dev/three@0.129.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js';
//import { AuidoLoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/AudioLoader.js';
// Setup
var balloon1, balloon2, balloon3, mouse, raycaster, selected = null;

const scene = new THREE.Scene();
scene.background = new THREE.Color( 0x000000 );

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

var raycaster = new THREE.Raycaster(), INTERSECTED;
var mouse = new THREE.Vector2();


var action = null;
var action1 = null;
var action2 = null;
var action3 = null;
const listener = new THREE.AudioListener();



window.addEventListener( 'mousemove', onMouseMove, false );
window.addEventListener( 'click', onClick );

const observer = new IntersectionObserver((entries)=>{
entries.forEach((entry)=>{
  console.log(entry)
  if(entry.isIntersecting){
    entry.target.classList.add('show');
  } else{
    entry.target.classList.remove('show');
  }
});
});
const hiddenelements = document.querySelectorAll('  .left,.about,.light');
hiddenelements.forEach((el) => observer.observe(el));

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.set(-10, 6, 10 );

window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize( e ) {
    containerWidth = window.clientWidth;
    containerHeight = window.clientHeight;
    renderer.setSize( containerWidth, containerHeight );
    camera.aspect = containerWidth / containerHeight;
    camera.updateProjectionMatrix();
}

renderer.render(scene, camera);

// Torus
const loader = new GLTFLoader();

// Lights

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);

const ambientLight = new THREE.AmbientLight(0x404040 );
scene.add(pointLight, ambientLight);





// Helpers

// const lightHelper = new THREE.PointLightHelper(pointLight)
// const gridHelper = new THREE.GridHelper(200, 50);
// scene.add(lightHelper, gridHelper)

// const controls = new OrbitControls(camera, renderer.domElement);


// Background

let mixer;

//  loader.load( 'ISLAND.glb', function ( gltf ) {

//   const model = gltf.scene;
//   model.position.set( 20, -40, -30 );
//   model.scale.set( 1.01, 1.01, 1.01 );
//   scene.add( model );
//   model.rotation.y += 0;
//   model.userData.id = "Island";

// }, undefined, function ( e ) {

//   console.error( e );

// } );

let rocket;
loader.load( 'rocket.glb', function ( gltf ) {

 rocket = gltf.scene;
  rocket.position.set( -100, -15, -20 );
  rocket.scale.set( 6.01, 6.01, 6.01 );
  scene.add( rocket );
  rocket.rotation.z -= Math.PI / 2;


}, undefined, function ( e ) {

  console.error( e );

} );


loader.load( 'stall.glb', function ( gltf ) {

  const model = gltf.scene;
  model.position.set( -10, -65, -20 );
  model.scale.set( 2.51, 3.01, 2.01 );
  scene.add( model );
  model.rotation.y += -5.3;
  

}, undefined, function ( e ) {

  console.error( e );

} );



loader.load( 'balloon2.glb', function ( gltf ) {

  const balloon3 = gltf.scene;
  balloon3.position.set( -12, -55, -20  );
  balloon3.scale.set( 4.01, 4.01, 4.51 );
  scene.add( balloon3 );
  balloon3.rotation.y += -1.3;
  mixer = new THREE.AnimationMixer(balloon3);

  action = mixer.clipAction(gltf.animations[0]);
  action.setLoop( THREE.LoopOnce );
  action1 = mixer.clipAction(gltf.animations[1]);
  action1.setLoop( THREE.LoopOnce );
  action2 = mixer.clipAction(gltf.animations[2]);
  action2.setLoop( THREE.LoopOnce );
  action3 = mixer.clipAction(gltf.animations[3]);
  action3.setLoop( THREE.LoopOnce );



}, undefined, function ( e ) {

  console.error( e );

} );
//const black = new THREE.TextureLoader().load('black.jpg');
//const white = new THREE.TextureLoader().load('normal.jpg');
//scene.background = 'white';
//scene.background = 'black';



const audioLoader = new THREE.AudioLoader();
const ballpop = new THREE.Audio(listener);
audioLoader.load('pop.mp3', function(buffer){
ballpop.setBuffer(buffer);
ballpop.setLoop(false);
ballpop.setVolume(1.0);
});

const Cloader = new THREE.TextureLoader();


const bpx = new THREE.BoxGeometry(5, 5, 5);

const meTexture = [
  new THREE.MeshStandardMaterial( { map: Cloader.load("m.jpg"), } ),
  new THREE.MeshStandardMaterial( { map: Cloader.load("black.jpg"), } ),
  new THREE.MeshStandardMaterial( { map: Cloader.load("sky.jpg"), } ),
  new THREE.MeshStandardMaterial( { map: Cloader.load("sq1.png"), } ),
  new THREE.MeshStandardMaterial( { map: Cloader.load("sq1.png"), } ),
  new THREE.MeshStandardMaterial( { map: Cloader.load("jeff.png"), } ),
];


// loader.load( 'star.glb', function ( gltf ) {

//   const model = gltf.scene;
//   model.position.set( -10, -60, -20 );
//   model.scale.set( 2.51, 3.01, 2.01 );
//   scene.add( model );
//   model.rotation.y += -3.3;
//   model.rotation.x -= Math.PI / 2;
  

// }, undefined, function ( e ) {

//   console.error( e );

// } );


const me = new THREE.Mesh(bpx, meTexture);
me.name = "me";
//scene.add(me);

// Moon

const moonTexture = new THREE.TextureLoader().load('moon.jpg');
const normalTexture = new THREE.TextureLoader().load('normal.jpg');
const sunTexture = new THREE.TextureLoader().load('sun.png');


const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({
    map: moonTexture,
    normalMap: normalTexture,
    
  })
);



const sun = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({
    map: sunTexture,

    
  })
);
moon.name = "moon"
scene.add(moon);
sun.name = "sun"
scene.add(sun);
moon.position.set( 55, 25, -40 );
sun.position.set( 75, 25, -40 );


me.position.z = -10;
me.position.x = 3;

function showL() {
 
  if ( document.getElementsByClassName('left') )
  document.getElementsByClassName('left')[0].style.display='block';
  
}

function showLight() {
 
  if ( document.getElementsByClassName('light') )
  document.getElementsByClassName('light')[0].style.display='block';
  
}

function show1() {
 
  if ( document.getElementsByClassName('about') )
  document.getElementsByClassName('about')[0].style.display='block';
  
}


function sceneToWhite() {
 

    scene.background = new THREE.Color("rgb(255, 250, 205)")
    document.documentElement.style.setProperty('--dark-bg', 'LemonChiffon');
    document.documentElement.style.setProperty('--light-bg', 'black');
}


function sceneToblack() {
 

    scene.background = new THREE.Color(0x00000a)
    document.documentElement.style.setProperty('--dark-bg', 'black');
    document.documentElement.style.setProperty('--light-bg', 'white');
  
}



function onMouseMove( event ) {
  mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}
function onClick(event){
raycaster.setFromCamera(mouse, camera);
const intersects = raycaster.intersectObjects( scene.children );
if (intersects.length > 0 && intersects[ 0 ].object.userData.name == 'Sphere'  ) {
  console.log( intersects[ 0 ].object.userData.name );
  console.log(scene.children);
  
  for ( let i = 0; i < intersects.length; i ++ ) {

  action.stop();  
  action1.stop();
  action2.stop();  
  action3.stop();
  action.play();
  action1.play();
  action2.play();
  action3.play();
 
  showLight()

  }
}
if (intersects.length > 0 && intersects[ 0 ].object.name == 'moon'  )
{
  console.log("HeLLO");
  moon.rotation.y += Math.PI / 2;

  sceneToWhite();
  moon.position.x += 20;
  sun.position.x -= 20;
  
  }
 
  if (intersects.length > 0 && intersects[ 0 ].object.name == 'sun'  )
  {
    console.log("HeLLO");
    moon.rotation.y += Math.PI / 2;
  
    sceneToblack();
    moon.position.x -= 20;
    sun.position.x += 20;
    
    }
  
    
    
  
  
if (intersects.length > 0 && intersects[ 0 ].object.name == 'me'  ){
console.log("HeLLO");
me.rotation.y += Math.PI / 2;
show1();

showL();


}

if (intersects.length > 0  ){
  console.log(intersects[ 0 ].object.name );

  
  
  }
  

}

// Scroll Animation
function moveMoon(){


    moon.position.y += 1.5;

    sun.position.y += 1.5;

}


function hover(){
  
  raycaster.setFromCamera( mouse, camera );
  const intersects = raycaster.intersectObjects( scene.children );

	for ( let i = 0; i < intersects.length; i ++ ) {


	}
}

function moveCamera() {
  const t = document.body.getBoundingClientRect().top;
  const b = document.body.getBoundingClientRect().bottom;

  me.position.x = 3;

  camera.position.z = t * 0.000;
  camera.position.x = t * 0.000;
  camera.position.y = t * 0.0432;
  if(rocket){
    
  rocket.position.x = (b * -.132) - 50;
  rocket.rotation.x += .02;
  
  }
}

document.body.onscroll = moveCamera, moveMoon;
moveCamera();    
moveMoon(); 

// Animation Loop
const clock = new THREE.Clock();
function animate() {

hover();

if(mixer)
  mixer.update(clock.getDelta());

  // controls.update();
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();
