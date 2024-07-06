import * as THREE from 'three'
import Experience from '../Experience'

export default class Section
{
    constructor(position, size, gap)
    {
        
        this.experience = new Experience()
        this.scene = this.experience.scene

        this.position = position
        this.size = size
        this.gap = gap

        this.setGeometry()
        this.setMaterial()
        this.setMesh()

        this.setPosition()
        this.setSize()
    }

    setGeometry()
    {
        this.buttonGeometry = new THREE.CylinderGeometry(1,1,0.2,3,1)
    }

    setMaterial()
    {
        this.buttonMaterial = new THREE.MeshStandardMaterial({color:'cadetblue'})
    }

    setMesh()
    {
        this.leftButtonMesh = new THREE.Mesh(this.buttonGeometry, this.buttonMaterial)
        this.leftButtonMesh.rotation.set(Math.PI * 0.5, -Math.PI * 0.5 , 0)
        this.scene.add(this.leftButtonMesh)
        
        this.rightButtonMesh = new THREE.Mesh(this.buttonGeometry, this.buttonMaterial)
        this.rightButtonMesh.rotation.set(Math.PI * 0.5, Math.PI * 0.5 , 0)
        this.scene.add(this.rightButtonMesh)
    }

    setPosition()
    {
        this.leftButtonMesh.position.set(this.position.x - this.gap, this.position.y, this.position.z)
        this.rightButtonMesh.position.set(this.position.x + this.gap, this.position.y, this.position.z)
    }

    setSize()
    {
        this.leftButtonMesh.scale.set(this.size, this.size, this.size)
        this.rightButtonMesh.scale.set(this.size, this.size, this.size)
    }
}