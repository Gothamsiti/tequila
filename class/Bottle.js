import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export default class Bottle {
    constructor(parent, group, settings){
        this.parent = parent;
        this.group = group;
        this.settings = settings
        this.bottle = null;
        this.init()
    }

    async init(){
        this.bottle = await this.parent.loadModel('./models/bottiglia.glb')
        
        const trasparentMaterial = new THREE.MeshPhongMaterial( {color: 0xffff00 , colorWrite: false} );
        this.bottle.scene.children[0].material =  trasparentMaterial;
        this.bottle.scene.position.y = this.settings.position.y
        this.group.add(this.bottle.scene)


    }

}