
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
        this.offsets = []
        this.mesh = null;

        this.init();
    }
    init() {

        console.log(this.layer)
        this.mesh = new THREE.InstancedMesh(this.geometry, this.material, this.layer.quantity);
        this.setInstancedMeshPositions()

        this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage); //per animare
        if (this.parent.debug) {
            const axesHelper = new THREE.AxesHelper(5)

            this.mesh.add(axesHelper);
        }
        this.parent.modelGroup.add(this.mesh);

        this.gsapAnimations()
        this.animate();
    }
    setInstancedMeshPositions() {

        for (var i = 0; i < this.layer.quantity; i++) {
            const deg = 360 / this.layer.quantity * i + this.layer.rotation_offset;
            this.offsets.push(deg)
            const radian = THREE.MathUtils.degToRad(this.offsets[i])
            const rotationY = radian;
            console.log(deg)
            this.dummy.rotation.y = rotationY;
            this.dummy.position.y = this.layer.y;
            this.dummy.position.z = Math.cos(radian) * (this.layer.distance) * (-1) // + (deg >= 180 ? -.2 : .2)
            this.dummy.position.x = Math.sin(radian) * (this.layer.distance) * (-1) // + (deg >= 180 ? -.2 : .2)


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
        const from = {rotation: { y: 0, x: 0 }, position: { y: this.layer.y, x: this.layer.distance } }
        const to = {  rotation: { x: this.layer.to.rotation.x, y: 180 }, position: { y: this.layer.to.position.y, x: this.layer.to.position.x } }

        const tl = gsap.timeline({
            defaults: { duration: 5, },
            repeat: -1,
            delay: 2,
            onUpdate: () => {
                const dummy = new THREE.Object3D();
                for (var i = 0; i < this.layer.quantity; i++) {
                    
                    const radianY = THREE.MathUtils.degToRad(this.offsets[i] )
                    
                    const radianX = THREE.MathUtils.degToRad(from.rotation.x)
                    console.log(radianX)
                    
                    dummy.rotation.y = radianY;

                    
                    
                    dummy.position.y = from.position.y;
                    dummy.position.z = Math.cos(radianY) * (from.position.x) * (-1) // + (deg >= 180 ? -.2 : .2)
                    dummy.position.x = Math.sin(radianY) * (from.position.x) * (-1) // + (deg >= 180 ? -.2 : .2)
                    // this.dummy.position.z =   Math.cos(radian) * distnce * (-1)  //+ (deg >= 180 ? -.2: .2)
                    // this.dummy.position.x =   Math.sin(radian) * distnce * (-1)  //+ (deg >= 180 ? -.2 : .2)
                    // this.dummy.position.z =   Math.cos(radian) * distnce * (-1)  + (deg >= 180 ? -.4 : .4)
                    // this.dummy.position.x =   Math.sin(radian) * distnce * (-1)  + (deg >= 180 ? -.4 : .4)

                    dummy.updateMatrix();
                    this.mesh.setMatrixAt(i, dummy.matrix);
                }
                this.mesh.instanceMatrix.needsUpdate = true;
            },
        });
        tl.to(from.position, {
            ...to.position,
            ease: "back.in(4)"
        },
        )
        tl.to(from.rotation, {
            ...to.rotation,
            
            duration: 5,
        },
        "-=5"
        )
       

    }


    animate() {

        // console.log(this.dummy.position)
        requestAnimationFrame(() => this.animate());
    }
}