import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

export default class CubeScene {
    constructor(canvas){
        this.canvas = canvas
        this.scene = null;
        this.camera = null;
        this.debug = true
        this.init()
    }

    async init(){
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xeeeeff);
        this.camera = new THREE.PerspectiveCamera(75, this.canvas.clientWidth / this.canvas.clientHeight, 0.1, 1000);
        // this.camera.position.y = 7
        this.camera.position.x = 4;
        this.camera.position.y = 7;
        this.camera.position.z = 4;
        
        this.initRenderer()
        if (this.debug) {
            this.controls = new OrbitControls(this.camera, this.renderer.domElement);
            const axesHelper = new THREE.AxesHelper(5);
            this.scene.add(axesHelper);
        }
        this.initLights()
        this.initScene();
        this.animate();
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

    async initScene(){
        const gltf = await this.loadModel();
        const mesh = gltf.scene.children[0];
        this.scene.add(mesh);
        const cube = mesh.getObjectByName('Cube')
        const influences = cube.morphTargetInfluences;
        const dictionary = cube.morphTargetDictionary;
        console.log(influences,dictionary);
        const gui = new GUI();

        for ( const [ key, value ] of Object.entries( dictionary ) ) {

            gui.add( influences, value, 0, 1, 0.01 )
                .name( key )
                .listen( influences );

        }

        
        // this.scene.add(model)
    }

    initRenderer(){
        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true });
        this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    }

    animate() {
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(() => this.animate());

    }


    async loadModel() {
        return await new Promise((resolve, reject) => {
            const loader = new GLTFLoader();
            return loader.load(
                './models/cubo-shapekeys.glb',
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
}