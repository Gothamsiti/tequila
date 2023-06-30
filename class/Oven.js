import * as THREE from 'three'
import gsap from 'gsap'

export default class Oven {
    constructor(parent, group, settings) {
        this.parent = parent;
        this.group = group;
        this.settings = settings
        this.direction = 1;
        this.oven = null;
        this.door = null
        this.animationDuration = 3
        this.ovenHeight = 5
        this.ovenScale = .9
        this.init()
    }

    async init() {

        const gltf = await this.parent.loadModel('/models/forno.glb')
        this.oven = gltf.scene
        const box = new THREE.Box3().setFromObject(this.oven);
        const size = box.getSize(new THREE.Vector3());
        this.ovenHeight = size.y;
        this.door = this.oven.getObjectByName(`door`);
        this.door.scale.set(.01,.01,.01)
        this.oven.scale.set(this.ovenScale,this.ovenScale,this.ovenScale)
        this.group.add(this.door)
        this.oven.traverse(node => {
            if (node.type == "Mesh") {
                node.position.y = 10
                node.material.transparent = true
                
            }
        })
        this.door.traverse(node => {
            if (node.type == "Mesh") {
                node.material.transparent = true
                node.position.z+= 0.4
                
            }
        })
        this.group.add(this.oven)
        this.addToTimeline()
        this.opacityWatcher()
    }
    opacityWatcher() {
        
        this.oven.traverse((node )=> {
            if (node.type == "Mesh") {
                
                node.material.opacity = this.parent.memoGetOpacity(this.ovenHeight/2, node.position.y, 2)
            }
        })
        this.door.traverse((node )=> {
            if (node.type == "Mesh") {
                node.material.opacity = this.parent.memoGetOpacity(this.ovenHeight/2, this.door.position.y,1)
            }
        })
        requestAnimationFrame(() => this.opacityWatcher())

    }

    addToTimeline() {
        
        const doorTl = {
            from: { position: {y : this.door.position.y}, scale: {x: this.door.scale.x},rotation: { y : this.door.rotation.y , }},
            // step1: { position: {y : 0, x :-0.2, z: -0.2 }, rotation: { y :  THREE.MathUtils.degToRad(180) }},
            step1: { position: {y : 0, z: .1 }, scale: {x: this.ovenScale},rotation: { y :  THREE.MathUtils.degToRad(180),  }},
            step2: { position: { z: .35 } },
            step3: { position: {y : 9.08 ,z: 0}, rotation: { y : THREE.MathUtils.degToRad(360) }}
            
        }
        // setup degli step 
        const layersTL = this.oven.children
                        .map((layer, i) => (
                            { 
                                from: { 
                                    rotation: { 
                                        y: layer.rotation.y 
                                    }, 
                                    position: { 
                                        y: layer.position.y 
                                    } 
                                }, 
                                step1: { 
                                    rotation: { 
                                        y: THREE.MathUtils.degToRad(-180 * (i % 2 == 0 ? -1 : 1)) 
                                    },
                                    position: { 
                                        y: 0 
                                    } 
                                } ,
                                step2: { 
                                    rotation: { 
                                        y: THREE.MathUtils.degToRad((i % 2 == 0 ? 360 : -360))
                                    },
                                } 
                            }))



        // esecuzione tl
        const tl = gsap.timeline({
            defaults: {
                ease: 'power2.inOut',
                onUpdate: ()=> {
                    
                    this.door.visible =this.door.scale.x == this.ovenScale
                    
                    this.door.scale.set(doorTl.from.scale.x,doorTl.from.scale.x,doorTl.from.scale.x)
                }
            },
        })


        // LAYER DI MURA
        layersTL.map((layer, i) => {
            tl.to(this.oven.children[i].position, {
                ...layer.step1.position,
                duration: 1,
                delay: 1,
                ease: 'power2.out'
            },
            `0.${i*1}`
            )
            tl.to(this.oven.children[i].rotation, {
                ...layer.step1.rotation,
                ease: 'power2.inOut',
                duration: 1.4,
                delay: 1,
            },
            "0"
            )
            
            tl.to(this.oven.children[i].position, {
                ...layer.from.position,
                duration: this.animationDuration,
            },
            `5.${(this.oven.children.length -i) *1 }`
            )
            tl.to(this.oven.children[i].rotation, {
                ...layer.step2.rotation,
                duration: 2
            },
                `5.4`
            )

        })
        // FINE LAYER DI MURA

        // DOOR 
       
        tl.to(this.door.position, {
            ...doorTl.step1.position,
            duration: this.animationDuration,
        },
        `0`
        )
        tl.to(this.door.rotation, {
            ...doorTl.step1.rotation,
            duration: this.animationDuration,
        },
        `.5`
        )
        tl.to(this.door.position, {
            ...doorTl.step2.position,
            duration: 1,
            ease:"power1.out",

        },
        `2.5`
        )
        tl.to(doorTl.from.scale, {
            ...doorTl.step1.scale,
            ease:"power2.in",
            duration: .3,
        },
        `2.1`
        )

        tl.to(this.door.position, {
            ...doorTl.step3.position,
            duration: this.animationDuration,
        },
        `5.35`
        )
        tl.to(this.door.rotation, {
            ...doorTl.step3.rotation,
            duration: 2,
        },
        `5.35`
        )

     
        tl.addLabel('oven')
        tl.name = 'oven'
        this.oven.gsapAnimation = tl


    }


}
