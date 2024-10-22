import * as THREE from 'three'
import Experience from '../../Experience.js'
import Buttons from '../Buttons.js'
import Light from '../Light.js'
import Pattern from '../Pattern.js'

export default class PatternSection
{
    constructor(section)
    {
        this.section = section

        this.currentGeometry = this.section.currentGeometry
        this.currentMaterial = this.section.colorSection.currentMaterial

        this.buttonGap = this.section.buttonGap
        this.buttonSize = this.section.buttonSize

        this.size = this.section.defaultSize
        this.color = this.section.defaultColor

        this.experience = new Experience()
        this.scene = this.experience.scene
        this.time = this.experience.time

        this.currentColor = section.currentColor


        this.pattern = new Pattern()
        this.stripeHeightPattern = this.pattern.createHeightStripe()
        this.stripeHeightPattern.minFilter = THREE.NearestFilter
        this.stripeHeightPattern.magFilter = THREE.NearestFilter

        this.pattern2 = new Pattern()
        this.stripeWidthPattern = this.pattern2.createWidthStripe()
        this.stripeWidthPattern.minFilter = THREE.NearestFilter
        this.stripeWidthPattern.magFilter = THREE.NearestFilter
        
        this.pattern3 = new Pattern()
        this.diagonalPattern = this.pattern3.createDiagonalGrid()
        this.diagonalPattern.minFilter = THREE.NearestFilter
        this.diagonalPattern.magFilter = THREE.NearestFilter

        this.list = ['plain','stripeHeight','stripeWidth', 'diagonal']
        this.patterns = {
            'plain' : false,
            'stripeHeight' : this.stripeHeightPattern,
            'stripeWidth' : this.stripeWidthPattern,
            'diagonal' : this.diagonalPattern
        }
        this.current = 0
        this.currentPattern = this.list[this.current]

        this.responsive = this.experience.responsive

        this.setMesh()

        this.setButtons()
        // this.setLight()
    }


    setMesh()
    {
        this.mesh = new THREE.Mesh(this.currentGeometry, this.currentMaterial)
        this.mesh.scale.set(0.5, 0.5, 0.5)
        
        this.meshSection = this.responsive.getMeshPosition('pattern')
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
        this.updatePattern()
    }

    updateMaterial()
    {
        if (this.currentMaterial)
        {
            this.currentMaterial.dispose()
            this.scene.remove(this.mesh)
        }
        
        this.currentMaterial = this.section.colorSection.currentMaterial

        this.buttons.leftButton.material.dispose()
        this.buttons.rightButton.material.dispose()
        this.buttons.leftButton.material = this.currentMaterial.clone()
        this.buttons.rightButton.material = this.currentMaterial.clone()
        
        this.setMesh()
        this.updatePattern()
    }

    updateColor()
    {
        this.currentMaterial.color.set(this.section.currentColor)
        // this.buttons.leftButton.material.color.set(this.currentColor)
        // this.buttons.rightButton.material.color.set(this.currentColor)
    }

    updatePattern()
    {

        if (this.currentMaterial)
        {
            this.currentMaterial.dispose()
            this.scene.remove(this.mesh)
        }
    

        this.currentMaterial = this.section.currentMaterial.clone()
        
        this.currentPattern = this.list[this.current]
        
        if (this.patterns[this.currentPattern])
        {
            this.currentMaterial.map = this.patterns[this.currentPattern]
        }
        
        this.updateColor()

        this.synchronizeFinalMesh()
        
        this.setMesh()
    }

    synchronizeFinalMesh()
    {
        // Geometry 동기화
        if (this.section.mesh)
        {
            this.scene.remove(this.section.mesh)

            if (this.section.mesh.geometry) this.section.mesh.geometry.dispose()
            this.section.mesh.geometry = this.currentGeometry
    
            if (this.section.mesh.material) this.section.mesh.material.dispose()
            this.section.mesh.material = this.currentMaterial
    
            this.scene.add(this.section.mesh)
        }
    }
    
    update()
    {
        this.elapsed = this.time.elapsed
        this.mesh.rotation.set(this.elapsed * 0.0001, -this.elapsed * 0.00012, 0)

        if(this.buttons)
        {
            this.buttons.update()
        }
    }
}