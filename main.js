class ThrustParticleSystem{
    constructor(scene, frequency, lifetime, initial_position){
        this.scene = scene
        this.Emittingfrequency = frequency;
        this.lifetime = lifetime;
        this.prevEmission = 0;
        this.geometry = new THREE.SphereGeometry(0.2, 10, 6);
        this.material = new THREE.MeshBasicMaterial({color: 0xFF7700});
        this.thrustParticles = [];
        this.numberOfParticles = 5;
        this.timer = new THREE.Clock();
        this.SetInitialParticlesPos(initial_position);

    }


    SetInitialParticlesPos(position){
        for(let i = 0; i < this.numberOfParticles; i++){
            var thrust_mesh = new THREE.Mesh(this.geometry, this.material);
            thrust_mesh.position.x = position[0] + Math.floor((Math.random() * 1) + -2);
            thrust_mesh.position.y = position[1] + Math.floor((Math.random() * 2) + -1);
            thrust_mesh.position.z = position[2] + Math.floor((Math.random() * 3) + -2);
            this.thrustParticles.push(thrust_mesh);
        }
    }

    addToScene(){
        for(let i = 0; i < this.numberOfParticles; i++){
            this.scene.add(this.thrustParticles[i]);
        }
        
    }

}



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

var thrustsys = new ThrustParticleSystem(scene, 0.2, 3, [0,0,0]);
thrustsys.addToScene();

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
