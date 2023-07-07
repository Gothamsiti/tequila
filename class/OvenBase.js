import * as THREE from 'three'
import gsap from 'gsap' 

export default class OvenBaase {
    constructor(parent, oven, group, settings){
        this.parent = parent;
        this.group = group;
        this.settings = settings
        this.oven = oven;
        this.macinaBraccio = null;
        this.macinaCilindro = null;
        this.animationDuration = 3
        this.ovenBaseHeight  = 5
        this.seeds = null;
        this.inited = false;
        this.parent.ready.ovenBase = false
        this.init()
    }

    async init(){
        this.ovenBase = this.oven.scene.getObjectByName('04-forno-base');
        this.ovenBase.position.y = this.settings.position.y;
        this.ovenBase.scale.set(.9,.9,.9);
        this.group.add(this.ovenBase);
        
        this.ovenBase.traverse(node=>{
            if(node.type == "Mesh"){
                node.material.transparent = true
                if(node.name=='Circle002_1'){
                    this.seeds = node
                    this.seeds.position.y = -1;
                }
            }
        } )
        this.macinaBraccio = this.ovenBase.getObjectByName(`macina-braccio`);
        this.macinaBraccio.scale.set(0,0,0);

        this.macinaBraccio.rotation.y = THREE.MathUtils.degToRad(-90)
        this.macinaCilindro = this.ovenBase.getObjectByName(`macina-cilindro`);

        const box = new THREE.Box3().setFromObject( this.ovenBase); 
        const size = box.getSize(new THREE.Vector3());
        this.ovenBaseHeight = size.y;
        this.opacityWacher();

        this.inited = true;  
        this.parent.ready.ovenBase = true
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
            step1 :{position : {y : 0}},
            step2 :{position: {y : 15}},
        }
        
        const macinaBraccioTL = {
            from: { rotation : { y : context.macinaBraccio.rotation.y }},
            step1: { rotation : { y : THREE.MathUtils.degToRad(150) }},
        }
        const seedsTL = {
            from: { position:{ y : context.seeds.position.y}},
            step1: { position:{ y : 0}}
        }
        
        const macinaCilindroTl = {
            from : {rotation : {z : context.macinaCilindro.rotation.x}},
            step1: { rotation : { z :  THREE.MathUtils.degToRad(-270)}}
        }

        const tl = gsap.timeline({
            onStart : () => {
                context.macinaBraccio.scale.set(0,0,0);
            }
        });
        
        tl.to(context.ovenBase.position, {
            ...groupTL.step1.position,
            ease: 'power2.Out',
            delay: 0,
            duration: 2,
        })
        tl.to(context.seeds.position, {
            ...seedsTL.step1.position,
            ease: "power4.in",
            duration: .2,
            onComplete: () => {
                context.macinaBraccio.scale.set(1,1,1);
            }
        },
        "4.5")

        tl.to(context.macinaBraccio.rotation, {
            ...macinaBraccioTL.step1.rotation,
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

        tl.to(context.macinaCilindro.rotation,{
            ...macinaCilindroTl.step1.rotation,
            duration: 5
        }, '7')

        return tl;
    }
}
