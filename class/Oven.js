import * as THREE from 'three'
import gsap from 'gsap'

export default class Oven {
    constructor(parent, group, settings) {
        this.parent = parent;
        this.group = group;
        this.settings = settings
        this.direction = 1;
        this.oven = null;
        this.animationDuration = 3
        this.ovenHeight = 5
        this.init()
    }

    async init() {
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

        const box = new THREE.Box3().setFromObject(this.oven);
        const size = box.getSize(new THREE.Vector3());
        this.ovenHeight = size.y;

        this.oven.traverse(node => {
            if (node.type == "Mesh") {
                node.position.y = 10
                node.material.transparent = true
            }
        })


        // this.group.add(oven.children[0].clone())
        // this.group.add(oven.children[1].clone())
        // this.group.add(oven.children[2].clone())
        // this.group.add(oven.children[3].clone())

        this.oven.position.y = 0;
        // this.group.add(this.oven)
        this.addToTimeline()
        this.opacityWatcher()
    }
    opacityWatcher() {
        let counter = 0;

        this.oven.traverse((node )=> {
            if (node.type == "Mesh") {
                node.material.opacity = this.parent.getOpacity(1, node.position.y, 4 + (counter*.2))
                counter+=1
            }
        })
        requestAnimationFrame(() => this.opacityWatcher())

    }
    addToTimeline() {
        const tl = gsap.timeline({
            defaults: {
                ease: 'power2.inOut'
            },
        })

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
            `3.${(this.oven.children.length -i) *1 }`
            )

            tl.to(this.oven.children[i].rotation, {
                ...layer.step2.rotation,
                duration: 2
            },
                `3.4`
            )

        })

     
        tl.addLabel('oven')
        tl.name = 'oven'
        this.oven.gsapAnimation = tl


    }


}
