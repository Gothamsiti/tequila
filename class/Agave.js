import * as THREE from 'three';
import InstancedMeshClass from './InstancedMeshClass.js';

export default class Agave {
    constructor(origin, gltf ){
        this.origin = origin;
        this.gltf = gltf;
        this.debug = false;
        this.modelGroup = new THREE.Group();
        this.layers = [
            { search: '01', quantity: 9, mesh : null, from: {}, to: { position: {x:1, y:-1, z: 1}, rotation: {x: -90, y: 0, z: 0}}},
            { search: '02', quantity: 9, mesh : null, from: {}, to: { position: {x:1, y:-1, z: 1}, rotation: {x: -90, y: 0, z: 0}}},
            { search: '03', quantity: 9, mesh : null, from: {}, to: { position: {x:2, y:-2, z: 2}, rotation: {x: -90, y: 0, z: 0}}},
            { search: '04', quantity: 6, mesh : null, from: {}, to: { position: {x:3, y:-3, z: 3}, rotation: {x: -90, y: 0, z: 0}}},
            { search: '05', quantity: 6, mesh : null, from: {}, to: { position: {x:4, y:-4, z: 4}, rotation: {x: -90, y: 0, z: 0}}},
            { search: '06', quantity: 3, mesh : null, from: {}, to: { position: {x:5, y:-5, z: 5}, rotation: {x: -90, y: 0, z: 0}}},
        ]

        this.init()
    }

    init(){
        this.agave()
    }

    play(){
        this.layers.map((layer)=>{
            layer.mesh.gsapAnimations()
        })
    }


    agave() {
        const agave_cuore = new THREE.Group();
        this.layers.map((layer) => {
            const piano = this.gltf.scene.getObjectByName(`foglia-agave-${layer.search}`);
            layer.mesh = new InstancedMeshClass(this, piano.geometry, piano.material, layer.quantity, layer.from, layer.to);

            // console.log(agave)
            agave_cuore.add( this.gltf.scene.getObjectByName(`agave-${layer.search}001`))
        })
        if(this.origin.deg){

            this.modelGroup.rotation.y = THREE.MathUtils.degToRad(this.origin.deg)
        }
        // this.modelGroup.rotation.y = this.origin.radian
        this.modelGroup.position.x = this.origin.x
        this.modelGroup.position.z = this.origin.z
        this.modelGroup.add(agave_cuore);
        this.play()
    }

}