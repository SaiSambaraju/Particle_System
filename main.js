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

var geometry = new THREE.BoxGeometry(10,0.2,10);
const grasstexture = new THREE.TextureLoader().load('textures/grassTexture.jpg');
var material = new THREE.MeshBasicMaterial({map: grasstexture});
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);
geometry = new THREE.CylinderGeometry(0, 0.5, 0.5, 7, 1);
material = new THREE.MeshNormalMaterial();
var rocket = new THREE.Mesh(geometry, material);
// rocket.posiion.z = 5;
scene.add(rocket);

camera.position.set(5,5,5);
controls.update();

function animate(){
    requestAnimationFrame(animate);

    rocket.translateY(0.01);

    controls.update()

    if (rocket.position.y > 5){
        scene.remove(rocket);
    }

    renderer.render(scene, camera);

}

animate();
