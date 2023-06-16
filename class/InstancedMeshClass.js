
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
        this.dummy = new THREE.Object3D();
        this.from = from;
        this.to = to;
        this.mesh = null;

        this.init();
    }
    init() {
        console.log(this.geometry)
        this.mesh = new THREE.InstancedMesh(this.geometry, this.material, this.count);
        const mesh = new THREE.Mesh(this.geometry,this.material)
        
        
        this.setInstancedMeshPositions()

        this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage); //per animare
        if(this.parent.debug){
            const axesHelper = new THREE.AxesHelper(5)
            
            this.mesh.add(axesHelper);
        }
        this.parent.modelGroup.add(this.mesh);

        // this.gsapAnimations()
        this.animate();
    }
    setInstancedMeshPositions() {
        const distnce = 3;
        for (var i = 0; i < this.count; i++) {
            const deg =360 / this.count * i 
            const radian = THREE.MathUtils.degToRad(deg)
            const rotationY = radian;
            console.log(deg)
            this.dummy.rotation.y = rotationY;
            this.dummy.translateX(2)
            
            this.dummy.position.z =   Math.cos(radian) * (distnce) * (-1) // + (deg >= 180 ? -.2 : .2)
            this.dummy.position.x =   Math.sin(radian) * (distnce) * (-1) // + (deg >= 180 ? -.2 : .2)
            
            
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
        const from = { posiiton: JSON.parse(JSON.stringify(this.dummy.position)) }
        const tl = gsap.timeline();
        const tempDummy = new THREE.Object3D()
        tl.to(from.posiiton, {
            duration: 5,
            x: this.to.position.x,
            onUpdate: () => {
                console.log('position',from.posiiton.x)
                for (var i = 0; i < this.count; i++) {
                    tempDummy.position.set(from.posiiton)
                    tempDummy.updateMatrix()
                    this.mesh.setMatrixAt(i, tempDummy.matrix)
                }
                // this.mesh.instanceMatrix.needsUpdate = true;
            }
        }, 0)
        
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