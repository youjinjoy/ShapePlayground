import * as THREE from 'three'
import Experience from '../Experience.js'

export default class Section
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene

        this.setGeometry()
        this.setMaterial()
        this.setMesh()

    }

    setGeometry()
    {
        this.geometry = new THREE.TorusGeometry(3)
    }

    setMaterial()
    {
        this.material = new THREE.MeshBasicMaterial( {color:'red'} )
    }

    setMesh()
    {
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.mesh.scale.set(0.5, 0.5, 0.5)
        this.mesh.position.set(3.5, 0, 0)
        this.scene.add(this.mesh)
    }
}