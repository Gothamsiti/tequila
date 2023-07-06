import * as THREE from 'three'
import gsap from 'gsap' 

export default class OvenBaase {
    constructor(parent, group, settings){
        this.parent = parent;
        this.group = group;
        this.settings = settings
        this.direction = 1;
        this.ovenBase = null;
        this.ovenBaseScale = .9;
        this.millstone = null;
        this.rondella = null;
        this.animationDuration = 3
        this.ovenBaseHeight  = 5
        this.seeds = null;
        this.inited = false;
        this.parent.ready.ovenBase = false
        this.init()
    }

    async init(){
        const gltf = await this.parent.loadModel('/models/forno_base_texture.glb')
        this.ovenBase = gltf.scene
        this.ovenBase.scale.set(this.ovenBaseScale, this.ovenBaseScale, this.ovenBaseScale)
        
        this.group.add(this.ovenBase)
        this.ovenBase.traverse(node=>{
            if(node.type=="Mesh"){
                node.position.y = 0.02
                node.material.transparent = true
                if(node.name=='Circle002_1'){
                    this.seeds = node
                    this.seeds.position.y = -1;
                }
            }
        } )
        
        this.setMillstone()
        const box = new THREE.Box3().setFromObject( this.ovenBase); 
        const size = box.getSize(new THREE.Vector3());
        this.ovenBaseHeight = size.y;
        this.opacityWacher();
        this.inited = true;  
        this.parent.ready.ovenBase = true
    }

    setMillstone(){
        this.rondella = this.ovenBase.getObjectByName(`macina-cilindro`);
        this.millstone = this.ovenBase.getObjectByName(`macina-braccio`);
        const box = new THREE.Box3().setFromObject( this.rondella); 
        const size = box.getSize(new THREE.Vector3());
        this.rondella.position.y += size.y /2
    }

    opacityWacher(){
        this.ovenBase.traverse(node=>{
            if(node.type=="Mesh"){
                
                node.material.opacity = this.parent.memoGetOpacity(this.ovenBaseHeight/2, this.ovenBase.position.y, 6 )
            }
        } )
        requestAnimationFrame(()=> this.opacityWacher())
        
    }

    addToTimeline(context){
        const groupTL = {
            step1 :{position : {y : .4}},
            step2 :{position: {y : 15}},
        }
        
        const millstoneTL = {
            from: { scale : {x : context.millstone.scale.x} , rotation : { y : 0}},
            step1: { scale : {x :1} , rotation : { y : THREE.MathUtils.degToRad(150)}},
            step2: { scale : {x :context.millstone.scale.x} }
        }
        const seedsTL = {
            from: { position:{ y : context.seeds.position.y}},
            step1: { position:{ y : 0}}
        }
        
        const rondellaTl = {
            from : {rotation : {z : context.rondella.rotation.x}},
            step1: { rotation : { z :  THREE.MathUtils.degToRad(-270)}}
        }
        const tl = gsap.timeline({
            defaults:{
                onUpdate:()=> {
                    context.millstone.scale.set(millstoneTL.from.scale.x,millstoneTL.from.scale.x,millstoneTL.from.scale.x)
                },
                
            },
        })

        tl.to(context.ovenBase.position, {
            ...groupTL.step1.position,
            ease: 'power2.Out',
            delay: 0,
            duration: 2,
        })
        
        tl.to(millstoneTL.from.scale, {
            ...millstoneTL.step1.scale,
            delay: 2.5,
            duration: .2
        })

        tl.to(context.seeds.position, {
            ...seedsTL.step1.position,
            
            ease: "power4.in",
            duration: .2
        },
        "4.5")

        tl.to(context.millstone.rotation, {
            ...millstoneTL.step1.rotation,
            ease: "none",
            duration: 5
        },
        "7")

        tl.to(context.ovenBase.position, {
            ...groupTL.step2.position,
            duration: context.animationDuration,
            ease: 'power2.inOut',
            
        },
        `-=1.5`)

        tl.to(millstoneTL.from.scale, {
            ...millstoneTL.step2.scale,
            duration: .2
        },
        "-=.2")

        tl.to(context.rondella.rotation,{
            ...rondellaTl.step1.rotation,
            duration: 5
        }, '9')

        return tl;
    }
}
