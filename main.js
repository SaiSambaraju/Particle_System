const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75,
    window.innerWidth/ window.innerHeight,
    0.1,
    1000
    );

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const controls = new THREE.OrbitControls(camera, renderer.domElement);

const geometry = new THREE.BoxGeometry(10,0.2,10);
const grasstexture = new THREE.TextureLoader().load('textures/grassTexture.jpg');
var material = new THREE.MeshBasicMaterial({map: grasstexture});
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.set(5,5,5);
controls.update();

function animate(){
    requestAnimationFrame(animate);

    controls.update()

    renderer.render(scene, camera);

}

animate();
