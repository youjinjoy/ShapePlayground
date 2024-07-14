import * as THREE from 'three'
import CANNON from 'cannon'
import Experience from '../Experience'

export default class World
{
    constructor()
    {
        this.experience = new Experience()
        this.time = this.experience.time
        this.sizes = this.experience.sizes
        this.responsive = this.experience.responsive
        this.camera = this.experience.camera

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
        // this.world.allowSleep = true
                
        this.floorRadius = 20
        this.floorPosition = -55
        this.floorLightPosition = -30

        this.setFloor(new THREE.Vector3(0,this.floorPosition,0), this.floorRadius)
        this.setFloorLight(this.floorLightPosition)
        
        
        this.objectDistance = this.experience.objectsDistance
        this.responsive.updateWorld(this)
    }
    
    setMesh()
    {
        this.mesh = this.section.mesh.clone()
        this.mesh.material= this.section.mesh.material.clone()
        
        this.mesh.scale.set(0.5, 0.5, 0.5)
        this.mesh.position.set(0, -36 - 0.5, 0)
        
        this.mesh.castShadow = true

        this.scene.add(this.mesh)
    }

    setFloorMesh(position, radius)
    {
        this.floorGeometry = new THREE.CylinderGeometry(radius,radius,1)
        this.floorMaterial = new THREE.MeshStandardMaterial({ color: '#eee' })
        this.floorMesh = new THREE.Mesh(this.floorGeometry, this.floorMaterial)

        this.floorMesh.position.set(position.x, position.y-1, position.z)

        this.floorMesh.receiveShadow = true
        this.scene.add(this.floorMesh)
    }
    
    setFloor(position, radius)
    {
        this.setFloorMesh(position, radius)

        this.floorShape = new CANNON.Cylinder(radius + 1, radius + 1, 1, 8)
        this.floorBody = new CANNON.Body()
        this.floorBody.mess = 0
        this.floorBody.addShape(this.floorShape)
        
        this.floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(- 1, 0, 0), Math.PI * 0.5)
        this.floorBody.position.set(position.x, position.y, position.z)

        this.floorBody.material = this.defaultMaterial

        this.world.addBody(this.floorBody)
    }

    setFloorLight(positionY)
    {
        this.floorDirectionalLight = new THREE.DirectionalLight("#999", 4)
        this.floorDirectionalLight.position.set(5, positionY, 5)
        this.floorDirectionalLight.target = this.floorMesh
        this.floorDirectionalLight.castShadow = true
        this.floorDirectionalLight.shadow.mapSize.width = 1024
        this.floorDirectionalLight.shadow.mapSize.height = 1024

        this.floorDirectionalLight.shadow.camera.left = -50
        this.floorDirectionalLight.shadow.camera.right = 50
        this.floorDirectionalLight.shadow.camera.top = 50
        this.floorDirectionalLight.shadow.camera.bottom = -50
        this.floorDirectionalLight.shadow.camera.near = 0.5
        this.floorDirectionalLight.shadow.camera.far = 50

        // this.lightHelper = new THREE.DirectionalLightHelper(this.floorDirectionalLight)
        // this.scene.add(this.lightHelper)

        // this.shadowCameraHelper = new THREE.CameraHelper(this.floorDirectionalLight.shadow.camera);
        // this.scene.add(this.shadowCameraHelper)


        this.scene.add(this.floorDirectionalLight)
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

    // setCylinderBody(radius, height, mass, position)
    // {
    //     this.cylinderShape = new CANNON.Cylinder(radius, radius, height)
    //     this.cylinderBody = new CANNON.Body({
    //         mass: mass,
    //         position: new CANNON.Vec3(position.x + 0.1 * Math.random(), position.y + 0.1 * Math.random(), position.z + 0.1 * Math.random()),
    //         shape: this.cylinderShape,
    //         material: this.defaultContactMaterial
    //     })
    //     this.world.addBody(this.cylinderBody)
    // }

    // setTorusBody()
    // {}

    removeObjects(object)
    {
        this.world.removeBody(object.body)

        this.scene.remove(object.mesh)

        // if (object.mesh.geometry) {
        //     object.mesh.geometry.dispose()
        // }
        if (object.mesh.material) {
            if (object.mesh.material.map) object.mesh.material.map.dispose()
            object.mesh.material.dispose()
        }

        const index = this.objectsToUpdate.indexOf(object);
        if (index > -1)
        {
            this.objectsToUpdate.splice(index, 1)
        }
    }

    update()
    {
        if (this.mesh && this.sphereBody && this.experience.scroll.currentLocation >= 4.5 )
        {
            this.world.step(1/60, this.time.delta, 3)
            
            this.objectsToRemove = []
            
            for(const object of this.objectsToUpdate)
            {
                object.mesh.position.copy(object.body.position)
                object.mesh.quaternion.copy(object.body.quaternion)

                if (object.body.position.y <= -70)
                {
                    this.objectsToRemove.push(object)
                }
            }

            for(const object of this.objectsToRemove)
            {
                this.removeObjects(object)
            }
        }
    }
}