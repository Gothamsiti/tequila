import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import Stats from 'stats-js'
import { avaragePositions, avarageRotations, avarageScales } from '~/utils/avarages.js';
import { opacities } from '~/utils/opacities.js';
import Agave from './Agave.js';
import Bottle from './Bottle.js';
import Oven from './Oven.js';
import AnimationsClass from './AnimationsClass.js'
import OvenBaase from './OvenBase.js';

if(!Array.prototype.avarage){
    Object.defineProperty(Array.prototype, 'avarage', {
        value: function(){ return this.length ?  this.reduce((a, b) => a + b, 0) / this.length : 0 ; }
    });
}
export default class ThreeClass {
    constructor(isAr = false, canvas) {
        this.isAr = isAr;
        this.canvas = canvas;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.oven = null;
        this.sceneHeight = null;
        this.controls = null;
        this.stats = null;
        this.maxAvarageSize = 30;
        this.debug = true;
        this.agavePositionsDeg = []
        this.sceneYOffset = -.45
        this.sceneScale = .425
        this.agaveModels = []
        

        this.agaveQuantity = 5;
        this.gltf = null;
        
        this.mixer = null;
        this.clock = new THREE.Clock();

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

        // this.camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, .1, 1000);
        this.camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, .1, 20); // improve performance
        this.camera.position.z = 4;
        
        this.camera.position.y = 1
        
        this.initRenderer()

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
        this.setUpGroupSceneLimits()
        new Bottle(this, this.mainGroup, {position: { y : 0 }})
        this.oven = new Oven(this, this.mainGroup, {})
        this.ovenBase = new OvenBaase(this, this.mainGroup, {})
        this.mainGroup.scale.set(this.sceneScale, this.sceneScale, this.sceneScale)
        this.mainGroup.position.y = this.sceneYOffset;
        this.gltf = await this.loadModel('./models/agave-pianta.glb');
        for(let i = 0; i<this.agaveQuantity ;i++){
            const deg = 360 / this.agaveQuantity * i
            
            new Agave(this, { radian : -.06, y: 0,  deg, }, { ...this.gltf, scene: this.gltf.scene.clone() });
            
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

        this.avaragePX.push(detail.position.x)
        this.avaragePY.push(detail.position.y + this.sceneYOffset)
        this.avaragePZ.push(detail.position.z)

        this.avarageRX.push(detail.rotation.x)
        this.avarageRY.push(detail.rotation.y)
        this.avarageRZ.push(detail.rotation.z)
        this.avarageRW.push(detail.rotation.w)

        // this.avarageScale.push(detail.scale)
         
        if(this.avaragePX.length >=  this.maxAvarageSize) this.avaragePX.shift();
        if(this.avaragePY.length >=  this.maxAvarageSize) this.avaragePY.shift();
        if(this.avaragePZ.length >=  this.maxAvarageSize) this.avaragePZ.shift();

        if(this.avarageRX.length >=  this.maxAvarageSize) this.avarageRX.shift();
        if(this.avarageRY.length >=  this.maxAvarageSize) this.avarageRY.shift();
        if(this.avarageRZ.length >=  this.maxAvarageSize) this.avarageRZ.shift();
        if(this.avarageRW.length >=  this.maxAvarageSize) this.avarageRW.shift();

        // if(this.avarageScale.length >=  this.maxAvarageSize) this.avarageScale.shift();
    }

