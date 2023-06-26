import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

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
        this.camera.position.y = 3;
        this.camera.position.z = 4;
        
        this.initRenderer()
        if (this.debug) {
            this.controls = new OrbitControls(this.camera, this.renderer.domElement);
            const axesHelper = new THREE.AxesHelper(5);
            this.scene.add(axesHelper);
        }
        this.initLights()
        this.initModelScene();
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

    initScene(){
        const group = new THREE.Group()
        const clipPlanes = [
            new THREE.Plane(new THREE.Vector3(1, 0, 0), 0),
            new THREE.Plane(new THREE.Vector3(0, -1, 0), 0),
            new THREE.Plane(new THREE.Vector3(0, 0, -1), 0),
          ]


        const cubeGeo = new THREE.BoxGeometry(2,2,2);
        const material =  new THREE.MeshLambertMaterial({
            color: new THREE.Color().setHSL(Math.random(), 0.5, 0.5),
            side: THREE.DoubleSide,
            clippingPlanes: clipPlanes,
            clipIntersection: true,
          })
        const cube = new THREE.Mesh(cubeGeo, material)
        group.add(cube)
        cube.rotation.z = 5;
        this.scene.add(group)
    }
    async initModelScene(){
        const group = new THREE.Group()
        const group2 = new THREE.Group()
        const group3 = new THREE.Group()
        const group4 = new THREE.Group()
        const clipPlanes = [
            new THREE.Plane(new THREE.Vector3(0,-1 , 0), .6),
            new THREE.Plane(new THREE.Vector3(0, -1, 0), -1),
          ]
        const model = await this.loadModel();
        const cuore =  model.scene.getObjectByName(`agave-03001`)
        // cuore.children[1].material.clippingPlanes= clipPlanes
        // cuore.children[1].material.clipIntersection= true

        cuore.children.map((child)=> {
            child.material.clippingPlanes= clipPlanes
            child.material.clipIntersection= true
        })

        // new THREE.MeshLambertMaterial({
        //     color: new THREE.Color().setHSL(Math.random(), 0.5, 0.5),
        //     side: THREE.DoubleSide,
        //     clippingPlanes: clipPlanes,
        //     clipIntersection: true,
        //   })
        cuore.position.x = 1
        cuore.position.y = 0.5
        const helpers = new THREE.Group()
        helpers.add(new THREE.PlaneHelper(clipPlanes[0], 2, 0xff0000))
        helpers.add(new THREE.PlaneHelper(clipPlanes[1], 2, 0x00ff00))
        helpers.visible = true
        group.add(cuore)
        group.rotation.x = 0.5
        group2.add(group)
        group3.add(group2)
        group4.add(group3)
        group3.add(helpers)
        this.scene.add(group4)
        
    }

    initRenderer(){
        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
        this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
        this.renderer.localClippingEnabled = true;
    }

    animate() {
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(() => this.animate());

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
}