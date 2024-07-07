import * as THREE from 'three'
import Experience from '../Experience'

export default class Section
{
    constructor(position, size, gap)
    {
        
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.time = this.experience.time
        this.selectableObjects = this.experience.selectableObjects

        this.position = position
        this.size = size
        this.gap = gap

        this.setGeometry()
        this.setMaterial()
        this.setMesh()

        this.setPosition()
        this.setRotation()
        this.setSize()
    }

    setGeometry()
    {
        this.leftButtonGeometry = new THREE.CylinderGeometry(1,1,0.2,3,1)
        this.rightButtonGeometry = new THREE.CylinderGeometry(1,1,0.2,3,1)
    }

    setMaterial()
    {
        this.leftButtonMaterial = new THREE.MeshStandardMaterial({color:'red'})
        this.rightButtonMaterial = new THREE.MeshStandardMaterial({color:'red'})
    }

    setMesh()
    {
        this.leftButtonMesh = new THREE.Mesh(this.leftButtonGeometry, this.leftButtonMaterial)
        this.scene.add(this.leftButtonMesh)
        
        this.rightButtonMesh = new THREE.Mesh(this.rightButtonGeometry, this.rightButtonMaterial)
        this.scene.add(this.rightButtonMesh)
    }

    setPosition()
    {
        this.leftButtonMesh.position.set(this.position.x - this.gap, this.position.y, this.position.z)
        this.rightButtonMesh.position.set(this.position.x + this.gap, this.position.y, this.position.z)
    }

    setRotation()
    {
        this.leftButtonMesh.rotation.set(Math.PI * 0.5, -Math.PI * 0.5 , 0)
        this.rightButtonMesh.rotation.set(Math.PI * 0.5, Math.PI * 0.5 , 0)
    }

    setSize()
    {
        this.leftButtonMesh.scale.set(this.size, this.size, this.size)
        this.rightButtonMesh.scale.set(this.size, this.size, this.size)
    }

    update()
    {
        this.elapsed = this.time.elapsed
        this.leftButtonMesh.rotation.set(Math.PI * 0.5 + 0.5 * Math.sin(Math.PI + 0.001 * this.elapsed), -Math.PI * 0.5 , 0)
        this.rightButtonMesh.rotation.set(Math.PI * 0.5 + 0.2 * Math.sin(0.001 * this.elapsed), Math.PI * 0.5 , 0)
    }
}