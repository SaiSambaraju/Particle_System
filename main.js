class ThrustParticleSystem{
    //the thrust is meant to be a system which is linked to a specific object, for which this 
    //system becomed the "thrust", these are all the initial paramters set up at construction of the system
    constructor(scene, belongingObject, frequency, lifetime, initial_position){
        this.scene = scene
        this.Emittingfrequency = frequency;
        this.thrustOf = belongingObject; //the object the thrust belongs to
        this.lifetime = lifetime;
        this.gravity = 9;   //simple value no decimals yet
        this.geometry = new THREE.SphereGeometry(0.08, 10, 6);
        this.thrustParticles = [];
        this.pos = initial_position;
        this.SetInitialParticlesPosAndVel(initial_position);
        this.mass = 0.1;    //each particle is given a mass, in future iterations used to calculate force on rocket (rocket physics)

    }


    SetInitialParticlesPosAndVel(position){
        //gives particles a velocity vector and sets their initial position
        //initial position of particles is set using object it belongs to + some added randomness
        var thrust_material = new THREE.MeshBasicMaterial({color: 0xFF7700});
        var thrust_mesh = new THREE.Mesh(this.geometry, thrust_material);
        thrust_mesh.position.x = position.x + (Math.random() * 0.3) + -0.15;            ;
        thrust_mesh.position.y = position.y - 0.5 + (Math.random() * 0.3) + -0.1;
        thrust_mesh.position.z = position.z + (Math.random() * 0.3) + -0.15;
        thrust_mesh.lifetime = this.lifetime;
        thrust_mesh.velocityVector = new THREE.Vector3((Math.random() * 0.04) + -0.02,(Math.random() * -0.1) + -0.05,(Math.random() * 0.04) + -0.02);
        thrust_mesh.lifelived = new THREE.Clock();  //calculate lifetime of each particle
        this.thrustParticles.push(thrust_mesh);
        this.scene.add(thrust_mesh);
        this.prevEmission = new THREE.Clock();      //separate clock to be used for generating new particles to meet frequency quota
    }


    createNew(){
        this.SetInitialParticlesPosAndVel(this.thrustOf.position);  //the thrust system will follow the object it belongs to.
    }

    update(){
        //write logic for travelling with rocket
        // for()//might need to update the list containing the particles before actually tranformng them? 
        for(let x = 0; x < this.thrustParticles.length; x++){
            var particle_life_lived = this.thrustParticles[x].lifelived.getElapsedTime();
            if(this.thrustParticles[x].lifetime > particle_life_lived){
                if(particle_life_lived >= (this.lifetime/4)){//turn the firey particles into smoke after some of their lifetime
                    this.thrustParticles[x].material.color.setHex(0x708c98);
                    this.thrustParticles[x].smokeSpeedDamp = true;
                }
                if(this.thrustParticles[x].position.y <= 0.2){  //detecting collision with the ground, so particles bounce
                    this.thrustParticles[x].needsBounce = true;  
                }
                if(this.thrustParticles[x].needsBounce){ //bounce from collision with the floor
                    this.thrustParticles[x].translateX(this.thrustParticles[x].velocityVector.x);   
                    this.thrustParticles[x].translateY((this.thrustParticles[x].velocityVector.y * -1) / this.gravity);  //dampening factor
                    this.thrustParticles[x].translateZ(this.thrustParticles[x].velocityVector.z);   
                }
                else{
                    if(this.thrustParticles[x].smokeSpeedDamp){ //smoke travels slower than the initial fire particle, so dampen speen
                        this.thrustParticles[x].translateX((this.thrustParticles[x].velocityVector.x/2));     
                        this.thrustParticles[x].translateY((this.thrustParticles[x].velocityVector.y)/2);     
                        this.thrustParticles[x].translateZ((this.thrustParticles[x].velocityVector.z)/2);    
                    }
                    else{
                        this.thrustParticles[x].translateX(this.thrustParticles[x].velocityVector.x);     
                        this.thrustParticles[x].translateY(this.thrustParticles[x].velocityVector.y);     
                        this.thrustParticles[x].translateZ(this.thrustParticles[x].velocityVector.z);     
                    }        
                }        
            }
            else{
                this.scene.remove(this.thrustParticles[x]); //remove the particle from the scene 
                this.thrustParticles.splice(x, 1);  //then remove it from list
                x--; //decrement index
            }
            //while we are looping through we check the frequency and create new particles as appropriate.
            if((1/this.Emittingfrequency) <= this.prevEmission.getElapsedTime()){
                if (this.thrustOf != null){ //dont create any new thrust particles if rocket has gone
                    this.createNew();
                }
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
const light = new THREE.AmbientLight(0xFFFFFF); //trying to add a moon \_(""/)_/
scene.add(light);
geometry = new THREE.CylinderGeometry(0, 0.5, 0.5, 7, 1);
material = new THREE.MeshLambertMaterial();
var rocket = new THREE.Mesh(geometry, material);    //a "rocket"
rocket.mass = 10;
rocket.fuel = 5;

var thrustsys = new ThrustParticleSystem(scene, rocket, 1000, 1.5, new THREE.Vector3(0,0,0)); //particle system, thrust

scene.add(rocket);

camera.position.set(5,5,5);
controls.update();


function compute_force_on_rocket(){
    //how much fuel mass leaves rocket - depends the frequency of the thrust
    //need a new measurement of time for equation to fully work
    // 
    //
    //                  
    //acceleration =  
    //
    //
    //
}


function animate(){
    requestAnimationFrame(animate);

    //compute_force_on_rocket();
    //decrement fuel
    //decrement rocket mass
    rocket.translateY(0.01);    //moving the rocket (simple for now)
    thrustsys.update(); //updating the particle system

    controls.update()   //updating orbital controls

    if (rocket.position.y > 4){
        thrustsys.thrustOf = null;
        scene.remove(rocket);   //removing rocket from scene after some distance
    }

    renderer.render(scene, camera); //render the scene

}

animate();  //animate loop
