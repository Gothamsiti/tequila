import * as THREE from 'three';
import InstancedMeshClass from '~/class/InstancedMeshClass.js';
import gsap from 'gsap' 

export default class Agave {
    constructor(parent, origin, gltf, i){
        this.origin = origin;
        this.i = i;
        this.gltf = gltf;
        this.parent = parent;
        this.group = this.parent.agaveGroup
        this.direction = 1;
        this.agaveScale = .5
        this.distanceFromBottle = 1.5;
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
        this.inited = false;
        this.parent.ready['agave'+this.i] = false
        this.init()
    }

    init() {
        const agave_cuore = new THREE.Group();        
        this.layers.map((layer, i) => {
            const piano = this.gltf.scene.getObjectByName(`foglia-agave-${layer.search}`);
            layer.mesh = new InstancedMeshClass(this, piano.geometry, piano.material, layer, i);
            const cuore =  this.gltf.scene.getObjectByName(`agave-${layer.search}001`)
            cuore.scale.set(this.agaveScale,this.agaveScale,this.agaveScale)
            layer.mesh.mesh.scale.set(this.agaveScale,this.agaveScale,this.agaveScale)
            cuore.children.map((child, i)=> { 
                child.renderOrder = 3
                child.material.clippingPlanes = this.clipPlanes;
                child.material.transparent = true
                child.material.clipIntersection = true;
            })

            agave_cuore.add( cuore)
        })
        const px = this.distanceFromBottle * Math.cos(THREE.MathUtils.degToRad(this.origin.deg))
        const pz = this.distanceFromBottle *  Math.sin(THREE.MathUtils.degToRad(this.origin.deg));
        
        this.modelGroup.position.x = px
        this.modelGroup.position.z = pz ?? 0
        this.modelGroup.position.y = this.origin.y ?? 0
        this.modelGroup.add(agave_cuore);
        const box = new THREE.Box3().setFromObject( this.modelGroup  ); 
        const size = box.getSize(new THREE.Vector3());
        this.groupHeight = size.y
        this.group.add(this.modelGroup)
        this.group.scale.set(.01,.01,.01);
        this.parent.ready['agave'+this.i] = true
        this.inited = true;
    }
    addToTimeline(context){
        const leafDummiesPositions = context.leafDummies.map(d => d.position);
        const agaveGroupTl = {
            from: { scale : { x : context.group.scale.x },},
            step1: {
                scale: { x :1 },
                rotation: { y: THREE.MathUtils.degToRad(150) }
            },
            step2: {
                rotation: { y: THREE.MathUtils.degToRad(360) },
                position: { y: 0 },
            },
            step3: {
                rotation: { y: THREE.MathUtils.degToRad(510) },
            }
        }

        const agaveTl = {
            from : {distanceFromBottle:{ distance : context.distanceFromBottle}, rotation : { y : context.modelGroup.rotation.y}},
            step1: { rotation: { y: THREE.MathUtils.degToRad(-270) } },
            step2: { distanceFromBottle:{distance : 1.2 }, rotation: { y: THREE.MathUtils.degToRad(-630) } }
        }

        const tl = gsap.timeline({
            onStart: () => { context.modelGroup.visible = true; },
            onUpdate : () => {
                context.group.scale.set(agaveGroupTl.from.scale.x,agaveGroupTl.from.scale.x,agaveGroupTl.from.scale.x)
                for(const dummy of context.leafDummies){
                    dummy.updateMatrix();
                    dummy.parentMesh.setMatrixAt(dummy.dummyIndex, dummy.matrix);
                    dummy.parentMesh.instanceMatrix.needsUpdate = true;
                }
                context.modelGroup.position.x = agaveTl.from.distanceFromBottle.distance * Math.cos(THREE.MathUtils.degToRad(context.origin.deg))
                context.modelGroup.position.z = agaveTl.from.distanceFromBottle.distance * Math.sin(THREE.MathUtils.degToRad(context.origin.deg))
            },
            onComplete: ()=> { context.modelGroup.visible = false; }
        })
        tl.to(agaveGroupTl.from.scale, { ...agaveGroupTl.step1.scale, duration: 3, }, '0')
        tl.to(
            leafDummiesPositions,
            { 
                x : i => {  
                    const deg = context.leafDummies[i].offsetDegrees - i * context.leafDummies[i].deltaDegrees;
                    return -context.leafDummies[i].layer.to.position.x * Math.cos(THREE.MathUtils.degToRad(deg))
                },
                z : i => {  
                    const deg = context.leafDummies[i].offsetDegrees - i * context.leafDummies[i].deltaDegrees;
                    return -context.leafDummies[i].layer.to.position.z * Math.sin(THREE.MathUtils.degToRad(deg))
                },
                y : i => {
                    return context.leafDummies[i].layer.to.position.y * Math.sin(context.leafDummies[i].layer.angle)
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
        tl.to(context.group.rotation, {
            ...agaveGroupTl.step1.rotation,
            duration: 4,      
            ease: "power2.out"  
            
        },
        '0')
        tl.to(context.modelGroup.rotation, {
            ...agaveTl.step1.rotation,
            duration: 4,            
            ease: "power4.out"  
        },
        '0')


        tl.to(context.group.rotation, {
            ...agaveGroupTl.step2.rotation,
            duration: 5,      
            ease: "power2.in"  
        },
        '4')
        tl.to(context.modelGroup.rotation, {
            ...agaveTl.step2.rotation,
            duration: 7,  
            ease: "power4.inOut"  
        },
        '4')
       
        tl.to(agaveTl.from.distanceFromBottle, {
            ...agaveTl.step2.distanceFromBottle,
            duration: 4,       
            ease: "power2.in",     
        },
        "5"
        )
        tl.to(context.group.position, {
            ...agaveGroupTl.step2.position,
            duration: 1,       
            ease: "power2.in",     
        },
        "7.5"
        )
        tl.to(context.group.rotation, {
            ...agaveGroupTl.step3.rotation,
            duration: 2,
        },
        '9')
        

        return tl
    }
}