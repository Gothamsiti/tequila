import * as THREE from 'three';
import InstancedMeshClass from './InstancedMeshClass.js';
import gsap from 'gsap' 

export default class Agave {
    constructor(origin, gltf ){
        this.origin = origin;
        this.gltf = gltf;
        this.debug = false;
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

    

    play(){
        this.layers.map((layer)=>{
            layer.mesh.gsapAnimations()
        })
    }


    init() {
        const agave_cuore = new THREE.Group();
        this.layers.map((layer, i) => {
            const piano = this.gltf.scene.getObjectByName(`foglia-agave-${layer.search}`);
            layer.mesh = new InstancedMeshClass(this, piano.geometry, piano.material, layer, i);

            // console.log(agave)
            agave_cuore.add( this.gltf.scene.getObjectByName(`agave-${layer.search}001`))
        })
        
        
        this.modelGroup.position.x = this.origin.x
        this.modelGroup.position.z = this.origin.z
        this.modelGroup.add(agave_cuore);

        const leafDummiesPositions = this.leafDummies.map(d => d.position);
        // const leafDummiesRotations = this.leafDummies.map(d => d.rotation);
        console.log('length ',this.leafDummies.length)
        const tl = gsap.timeline({
            repeat:-1,
            onUpdate : () => {
                for(const dummy of this.leafDummies){
                    dummy.updateMatrix();
                    dummy.parentMesh.setMatrixAt(dummy.dummyIndex, dummy.matrix);
                    dummy.parentMesh.instanceMatrix.needsUpdate = true;
                }
            }
        })
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
        // tl.to(
        //     leafDummiesPositions,
        //     { 
        //         x : i => {  
        //             const deg = this.leafDummies[i].offsetDegrees - i * this.leafDummies[i].deltaDegrees;
        //             return -this.leafDummies[i].layer.to.position.x * 4 * Math.cos(THREE.MathUtils.degToRad(deg))
        //         },
        //         z : i => {  
        //             const deg = this.leafDummies[i].offsetDegrees - i * this.leafDummies[i].deltaDegrees;
        //             return -this.leafDummies[i].layer.to.position.z * 4 * Math.sin(THREE.MathUtils.degToRad(deg))
        //         },
        //         ease : "power4.out",
        //         stagger: .05,
        //         duration : 1,
        //     }
        // )
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


    }

}