import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export default class Tower {
    constructor(parent, group, settings){
        this.parent = parent;
        this.group = group;
        this.settings = settings
        this.tower = null;
        this.towerHeight  = 5
        this.init()
    }

    async init(){
        console.log(this.parent.clipPlanes)
        const geometry = new THREE.CylinderGeometry( 2, 2, this.towerHeight, 10 ); 
        const material = new THREE.MeshBasicMaterial( {
            color: 0xffff00, 
            side: THREE.DoubleSide,
            transparent : true,
            clippingPlanes : this.parent.clipPlanes,
            clipIntersection : true,
        }); 
        this.tower = new THREE.Mesh( geometry, material ); 
        

        this.group.add(this.tower)
        this.animate()
    }

    animate(){
        if(this.tower.position.y < 4 + this.towerHeight / 3 ) {
            this.tower.position.y += 0.1;
            this.tower.material.opacity -= .002
            console.log(this.tower.material)
        }

        requestAnimationFrame(()=> this.animate())
    }
    

}