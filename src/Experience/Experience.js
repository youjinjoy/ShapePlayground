import * as THREE from 'three'
import Debug from './Utils/Debug.js'
import Sizes from './Utils/Sizes.js'
import Time from './Utils/Time.js'
import Camera from './Camera.js'
import Renderer from './Renderer.js'
import Section from './Section/Section.js'
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
        window.addEventListener('scroll', () =>
        {
            this.scrollY = window.scrollY
            this.newSection = Math.round(this.scrollY / this.sizes.height)
            console.log(this.currentSection, this.newSection)
            if(this.newSection != this.currentSection)
            {
                this.currentSection = this.newSection
                gsap.to(window, {
                    duration: 1,
                    scrollTo: { y: this.newSection * this.sizes.height, autoKill: false }
                })
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
        this.camera.instance.position.y = - this.scrollY / this.sizes.height * this.objectsDistance
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