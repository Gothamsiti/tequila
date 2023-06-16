import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Stats from 'stats-js'
import InstancedMeshClass from './InstancedMeshClass.js';

export default class ThreeClass{
    constructor(canvas){
        this.canvas = canvas;
        this.debug = true;

        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.stats = null;

        this.gltf = null;

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

        this.gltf = await this.loadModel();

        const piano_1 = this.gltf.scene.getObjectByName('foglia-agave-01'); 
        const piano_2 = this.gltf.scene.getObjectByName('foglia-agave-02'); 
        const piano_3 = this.gltf.scene.getObjectByName('foglia-agave-03'); 
        const piano_4 = this.gltf.scene.getObjectByName('foglia-agave-04'); 
        const piano_5 = this.gltf.scene.getObjectByName('foglia-agave-05'); 
        const piano_6 = this.gltf.scene.getObjectByName('foglia-agave-06'); 

        const piano_1_instancedMesh = new InstancedMeshClass(this, piano_1.geometry, piano_1.material, 9);
        const piano_2_instancedMesh = new InstancedMeshClass(this, piano_2.geometry, piano_2.material, 9);
        const piano_3_instancedMesh = new InstancedMeshClass(this, piano_3.geometry, piano_3.material, 9);
        const piano_4_instancedMesh = new InstancedMeshClass(this, piano_4.geometry, piano_4.material, 6);
        const piano_5_instancedMesh = new InstancedMeshClass(this, piano_5.geometry, piano_5.material, 6);
        const piano_6_instancedMesh = new InstancedMeshClass(this, piano_6.geometry, piano_6.material, 3);
        this.agave_cuore();

        this.scene.add(this.modelGroup)
        this.animate();
    }

    agave_cuore(){
        const agave_01 = this.gltf.scene.getObjectByName('agave-01001'); 
        const agave_02 = this.gltf.scene.getObjectByName('agave-02001'); 
        const agave_03 = this.gltf.scene.getObjectByName('agave-03001'); 
        const agave_04 = this.gltf.scene.getObjectByName('agave-04001'); 
        const agave_05 = this.gltf.scene.getObjectByName('agave-05001'); 
        const agave_06 = this.gltf.scene.getObjectByName('agave-06001'); 

        const agave_cuore = new THREE.Group();

        agave_cuore.add(agave_01)
        agave_cuore.add(agave_02)
        agave_cuore.add(agave_03)
        agave_cuore.add(agave_04)
        agave_cuore.add(agave_05)
        agave_cuore.add(agave_06);

        this.modelGroup.add(agave_cuore);
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
        return await new Promise((resolve,reject) => {
            const loader = new GLTFLoader();
            return loader.load(
                './models/agave-pianta.glb', 
                (gltf) => {
                    return resolve(gltf);
                },
                (xhr) => {
                    // console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
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

        // this.mixer.update(this.clock.getDelta());

        if(this.debug){
            this.controls.update();

        }

        if(this.stats) this.stats.end();

        requestAnimationFrame( () => this.animate() );

    }
}