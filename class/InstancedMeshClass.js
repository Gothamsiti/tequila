
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

        this.initialRoatationsY = [];

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

        const deltaDegrees = 360/this.count;
        const offsetDegrees = 110 + 360 - deltaDegrees/2;
        for (var i = 0; i < this.count; i++) {
            const dummy = new THREE.Object3D();
            const deg = 360 / this.count * i
            const radian = THREE.MathUtils.degToRad(deg)
            const rotationY = radian;
            this.initialRoatationsY.push(rotationY);
            dummy.rotation.y = rotationY;
            dummy.updateMatrix();
            dummy.parentMesh = this.mesh;
            dummy.dummyIndex = i;
            dummy.deltaDegrees = deltaDegrees;
            dummy.offsetDegrees = offsetDegrees;
            this.parent.leafDummies.push(dummy);
            this.mesh.setMatrixAt(i, dummy.matrix);
            this.matrixes.push(dummy);

            // this.dummy.translateX(Math.cos(radian) * distnce);
            
            // this.dummy.position.z = deg>= 10 ?  Math.cos(radian) * distnce :
            // this.dummy.position.z = Math.sin(radian) * distnce
        }

        this.mesh.instanceMatrix.needsUpdate = true;

    }

    gsapAnimations() {
        return;
        const deltaDegrees = 360/this.count;
        const offsetDegrees = 110 + 360 - deltaDegrees/2; //aggiungo 110° per compensare il fatto che il primo indice non parte da 0°

        var position = {};
        if(this.from && this.from.position){
            position = JSON.parse(JSON.stringify(this.from.position))
        }else{
            position = {x: 0, y: 0, z: 0}
        }

        var rotation = {};
        if(this.from && this.from.rotation){
            rotation = JSON.parse(JSON.stringify(this.from.rotation))
        }else{
            rotation = {x: 0, y: 0, z: 0}
        }

        const prevRotation = JSON.parse(JSON.stringify(rotation));
        var deltaRotation = {x: 0, y: 0, z: 0}
        const trashold = .5;



        const tl = gsap.timeline({
            repeat: -1,
            repeatDelay: 1,
            onUpdate : () => {
                deltaRotation = {
                    x: rotation.x - prevRotation.x,
                    y: rotation.y - prevRotation.y,
                    z: rotation.z - prevRotation.z
                }
                

                for(var i = 0 ; i < this.count; i++){
                    var deg =  offsetDegrees - i * deltaDegrees;
                    deg = THREE.MathUtils.degToRad(deg);

                    this.matrixes[i].position.x = -position.x * Math.cos(deg);

                    this.matrixes[i].position.y = position.y;
                    
                    this.matrixes[i].position.z = -position.z * Math.sin(deg);


                    this.matrixes[i].rotateX(THREE.MathUtils.degToRad(deltaRotation.x))
                    this.matrixes[i].rotateY(THREE.MathUtils.degToRad(deltaRotation.y))
                    this.matrixes[i].rotateZ(THREE.MathUtils.degToRad(deltaRotation.z))

                    this.matrixes[i].updateMatrix();
                    this.mesh.setMatrixAt(i, this.matrixes[i].matrix);
                }

                if(prevRotation.x != rotation.x) prevRotation.x = rotation.x;
                if(prevRotation.y != rotation.y) prevRotation.y = rotation.y;
                if(prevRotation.z != rotation.z) prevRotation.z = rotation.z;
                

                this.mesh.instanceMatrix.needsUpdate = true;
            },
            onComplete: () => {
                for(var i = 0 ; i < this.count; i++){
                    this.matrixes[i].rotateX(THREE.MathUtils.degToRad(-this.to.rotation.x))
                    this.matrixes[i].rotateY(THREE.MathUtils.degToRad(-this.to.rotation.y))
                    this.matrixes[i].rotateZ(THREE.MathUtils.degToRad(-this.to.rotation.z))
                    this.mesh.instanceMatrix.needsUpdate = true;
                }
            }
            // onRepeat: () => {
            //     for(var i = 0 ; i < this.count; i++){
            //         // this.matrixes[i].rotation.x = 0;
            //         // this.matrixes[i].rotation.z = 0;
            //         // this.matrixes[i].position.set(0,0,0);
            //         // this.matrixes[i].rotation.set(0,this.initialRoatationsY[i],0);

            //         this.matrixes[i].rotateX(THREE.MathUtils.degToRad(-this.to.rotation.x))
            //         this.matrixes[i].rotateY(THREE.MathUtils.degToRad(-this.to.rotation.y))
            //         this.matrixes[i].rotateZ(THREE.MathUtils.degToRad(-this.to.rotation.z))
            //         this.matrixes[i].updateMatrix();
            //         this.mesh.setMatrixAt(i, this.matrixes[i].matrix);
            //     }
            //     this.mesh.instanceMatrix.needsUpdate = true;

            // }
        })
        const dummies = [
            { pos : { x: 1, y: 1, z: 1 }},
            { pos : { x: 1, y: 2, z: 2 }},
            { pos : { x: 1, y: 3, z: 3 }},
            { pos : { x: 1, y: 4, z: 4 }},
        ]

        const dummiesTo = [
            {x: 100, y: 5, z: 5},
            {x: 400, y: 6, z: 6},
            {x: 7, y: 7, z: 7},
            {x: 8, y: 8, z: 8},
        ]
        const dummiesPosition = dummies.map(d => d.pos);

        tl.to(dummiesPosition,{
            x : (i,t) => dummiesTo[i].x,
            y : (i,t) => dummiesTo[i].x,
            z : (i,t) => dummiesTo[i].x,
            duration: 5,
            stagger : 1,
            onUpdate : () => {
                console.log('UPDATE DUMMIES', dummies[0].pos.x, dummies[1].pos.x)
            }
        })



        tl.to(
            position,
            {
                x: this.to.position.x,
                z: this.to.position.z,
                duration : .5
            }
        )
        const delay = Math.random() * 1.5
        tl.to(
            position,
            {
                y: this.to.position.y,
                duration : 1.5,
                // ease: 'back.in(4)'
            },
            // '-=5'
        )
        tl.to(
            rotation,
            {
                x:this.to.rotation.x,
                y:this.to.rotation.y,
                z:this.to.rotation.z,
                duration: 1.5,
                // ease: 'power4.in'
            },
            '-=1.5'
        )        
    }
    


    animate() {
        requestAnimationFrame(() => this.animate());
    }
}