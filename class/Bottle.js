import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export default class Bottle {
    constructor(group, settings){
        this.group = group;
        this.settings = settings
        this.bottle = null;
        this.init()
    }

    async init(){
        this.bottle = await this.loadBottle()
        console.log(this.bottle.scene.children[0])
        
        const trasparentMaterial = new THREE.MeshPhongMaterial( {color: 0xffff00 , colorWrite: false} );
        this.bottle.scene.children[0].material =  trasparentMaterial;
        this.bottle.scene.position.y = this.settings.position.y
        this.group.add(this.bottle.scene)


    }

    async loadBottle(){
        return await new Promise((resolve, reject)=> {
            const loader = new GLTFLoader()
            return loader.load(
                './models/bottiglia.glb',
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