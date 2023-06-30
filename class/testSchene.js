import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import gsap from 'gsap' 

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
        this.camera.position.x = 5;
        this.camera.position.y = 4;
        this.camera.position.z = 5;
        
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
        const group = new THREE.Group()

        this.silo = {};

        this.silo.sx = gltf.scene.children[0].children[0]
        this.silo.dx = gltf.scene.children[1].children[0]
        
        group.add(this.silo.sx)
        group.add(this.silo.dx)
        this.scene.add(group);
        const gui = new GUI();

        for(var i in this.silo){
            const gui_group = gui.addFolder(i);
            const influences = this.silo[i].morphTargetInfluences;
            const dictionary = this.silo[i].morphTargetDictionary;
            for ( const [ key, value ] of Object.entries( dictionary ) ) {
                gui_group.add( influences, value, 0, 1, 0.01 ).name( key ).listen( influences );
            }
        }

       // this.gsapAnimation();
    }

    gsapAnimation(){
        const toAnimate = this.silo.sx.morphTargetInfluences;
        const dictionary = this.silo.sx.morphTargetDictionary;

        const obj = {};
        for ( const [ key, value ] of Object.entries( dictionary ) ) {
            obj[key] = toAnimate[value];
        }
        const tl = gsap.timeline({repeat: -1, repeatDelay: .5, yoyo: true});

        tl.to(obj,
            {
                alambicco: 1,
                duration: 2,
                onUpdate : () => {
                    const index = dictionary.alambicco;
                    this.silo.sx.morphTargetInfluences[index] = obj.alambicco;
                    this.silo.dx.morphTargetInfluences[index] = obj.alambicco;
                }
            })

        tl.to(obj,
            {
                alambicco: 0,
                botte: 1,
                duration: 2,
                onUpdate : () => {
                    const index_alambicco = dictionary.alambicco;
                    this.silo.sx.morphTargetInfluences[index_alambicco] = obj.alambicco;
                    this.silo.dx.morphTargetInfluences[index_alambicco] = obj.alambicco;

                    const index_botte = dictionary.botte;
                    this.silo.sx.morphTargetInfluences[index_botte] = obj.botte;
                    this.silo.dx.morphTargetInfluences[index_botte] = obj.botte;
                }
            })

        tl.to(obj,
            {
                botte: 0,
                botte_aperta: 1,
                duration: 2,
                onUpdate : () => {
                    const index_botte = dictionary.botte;
                    this.silo.sx.morphTargetInfluences[index_botte] = obj.botte;
                    this.silo.dx.morphTargetInfluences[index_botte] = obj.botte;

                    const index_botte_aperta = dictionary.botte_aperta;
                    this.silo.sx.morphTargetInfluences[index_botte_aperta] = obj.botte_aperta;
                    this.silo.dx.morphTargetInfluences[index_botte_aperta] = obj.botte_aperta;
                }
            })
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
                './models/silo.glb',
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