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

        this.world = new CANNON.World()
        this.world.gravity.set(0, - 9.82, 0)

        this.defaultMaterial = new CANNON.Material('default')
        this.defaultContactMaterial = new CANNON.ContactMaterial(
            this.defaultMaterial,
            this.defaultMaterial,
            {
                friction: 0.1,
                restitution: 0.7
            }
        )
        this.world.addContactMaterial(this.defaultContactMaterial)
        this.world.defaultContactMaterial = this.defaultContactMaterial

        this.objectsToUpdate = []

        this.world.broadphase = new CANNON.SAPBroadphase(this.world)
        this.world.allowSleep = true
                
        this.setFloor(new THREE.Vector3(0,-83,0))
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

        this.floorBody.material = this.defaultMaterial

        this.world.addBody(this.floorBody)
    }

    setSphereBody(radius, mass, position)
    {
        this.sphereShape = new CANNON.Sphere(radius)
        this.sphereBody = new CANNON.Body({
            mass: mass,
            position: new CANNON.Vec3(position.x + 0.1 * Math.random(), position.y + 0.1 * Math.random(), position.z + 0.1 * Math.random()),
            shape: this.sphereShape,
            material: this.defaultContactMaterial
        })
        this.world.addBody(this.sphereBody)
    }

    update()
    {
        if (this.mesh && this.sphereBody && this.experience.scroll.currentSection >= 5 )
        {
            this.world.step(1/60, this.time.delta, 3)

            for(const object of this.objectsToUpdate)
            {
                object.mesh.position.copy(object.body.position)
                object.mesh.quaternion.copy(object.body.quaternion)
            }
        }
    }
}