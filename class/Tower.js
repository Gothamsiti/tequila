import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export default class Tower {
    constructor(parent, group, settings){
        this.parent = parent;
        this.group = group;
        this.settings = settings
        this.direction = 1;
        this.tower = null;
        this.towerHeight  = 5
        this.init()
    }

    async init(){
        const geometry = new THREE.CylinderGeometry( 2, 2, this.towerHeight, 10 ); 
        const material = new THREE.MeshBasicMaterial( {
            color: 0xffff00, 
            side: THREE.DoubleSide,
            transparent : true,
        }); 
        this.tower = new THREE.Mesh( geometry, material ); 
        
        this.tower.customParameters = {
            height: this.tower.geometry.parameters.height
        }
        this.group.add(this.tower)
        // this.animate()   
    }

    animate(){
        this.tower.material.opacity = this.parent.getOpacity(this.towerHeight, this.tower.position.y,2)
        this.tower.position.y += 0.1 * this.direction;
        if(this.tower.position.y > 11 || this.tower.position.y < 0 ){
            this.direction = this.direction * -1
        }
        requestAnimationFrame(()=> this.animate())
        
    }
    

}
