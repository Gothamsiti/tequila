import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Stats from 'stats-js'
import InstancedMeshClass from './InstancedMeshClass.js';

export default class ThreeClass {
    constructor(canvas) {
        this.canvas = canvas;
        this.debug = true;

        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.stats = null;

        this.gltf = null;
        // non buono con 2 modelli,meglio impostare meglio blender modificando solo l'origine per x e z delle foglie, lasciando la y invariata così da dover impostare solo la rotation_offset
        this.gltf2 = null;

        this.mixer = null;
        this.clock = null;

        this.modelGroup = new THREE.Group();
        this.layers = [
            // { search: '01',rotation_offset:  0,y:0 ,distance: .47, quantity: 9, mesh: null, to: { rotation: {x: 90}, position: {}} },
            // { search: '02', rotation_offset: 22.1,  y:.21 ,quantity: 9, distance: .74, mesh: null, to: { rotation: {x: 90}, position: {}} },
            { search: '03',rotation_offset: 0,  y:.44 ,distance: .6, quantity: 9, mesh: null, to: { rotation: {x: 110}, position: {y: -2}} },
            //{ search: '04',rotation_offset: 19.8, y:.528 ,distance: .414, quantity: 6, mesh: null, to: { rotation: {x: 90}, position: {}} },
            // { search: '05',rotation_offset: -13.8, y:.707 ,distance: .378, quantity: 6, mesh: null, to: { rotation: {x: 90}, position: {}} },
            // { search: '06',rotation_offset: 31, y:.89,distance: .12, quantity: 3, mesh: null },
        ]
        this.init(canvas);
    }
    async init(canvas) {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xffffff);
        this.camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
//        this.camera.position.z = 2;
        this.camera.position.y = 4;


        this.initRenderer()
        this.clock = new THREE.Clock();

        if (this.debug) {
            this.controls = new OrbitControls(this.camera, this.renderer.domElement);
            this.stats = new Stats();
            const statsContainer = document.getElementById('stats');
            if (statsContainer) statsContainer.appendChild(this.stats.dom)
        }

        this.initLights();

        this.gltf = await this.loadModel();
        this.gltf2 = await this.loadModel2();


        this.agave();

        this.scene.add(this.modelGroup)
        this.animate();
    }

    agave() {
        const agave_cuore = new THREE.Group();
        this.layers.map((layer) => {
            const piano = this.gltf.scene.getObjectByName(`foglia-agave-${layer.search}`);
            layer.mesh = new InstancedMeshClass(this, piano.geometry, piano.material, layer);
            const agave = this.gltf2.scene.getObjectByName(`agave-${layer.search}001`); 
            agave_cuore.add(agave)
        })

        this.modelGroup.add(agave_cuore);
    }

    initRenderer() {
        const topPlane = new THREE.Plane(new THREE.Vector3(0, -1, 0), 4.3)
        const bottomPlane = new THREE.Plane(new THREE.Vector3(0, -1, 0), 0)
        bottomPlane.negate();


        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
        this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
        // this.renderer.clippingPlanes = [topPlane, bottomPlane];
        // this.renderer.localClippingEnabled = true;

    }

    initLights() {
        const ambientLight = new THREE.AmbientLight(0x404040); // soft white light
        this.scene.add(ambientLight);

        const light_1 = new THREE.PointLight(0xffffff, 1, 100);
        light_1.position.set(0, 10, 0);
        if (this.debug) {
            const axesHelper = new THREE.AxesHelper(5);
            light_1.add(axesHelper);
        }

        this.modelGroup.add(light_1);
    }

    async loadModel() {
        return await new Promise((resolve, reject) => {
            const loader = new GLTFLoader();
            return loader.load(
                './models/agave-pianta_new.glb',
                (gltf) => {
                    console.log(gltf)
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
    async loadModel2() {
        return await new Promise((resolve, reject) => {
            const loader = new GLTFLoader();
            return loader.load(
                './models/agave-pianta.glb',
                (gltf) => {
                    console.log(gltf)
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
        this.renderer.render(this.scene, this.camera);

        // this.mixer.update(this.clock.getDelta());

        if (this.debug) {
            this.controls.update();

        }

        if (this.stats) this.stats.end();

        requestAnimationFrame(() => this.animate());

    }
}