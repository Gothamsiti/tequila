import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export default class ThreeClass{
    constructor(canvas){
        this.debug = true;

        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.lights = [];

        this.mixer = null;
        this.clock = null;
        
        this.init(canvas);
    }
    async init(canvas){
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color( 0xffffff );
        this.camera = new THREE.PerspectiveCamera( 75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000 );
        this.camera.position.z = 25;
        
        this.renderer = new THREE.WebGLRenderer({canvas:canvas});
        this.renderer.setSize( canvas.clientWidth, canvas.clientHeight );
        this.clock = new THREE.Clock();

        if(this.debug){
            this.controls = new OrbitControls( this.camera, this.renderer.domElement );
        }

        this.initLights();
        await this.loadModel();

        this.animate();
    }

    initLights(){
        const ambientLight = new THREE.AmbientLight( 0x404040 ); // soft white light
        this.scene.add( ambientLight );
    }

    async loadModel(){
        await new Promise((resolve,reject) => {
            const loader = new GLTFLoader();
            loader.load(
                './models/tequila.glb', 
                (gltf) => {
                    // console.log(gltf);
                    gltf.scene.traverse((child) => {
                        if (child instanceof THREE.Mesh) {
                            console.log('mesh',child);
                        }
                    })
    
    
                    this.scene.add(gltf.scene);
                    this.mixer = new THREE.AnimationMixer( this.scene.children[1] );
                    this.handleAnimations(gltf.animations);

                    return resolve();
                },
                (xhr) => {
                    console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
                },
                (error) => {
                    console.log( 'An error happened' );
                }
            )
            
        })
    }

    handleAnimations(animations){
        animations.forEach((clip) => {
            this.mixer.clipAction( clip ).play();
        } );
    }



    animate(){
        this.renderer.render( this.scene, this.camera );
        this.mixer.update(this.clock.getDelta());
        if(this.debug){
            this.controls.update();

        }
        requestAnimationFrame( () => this.animate() );

    }
}