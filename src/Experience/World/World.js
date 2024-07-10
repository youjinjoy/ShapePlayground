import * as THREE from 'three'
import CANNON from 'cannon'
import Experience from '../Experience'

export default class World
{
    constructor()
    {
        this.experience = new Experience()
        this.time = this.experience.time
        this.scene = this.experience.scene
        this.section = this.experience.section

        // this.size = this.section.defaultSize

        // this.geometries = {
        //     'torus': new THREE.TorusGeometry(this.size - 1, 1),
        //     'sphere': new THREE.SphereGeometry(this.size),
        //     'cylinder': new THREE.CylinderGeometry(this.size, this.size, 5),
        // }

        this.world = new CANNON.World()
        this.world.gravity.set(0, - 9.82, 0)
        
        this.setFloor(new THREE.Vector3(0,-84,0))
    }
    
    setMesh()
    {
        this.mesh = this.section.mesh.clone()
        
        this.mesh.scale.set(0.5, 0.5, 0.5)
        this.mesh.position.set(0, -63 - 0.5, 0)
        
        this.scene.add(this.mesh)
    }
    
    setFloor(position)
    {
        this.floorShape = new CANNON.Plane()
        this.floorBody = new CANNON.Body()
        this.floorBody.mess = 0
        this.floorBody.addShape(this.floorShape)
        
        this.floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(- 1, 0, 0), Math.PI * 0.5)
        this.floorBody.position.set(position.x, position.y, position.z)

        this.world.addBody(this.floorBody)
    }

    setSphereBody(radius, mass, position)
    {
        this.sphereShape = new CANNON.Sphere(radius)
        this.sphereBody = new CANNON.Body({
            mass: mass,
            position: new CANNON.Vec3(position.x, position.y, position.z),
            shape: this.sphereShape
        })
        this.world.addBody(this.sphereBody)
    }

    update()
    {
        if (this.mesh && this.sphereBody && this.experience.scroll.currentSection >= 5 )
        {
            this.world.step(1/60, this.time.delta, 3)
            this.mesh.position.copy(this.sphereBody.position)
        }
    }
}