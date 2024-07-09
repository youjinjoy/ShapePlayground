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
        this.scene = this.experience.scene
        this.camera = this.experience.camera.instance
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
        // this.mesh = new THREE.Mesh(
        //     this.currentGeometry,
        //     this.currentMaterial
        // )
        // this.mesh.material.color.set(this.currentColor)
        // this.mesh.material.map = this.currentPattern
        this.mesh = this.patternSection.mesh.clone()
        this.mesh.position.set(0, -63 - 0.5, 0)
        this.scene.add(this.mesh)
        

        this.raycaster = new Raycaster(this)

    }

    setGeometryList()
    {
        this.geometryList = new GeometryList()
    }

    setLight()
    {
        this.light = new Light(this.geometryList.mesh)
        this.light.setAmbientLight()
        this.light.setDirectionalLight()
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