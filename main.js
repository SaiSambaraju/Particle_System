class ThrustParticleSystem{
    //the thrust is meant to be a system which is linked to a specific object, for which this 
    //system becomed the "thrust", these are all the initial paramters set up at construction of the system
    constructor(scene, belongingObject, frequency, lifetime, initial_position){
        this.scene = scene
        this.Emittingfrequency = frequency;
        this.thrustOf = belongingObject; //the object the thrust belongs to
        this.lifetime = lifetime;
        this.gravity = 9;
        this.geometry = new THREE.SphereGeometry(0.08, 10, 6);
        this.material = new THREE.MeshBasicMaterial({color: 0xFF7700});
        this.thrustParticles = [];
        this.pos = initial_position;
        this.SetInitialParticlesPosAndVel(initial_position);

    }


    SetInitialParticlesPosAndVel(position){
        //gives particles a (velocity vectorcurrently not used) and sets their initial position
        //in future terations will be used for particles to follow a specific object, ie-> this.thrustof
        var thrust_mesh = new THREE.Mesh(this.geometry, this.material);
        thrust_mesh.position.x = position.x + (Math.random() * 1) + -0.5;            ;
        thrust_mesh.position.y = position.y + (Math.random() * 1) + -0.5;
        thrust_mesh.position.z = position.z + (Math.random() * 1) + -0.5;
        thrust_mesh.lifetime = this.lifetime;
        thrust_mesh.velocityVector = new THREE.Vector3((Math.random() * 2) + -1,(Math.random() * 2) + -1,(Math.random() * 2) + -1);
        thrust_mesh.lifelived = new THREE.Clock();
        this.thrustParticles.push(thrust_mesh);
        this.scene.add(thrust_mesh);
        this.prevEmission = new THREE.Clock();
    }


    createNew(){
        this.SetInitialParticlesPosAndVel(this.pos);
    }

    update(){
        //write logic for travelling with rocket
        // for()//might need to update the list containing the particles before actually tranformng them? 
        for(let x = 0; x < this.thrustParticles.length; x++){
            if(this.thrustParticles[x].lifetime > this.thrustParticles[x].lifelived.getElapsedTime()){
                this.thrustParticles[x].translateY(0.1);                
            }
            else{
                this.scene.remove(this.thrustParticles[x]); //remove the particle from the scene 
                this.thrustParticles.splice(x, 1);  //then remove it from list
                x--; //decrement index
            }
            //while we are looping through we check the frequency and create new particles as appropriate.
            if((1/this.Emittingfrequency) <= this.prevEmission.getElapsedTime()){
                this.createNew();
            }
        }
        // console.log(this.thrustParticles.length); foe debbugging purposes

    }

}



const scene = new THREE.Scene();    //creates the scene 
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
var material = new THREE.MeshBasicMaterial({map: grasstexture});    //a grass floor 
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);
geometry = new THREE.CylinderGeometry(0, 0.5, 0.5, 7, 1);
material = new THREE.MeshNormalMaterial();
var rocket = new THREE.Mesh(geometry, material);    //a "rocket"

var thrustsys = new ThrustParticleSystem(scene, rocket, 1000, 5, new THREE.Vector3(0,0,0)); //particle system, thrust

scene.add(rocket);

camera.position.set(5,5,5);
controls.update();





function animate(){
    requestAnimationFrame(animate);

    rocket.translateY(0.01);    //moving the rocket (simple for now)
    thrustsys.update(); //updating the particle system

    controls.update()   //updating orbital controls

    if (rocket.position.y > 5){
        scene.remove(rocket);   //removing rocket from scene after some distance
    }

    renderer.render(scene, camera); //render the scene

}

animate();  //animate loop
