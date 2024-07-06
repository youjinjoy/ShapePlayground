import * as THREE from 'three'
import Experience from '../Experience.js'
import Light from './Light.js'
import Button from './Button.js'

export default class Section
{
    constructor()
    {
        
        this.experience = new Experience()
        this.scene = this.experience.scene

        this.setGeometry()
        this.setMaterial()
        this.setMesh()

        this.setLight()

        this.setButton()
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

    setLight()
    {
        this.light = new Light(this.mesh)
        this.light.setAmbientLight()
        this.light.setDirectionalLight()
    }

    setButton()
    {
        this.gap = 2.5
        this.size = 0.5
        this.button = new Button(this.mesh.position, this.size, this.gap)
    }

    update()
    {
        if(this.button)
        {
            this.button.update()
        }
    }
}