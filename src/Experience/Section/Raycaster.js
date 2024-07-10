import * as THREE from 'three'
import Experience from '../Experience.js'

export default class Raycaster
{
    constructor(section)
    {
        this.section = section
        this.selectableObjects = section.selectableObjects

        this.experience = new Experience()
        this.scene = this.experience.scene
        this.camera = this.experience.camera.instance
        this.sizes = this.experience.sizes

        this.raycaster = new THREE.Raycaster()
        this.mouse = new THREE.Vector2()
        this.mouse.x = -1
        this.mouse.y = -1

        this.currentIntersect = null
        this.leftButton =  this.selectableObjects[0]
        this.rightButton =  this.selectableObjects[1]
        this.leftButtonMaterial =  this.selectableObjects[2]
        this.rightButtonMaterial =  this.selectableObjects[3]
        this.leftButtonColor =  this.selectableObjects[4]
        this.rightButtonColor =  this.selectableObjects[5]
        this.leftButtonPattern =  this.selectableObjects[6]
        this.rightButtonPattern =  this.selectableObjects[7]

        this.defaultColor = section.defaultColor
        this.currentColor = section.defaultColor

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
                    this.section.geometrySection.current += this.section.geometrySection.list.length
                    this.section.geometrySection.current -= 1
                    this.section.geometrySection.current %= this.section.geometrySection.list.length
                    this.section.geometrySection.updateGeometry()
                    this.section.materialSection.updateGeometry()
                    this.section.colorSection.updateGeometry()
                    this.section.patternSection.updateGeometry()
                }
                else if(this.currentIntersect.object === this.rightButton)
                {
                    this.section.geometrySection.current += 1
                    this.section.geometrySection.current %= this.section.geometrySection.list.length
                    this.section.geometrySection.updateGeometry()
                    this.section.materialSection.updateGeometry()
                    this.section.colorSection.updateGeometry()
                    this.section.patternSection.updateGeometry()
                }
                else if(this.currentIntersect.object === this.leftButtonMaterial)
                {
                    this.section.materialSection.current += this.section.materialSection.list.length
                    this.section.materialSection.current -= 1
                    this.section.materialSection.current %= this.section.materialSection.list.length
                    this.section.materialSection.updateMaterial()
                    this.section.colorSection.updateMaterial()
                    this.section.patternSection.updateMaterial()
                }
                else if(this.currentIntersect.object === this.rightButtonMaterial)
                {
                    this.section.materialSection.current += 1
                    this.section.materialSection.current %= this.section.materialSection.list.length
                    this.section.materialSection.updateMaterial()
                    this.section.colorSection.updateMaterial()
                    this.section.patternSection.updateMaterial()

                }
                else if(this.currentIntersect.object === this.leftButtonColor)
                {
                    this.section.colorSection.current += this.section.colorSection.list.length
                    this.section.colorSection.current -= 1
                    this.section.colorSection.current %= this.section.colorSection.list.length
                    this.currentColor = this.section.colorSection.updateColor()
                }
                else if(this.currentIntersect.object === this.rightButtonColor)
                {
                    this.section.colorSection.current += 1
                    this.section.colorSection.current %= this.section.colorSection.list.length
                    this.currentColor = this.section.colorSection.updateColor()
                }
                else if(this.currentIntersect.object === this.leftButtonPattern)
                {
                    this.section.patternSection.current += this.section.patternSection.list.length
                    this.section.patternSection.current -= 1
                    this.section.patternSection.current %= this.section.patternSection.list.length
                    this.section.patternSection.updatePattern()
                }
                else if(this.currentIntersect.object === this.rightButtonPattern)
                {
                    this.section.patternSection.current += 1
                    this.section.patternSection.current %= this.section.patternSection.list.length
                    this.section.patternSection.updatePattern()
                }
            }
            else
            {
                if(this.experience.scroll.currentSection >= 5)
                {
                    this.experience.world.setMesh()
                    this.experience.world.setSphereBody(this.section.defaultSize - 2.3, 1, this.experience.world.mesh.position)

                    this.experience.world.objectsToUpdate.push({
                        mesh: this.experience.world.mesh,
                        body: this.experience.world.sphereBody
                    })
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
                if(object === this.rightButtonColor || object === this.leftButtonColor || object === this.leftButtonPattern || object === this.rightButtonPattern)
                {
                    object.material.color.set(this.currentColor)
                }
                else    
                {
                    object.material.color.set(this.defaultColor)
                }
            }
        }

        if(this.intersects.length)
        {
            if(!this.currentIntersect)
            {
                console.log('mouse enter')
            }
    
            this.currentIntersect = this.intersects[0]
            this.currentIntersect.object.material.color.set('#ffeded')
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