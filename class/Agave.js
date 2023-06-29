import * as THREE from 'three';
import InstancedMeshClass from './InstancedMeshClass.js';
import gsap from 'gsap' 

export default class Agave {
    constructor(parent, origin, gltf){
        this.origin = origin;
        this.gltf = gltf;
        this.parent = parent;
        this.group = this.parent.agaveGroup
        this.direction = 1;
        this.groupHeight = null;
        this.modelGroup = new THREE.Group();
        this.layers = [
            { search: '01', rotationOffset: 110, angle : 0 , quantity: 9, mesh : null, from: {}, to: { position: {x:.2, y:0, z: .2}, rotation: {x: -10, y: 0, z: 0}}},
            { search: '02', rotationOffset: 90, angle : THREE.MathUtils.degToRad(16), quantity: 9, mesh : null, from: {}, to: { position: {x:.14, y:.3, z: .14}, rotation: {x: -10, y: 0, z: 0}}},
            { search: '03', rotationOffset: 110, angle : THREE.MathUtils.degToRad(45), quantity: 9, mesh : null, from: {}, to: { position: {x:.16, y:.2, z: .16}, rotation: {x: -10, y: 0, z: 0}}},
            { search: '04', rotationOffset: 90, angle : THREE.MathUtils.degToRad(80), quantity: 6, mesh : null, from: {}, to: { position: {x:-.18, y:.2, z:-.18}, rotation: {x: -10, y: 0, z: 0}}},
            { search: '05', rotationOffset: 130, angle : THREE.MathUtils.degToRad(110), quantity: 6, mesh : null, from: {}, to: { position: {x:-.2, y:0, z:-.2}, rotation: {x: -10, y: 0, z: 0}}},
            { search: '06', rotationOffset: 130, angle : THREE.MathUtils.degToRad(130), quantity: 3, mesh : null, from: {}, to: { position: {x:.3, y:0, z:.3}, rotation: {x: -10, y: 0, z: 0}}},
        ]
        this.leafDummies = [];
        this.init()
    }


    init() {
        const agave_cuore = new THREE.Group();        
        this.layers.map((layer, i) => {
            const piano = this.gltf.scene.getObjectByName(`foglia-agave-${layer.search}`);
            layer.mesh = new InstancedMeshClass(this, piano.geometry, piano.material, layer, i);
            const cuore =  this.gltf.scene.getObjectByName(`agave-${layer.search}001`)
            cuore.children.map((child, i)=> { 
                child.renderOrder = 3
                child.material.clippingPlanes = this.clipPlanes;
                child.material.transparent = true
                child.material.clipIntersection = true;
            })

            agave_cuore.add( cuore)
        })
        
        this.modelGroup.position.x = this.origin.x ?? 0
        this.modelGroup.position.z = this.origin.z ?? 0
        this.modelGroup.position.y = this.origin.y ?? 0
        this.modelGroup.add(agave_cuore);
        const box = new THREE.Box3().setFromObject( this.modelGroup  ); 
        const size = box.getSize(new THREE.Vector3());
        this.groupHeight = size.y
        this.group.add(this.modelGroup)
        this.group.scale.set(.01,.01,.01)
        this.addToTimeline();

        // this.opacityWatcher()


    }
    addToTimeline(){
        const leafDummiesPositions = this.leafDummies.map(d => d.position);

        const agaveGroupTl = {
            from: { scale : { x : this.group.scale.x }},
            step1: {
                scale: { x :1 },
                rotation: { y: THREE.MathUtils.degToRad(360/5) }
            },
            step2: {
                
                position: { y: -2 }
            }
        }

        const agaveTl = {
            step1: {
                rotation: { y: THREE.MathUtils.degToRad(270) }
            },
            step2: {
                rotation: { y: THREE.MathUtils.degToRad(540) }
            }
        }


        const tl = gsap.timeline({
            onUpdate : () => {
                this.group.scale.set(agaveGroupTl.from.scale.x,agaveGroupTl.from.scale.x,agaveGroupTl.from.scale.x)
                for(const dummy of this.leafDummies){
                    dummy.updateMatrix();
                    dummy.parentMesh.setMatrixAt(dummy.dummyIndex, dummy.matrix);
                    dummy.parentMesh.instanceMatrix.needsUpdate = true;
                }
            },
        })
        tl.to(agaveGroupTl.from.scale, {
            ...agaveGroupTl.step1.scale,
            duration: 1,            
        },
        '0')

        tl.to(
            leafDummiesPositions,
            { 
                x : i => {  
                    const deg = this.leafDummies[i].offsetDegrees - i * this.leafDummies[i].deltaDegrees;
                    return -this.leafDummies[i].layer.to.position.x * Math.cos(THREE.MathUtils.degToRad(deg))
                },
                z : i => {  
                    const deg = this.leafDummies[i].offsetDegrees - i * this.leafDummies[i].deltaDegrees;
                    return -this.leafDummies[i].layer.to.position.z * Math.sin(THREE.MathUtils.degToRad(deg))
                },
                y : i => {
                    return this.leafDummies[i].layer.to.position.y * Math.sin(this.leafDummies[i].layer.angle)
                },
                stagger: .02,
                duration : .6,
            }
        )
        tl.to(
            leafDummiesPositions,
            {
                y : -1.3,
                ease : "back.in(.9)",
                stagger: .02,
                duration :1,
            },
            "-=.75"
        )
        tl.to(this.group.rotation, {
            ...agaveGroupTl.step1.rotation,
            duration: 2.4,            
        },
        '0')
        tl.to(this.modelGroup.rotation, {
            ...agaveTl.step1.rotation,
            duration: 2.4,            
        },
        '0')
        tl.to(this.modelGroup.rotation, {
            ...agaveTl.step2.rotation,
            duration: 1.6,            
        },
        '3.4')
        tl.to(this.group.position, {
            ...agaveGroupTl.step2.position,
            duration: 1,       
            ease: "power2.in",     
        },
        "4"
        )
        
        tl.addLabel('agave')
        tl.name = 'agave';
        this.modelGroup.gsapAnimation = tl


    }

    // opacityWatcher(){

    //     this.modelGroup.children[6].children.map(cuore=> cuore.children.map((child)=> {
    //         child.material.opacity = this.parent.getOpacity(this.groupHeight, this.modelGroup.position.y, 4)
    //     }))

    //     // if(this.modelGroup.position.y > 8 || this.modelGroup.position.y < 0 ){
    //     //     this.direction = this.direction * -1
    //     // }

    //     requestAnimationFrame(()=> this.opacityWatcher())
    // }

}