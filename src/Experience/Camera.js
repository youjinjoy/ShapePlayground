import * as THREE from 'three'
import Experience from './Experience.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap'

export default class Camera
{
    constructor()
    {
        this.experience = new Experience()
        this.canvas = this.experience.canvas
        this.sizes = this.experience.sizes
        this.scroll = this.experience.scroll
        this.scene = this.experience.scene
        
        this.objectsDistance = 9
        this.currentLocation = null
        this.animating = false

        this.setInstance()
        this.updateCameraSettings()
        // this.setControls()

        this.scroll.on('scroll', (event) =>
        {
            this.currentLocation = event.currentLocation
            this.animating = event.animating
            // this.updateCameraPosition(event.direction, event.currentSection, event.currentLocation)
        })

        this.scroll.on('sectionChange', (event) =>
        {
            if (event.animating) return

            if (event.direction === "up")
            {
                gsap.to(window, {
                    duration: 1,
                    scrollTo: { y: (event.currentSection-1) * this.sizes.height, autoKill: false }
                })
            }
            else if (event.direction === "down")
            {
                gsap.to(window, {
                    duration: 1,
                    scrollTo: { y: (event.currentSection+1) * this.sizes.height, autoKill: false }
                }) 
            }
        })
    }

    getObjectDistance()
    {
        return this.objectsDistance
    }

    updateCameraPosition()
    {
        const temp = window.scrollY / this.sizes.height
        if (temp <= 4)
        {
            this.instance.position.set(0, - temp * this.objectsDistance, 12)
            this.instance.rotation.set(0,0,0)
        }
        else if (temp <= 5)
        {
            this.progress = (temp - 4)
            this.angle = this.progress * Math.PI * 2
            this.radius = 12 + this.progress * 30
            this.x = this.radius * Math.sin(this.angle)
            this.z = this.radius * Math.cos(this.angle)
    
            this.instance.position.set(this.x, - 36, this.z)
            this.instance.lookAt(0, -36, 0)
        }
        else
        {
            this.x = 0
            this.z = 42
            this.instance.position.set(this.x, -36 - (temp-5) * 9,this.z)
            this.instance.rotation.set(0, 0, 0)            
        }
    }

    setCameraPosition()
    {
        const currentLocation = window.scrollY / this.sizes.height
        this.currentLocation = currentLocation

        if (currentLocation <= 4)
        {
            this.instance.position.set(0, - currentLocation * this.objectsDistance, 12)
        }
        else if (currentLocation <= 5)
        {
            this.progress = (currentLocation - 4)
            this.angle = this.progress * Math.PI * 2
            this.radius = 12 + this.progress * 30
            this.x = this.radius * Math.sin(this.angle)
            this.z = this.radius * Math.cos(this.angle)
    
            this.instance.position.set(this.x, - 36, this.z)
            this.instance.lookAt(0, -36, 0)
        }
        else
        {
            this.x = 0
            this.z = 42
            this.instance.position.set(this.x, -36 - (currentLocation-5) * 9,this.z)
            this.instance.rotation.set(0, 0, 0)            
        }
    }

    setInstance()
    {
        this.instance = new THREE.PerspectiveCamera(35, this.sizes.width / this.sizes.height, 0.1, 100)
        this.setCameraPosition()
        this.scene.add(this.instance)
    }

    setControls()
    {
        this.controls = new OrbitControls(this.instance, this.canvas)
        this.controls.enableDamping = true
    }

    resize()
    {
        this.instance.aspect = this.sizes.width / this.sizes.height;
        this.updateCameraSettings()
    }

    update()
    {
        // console.log(this.instance.rotation)
        // this.controls.update();
        if (this.animating) this.updateCameraPosition()
    }

    // 카메라 설정 함수
    updateCameraSettings()
    {
        // 세로가 긴 경우
        if(window.matchMedia("(max-width: 480px)").matches)
        {
            this.instance.fov = 55
        }
        else if(window.matchMedia("(max-width: 768px)").matches)
        {
            this.instance.fov = 45
        }
        // 가로가 긴 경우
        else if(window.matchMedia("(max-width: 900px)").matches)
        {
            this.instance.fov = 55
        }
        else if(window.matchMedia("(max-width: 1050px)").matches)
        {
            this.instance.fov = 50
        }
        else if(window.matchMedia("(max-width: 1150px)").matches)
        {
            this.instance.fov = 45
        }
        else if(window.matchMedia("(max-width: 1250px)").matches)
        {
            this.instance.fov = 40
        }
        else
        {
            this.instance.fov = 35 // 큰 화면에서 기본 시야
        }
        
        this.instance.updateProjectionMatrix()
      }
  
}