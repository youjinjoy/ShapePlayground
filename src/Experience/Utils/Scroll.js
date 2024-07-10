import * as THREE from 'three'
import EventEmitter from './EventEmitter'
import Experience from '../Experience'

import gsap from 'gsap'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollToPlugin)
gsap.registerPlugin(ScrollTrigger)


export default class Scroll extends EventEmitter
{
    constructor()
    {
        super()

        this.experience = new Experience()
        this.sizes = this.experience.sizes
        this.camera = this.experience.camera
        
        
        this.objectsDistance = 9
        this.scrollY = window.scrollY
        this.currentSection = Math.round(this.scrollY / this.sizes.height)

        // Section5에서 카메라 회전 애니메이션 위함
        this.setProperty()
        this.animate()

        window.addEventListener('scroll', () =>
        {
            this.scrollY = window.scrollY
            this.newSection = Math.round(this.scrollY / this.sizes.height)

            if(this.newSection != this.currentSection)
            {
                this.currentSection = this.newSection
                gsap.to(window, {
                    duration: 1,
                    scrollTo: { y: this.newSection * this.sizes.height, autoKill: false }
                })
            }
            this.trigger('scroll')
        })
    }

    setProperty()
    {
        if (this.scrollY / this.sizes.height <= 5)
        {
            this.progress = (this.scrollY / this.sizes.height - 4)
            this.angle = this.progress * Math.PI * 2
            this.radius = 12 + this.progress * 30
            this.x = this.radius * Math.sin(this.angle)
            this.z = this.radius * Math.cos(this.angle)
        }
        else
        {
            this.x = 0
            this.z = 42
        }
    }

    animate()
    {
        
        this.scrollY = window.scrollY
        if(Math.round(this.scrollY / this.sizes.height) <= 3.5)
        {
            this.camera.instance.position.y = - this.scrollY / this.sizes.height * this.objectsDistance
            this.camera.instance.position.z = 12
            this.camera.instance.position.x = 0
            this.camera.instance.rotation.set(0, 0, 0)
        }
        else if(this.scrollY / this.sizes.height <= 4)
        {
            this.camera.instance.position.y = - (this.scrollY / this.sizes.height + 3)* this.objectsDistance
            this.camera.instance.position.z = 12
            this.camera.instance.position.x = 0
            
            this.camera.instance.rotation.set(0, 0, 0)
        }
        else if(this.scrollY / this.sizes.height <= 5)
        {
            this.progress = (this.scrollY / this.sizes.height - 4)
            this.angle = this.progress * Math.PI * 2
            this.radius = 12 + this.progress * 30
            this.x = this.radius * Math.sin(this.angle)
            this.z = this.radius * Math.cos(this.angle)
    
            this.camera.instance.position.set(this.x, - 63, this.z)
            this.camera.instance.lookAt(0, -63, 0)

        }
        else
        {
            this.camera.instance.position.set(this.x, - (this.scrollY / this.sizes.height + 2)* this.objectsDistance, this.z)
            this.camera.instance.rotation.set(0, 0, 0)
            this.camera.instance.lookAt(0, this.camera.instance.position.y, 0)
        }
    }
}