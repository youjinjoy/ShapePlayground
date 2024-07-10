import * as THREE from 'three'
import CANNON from 'cannon'
import Experience from '../Experience'

export default class World
{
    constructor()
    {
        this.experience = new Experience()
        this.time = this.experience.time
        this.section = this.experience.section

        this.mesh = this.section.mesh

        this.world = new CANNON.World()
        this.world.gravity.set(0, - 9.82, 0)
        
        this.setFloor(new THREE.Vector3(0,-72,0))
        this.setSphereBody(this.section.defaultSize, 1, this.mesh.position )
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
        if (this.mesh && this.sphereBody)
        {
            this.world.step(1/60, this.time.delta, 3)
            this.mesh.position.copy(this.sphereBody.position)
            // console.log(this.mesh.position)
        }
    }
}