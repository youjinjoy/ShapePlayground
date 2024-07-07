import * as THREE from 'three'
import Experience from '../Experience.js'

export default class GeometryList
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.time = this.experience.time

        this.current = 0
        this.size = 3
        this.list = ['torus', 'sphere', 'cylinder']

        this.setGeometry()
        this.setMaterial()
        this.setMesh()
    }

    setGeometry()
    {
        switch(this.current)
        {
            case 0:
                this.geometry = new THREE.TorusGeometry(this.size - 1, 1)
                break

            case 1:
                this.geometry = new THREE.SphereGeometry(this.size)
                break

            case 2:
                this.geometry = new THREE.CylinderGeometry(this.size, this.size, 5)
                break
        }
    }

    updateGeometry()
    {
        if (this.geometry)
        {
            this.geometry.dispose()
            this.scene.remove(this.mesh)
        }

        switch(this.current)
        {
            case 0:
                this.geometry = new THREE.TorusGeometry(this.size - 1, 1)
                break

            case 1:
                this.geometry = new THREE.SphereGeometry(this.size)
                break

            case 2:
                this.geometry = new THREE.CylinderGeometry(this.size, this.size, 5)
                break
        }

        this.setMesh()
    }

    setMaterial()
    {
        this.material = new THREE.MeshStandardMaterial( {color: 'red', wireframe: true} )
    }

    setMesh()
    {
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.mesh.scale.set(0.5, 0.5, 0.5)
        this.mesh.position.set(3.5, 0, 0)
        this.scene.add(this.mesh)
    }

    update()
    {
        this.elapsed = this.time.elapsed

        this.mesh.rotation.set(this.elapsed * 0.0001, this.elapsed * 0.00012, 0)
    }
}