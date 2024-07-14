import * as THREE from 'three'
import Experience from '../Experience.js'
import Light from './Light.js'
import Buttons from './Buttons.js'
import Raycaster from './Raycaster.js'
import GeometrySection from './SubSection/GeometrySection.js'
import MaterialSection from './SubSection/MaterialSection.js'
import ColorSection from './SubSection/ColorSection.js'
import PatternSection from './SubSection/PatternSection.js'

export default class Section
{
    constructor()
    {
        
        this.experience = new Experience()
        this.sizes = this.experience.sizes
        this.scroll = this.experience.scroll
        this.scene = this.experience.scene
        this.camera = this.experience.camera
        this.resources = this.experience.resources
        
        this.selectableObjects = []

        this.setAmbientLight()

        // Candidate
        this.currentGeometry = null
        this.currentMaterial = null
        this.currentColor = null
        this.currentPattern = null

        // Common Properties
        this.buttonGap = 2.5
        this.buttonSize = 0.5

        this.defaultSize = 3
        this.defaultColor = 'red'

        // Geometry Section
        this.geometrySection = new GeometrySection(this)
        this.currentGeometry = this.geometrySection.currentGeometry

        // Material Section
        this.materialSection = new MaterialSection(this)
        this.currentMaterial = this.materialSection.currentMaterial

        // Color Section
        this.colorSection = new ColorSection(this)
        this.currentColor = this.colorSection.currentColor

        // Pattern Section
        this.patternSection = new PatternSection(this)
        this.currentPattern = this.patternSection.currentPattern
        
        // Final Result
        this.mesh = this.patternSection.mesh.clone()
        this.mesh.material.envMap = this.envMap
        this.mesh.material.envMapIntensity = 30
        this.mesh.position.set(0, -36 - 0.5, 0)

        // this.resources.on('ready', () =>
        // {
        //     this.setEnvironmentMap()
        // })
        
        this.scene.add(this.mesh)

        this.finalLight = new THREE.SpotLight('#fff',40)
        this.finalLight.position.set(0, -36 + 1, -5)
        this.finalLight.target = this.mesh
        
        this.scene.add(this.finalLight)
        this.raycaster = new Raycaster(this)

        // resize event
        this.updateResponsiveElements()

        this.sizes.on('resize', () => {
            this.updateResponsiveElements()
        })

        // section change event
        if (this.scroll.currentLocation >= 4)
        {
            this.patternSection.mesh.visible = false
            this.patternSection.buttons.leftButton.visible = false
            this.patternSection.buttons.rightButton.visible = false
        }
        else
        {
            this.patternSection.mesh.visible = true
            this.patternSection.buttons.leftButton.visible = true
            this.patternSection.buttons.rightButton.visible = true
        }

        this.scroll.on('sectionChange', (event) => {
            if (event.currentLocation >= 4)
            {
                this.patternSection.mesh.visible = false
                this.patternSection.buttons.leftButton.visible = false
                this.patternSection.buttons.rightButton.visible = false
            }
            else
            {
                this.patternSection.mesh.visible = true
                this.patternSection.buttons.leftButton.visible = true
                this.patternSection.buttons.rightButton.visible = true
            }
        })
    }

    updateResponsiveElements()
    {
        this.objectDistance = this.camera.getObjectDistance()

        if(window.matchMedia("(max-width: 768px)").matches)
        {
            this.extra = -1

            this.geometrySection.mesh.position.set(0, 0 + this.extra, 0)
            this.geometrySection.buttons.updatePosition(new THREE.Vector3(0, 0 + this.extra, 0))
            this.geometrySection.buttons.setPosition()

            this.materialSection.mesh.position.set(0, - this.objectDistance + this.extra, 0)
            this.materialSection.buttons.updatePosition(new THREE.Vector3(0, - this.objectDistance + this.extra, 0))
            this.materialSection.buttons.setPosition()

            this.colorSection.mesh.position.set(0, - this.objectDistance * 2 + this.extra, 0)
            this.colorSection.buttons.updatePosition(new THREE.Vector3(0, - this.objectDistance * 2 + this.extra, 0))
            this.colorSection.buttons.setPosition()

            this.patternSection.mesh.position.set(0, - this.objectDistance * 3 + this.extra, 0)
            this.patternSection.buttons.updatePosition(new THREE.Vector3(0, - this.objectDistance * 3 + this.extra, 0))
            this.patternSection.buttons.setPosition()
        }
        else
        {
            this.geometrySection.mesh.position.set(3.5, 0, 0)
            this.geometrySection.buttons.updatePosition(new THREE.Vector3(3.5, 0, 0))
            this.geometrySection.buttons.setPosition()

            this.materialSection.mesh.position.set(-3.5, - this.objectDistance, 0)
            this.materialSection.buttons.updatePosition(new THREE.Vector3(-3.5, - this.objectDistance, 0))
            this.materialSection.buttons.setPosition()

            this.colorSection.mesh.position.set(3.5, - this.objectDistance * 2, 0)
            this.colorSection.buttons.updatePosition(new THREE.Vector3(3.5, - this.objectDistance * 2, 0))
            this.colorSection.buttons.setPosition()

            this.patternSection.mesh.position.set(-3.5, - this.objectDistance * 3, 0)
            this.patternSection.buttons.updatePosition(new THREE.Vector3(-3.5, - this.objectDistance * 3, 0))
            this.patternSection.buttons.setPosition()
        }
    }

    setEnvironmentMap()
    {
        this.environmentMap = {}
        this.environmentMap.intensity = 10
        this.environmentMap.texture = this.resources.items.environmentMapTexture
        this.environmentMap.texture.colorSpace = THREE.SRGBColorSpace
        
        this.scene.environment = this.environmentMap.texture
        this.scene.environmentIntensity = 10

        this.environmentMap.updateMaterials = () =>
        {
            this.scene.traverse((child) =>
            {
                if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial)
                {
                    child.material.envMap = this.environmentMap.texture
                    child.material.envMapIntensity = this.environmentMap.intensity
                    child.material.needsUpdate = true
                }
            })
        }
        this.environmentMap.updateMaterials()
    }

    setButtons()
    {
        this.gap = 2.5
        this.size = 0.5
        this.buttons = new Buttons(this.geometryList.mesh.position, this.size, this.gap)
        this.selectableObjects.push(this.buttons.leftButton)
        this.selectableObjects.push(this.buttons.rightButton)
    }

    setAmbientLight()
    {
        this.ambientLight = new THREE.AmbientLight('#ffffff')
        this.ambientLight.position.set(0,0,0)
        this.scene.add(this.ambientLight)
    }

    update()
    {
        if(this.currentGeometry)
        {
            this.geometrySection.update()
        }

        if(this.currentMaterial)
        {
            this.materialSection.update()
        }

        if(this.currentColor)
        {
            this.colorSection.update()
        }

        if(this.currentPattern)
        {
            this.patternSection.update()
        }


        if(this.raycaster)
        {
            this.raycaster.update()
        }

    }
}