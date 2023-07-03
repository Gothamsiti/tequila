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
        this.init();
        this.objMorphs = {}
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
        const group = new THREE.Group();

        const silo = gltf.scene.children.find(c => c.name == "movement-totale");
        this.perno = {};

        this.perno.dx = silo.children[2]
        this.perno.sx = silo.children[3]
        
        group.add(this.perno.sx)
        group.add(this.perno.dx)
        this.scene.add(group);

        const gui = new GUI();

        for(var i in this.perno){
            const gui_group = gui.addFolder(i);
            this.perno[i].traverse(child => {
                if(child.morphTargetDictionary){
                    const influences = child.morphTargetInfluences;
                    const dictionary = child.morphTargetDictionary;
                    for ( const [ key, value ] of Object.entries( dictionary ) ) {
                        if(!this.objMorphs[key]) this.objMorphs[key] = influences[value]
                        gui_group.add( influences, value, 0, 1, 0.01 ).name( key ).listen( influences );
                    }
                }
            })

            
        }

       this.gsapAnimation();
    }

    gsapAnimation(){
        /* const dictionary = {
            anelliAlambicco : undefined,
            alambiccoDx : undefined,
            alambiccoSx : undefined,
            anelliBotti : undefined,
            botteDx : undefined,
            botteSx : undefined
        }


        for(var i in this.perno){
            this.perno[i].traverse(child => {
                if(child.morphTargetDictionary){
                    if(dictionary.anelliAlambicco === undefined && child.morphTargetDictionary['anelli-alambicco'] !== undefined) dictionary.anelliAlambicco = child.morphTargetDictionary['anelli-alambicco'];
                    if(dictionary.alambiccoDx === undefined && child.morphTargetDictionary['alambicco-dx'] !== undefined) dictionary.alambiccoDx = child.morphTargetDictionary['alambicco-dx'];
                    if(dictionary.alambiccoSx === undefined && child.morphTargetDictionary['alambicco-sx'] !== undefined) dictionary.alambiccoSx = child.morphTargetDictionary['alambicco-sx'];
                    if(dictionary.anelliBotti === undefined && child.morphTargetDictionary['anelli-botti'] !== undefined) dictionary.anelliBotti = child.morphTargetDictionary['anelli-botti'];
                    if(dictionary.botteDx === undefined && child.morphTargetDictionary['botte-dx'] !== undefined) dictionary.botteDx = child.morphTargetDictionary['botte-dx'];
                    if(dictionary.botteSx === undefined && child.morphTargetDictionary['botte-sx'] !== undefined) dictionary.botteSx = child.morphTargetDictionary['botte-sx'];

                }
            })
        }


        const tl = gsap.timeline({repeat: 0, repeatDelay: .5, yoyo: true});


        tl.to(this.objMorphs,
            {
                'anelli-alambicco': 1,
                'alambicco-dx': 1,
                'alambicco-sx': 1,
                duration: 2,
                onUpdate : () => {
                    for(var i in this.perno){
                        this.perno[i].traverse(child => {
                            if(child.morphTargetDictionary){
                                child.morphTargetInfluences[dictionary.anelliAlambicco] = this.objMorphs['anelli-alambicco']
                                child.morphTargetInfluences[dictionary.alambiccoDx] = this.objMorphs['alambicco-dx']
                                child.morphTargetInfluences[dictionary.alambiccoSx] = this.objMorphs['alambicco-sx']
                        })
                    }
                }
            })
        */
        
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
                './models/silo_new.glb',
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