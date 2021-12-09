const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75,
    window.innerWidth/ window.innerHeight,
    0.1,
    1000
    );

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry(10,0.1,10);
const material = new THREE.MeshBasicMaterial({color:0x00FF00});
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;

function animate(){
    requestAnimationFrame(animate);

    cube.rotation.x += 0.001;
    cube.rotation.y += 0.001;

    renderer.render(scene, camera);

}

animate();
