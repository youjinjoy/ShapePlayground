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
        this.raycaster = new Raycaster()

        this.setGeometryList()

        this.setLight()

        this.setButton()
    }

    setGeometryList()
    {
        this.geometryList = new GeometryList()
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
        this.light = new Light(this.geometryList.mesh)
        this.light.setAmbientLight()
        this.light.setDirectionalLight()
    }

    setButton()
    {
        this.gap = 2.5
        this.size = 0.5
        this.buttons = new Buttons(this.geometryList.mesh.position, this.size, this.gap)
        this.selectableObjects.push(this.buttons.leftButtonMesh)
        this.selectableObjects.push(this.buttons.rightButtonMesh)
    }

    update()
    {
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