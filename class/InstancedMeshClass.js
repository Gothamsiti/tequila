
import * as THREE from 'three';
import gsap from 'gsap'
export default class InstancedMeshClass {
    constructor(parent, geometry, material, count, from, to) {
        this.parent = parent;
        this.geometry = geometry;
        this.material = material;
        this.count = count;
        // this.positions = positions;
        // this.rotations = rotations;

        this.matrixes = [];

        
        this.from = from;
        this.to = to;
        this.mesh = null;

        this.init();
    }
    init() {
        this.mesh = new THREE.InstancedMesh(this.geometry, this.material, this.count);
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
        const distnce = 3;
        for (var i = 0; i < this.count; i++) {
            const dummy = new THREE.Object3D();
            const deg = 360 / this.count * i
            const radian = THREE.MathUtils.degToRad(deg)
            const rotationY = radian;
            dummy.rotation.y = rotationY;
            dummy.updateMatrix();
            this.mesh.setMatrixAt(i, dummy.matrix);
            this.matrixes.push(dummy);

            // this.dummy.translateX(Math.cos(radian) * distnce);
            
            // this.dummy.position.z = deg>= 10 ?  Math.cos(radian) * distnce :
            // this.dummy.position.z = Math.sin(radian) * distnce
        }

        this.mesh.instanceMatrix.needsUpdate = true;

    }

    gsapAnimations() {
        const deltaDegrees = 360/this.count;
        const offsetDegrees = 90 + 360 - deltaDegrees/2;
        const distance = 1;
        
        // for(var i = 0 ; i < this.count; i++){
        //     var deg =  offsetDegrees - i * deltaDegrees;
        //     deg = THREE.MathUtils.degToRad(deg);
        //     this.matrixes[i].position.x = -distance * Math.cos(deg);
        //     this.matrixes[i].position.z = -distance * Math.sin(deg);
        //     this.matrixes[i].updateMatrix();
        //     this.mesh.setMatrixAt(i, this.matrixes[i].matrix);
        // }
        // this.mesh.instanceMatrix.needsUpdate = true;

        const positions = { 
            distance : 0,
            y : 3,
            rY : THREE.MathUtils.degToRad(30)
        }
        gsap.to(
            positions,
            {
                distance : 1,
                duration : 6,
                rY : THREE.MathUtils.degToRad(30)
            }
        )
        for(var i = 0 ; i < this.count; i++){
            var deg =  offsetDegrees - i * deltaDegrees;
            deg = THREE.MathUtils.degToRad(deg);
            // this.matrixes[i].position.x = -distance * Math.cos(deg);
            // this.matrixes[i].position.z = -distance * Math.sin(deg);
            this.matrixes[i].rotation.z = positions.rY;
            this.matrixes[i].updateMatrix();
            this.mesh.setMatrixAt(i, this.matrixes[i].matrix);
        }
        // gsap.to(
        //     positions,
        //     {
        //         y : -1,
        //         duration: 10,
        //         repeat: -1,
        //         onUpdate : () => {
        //             for(var i = 0 ; i < this.count; i++){
        //                 var deg =  offsetDegrees - i * deltaDegrees;
        //                 deg = THREE.MathUtils.degToRad(deg);
        //                 this.matrixes[i].position.x = -positions.distance * Math.cos(deg);
        //                 this.matrixes[i].position.z = -positions.distance * Math.sin(deg);
        //                 this.matrixes[i].rotation.x = -positions.rY;
        //                 // this.matrixes[i].rotation.z = -positions.rY * Math.sin(deg);
        //                 this.matrixes[i].rotation.y = 0;
        //                 this.matrixes[i].position.y = 1;
        //                 this.matrixes[i].updateMatrix();
        //                 this.mesh.setMatrixAt(i, this.matrixes[i].matrix);
        //                 this.matrixes[i].rotation.y = deg;
        //                 this.matrixes[i].updateMatrix();
        //                 this.mesh.setMatrixAt(i, this.matrixes[i].matrix);
        //             }
        //             this.mesh.instanceMatrix.needsUpdate = true;
        //         }
        //     }
        // )

        // this.matrixes[1].position.x = 1;
        // this.matrixes[1].updateMatrix();
        // this.mesh.setMatrixAt(1, this.matrixes[1].matrix);

        // this.matrixes[i].position.z = y;

        // for (var i = 0; i < this.count; i++) {
        //         const angle = 360 / this.count * i

        //         console.log(angle);
        //         // const angle = Math.PI * 0.5 * i;
        //         const distance = 1;
        //         const x = distance * Math.cos(angle);
        //         const y = distance * Math.sin(angle);

        //         this.matrixes[i].position.x = x;
        //         this.matrixes[i].position.z = y;

        //         // this.matrixes[i].rotation.y = angle + Math.PI * 0.5;
        //         this.matrixes[i].updateMatrix();

        //         this.mesh.setMatrixAt(i, this.matrixes[i].matrix);

        // }
        


        // const from = { posiiton: JSON.parse(JSON.stringify(this.dummy.position)) }
        // const tl = gsap.timeline();
        // const tempDummy = new THREE.Object3D()
        // tl.to(from.posiiton, {
        //     duration: 5,
        //     x: this.to.position.x,
        //     onUpdate: () => {
        //         console.log('position',from.posiiton.x)
        //         for (var i = 0; i < this.count; i++) {
        //             tempDummy.position.set(from.posiiton)
        //             tempDummy.updateMatrix()
        //             this.mesh.setMatrixAt(i, tempDummy.matrix)
        //         }
        //         // this.mesh.instanceMatrix.needsUpdate = true;
        //     }
        // }, 0)
        
    }

    getSine(radius, deg){

    }

    getCosine( radius, deg){

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