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
        this.setFloorLight()
    }
    
    setMesh()
    {
        this.mesh = this.section.mesh.clone()
        
        this.mesh.scale.set(0.5, 0.5, 0.5)
        this.mesh.position.set(0, -63 - 0.5, 0)
        
        this.mesh.castShadow = true

        this.scene.add(this.mesh)
    }

    setFloorMesh(position)
    {
        this.floorGeometry = new THREE.CylinderGeometry(20,20,1)
        this.floorMaterial = new THREE.MeshStandardMaterial({ color: '#eee' })
        this.floorMesh = new THREE.Mesh(this.floorGeometry, this.floorMaterial)

        this.floorMesh.position.set(position.x, position.y-1, position.z)

        this.floorMesh.receiveShadow = true

        this.scene.add(this.floorMesh)
    }
    
    setFloor(position)
    {
        this.setFloorMesh(position)

        this.floorShape = new CANNON.Plane()
        this.floorBody = new CANNON.Body()
        this.floorBody.mess = 0
        this.floorBody.addShape(this.floorShape)
        
        this.floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(- 1, 0, 0), Math.PI * 0.5)
        this.floorBody.position.set(position.x, position.y, position.z)

        this.floorBody.material = this.defaultMaterial

        this.scene.add(this.floorDirectionalLight)

        this.world.addBody(this.floorBody)
    }

    setFloorLight()
    {
        this.floorDirectionalLight = new THREE.DirectionalLight("#fff",4)
        this.floorDirectionalLight.position.set(5, -70, 5)
        this.floorDirectionalLight.target = this.floorMesh
        this.floorDirectionalLight.castShadow = true

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