    initRenderer() {
        let antiAlias = false; //improve performance 

        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: antiAlias, powerPreference: 'high-performance'});
        this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
        if(this.isAr){

            this.renderer.setPixelRatio(window.devicePixelRatio * 0.5) // imporove performance 
        }
    }

    initLights() {
        const ambientLight = new THREE.AmbientLight(0x404040); // soft white light
        this.scene.add(ambientLight);

        const light_1 = new THREE.PointLight(0xffffff, 1, 100);
        light_1.position.set(-2, 4, 2);
        this.mainGroup.add(light_1);
        // if (this.debug) {
        //     const axesHelper = new THREE.AxesHelper(5);
        //     light_1.add(axesHelper);
        // }

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

    ARanimate(time){
        if (this.stats) this.stats.begin();
        if(time%2 ){
            this.memoSetAvarages()
        }else {
            this.renderer.render(this.scene, this.camera)
        }
        // this.renderer.render(this.scene, this.camera);
        if (this.stats) this.stats.end();
        requestAnimationFrame( (time)=> this.ARanimate(time) );
        
    }

    animate() {
        if (this.stats) this.stats.begin();
        
        if (this.debug) {
            if(this.controls) this.controls.update();

        }
        
        this.renderer.render(this.scene, this.camera);
        if (this.stats) this.stats.end();
        requestAnimationFrame( ()=> this.animate() );
    }

    getOpacity(modelHeight, y, offset= 0, ){
        if(y < offset) return 1
        return  1 - (y - offset) / (this.sceneHeight + modelHeight)
    }
    memoGetOpacity (modelHeight, y, offset= 0, ){
        if(y < offset) return 1
        const memoizedIndex =`${modelHeight}${y}${offset}` 
        if(opacities[memoizedIndex]) return opacities[memoizedIndex]
        opacities[memoizedIndex] =  1 - (y - offset) / (this.sceneHeight + modelHeight)
        return opacities[memoizedIndex]
    }
    



    setAvarages(){
        this.mainGroup.position.set(this.avaragePX.avarage(), this.avaragePY.avarage(), this.avaragePZ.avarage());
        this.mainGroup.quaternion.set(this.avarageRX.avarage(), this.avarageRY.avarage(), this.avarageRZ.avarage(), this.avarageRW.avarage());
        // this.mainGroup.scale.set(this.avarageScale.avarage() / 2, this.avarageScale.avarage() / 2, this.avarageScale.avarage() / 2);
    }
    memoSetAvarages(){
        if(this.mainGroup ){
            const avaragePXMemoIndex = this.avaragePX.join('-')
            const avaragePZMemoIndex = this.avaragePY.join('-')
            const avaragePYMemoIndex = this.avaragePZ.join('-')
            const avarageRXMemoIndex = this.avarageRX.join('-')
            const avarageRYMemoIndex = this.avarageRY.join('-')
            const avarageRZMemoIndex = this.avarageRZ.join('-')
            const avarageRWMemoIndex = this.avarageRW.join('-')
            const avarageScaleMemoIndex = this.avarageScale.join('-')
            if(! avaragePositions.x[avaragePXMemoIndex] ) { avaragePositions.x[avaragePXMemoIndex] = this.avaragePX.avarage()}
            if(! avaragePositions.y[avaragePYMemoIndex] ) { avaragePositions.y[avaragePYMemoIndex] = this.avaragePY.avarage()}
            if(! avaragePositions.z[avaragePZMemoIndex] ) { avaragePositions.z[avaragePZMemoIndex] = this.avaragePZ.avarage()}
            if(! avarageRotations.x[avarageRXMemoIndex] ) { avarageRotations.x[avarageRXMemoIndex] = this.avarageRX.avarage()}
            if(! avarageRotations.y[avarageRYMemoIndex] ) { avarageRotations.y[avarageRYMemoIndex] = this.avarageRY.avarage()}
            if(! avarageRotations.z[avarageRZMemoIndex] ) { avarageRotations.z[avarageRZMemoIndex] = this.avarageRZ.avarage()}
            if(! avarageRotations.w[avarageRWMemoIndex] ) { avarageRotations.w[avarageRWMemoIndex] = this.avarageRW.avarage()}
            // if(! avarageScales[avarageScaleMemoIndex]) {  avarageScales[avarageScaleMemoIndex] = this.avarageScale.avarage()}
            this.mainGroup.position.set(
                avaragePositions.x[avaragePXMemoIndex], 
                avaragePositions.y[avaragePYMemoIndex], 
                avaragePositions.z[avaragePZMemoIndex]);
            this.mainGroup.quaternion.set(
                avarageRotations.x[avarageRXMemoIndex], 
                avarageRotations.y[avarageRYMemoIndex], 
                avarageRotations.z[avarageRZMemoIndex]-0.002, 
                avarageRotations.w[avarageRWMemoIndex]);
        // this.mainGroup.scale.set(avarageScales[avarageScaleMemoIndex] / 2, avarageScales[avarageScaleMemoIndex] / 2, avarageScales[avarageScaleMemoIndex] / 2);
        }
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
