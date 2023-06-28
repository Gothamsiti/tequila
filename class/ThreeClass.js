import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import Stats from 'stats-js'

import Agave from './Agave.js';
import Bottle from './Bottle.js';
import Tower from './Oven.js';
import AnimationsClass from './AnimationsClass.js'

const avarage = function(array) {
    return array.length ?  array.reduce((a, b) => a + b, 0) / array.length : 0 ;
}

export default class ThreeClass {
    constructor(isAr = false, canvas) {
        this.isAr = isAr;
        this.canvas = canvas;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.tower = null;
        this.sceneHeight = null;
        this.controls = null;
        this.stats = null;
        this.maxAvarageSize = 25;
        this.debug = true;
        this.agavePositionsDeg = []
        this.agaveModels = []
        this.distanceFromBottle = 3;

        this.agaveQuantity = 5;
        this.gltf = null;

        this.mixer = null;
        this.clock = null;

        this.agaveGroup = new THREE.Group();
        this.mainGroup = new THREE.Group();
        this.group = new THREE.Group();


        this.avaragePX = [];
        this.avaragePY = [];
        this.avaragePZ = [];

        this.avarageRX = [];
        this.avarageRY = [];
        this.avarageRZ = [];
        this.avarageRW = [];

        this.avarageScale = [];
       
        if(!this.isAr) {
            this.init(canvas)
        };
    }
    async init(canvas) {
        this.group.visible = true;
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xffffff);

        this.camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
        this.camera.position.x = 4;
        
        this.camera.position.y = 7
        this.camera.position.z = 4;
        this.initRenderer()
        this.clock = new THREE.Clock();

        if (this.debug) {
            this.controls = new OrbitControls(this.camera, this.renderer.domElement);
            this.stats = new Stats();
            const statsContainer = document.getElementById('stats');
            if (statsContainer) statsContainer.appendChild(this.stats.dom)
        }

