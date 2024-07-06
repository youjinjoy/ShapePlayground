import * as THREE from 'three'
import Experience from '../Experience.js'

export default class Raycaster
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.camera = this.experience.camera.instance
        this.sizes = this.experience.sizes
        this.selectableObjects = this.experience.selectableObjects

        this.raycaster = new THREE.Raycaster()
        this.mouse = new THREE.Vector2()

        window.addEventListener('mousemove', (event) =>
        {
            this.mouse.x = event.clientX / this.sizes.width * 2 - 1
            this.mouse.y = - (event.clientY / this.sizes.height) * 2 + 1        
        })
    }

    update()
    {
        this.raycaster.setFromCamera(this.mouse, this.camera)
        this.intersects = this.raycaster.intersectObjects(this.selectableObjects)    

        for(const intersect of this.intersects)
        {
            intersect.object.material.color.set('#0000ff')
        }
    
        for(const object of this.selectableObjects)
        {
            if(!this.intersects.find(intersect => intersect.object === object))
            {
                object.material.color.set('#ff0000')
            }
        }
    }
}