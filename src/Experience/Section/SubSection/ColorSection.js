import * as THREE from 'three'
import Experience from '../../Experience.js'
import Buttons from '../Buttons.js'
import Light from '../Light.js'

export default class ColorSection
{
    constructor(section)
    {
        this.section = section

        this.currentGeometry = this.section.currentGeometry
        this.currentMaterial = this.section.currentMaterial.clone()

        this.buttonGap = this.section.buttonGap
        this.buttonSize = this.section.buttonSize

        this.size = this.section.defaultSize
        this.color = this.section.defaultColor

        this.experience = new Experience()
        this.scene = this.experience.scene
        this.time = this.experience.time

        this.list = ['red','orange','green','#0039a6','#720e9e','wheat','#333']
        this.current = 0
        this.currentColor = this.list[this.current]
        this.currentMaterial.color.set(this.currentColor)


        this.responsive = this.experience.responsive

        this.setMesh()

        this.setButtons()
        // this.setLight()
    }


    setMesh()
    {
        this.mesh = new THREE.Mesh(this.currentGeometry, this.currentMaterial)
        this.mesh.scale.set(0.5, 0.5, 0.5)
        
        this.meshSection = this.responsive.getMeshPosition('color')
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

        this.currentGeometry = this.section.currentGeometry
        this.setMesh()
    }

    updateMaterial()
    {
        if (this.currentMaterial)
        {
            this.currentMaterial.dispose()
            this.scene.remove(this.mesh)
        }
        
        this.currentMaterial = this.section.currentMaterial.clone()
                
        this.buttons.leftButton.material.dispose()
        this.buttons.rightButton.material.dispose()
        this.buttons.leftButton.material = this.currentMaterial.clone()
        this.buttons.rightButton.material = this.currentMaterial.clone()

        this.setMesh()
        this.updateColor()
    }

    updateColor()
    {
        this.currentColor = this.list[this.current]

        this.currentMaterial.color.set(this.currentColor)
        this.buttons.leftButton.material.color.set(this.currentColor)
        this.buttons.rightButton.material.color.set(this.currentColor)

        this.section.currentColor = this.currentColor
        this.section.patternSection.updateColor()
        
        return this.currentColor
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