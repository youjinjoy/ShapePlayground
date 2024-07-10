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
        this.currentSection = Math.round(window.scrollY / this.sizes.height)

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

    animate()
    {
        
        this.scrollY = window.scrollY
        // 섹션 별 카메라 애니메이션
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
            const progress = (this.scrollY / this.sizes.height - 4)
            const angle = progress * Math.PI * 2

            // 카메라가 메시 주위를 회전하면서 점점 멀어지게 하기
            const radius = 12 + progress * 30
            const x = radius * Math.sin(angle)
            const z = radius * Math.cos(angle)
            this.camera.instance.position.set(x, - 63, z)
            this.camera.instance.lookAt(0, -63, 0)
        }
        else
        {
            this.camera.instance.position.y = - (this.scrollY / this.sizes.height + 2)* this.objectsDistance
            this.camera.instance.rotation.set(0, 0, 0)
            this.camera.instance.lookAt(0, this.camera.instance.position.y, 0)
        }
    }
}