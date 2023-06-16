import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Stats from 'stats-js'

export default class ThreeClass{
    constructor(canvas){
        this.canvas = canvas;
        this.debug = true;

        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.stats = null;

        this.mixer = null;
        this.clock = null;

        this.modelGroup = new THREE.Group();
        
        this.init(canvas);
    }
    async init(canvas){
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color( 0xffffff );
        this.camera = new THREE.PerspectiveCamera( 75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000 );
        this.camera.position.z = 7;
        
        this.initRenderer()
        this.clock = new THREE.Clock();

        if(this.debug){
            this.controls = new OrbitControls( this.camera, this.renderer.domElement );
            this.stats = new Stats();
            const statsContainer = document.getElementById('stats');
            if(statsContainer) statsContainer.appendChild(this.stats.dom)
        }

        this.initLights();
        await this.loadModel();
        this.scene.add(this.modelGroup)
        this.animate();
    }
    initRenderer(){
        const topPlane = new THREE.Plane(new THREE.Vector3(0, -1, 0), 4.3)
        const bottomPlane = new THREE.Plane(new THREE.Vector3(0, -1, 0), 0)
        bottomPlane.negate();


        this.renderer = new THREE.WebGLRenderer({canvas:this.canvas});
        this.renderer.setSize( this.canvas.clientWidth, this.canvas.clientHeight );
        this.renderer.clippingPlanes = [topPlane, bottomPlane];
        this.renderer.localClippingEnabled = true;

    }

    initLights(){
        const ambientLight = new THREE.AmbientLight( 0x404040 ); // soft white light
        this.scene.add( ambientLight );

        const light_1 = new THREE.PointLight( 0xffffff, 1, 100 );
        light_1.position.set( 0, 10, 0 );
        if(this.debug){
            const axesHelper = new THREE.AxesHelper( 5 );
            light_1.add( axesHelper );
        }

        this.modelGroup.add( light_1 );
    }

    async loadModel(){
        await new Promise((resolve,reject) => {
            const loader = new GLTFLoader();
            loader.load(
                './models/tequila.glb', 
                (gltf) => {


                    
                    this.modelGroup.add(gltf.scene);
                    this.mixer = new THREE.AnimationMixer( this.modelGroup.children[1] );
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
        if(this.stats) this.stats.begin();
        this.renderer.render( this.scene, this.camera );
        this.mixer.update(this.clock.getDelta());
        if(this.debug){
            this.controls.update();

        }

        if(this.stats) this.stats.end();

        requestAnimationFrame( () => this.animate() );

    }
}