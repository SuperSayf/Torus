// import * as THREE from './three.js';
import './style.css';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import gsap from 'gsap';
// import { Light } from './three.js';

//Scene
const scene = new THREE.Scene();

//Create a sphere
const geometry = new THREE.TorusGeometry(4, 1, 8, 100);
const material = new THREE.MeshStandardMaterial({
  color: "#00ff83",
  roughness: 0.5,
  metalness: 0.5,
  //wireframe: true
});
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

//Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
};

//Light
const pointLight = new THREE.PointLight(0xffffff, 1, 100);
pointLight.position.set(10, 0, 10);
pointLight.intensity = 2;
scene.add(pointLight);

//Camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100);
camera.position.z = 20;
scene.add(camera);

//Renderer
const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);

//Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false;
controls.enableZoom = false;
controls.autoRotate = true;
controls.autoRotateSpeed = 1;

//Resize
window.addEventListener("resize", () => {
  //Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  //Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
});

const loop = () => {
  //sphere.position.x = Math.sin(Date.now() / 1000) * 10;
  controls.update();
  window.requestAnimationFrame(loop);
  renderer.render(scene, camera);
}
loop();

//Timeline magic
const tl = gsap.timeline({ defaults: { duration: 1 } });
tl.fromTo(sphere.scale, { x: 0, y: 0, z: 0 }, { x: 1, y: 1, z: 1 })
tl.fromTo('nav', { y: '-100%' }, { y: '0%' }, '-=1')
tl.fromTo('nav', { opacity: 0 }, { opacity: 1 }, '-=0.5')
tl.fromTo('h1', { opacity: 0 }, { opacity: 1 }, '-=0.5')
tl.fromTo('h1', { y: '-100%' }, { y: '0%' }, '-=1')

//Mouse animation color
let mouseDown = false;
window.addEventListener('mousedown', () => {
  mouseDown = true;
}
);
window.addEventListener('mouseup', () => {
  mouseDown = false;
}
);
window.addEventListener('mousemove', (e) => {
  if (mouseDown) {
    let rgb = [ Math.round((e.pageX / sizes.width) * 255), Math.round((e.pageY / sizes.height) * 255), 150 ];

    //Let's make the color change
    let newColor = new THREE.Color(`rgb(${rgb.join(",")})`);
    gsap.to(sphere.material.color, {
      r: newColor.r,
      g: newColor.g,
      b: newColor.b
    }
    );
  }
}
);