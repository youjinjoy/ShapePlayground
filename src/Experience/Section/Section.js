import * as THREE from 'three'
import Experience from '../Experience.js'
import Light from './Light.js'
import Buttons from './Buttons.js'
import GeometryList from './GeometryList.js'
import Raycaster from './Raycaster.js'
import GeometrySection from './GeometrySection.js'
import MaterialSection from './MaterialSection.js'
import ColorSection from './ColorSection.js'

export default class Section
{
    constructor()
    {
        
        this.experience = new Experience()
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.camera = this.experience.camera.instance

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

        this.modelSize = 3
        this.modelColor = 'red'

        

        // Geometry Section
        this.geometrySection = new GeometrySection(this)
        this.currentGeometry = this.geometrySection.currentGeometry

        // // Material Section
        this.materialSection = new MaterialSection(this)
        this.currentMaterial = this.materialSection.currentMaterial

        // // Color Section
        this.colorSection = new ColorSection(this)
        this.currentColor = this.colorSection.currentColor

        // // Pattern Section
        // this.patternSection = new PatternSection(this)
        // this.currentPattern = this.patternSection.currentPattern

        // // Final Result
        // this.mesh = new THREE.Mesh(
        //     this.currentGeometry,
        //     this.currentMaterial
        // )

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


        if(this.raycaster)
        {
            this.raycaster.update()
        }

    }
}