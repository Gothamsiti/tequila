
import * as THREE from 'three';
import gsap from 'gsap'
export default class InstancedMeshClass {
    constructor(parent, geometry, material, layer) {
        this.parent = parent;
        this.geometry = geometry;
        this.material = material;
        
        this.layer = layer
        // this.positions = positions;
        // this.rotations = rotations;
        this.dummy = new THREE.Object3D();
       
        this.mesh = null;

        this.init();
    }
    init() {
        
        console.log(this.layer)
        this.mesh = new THREE.InstancedMesh(this.geometry, this.material, this.layer.quantity);
        this.setInstancedMeshPositions()

        this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage); //per animare
        if(this.parent.debug){
            const axesHelper = new THREE.AxesHelper(5)
            
            this.mesh.add(axesHelper);
        }
        this.parent.modelGroup.add(this.mesh);

        this.gsapAnimations()
        this.animate();
    }
    setInstancedMeshPositions() {
        
        for (var i = 0; i < this.layer.quantity; i++) {
            const deg =360 / this.layer.quantity * i +this.layer.rotation_offset;
            const radian = THREE.MathUtils.degToRad(deg)
            const rotationY = radian;
            console.log(deg)
            this.dummy.rotation.y = rotationY;
            this.dummy.position.y= this.layer.y;
            this.dummy.position.z =   Math.cos(radian) * (this.layer.distance) * (-1) // + (deg >= 180 ? -.2 : .2)
            this.dummy.position.x =   Math.sin(radian) * (this.layer.distance) * (-1) // + (deg >= 180 ? -.2 : .2)
            
            
            // this.dummy.position.z =   Math.cos(radian) * distnce * (-1)  //+ (deg >= 180 ? -.2: .2)
            // this.dummy.position.x =   Math.sin(radian) * distnce * (-1)  //+ (deg >= 180 ? -.2 : .2)
            // this.dummy.position.z =   Math.cos(radian) * distnce * (-1)  + (deg >= 180 ? -.4 : .4)
            // this.dummy.position.x =   Math.sin(radian) * distnce * (-1)  + (deg >= 180 ? -.4 : .4)
            
            this.dummy.updateMatrix();
            this.mesh.setMatrixAt(i, this.dummy.matrix);
        }
        this.mesh.instanceMatrix.needsUpdate = true;
        

    }

     gsapAnimations() {
         const from = { distance: this.layer.distance , ry: 0}
         const to = { distance: this.layer.distance+3 , ry: 180}
         const tl = gsap.timeline({ defaults: {duration: 2,}, repeat:-1, delay: 1 });
         tl.to(from, {
             ...to,
             onUpdate: () => {
                 const dummy = new THREE.Object3D();
                 for (var i = 0; i < this.layer.quantity; i++) {
                    const deg =360 / this.layer.quantity * i +this.layer.rotation_offset + from.ry;
                    const radian = THREE.MathUtils.degToRad(deg)
                    const rotationY = radian;
                    dummy.rotation.y = rotationY;
                    dummy.position.y= this.layer.y;
                    dummy.position.z =   Math.cos(radian) * (from.distance) * (-1) // + (deg >= 180 ? -.2 : .2)
                    dummy.position.x =   Math.sin(radian) * (from.distance) * (-1) // + (deg >= 180 ? -.2 : .2)
                    
                    
                    // this.dummy.position.z =   Math.cos(radian) * distnce * (-1)  //+ (deg >= 180 ? -.2: .2)
                    // this.dummy.position.x =   Math.sin(radian) * distnce * (-1)  //+ (deg >= 180 ? -.2 : .2)
                    // this.dummy.position.z =   Math.cos(radian) * distnce * (-1)  + (deg >= 180 ? -.4 : .4)
                    // this.dummy.position.x =   Math.sin(radian) * distnce * (-1)  + (deg >= 180 ? -.4 : .4)
                    
                    dummy.updateMatrix();
                    this.mesh.setMatrixAt(i, dummy.matrix);
                }
                 this.mesh.instanceMatrix.needsUpdate = true;
             }
         }, )
         .to(from, {
             ...from,
             onUpdate: () => {
                 const dummy = new THREE.Object3D();
                 for (var i = 0; i < this.layer.quantity; i++) {
                    const deg =360 / this.layer.quantity * i +this.layer.rotation_offset + from.ry;
                    const radian = THREE.MathUtils.degToRad(deg)
                    const rotationY = radian;
                    dummy.rotation.y = rotationY;
                    dummy.position.y= this.layer.y;
                    dummy.position.z =   Math.cos(radian) * (from.distance) * (-1) // + (deg >= 180 ? -.2 : .2)
                    dummy.position.x =   Math.sin(radian) * (from.distance) * (-1) // + (deg >= 180 ? -.2 : .2)
                    
                    
                    // this.dummy.position.z =   Math.cos(radian) * distnce * (-1)  //+ (deg >= 180 ? -.2: .2)
                    // this.dummy.position.x =   Math.sin(radian) * distnce * (-1)  //+ (deg >= 180 ? -.2 : .2)
                    // this.dummy.position.z =   Math.cos(radian) * distnce * (-1)  + (deg >= 180 ? -.4 : .4)
                    // this.dummy.position.x =   Math.sin(radian) * distnce * (-1)  + (deg >= 180 ? -.4 : .4)
                    
                    dummy.updateMatrix();
                    this.mesh.setMatrixAt(i, dummy.matrix);
                }
                 this.mesh.instanceMatrix.needsUpdate = true;
             }
         })
  
     }


    // randomizeMatrix(matrix) {
    //     const position = new THREE.Vector3();
    //     const rotation = new THREE.Euler();
    //     const quaternion = new THREE.Quaternion();
    //     const scale = new THREE.Vector3();

    //     position.x = Math.random() * 40 - 20;
    //     position.y = Math.random() * 40 - 20;
    //     position.z = Math.random() * 40 - 20;

    //     rotation.x = Math.random() * 2 * Math.PI;
    //     rotation.y = Math.random() * 2 * Math.PI;
    //     rotation.z = Math.random() * 2 * Math.PI;

    //     quaternion.setFromEuler( rotation );
    //     scale.x = scale.y = scale.z = Math.random() * 1;
    //     matrix.compose( position, quaternion, scale );
    // }

    animate() {

        // console.log(this.dummy.position)
        requestAnimationFrame(() => this.animate());
    }
}