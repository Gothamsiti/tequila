import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import gsap from 'gsap' 

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
        this.addToTimeline()
        this.animate()   
    }

    animate(){
        this.tower.material.opacity = this.parent.getOpacity(this.towerHeight, this.tower.position.y,2)
        requestAnimationFrame(()=> this.animate())
        
    }
    addToTimeline(){
        const to = {y : 12}
        const from = {y : 0}
        const tl = gsap.timeline({
            defaults:{
                ease: 'power4.inOut'
            },
            onUpdate:()=> {
                console.log('upldating')
            }
        })
        tl.to(this.tower.position, {
            ...to,
            duration: 1.5,
        })
        tl.to(this.tower.position, {
            ...from,
            duration: 1.5
            
        })
        tl.name='tower'
        this.tower.gsapAnimation = tl


    }
    

}
