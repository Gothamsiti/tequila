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
        this.group = new THREE.Group();

        const silo = gltf.scene.children.find(c => c.name == "movement-totale");

        this.perno = {};
        this.perno.dx = silo.getObjectByName('perno-dx')
        this.perno.sx = silo.getObjectByName('perno-sx')

        this.base = silo.getObjectByName('silo_base');
        this.gambe = silo.getObjectByName('gambe');
        
        this.group.add(this.perno.sx)
        this.group.add(this.perno.dx)
        this.group.add(this.base)
        this.group.add(this.gambe)

        this.scene.add(this.group);

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
        var morphs = this.initMorph();
        const tl = gsap.timeline({
            repeat: -1,
            repeatDelay: .5,
            yoyo: true,
            onUpdate : () => {
                const currentLabel = tl.currentLabel();
                if(currentLabel == 'group_in'){
                    this.group.position.y = group_in.positionY;
                    this.group.rotation.y = THREE.MathUtils.degToRad(group_in.rotationY);
                }

                if(currentLabel == 'morph'){
                    this.perno.dx.traverse(child => {
                        if(child.morphTargetDictionary){
                            if(child.morphTargetDictionary['alambicco-dx'] !== undefined) child.morphTargetInfluences[morphs.dx['alambicco-dx'].index] = morphs.dx['alambicco-dx'].value;
                            if(child.morphTargetDictionary['anelli-alambicco'] !== undefined) child.morphTargetInfluences[morphs.dx['anelli-alambicco'].index] = morphs.dx['anelli-alambicco'].value;
                            if(child.morphTargetDictionary['anelli-botti'] !== undefined) child.morphTargetInfluences[morphs.dx['anelli-botti'].index] = morphs.dx['anelli-botti'].value;
                            if(child.morphTargetDictionary['botte-dx'] !== undefined) child.morphTargetInfluences[morphs.dx['botte-dx'].index] = morphs.dx['botte-dx'].value;
                        }
                    })
                    this.perno.sx.traverse(child => {
                        if(child.morphTargetDictionary){
                            if(child.morphTargetDictionary['alambicco-sx'] !== undefined) child.morphTargetInfluences[morphs.sx['alambicco-sx'].index] = morphs.sx['alambicco-sx'].value;
                            if(child.morphTargetDictionary['anelli-alambicco'] !== undefined) child.morphTargetInfluences[morphs.sx['anelli-alambicco'].index] = morphs.sx['anelli-alambicco'].value;
                            if(child.morphTargetDictionary['anelli-botti'] !== undefined) child.morphTargetInfluences[morphs.sx['anelli-botti'].index] = morphs.sx['anelli-botti'].value;
                            if(child.morphTargetDictionary['botte-sx'] !== undefined) child.morphTargetInfluences[morphs.sx['botte-sx'].index] = morphs.sx['botte-sx'].value;
                        }
                    })
                }
            }
        });

        tl.addLabel('group_in');
        const group_in = {positionY: 0, rotationY: 0}
        tl.to(group_in,{ positionY: 1, rotationY: 90, duration: 2})

        tl.addLabel('morph')
        tl.to([
                morphs.dx['anelli-alambicco'],
                morphs.sx['anelli-alambicco'],
                morphs.dx['alambicco-dx'],
                morphs.sx['alambicco-sx'],
            ],{
                value: 1,
                duration: 2
        })
        tl.to([
            morphs.dx['anelli-alambicco'],
            morphs.sx['anelli-alambicco'],
            morphs.dx['alambicco-dx'],
            morphs.sx['alambicco-sx'],
        ],{
            value: 0,
            duration: 2
        })
        tl.to([
            morphs.dx['anelli-botti'],
            morphs.sx['anelli-botti'],
            morphs.dx['botte-dx'],
            morphs.sx['botte-sx'],
        ],{
            value: 1,
            duration: 2
        },'<')
        
        tl.addLabel('base_move');
        tl.to(this.base.position,{y:-.1, duration: 2},'<')
        tl.to(this.gambe.position,{y:-.3, duration: 2},'<')
    }
    
    initMorph(){
        var morphs = {};
        for(var i in this.perno){
            if(!morphs[i]) morphs[i] = {}
            this.perno[i].traverse(child => {
                if(child.morphTargetDictionary){
                    let keys = Object.keys(child.morphTargetDictionary);
                    for(var k in keys){
                        if(!morphs[i][keys[k]]){
                            morphs[i][keys[k]] = {
                                index: child.morphTargetDictionary[keys[k]],
                                value: child.morphTargetInfluences[k]
                            }
                        }
                    }
                }
            })
        }

        return morphs;
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