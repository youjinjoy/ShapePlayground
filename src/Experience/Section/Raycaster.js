import * as THREE from 'three'
import Experience from '../Experience.js'

export default class Raycaster
{
    constructor(section)
    {
        this.section = section

        this.experience = new Experience()
        this.scene = this.experience.scene
        this.camera = this.experience.camera.instance
        this.sizes = this.experience.sizes
        this.selectableObjects = this.experience.selectableObjects

        this.raycaster = new THREE.Raycaster()
        this.mouse = new THREE.Vector2()
        this.mouse.x = -1
        this.mouse.y = -1

        this.currentIntersect = null
        this.leftButton =  this.selectableObjects[0]
        this.rightButton =  this.selectableObjects[1]

        window.addEventListener('mousemove', (event) =>
        {
            this.mouse.x = event.clientX / this.sizes.width * 2 - 1
            this.mouse.y = - (event.clientY / this.sizes.height) * 2 + 1        
        })

        window.addEventListener('click', () =>
        {
            if(this.currentIntersect)
            {
                console.log('click')
                if(this.currentIntersect.object === this.leftButton)
                {
                    this.section.geometryList.current += this.section.geometryList.list.length
                    this.section.geometryList.current -= 1
                    this.section.geometryList.current %= 3
                    this.section.geometryList.updateGeometry()
                }
                else if(this.currentIntersect.object === this.rightButton)
                {
                    this.section.geometryList.current += 1
                    this.section.geometryList.current %= 3
                    this.section.geometryList.updateGeometry()
                }
                
            }
        })
    }

    update()
    {
        this.raycaster.setFromCamera(this.mouse, this.camera)
        this.intersects = this.raycaster.intersectObjects(this.selectableObjects)
        
        // for(const intersect of this.intersects)
        // {
        //     intersect.object.material.color.set('#0000ff')
        // }
    
        for(const object of this.selectableObjects)
        {
            if(!this.intersects.find(intersect => intersect.object === object))
            {
                object.material.color.set('#ff0000')
            }
        }

        if(this.intersects.length)
        {
            if(!this.currentIntersect)
            {
                console.log('mouse enter')
            }
    
            this.currentIntersect = this.intersects[0]
            this.currentIntersect.object.material.color.set('#0000ff')
        }
        else
        {
            if(this.currentIntersect)
            {
                console.log('mouse leave')
            }
            this.currentIntersect = null
        }
    }
}