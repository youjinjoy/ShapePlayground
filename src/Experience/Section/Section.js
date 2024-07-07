import * as THREE from 'three'
import Experience from '../Experience.js'
import Light from './Light.js'
import Buttons from './Buttons.js'
import GeometryList from './GeometryList.js'
import Raycaster from './Raycaster.js'

export default class Section
{
    constructor()
    {
        
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.camera = this.experience.camera.instance
        this.sizes = this.experience.sizes

        this.selectableObjects = this.experience.selectableObjects
        
        this.setGeometryList()
        
        this.setLight()
        
        this.setButtons()

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

    update()
    {
        if(this.geometryList.mesh)
        {
            this.geometryList.update()
        }

        if(this.buttons)
        {
            this.buttons.update()
        }

        if(this.raycaster)
        {
            this.raycaster.update()
        }

    }
}