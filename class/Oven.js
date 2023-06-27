import * as THREE from 'three'
import gsap from 'gsap' 

export default class Oven {
    constructor(parent, group, settings){
        this.parent = parent;
        this.group = group;
        this.settings = settings
        this.direction = 1;
        this.oven = null;
        this.animationDuration = 3
        this.ovenHeight  = 5
        this.init()
    }

    async init(){
        // const geometry = new THREE.CylinderGeometry( 2, 2, this.ovenHeight, 10 ); 
        // const material = new THREE.MeshBasicMaterial( {
        //     color: 0xffff00, 
        //     side: THREE.DoubleSide,
        //     transparent : true,
        // }); 
        // this.oven = new THREE.Mesh( geometry, material ); 
        
        // this.oven.customParameters = {
        //     height: this.oven.geometry.parameters.height
        // }
        const gltf = await this.parent.loadModel('/models/forno.glb')
        
        // console.log(gltf)
        this.oven = gltf.scene
        
        this.group.add(this.oven)
        
        const box = new THREE.Box3().setFromObject( this.oven); 
        const size = box.getSize(new THREE.Vector3());
        this.ovenHeight = size.y;

        this.oven.traverse(node=>{
            if(node.type=="Mesh"){
                node.position.y = 0
                node.material.transparent = true
            }
        } )
        

        // this.group.add(oven.children[0].clone())
        // this.group.add(oven.children[1].clone())
        // this.group.add(oven.children[2].clone())
        // this.group.add(oven.children[3].clone())

        this.oven.position.y = 10;
        // this.group.add(this.oven)
        this.addToTimeline()
        this.animate()   
    }

    animate(){
        
        this.oven.traverse(node=>{
            if(node.type=="Mesh"){
                
                node.material.opacity = this.parent.getOpacity(this.ovenHeight, this.oven.position.y, 4 )
            }
        } )
        requestAnimationFrame(()=> this.animate())
        
    }
    addToTimeline(){
        const groupTL = {
            from :{position : {y : this.oven.position.y}},
            to :{position: {y : 0}},
            }
        const tl = gsap.timeline({
            defaults:{
                ease: 'power4.inOut'
            },
        })


        const layersTL = this.oven.children.map((layer, i)=> ( {from : {rotation : { y : layer.rotation.y} } , to : { rotation : { y : THREE.MathUtils.degToRad(180 * (i % 2 == 0 ? 1 : -1))}}}))

        tl.to(this.oven.position, {
            ...groupTL.to.position,
            duration: this.animationDuration,
            delay: 0,
        })
        
        layersTL.map((layer, i)=> {
            tl.to(this.oven.children[i].rotation, {
                ...layer.to.rotation,
                duration: this.animationDuration,
            },
            "0"
            )
            tl.to(this.oven.children[i].rotation, {
                ...layer.from.rotation,
                duration: this.animationDuration,
            },
            `${this.animationDuration}`
            )
            tl.to(this.oven.children[i].rotation, {
                ...layer.to.rotation,
                duration: this.animationDuration,
            },
            "0"
            )
        })

        tl.to(this.oven.position, {
            ...groupTL.from.position,
            duration: this.animationDuration,
            
        },
        `${this.animationDuration}`
        )
        tl.addLabel('oven')
        tl.name='oven'
        this.oven.gsapAnimation = tl


    }
    

}
