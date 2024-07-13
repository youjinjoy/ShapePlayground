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
        
        this.scrollY = window.scrollY
        this.currentLocation = this.scrollY / this.sizes.height
        this.currentSection = Math.round(this.currentLocation)
        this.animating = false

        window.addEventListener('wheel', (event) => {
            if (this.animating)
            {
                document.body.style.overflow = 'hidden';
                event.preventDefault(); // 휠 이벤트 막기
            }
            else
            {
                document.body.style.overflow = ''
            }
          }, { passive: false }); // passive를 false로 설정해야 preventDefault가 적용됨

        window.addEventListener('scroll', () =>
        {
            this.scrollY = window.scrollY
            this.newLocation = this.scrollY / this.sizes.height

            this.direction = this.currentLocation === this.newLocation ? "no move" : (this.currentLocation < this.newLocation ? "down" : "up")
            // this.direction = this.currentLocation < this.newLocation ? "down" : "up"
            // this.direction = this.currentLocation === this.newLocation ? "no move" : this.direction

            this.newSection = Math.round(this.newLocation)
            
            this.currentLocation = this.newLocation
            this.currentSection = this.newSection

            if (!this.animating)
            {
                this.trigger('sectionChange', [{
                    direction : this.direction,
                    currentSection : this.currentSection,
                    currentLocation : this.currentLocation,
                    animating: this.animating
                }])

                this.animating = true

                setTimeout(() => {
                    this.animating = false
                }, 1100)
            }

            this.trigger('scroll', [{
                direction : this.direction,
                currentSection : this.currentSection,
                currentLocation : this.currentLocation,
                animating: this.animating
            }])


        })

        this.sizes.on('resize', () => {
            this.currentSection = Math.round(this.scrollY / this.sizes.height)
            if(window.matchMedia("(max-width: 480px)").matches)
            {
                switch (this.currentSection % 2)
                {
                    case 0:
                        this.camera.instance.position.x = 3.5
                        break
                    case 1:
                        this.camera.instance.position.x = -3.5
                        break
                }
            }
            else if(window.matchMedia("(max-width: 768px)").matches)
            {
                switch (this.currentSection % 2)
                {
                    case 0:
                        this.camera.instance.position.x = 3.5
                        break
                    case 1:
                        this.camera.instance.position.x = -3.5
                        break
                }
            }
            else
            {
                this.camera.instance.position.x = 0
            }
        })
    }
}