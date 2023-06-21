import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Stats from 'stats-js'

import Agave from './Agave.js';

export default class ThreeClass {
    constructor(canvas) {
        this.canvas = canvas;
        this.debug = true;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.stats = null;
        this.agavePositionsDeg = []
        this.agaveModels = []
        this.distanceFromBottle = 3;

        this.agaveQuantity = 5;
        this.gltf = null;

        this.mixer = null;
        this.clock = null;

        this.agaveGroup = new THREE.Group();
       
        this.init(canvas);
    }
    async init(canvas) {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xffffff);
        this.camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
        // this.camera.position.y = 7
        this.camera.position.x = 4;
        this.camera.position.y = 3;
        this.camera.position.z = 4;

        this.initRenderer()
        this.clock = new THREE.Clock();

        if (this.debug) {
            this.controls = new OrbitControls(this.camera, this.renderer.domElement);
            this.stats = new Stats();
            const statsContainer = document.getElementById('stats');
            if (statsContainer) statsContainer.appendChild(this.stats.dom)
        }

        this.initLights();
        for(let i = 0; i<this.agaveQuantity ;i++){
            
            this.agaveModels.push(await this.loadModel()); // da capire perchè perde il modello del ciore
        }
        for(let i = 0; i<this.agaveQuantity ;i++){
            const deg = 360 / this.agaveQuantity * i
            console.log(Math.cos(THREE.MathUtils.degToRad(180)))
            console.log('deg =', deg, 'sin =', Math.sin(THREE.MathUtils.degToRad(deg)), 'cos = ',(Math.cos(THREE.MathUtils.degToRad(deg))))
            const px = this.distanceFromBottle * Math.cos(THREE.MathUtils.degToRad(deg))
            const pz = this.distanceFromBottle *  Math.sin(THREE.MathUtils.degToRad(deg));
            // const pz = -this.distanceFromBottle * Math.sin(deg);
            
            
            const agave = new Agave(
                {
                    radian : -.06,
                    x: px,
                    z: pz
                },
                this.agaveModels[i], 
                this.debug
            );
            this.agaveGroup.add(agave.modelGroup)
        }
        this.scene.add(this.agaveGroup)
        
        this.animate();
    }

    

    initRenderer() {
        const topPlane = new THREE.Plane(new THREE.Vector3(0, -1, 0), 4.3)
        const bottomPlane = new THREE.Plane(new THREE.Vector3(0, -1, 0), 0)
        bottomPlane.negate();


        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
        this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
        this.renderer.clippingPlanes = [topPlane, bottomPlane];
        this.renderer.localClippingEnabled = true;

    }

    initLights() {
        const ambientLight = new THREE.AmbientLight(0x404040); // soft white light
        this.scene.add(ambientLight);
        const axesHelper = new THREE.AxesHelper(5);
        this.scene.add(axesHelper)

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

    handleAnimations(animations) {
        animations.forEach((clip) => {
            this.mixer.clipAction(clip).play();
        });
    }

    animate() {
        if (this.stats) this.stats.begin();
        
        // this.mixer.update(this.clock  .getDelta());
        this.agaveGroup.rotateY(0.01);
        this.agaveGroup.children.map((child)=> child.rotateY(-0.04) )
        this.renderer.render(this.scene, this.camera);
        if (this.debug) {
            this.controls.update();

        }

        if (this.stats) this.stats.end();

        requestAnimationFrame(() => this.animate());

    }
}