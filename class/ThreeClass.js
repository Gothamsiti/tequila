import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Stats from 'stats-js'
import InstancedMeshClass from './InstancedMeshClass.js';
import gsap from 'gsap';

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

        this.mixer = null;
        this.clock = null;

        this.modelGroup = new THREE.Group();
        this.layers = [
            { search: '01', quantity: 9, mesh : null, from: {}, to: { position: {x:.2, y:-1.5, z: .3}, rotation: {x: -10, y: 0, z: 0}}},
            { search: '02', quantity: 9, mesh : null, from: {}, to: { position: {x:.2, y:-1.5, z: .3}, rotation: {x: -10, y: 0, z: 0}}},
            // { search: '03', quantity: 9, mesh : null, from: {}, to: { position: {x:.2, y:-1.5, z: .3}, rotation: {x: -10, y: 0, z: 0}}},
            // { search: '04', quantity: 6, mesh : null, from: {}, to: { position: {x:.2, y:-1.5, z: .3}, rotation: {x: -10, y: 0, z: 0}}},
            // { search: '05', quantity: 6, mesh : null, from: {}, to: { position: {x:.2, y:-1.5, z: .3}, rotation: {x: -10, y: 0, z: 0}}},
            // { search: '06', quantity: 3, mesh : null, from: {}, to: { position: {x:.2, y:-1.5, z: .3}, rotation: {x: -10, y: 0, z: 0}}},
        ]
        this.leafDummies = [];
        this.init(canvas);
    }
    async init(canvas) {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xffffff);
        this.camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
        this.camera.position.y = 3
        // this.camera.position.x = 4;
        // this.camera.position.y = 3;
        // this.camera.position.z = 4;

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


        this.agave();

        this.scene.add(this.modelGroup)
        this.animate();
    }

    agave() {
        const agave_cuore = new THREE.Group();
        this.layers.map((layer) => {
            const piano = this.gltf.scene.getObjectByName(`foglia-agave-${layer.search}`);
            layer.mesh = new InstancedMeshClass(this, piano.geometry, piano.material, layer.quantity, layer.from, layer.to);

            const agave = this.gltf.scene.getObjectByName(`agave-${layer.search}001`); 
            agave_cuore.add(agave)
        })

        this.modelGroup.add(agave_cuore);

        const leafDummiesPositions = this.leafDummies.map(d => d.position);
        const leafDummiesRotations = this.leafDummies.map(d => d.rotation);

        // gsap.to(
        //     leafDummiesPositions,
        //     { 
        //         x : i => {  
        //             const deg = this.leafDummies[i].offsetDegrees - i * this.leafDummies[i].deltaDegrees;
        //             return -1 * Math.cos(THREE.MathUtils.degToRad(deg))
        //         },
        //         z : i => {  
        //             const deg = this.leafDummies[i].offsetDegrees - i * this.leafDummies[i].deltaDegrees;
        //             return -1 * Math.sin(THREE.MathUtils.degToRad(deg))
        //         },
        //         duration : 5,
        //         onUpdate : () => {
        //             for(const dummy of this.leafDummies){
        //                 console.log("onUpdate",dummy.position.x);
        //                 dummy.updateMatrix();
        //                 dummy.parentMesh.setMatrixAt(dummy.dummyIndex, dummy.matrix);
        //                 dummy.parentMesh.instanceMatrix.needsUpdate = true;
        //             }
        //         }
        //     }
        // )
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

        const light_1 = new THREE.PointLight(0xffffff, 1, 100);
        light_1.position.set(0, 10, 0);
        if (this.debug) {
            // const axesHelper = new THREE.AxesHelper(5);
            // light_1.add(axesHelper);
        }

        this.modelGroup.add(light_1);
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
        this.renderer.render(this.scene, this.camera);

        // this.mixer.update(this.clock  .getDelta());

        if (this.debug) {
            this.controls.update();

        }

        if (this.stats) this.stats.end();

        requestAnimationFrame(() => this.animate());

    }
}