        await this.initScene();
        // this.tower.animate()
        this.animate();
    }
    async initScene(){
        this.initLights();
        new Bottle(this, this.mainGroup, {position: { y : 0 }})
        this.setUpGroupSceneLimits()
        this.tower = new Tower(this, this.mainGroup, {})

        this.gltf = await this.loadModel('./models/agave-pianta.glb');
        for(let i = 0; i<this.agaveQuantity ;i++){
            const deg = 360 / this.agaveQuantity * i
            const px = this.distanceFromBottle * Math.cos(THREE.MathUtils.degToRad(deg))
            const pz = this.distanceFromBottle *  Math.sin(THREE.MathUtils.degToRad(deg));
            
            const agave = new Agave(this, { radian : -.06, y: 0, x: px, z: pz }, { ...this.gltf, scene: this.gltf.scene.clone() });
            this.agaveGroup.add(agave.modelGroup)
        }
        this.mainGroup.add(this.agaveGroup);
        this.group.add(this.mainGroup)
        this.scene.add(this.group)

        new AnimationsClass(this)
        



        if(this.debug){
            const axesHelper = new THREE.AxesHelper(5);
            this.mainGroup.add(axesHelper);
        }
       
    }

    async initAr(XR8scene, XR8camera, XR8renderer){
        this.scene = XR8scene;

        this.initRenderer() // o questo renderer
        // this.renderer = XR8renderer; // oppure questo

        this.camera = XR8camera;
        this.renderer.autoClear = false;
        this.group.visible = false;
        if (this.debug) {
            this.stats = new Stats();
            const statsContainer = document.getElementById('stats');
            if (statsContainer) statsContainer.appendChild(this.stats.dom)
        }

        await this.initScene();
        this.ARanimate();
    }

    handleTargetFound(detail) {
        console.log('=== FOUND ===')
        // this.rotationOffset = this.calcRotationOffset(detail.metadata);
        this.tower.animate()
        this.group.visible = true;
        this.avaragePX = [detail.position.x];
        this.avaragePY = [detail.position.y];
        this.avaragePZ = [detail.position.z];

        this.avarageRX = [detail.rotation.x];
        this.avarageRY = [detail.rotation.y];
        this.avarageRZ = [detail.rotation.z];
        this.avarageRW = [detail.rotation.w];

        this.avarageScale = [detail.scale];
    }
    handleTargetLost(detail) {
        console.log('=== LOST ===')
        this.group.visible = false;
    }
    handleTargetUpdate(detail) {
        console.log('=== UPDATE ===');

        
        // this.rotationOffset = this.calcRotationOffset(detail.metadata);
        
     
        this.avaragePX.push(detail.position.x)
        this.avaragePY.push(detail.position.y)
        this.avaragePZ.push(detail.position.z)

        this.avarageRX.push(detail.rotation.x)
        this.avarageRY.push(detail.rotation.y)
        this.avarageRZ.push(detail.rotation.z)
        this.avarageRW.push(detail.rotation.w)

        this.avarageScale.push(detail.scale)
         
        if(this.avaragePX.length >=  this.maxAvarageSize) this.avaragePX.shift();
        if(this.avaragePY.length >=  this.maxAvarageSize) this.avaragePY.shift();
        if(this.avaragePZ.length >=  this.maxAvarageSize) this.avaragePZ.shift();

        if(this.avarageRX.length >=  this.maxAvarageSize) this.avarageRX.shift();
        if(this.avarageRY.length >=  this.maxAvarageSize) this.avarageRY.shift();
        if(this.avarageRZ.length >=  this.maxAvarageSize) this.avarageRZ.shift();
        if(this.avarageRW.length >=  this.maxAvarageSize) this.avarageRW.shift();

        if(this.avarageScale.length >=  this.maxAvarageSize) this.avarageScale.shift();
    }

    initRenderer() {
        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true });
        this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    }

    initLights() {
        const ambientLight = new THREE.AmbientLight(0x404040); // soft white light
        this.scene.add(ambientLight);

        const light_1 = new THREE.PointLight(0xffffff, 1, 100);
        light_1.position.set(0, 10, 0);
        if (this.debug) {
            // const axesHelper = new THREE.AxesHelper(5);
            // light_1.add(axesHelper);
        }

        this.scene.add(light_1);
    }

    async loadModel(src) {
        return await new Promise((resolve, reject) => {
            const loader = new GLTFLoader();
            return loader.load(
                src,
                (gltf) => {
                    return resolve(gltf);
                },
                (xhr) => {
                    // console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
                },
                (error) => {
                    console.log('An error happened');
                }
            )

        })
    }

    ARanimate(){
        if (this.stats) this.stats.begin();

        if(this.mainGroup){
            this.mainGroup.position.set(avarage(this.avaragePX), avarage(this.avaragePY), avarage(this.avaragePZ));
            this.mainGroup.quaternion.set(avarage(this.avarageRX), avarage(this.avarageRY), avarage(this.avarageRZ), avarage(this.avarageRW));
            this.mainGroup.scale.set(avarage(this.avarageScale) / 2, avarage(this.avarageScale) / 2, avarage(this.avarageScale) / 2);

        }

        
        this.renderer.render(this.scene, this.camera);
        if (this.stats) this.stats.end();
        requestAnimationFrame(() => { this.ARanimate() });
    }

    animate() {
        if (this.stats) this.stats.begin();
        
        //this.agaveGroup.rotateY(0.01);
        //this.agaveGroup.children.map((child)=> child.rotateY(-0.04) )
        if (this.debug) {
            if(this.controls) this.controls.update();

        }
        
        this.renderer.render(this.scene, this.camera);
        if (this.stats) this.stats.end();
        requestAnimationFrame(() => this.animate());

    }

    getOpacity(modelHeight, y, offset= 0, ){
        if(y < offset) return 1
        return  1 - (y - offset) / (this.sceneHeight + modelHeight)
    }

    
    setUpGroupSceneLimits(){
       
        const cubeSize = 10;
        const CubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
        const trasparentMaterial = new THREE.MeshPhongMaterial( {color: 0xffff00, colorWrite: false} );
        const cube = new THREE.Mesh(CubeGeometry, trasparentMaterial)
        cube.position.y= -cubeSize/2;
        this.sceneHeight = 4;
        this.mainGroup.add(cube)

    }
}