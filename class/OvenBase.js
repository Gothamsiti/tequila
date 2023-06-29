import * as THREE from 'three'
import gsap from 'gsap' 

export default class OvenBaase {
    constructor(parent, group, settings){
        this.parent = parent;
        this.group = group;
        this.settings = settings
        this.direction = 1;
        this.ovenBase = null;
        this.rondella = null;
        this.animationDuration = 3
        this.ovenBaseHeight  = 5
        this.init()
    }

    async init(){

        const gltf = await this.parent.loadModel('/models/forno_base.glb')
        this.ovenBase = gltf.scene
        this.group.add(this.ovenBase)
        this.ovenBase.traverse(node=>{
            if(node.type=="Mesh"){
                node.position.y = 0
                node.material.transparent = true
            }
        } )
        
        this.setMillstone()
        const box = new THREE.Box3().setFromObject( this.ovenBase); 
        const size = box.getSize(new THREE.Vector3());
        this.ovenBaseHeight = size.y;
        this.addToTimeline()
        this.opacityWacher()   
    }

    setMillstone(){
        this.rondella = this.ovenBase.getObjectByName(`macina-cilindro`);
        const box = new THREE.Box3().setFromObject( this.rondella); 
        const size = box.getSize(new THREE.Vector3());
        this.rondella.position.y += size.y /2
        
    }

    opacityWacher(){
        
        this.ovenBase.traverse(node=>{
            if(node.type=="Mesh"){
                
                node.material.opacity = this.parent.memoGetOpacity(this.ovenBaseHeight/2, this.ovenBase.position.y, 4 )
            }
        } )
        requestAnimationFrame(()=> this.opacityWacher())
        
    }
    addToTimeline(){
        const groupTL = {
            step1 :{position : {y : .4}},
            step2 :{position: {y : 10}},
            }
        const millstone = this.ovenBase.getObjectByName(`macina-braccio`);
        const millstoneTL = {
            from: { scale : {x : millstone.scale.x} , rotation : { y : 0}},
            step1: { scale : {x :1} , rotation : { y : THREE.MathUtils.degToRad(150)}},
            step2: { scale : {x :millstone.scale.x} }
        }
        const rondellaTl = {
            from : {rotation : {z : this.rondella.rotation.x}},
            step1: { rotation : { z :  THREE.MathUtils.degToRad(-270)}}
        }
        const tl = gsap.timeline({
            defaults:{
                onUpdate:()=> {
                    millstone.scale.set(millstoneTL.from.scale.x,millstoneTL.from.scale.x,millstoneTL.from.scale.x)
                },
                
            },
        })

        tl.to(this.ovenBase.position, {
            ...groupTL.step1.position,
            ease: 'power2.Out',
            delay: 0,
            duration: 2,
        })
        tl.to(millstoneTL.from.scale, {
            ...millstoneTL.step1.scale,
            
            delay: 2.4,
            duration: .2
        },
        
        )
        tl.to(millstone.rotation, {
            ...millstoneTL.step1.rotation,
            ease: "none",
            
            duration: 4
        },
        "7"
        )
        

        tl.to(this.ovenBase.position, {
            ...groupTL.step2.position,
            duration: this.animationDuration,
            ease: 'power2.inOut',
            
        },
        `-=1.5`
        )
        tl.to(millstoneTL.from.scale, {
            ...millstoneTL.step2.scale,
            
            
            duration: .2
        },
        "-=1.5"
        )
        tl.to(this.rondella.rotation,{
            ...rondellaTl.step1.rotation,
            duration: 3
        }, '7')
        tl.addLabel('ovenBase')
        tl.name='ovenBase'
        this.ovenBase.gsapAnimation = tl
    }
    

}
