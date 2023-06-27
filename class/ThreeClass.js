import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import Stats from 'stats-js'

import Agave from './Agave.js';
import Bottle from './Bottle.js';
import Tower from './Tower.js';

Array.prototype.avarage = function() {
    return this.length ?  this.reduce((a, b) => a + b, 0) / this.length : 0 ;
}

export default class ThreeClass {
    constructor(isAr = false, canvas) {
        this.isAr = isAr;
        this.clipPlanes =[]
        this.canvas = canvas;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.tower = null;
        this.sceneHeight = 4;
        this.controls = null;
        this.stats = null;
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

        this.clippingPlanes = {};
       
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
        
        this.animate();
    }
    async initScene(){
        this.initLights();
        new Bottle(this.mainGroup, {position: { y : 1.1 }})
        this.setUpGroupSceneLimits()
        this.tower = new Tower(this, this.mainGroup, {})
        this.gltf = await this.loadModel();
        this.tower.animate()
        for(let i = 0; i<this.agaveQuantity ;i++){
            const deg = 360 / this.agaveQuantity * i
            const px = this.distanceFromBottle * Math.cos(THREE.MathUtils.degToRad(deg))
            const pz = this.distanceFromBottle *  Math.sin(THREE.MathUtils.degToRad(deg));
            
            const agave = new Agave(
                this,
                {
                    radian : -.06,
                    y: 0,
                    x: px,
                    z: pz
                },
                {
                    ...this.gltf,
                    scene: this.gltf.scene.clone()
                },
                this.clipPlanes
            );
            this.agaveGroup.add(agave.modelGroup)
        }

        // const agave = new Agave(
        //     this,
        //     {
                
        //         x: 2,
        //         x: 2,
        //         y: -.4
        //     },
        //     {
        //         ...this.gltf,
        //         scene: this.gltf.scene.clone()
        //     },
        //     this.clipPlanes
        // );
        // this.agaveGroup.add(agave.modelGroup)

        this.mainGroup.add(this.agaveGroup);
        
        if(this.debug){
            const axesHelper = new THREE.AxesHelper(5);
            this.mainGroup.add(axesHelper);
        }
        
        this.group.add(this.mainGroup)
        this.scene.add(this.group)
       
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
         
        if(this.avaragePX.length >=  20) this.avaragePX.shift();
        if(this.avaragePY.length >=  20) this.avaragePY.shift();
        if(this.avaragePZ.length >=  20) this.avaragePZ.shift();

        if(this.avarageRX.length >=  20) this.avarageRX.shift();
        if(this.avarageRY.length >=  20) this.avarageRY.shift();
        if(this.avarageRZ.length >=  20) this.avarageRZ.shift();
        if(this.avarageRW.length >=  20) this.avarageRW.shift();

        if(this.avarageScale.length >=  20) this.avarageScale.shift();
    }

    initRenderer() {
        
        // this.clippingPlanes.top = new THREE.Plane(new THREE.Vector3(0, -1, 0), 4.3)
        // this.clippingPlanes.bottom = new THREE.Plane(new THREE.Vector3(0, -1, 0), 0)
        // this.clippingPlanes.bottom.negate();

        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
        this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
        this.renderer.localClippingEnabled = true;
        // this.renderer.clippingPlanes = [this.clippingPlanes.bottom];

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

    async loadModel() {
        return await new Promise((resolve, reject) => {
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
                    console.log('An error happened');
                }
            )

        })
    }

    ARanimate(){
        if (this.stats) this.stats.begin();

        if(this.mainGroup){
            this.mainGroup.position.set(this.avaragePX.avarage(), this.avaragePY.avarage(), this.avaragePZ.avarage());
            this.mainGroup.quaternion.set(this.avarageRX.avarage(), this.avarageRY.avarage(), this.avarageRZ.avarage(), this.avarageRW.avarage());
            this.mainGroup.scale.set(this.avarageScale.avarage() / 2, this.avarageScale.avarage() / 2, this.avarageScale.avarage() / 2);

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
        return  1 - (y ) / (this.sceneHeight + offset + modelHeight)
    }

    setUpGroupSceneLimits(){
       
        const cubeSize = 10;
        const CubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
        // const trasparentMaterial = new THREE.MeshPhongMaterial( {color: 0xffff00, } );
        const trasparentMaterial = new THREE.MeshPhongMaterial( {color: 0xffff00, colorWrite: false} );
        const cube = new THREE.Mesh(CubeGeometry, trasparentMaterial)
        cube.position.y= -cubeSize/2;
        this.mainGroup.add(cube)
        // this.clipPlanes[0].negate()
        // this.clipPlanes[0].negate()
        
        // this.clipPlanes= [
        //     new THREE.Plane(new THREE.Vector3(0, -1 ,0 ) , 4),
            
        // ]
        // if(this.debug){
        //     const helpers = new THREE.Group()
        //     helpers.add(new THREE.PlaneHelper(this.clipPlanes[0], 15, 0xff0000))
        //     helpers.visible = true
        //     helpers.name='helpers'

        //     this.scene.add(helpers)
        // }

    }
}