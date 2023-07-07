import * as THREE from 'three'
import gsap from 'gsap'

export default class Oven {
    constructor(parent, oven, group, settings) {
        this.parent = parent;
        this.group = group;
        this.settings = settings
        this.direction = 1;
        this.glb = oven;
        this.oven = new THREE.Group();
        this.door = null
        this.animationDuration = 3
        this.ovenHeight = 5
        this.ovenScale = .9
        this.light = null;
        this.ring = null;
        this.parent.ready.oven = false
        this.inited = false;

        this.init()
    }

    async init() {
        var models = [];
        this.glb.scene.traverse((child) => {
            if(['liv_01','liv_02','liv_03','liv_04','door'].includes(child.name)) models.push(child)
        })
        models.map(m => this.oven.add(m));

        const box = new THREE.Box3().setFromObject(this.oven);
        const size = box.getSize(new THREE.Vector3());
        this.ovenHeight = size.y;
        this.door = this.oven.getObjectByName(`door`);
        this.door.scale.set(.01,.01,.01)
        this.door.position.y = -2
        this.oven.scale.set(this.ovenScale,this.ovenScale,this.ovenScale)
        this.group.add(this.door)
        this.initLight()
        this.initCylinder()
        
        this.oven.traverse(node => {
            if (node.type == "Mesh") {
                node.position.y = 10
                node.material.transparent = true
            }
        })
        this.door.traverse(node => {
            if (node.type == "Mesh") {
                node.material = node.material.clone();
                node.material.transparent = true
                node.position.z+= 0.4
                
            }
        })
        this.group.add(this.oven)
        this.opacityWatcher();

        this.inited = true;
        this.parent.ready.oven = true
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

    initLight(){
        this.light = new THREE.PointLight( 0xffee88, 0, 100, 2 );
        this.light.position.y= 1;
        this.group.add(this.light)
    }
    initCylinder(){
        // Define the outer and inner radius of the cylinder
        const outerRadius = 1.2
        

        // Create a shape for the outer circle
        const outerShape = new THREE.Shape();
        outerShape.absarc(0, 0, outerRadius, 0, Math.PI * 2, false);

        // Create a shape for the inner circle
        

        // Create a path for the outer shape
        const outerPath = new THREE.Path(outerShape.getPoints());
        outerPath.closePath();

        // Create a path for the inner shape
        

        // Create the final shape by subtracting the inner shape from the outer shape
        const finalShape = new THREE.Shape();
        finalShape.moveTo(0, 0);
        finalShape.holes.push(outerPath);

        // Create the geometry by extruding the final shape
        const geometry = new THREE.ExtrudeGeometry(finalShape, {
        depth: 1.9, // Adjust the depth of the cylinder as needed
        bevelEnabled: false
        });

        // Create a material
        const material = new THREE.MeshBasicMaterial({ color: 0x958980, side: THREE.DoubleSide, transparent: true });

        // Create a mesh and add it to the scene
        this.ring = new THREE.Mesh(geometry, material);
        this.ring.renderOrder =2
        this.ring.rotation.x = THREE.MathUtils.degToRad(90)
        this.ring.material.opacity= 0;
        this.ring.position.y= 0;
        this.group.add(this.ring);
    }


    addToTimeline(context) {
        const lightTl = {
            from : { intensity : context.light.intensity },
            step1: {intensity : 1},
            step2 : { intensity : 0}
        }
        const ringTL = {
            from: {position: { y : context.ring.position.y }, material: {opacity: context.ring.material.opacity}},
            step1: {position : { y : 1.9}, material : {opacity : 1 }},
            step2: {position : { y : 0}, material : {opacity : 0}}
        }
        const doorTl = {
            from: { position: {y : context.door.position.y }, scale: { x: context.door.scale.x },rotation: { y : context.door.rotation.y }},
            step1: { position: {y : 0, z: .1 }, scale: {x: context.ovenScale },rotation: { y :  THREE.MathUtils.degToRad(180) }},
            step2: { position: { z: .35 } },
            step3: { position: {y : 9.08 ,z: 0}, rotation: { y : THREE.MathUtils.degToRad(360) }}
        }
        // setup degli step 
        const layersTL = context.oven.children
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
                    context.door.visible = context.door.scale.x == context.ovenScale
                    context.door.scale.set(doorTl.from.scale.x,doorTl.from.scale.x,doorTl.from.scale.x)
                }
            },
        })

        // LAYER DI MURA
        layersTL.map((layer, i) => {
            tl.to(context.oven.children[i].position, {
                ...layer.step1.position,
                duration: 1,
                delay: 1,
                ease: 'power2.out'
            },
            `0.${i*1}`
            )
            tl.to(context.oven.children[i].rotation, {
                ...layer.step1.rotation,
                ease: 'power2.inOut',
                duration: 1.4,
                delay: 1,
            },
            "0"
            )   
            tl.to(context.oven.children[i].position, {
                ...layer.from.position,
                duration: context.animationDuration,
            },
            `6.${(context.oven.children.length -i) *1 }`
            )
            tl.to(context.oven.children[i].rotation, {
                ...layer.step2.rotation,
                duration: 2
            },
            `6.4`
            )

        })
        // FINE LAYER DI MURA

        // DOOR      
        tl.to(context.door.position, {
            ...doorTl.step1.position,
            duration: context.animationDuration,
        },
        `0`
        )
        tl.to(context.door.rotation, {
            ...doorTl.step1.rotation,
            duration: context.animationDuration,
        },
        `.5`
        )
        tl.to(context.ring.material, {
            ...ringTL.step1.material,
            duration: .2,
            ease: "power2.out"
        },
        "3.3")
        tl.to(context.ring.position, {
            ...ringTL.step1.position,
            duration: .2,
            ease: "power2.out"
        },
        "3.3")
        tl.to(context.light,{
            ...lightTl.step1,
            ease: "bounce.inOut",
            duration: 1.5
        },"3.5")
        tl.to(context.light,{
            ...lightTl.step2,
            ease: "bounce.inOut",
            duration: 1.5
        },"5.5")
        tl.to(context.ring.material, {
            ...ringTL.step2.material,
            duration: .2,
            ease: "power2.out"
        },
        "6.3")
        tl.to(context.ring.position, {
            ...ringTL.step2.position,
            duration: .2,
            ease: "power2.out"
        },
        "6.3")
        tl.to(context.door.position, {
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
        tl.to(context.door.position, {
            ...doorTl.step3.position,
            duration: context.animationDuration,
        },
        `6.35`
        )
        tl.to(context.door.rotation, {
            ...doorTl.step3.rotation,
            duration: 2,
        },
        `6.35`
        )

        
        return tl
    }


}
