import * as THREE from 'three'
import Debug from './Utils/Debug.js'
import Sizes from './Utils/Sizes.js'
import Time from './Utils/Time.js'
import Resources from './Utils/Resources.js'
import Camera from './Camera.js'
import Renderer from './Renderer.js'
import Section from './Section/Section.js'

import sources from './sources.js'

import World from './World/World.js'
import Scroll from './Utils/Scroll.js'

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
        this.world = new World()

        this.scroll = new Scroll()

        this.sizes.on("resize", () => {
            this.resize()
        })

        this.time.on("tick", () => {
            this.update()
        })

        this.scroll.on("scroll", () => {
            this.scroll.animate()
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
        this.world.update()
        this.camera.update()
        this.renderer.update()
    }

    destroy()
    {
        this.sizes.off("resize")
        this.time.off("tick")
        this.scroll.off("scroll")
        
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