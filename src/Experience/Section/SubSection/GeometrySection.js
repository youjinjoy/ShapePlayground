import * as THREE from 'three'
import Experience from '../../Experience.js'
import Buttons from '../Buttons.js'
import Light from '../Light.js'

export default class GeometrySection
{
    constructor(section)
    {
        this.section = section

        this.buttonGap = this.section.buttonGap
        this.buttonSize = this.section.buttonSize

        this.size = this.section.defaultSize
        this.color = this.section.defaultColor

        this.experience = new Experience()
        this.scene = this.experience.scene
        this.time = this.experience.time
        this.responsive = this.experience.responsive

        this.setGeometry()
        this.setMaterial()
        this.setMesh()

        this.setButtons()
        this.setLight()
    }

    setGeometry()
    {
        this.list = ['torus', 'sphere', 'cylinder']
        this.geometries = {
            'torus' : new THREE.TorusGeometry(this.size - 1, 1),
            'sphere' : new THREE.SphereGeometry(this.size),
            'cylinder' : new THREE.CylinderGeometry(this.size, this.size, 5),
        }

        this.current = 0
        this.currentGeometry = this.geometries[this.list[this.current]]
    }

    setMaterial()
    {
        this.material = new THREE.MeshStandardMaterial( {color: this.color, wireframe: true} )
    }

    setMesh()
    {
        this.mesh = new THREE.Mesh(this.currentGeometry, this.material)
        this.mesh.scale.set(0.5, 0.5, 0.5)
        
        this.meshSection = this.responsive.getMeshPosition('geometry')
        this.mesh.position.copy(this.meshSection)
        this.scene.add(this.mesh)
    }

    setButtons()
    {
        this.buttons = new Buttons(this.mesh.position, this.buttonSize, this.buttonGap)
        this.section.selectableObjects.push(this.buttons.leftButton)
        this.section.selectableObjects.push(this.buttons.rightButton)
    }

    setLight()
    {
        this.light = new Light(this.mesh)
        this.light.setDirectionalLight()
    }

    updateGeometry()
    {
        if (this.currentGeometry)
        {
            this.currentGeometry.dispose()
            this.scene.remove(this.mesh)
        }
        
        this.currentGeometry = this.geometries[this.list[this.current]]
        this.section.currentGeometry = this.currentGeometry
        
        this.setMesh()
    }

    update()
    {
        this.elapsed = this.time.elapsed

        this.mesh.rotation.set(this.elapsed * 0.0001, this.elapsed * 0.00012, 0)

        if(this.buttons)
        {
            this.buttons.update()
        }
    }
}