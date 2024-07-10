import * as THREE from 'three'
import Debug from './Utils/Debug.js'
import Sizes from './Utils/Sizes.js'
import Time from './Utils/Time.js'
import Resources from './Utils/Resources.js'
import Camera from './Camera.js'
import Renderer from './Renderer.js'
import Section from './Section/Section.js'

import sources from './sources.js'

import gsap from 'gsap'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollToPlugin)
gsap.registerPlugin(ScrollTrigger)

let instance = null;

export default class Experience
{
    constructor(_canvas)
    {
        if(instance)
        {
            return instance
        }
        instance = this

        // window.experience = this

        this.canvas = _canvas

        this.debug = new Debug()
        this.sizes = new Sizes()
        this.time = new Time()

        this.scene = new THREE.Scene()
        this.resources = new Resources(sources)
        this.camera = new Camera()
        this.renderer = new Renderer()
        this.section = new Section()

        this.sizes.on("resize", () => {
            this.resize()
        })

        this.time.on("tick", () => {
            this.update()
        })

        this.scrollY = window.scrollY
        this.objectsDistance = 9
        this.currentSection = Math.round(this.scrollY / this.sizes.height)
        this.camera.instance.position.set(0,- this.scrollY / this.sizes.height * this.objectsDistance, 12)

 
        window.addEventListener('scroll', () =>
        {
            // 섹션 별 스크롤 애니메이션
            this.scrollY = window.scrollY
            this.newSection = Math.round(this.scrollY / this.sizes.height)
            if(this.newSection != this.currentSection)
            {
                this.currentSection = this.newSection
                gsap.to(window, {
                    duration: 0.5,
                    scrollTo: { y: this.newSection * this.sizes.height, autoKill: false }
                })
            }

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
                this.camera.instance.lookAt(0, this.camera.instance.position.y, 0)
            }
        })
    }

    resize()
    {
        this.camera.resize()
        this.renderer.resize()
    }

    update()
    {
        this.section.update()
        this.camera.update()
        this.renderer.update()
    }

    destroy()
    {
        this.sizes.off("resize");
        this.time.off("tick");
        
        this.scene.traverse((child) => {
            if (child instanceof THREE.Mesh)
            {
                child.geometry.dispose()

                for (const key in child.material)
                {
                    const value = child.material[key]

                    if (value && typeof value.dispose === "function")
                    {
                        value.dispose()
                    }
                }
            }
        })

        this.camera.controls.dispose()
        this.renderer.instance.dispose()

        if (this.debug.active) this.debug.ui.destroy()
    }

}