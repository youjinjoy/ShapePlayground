import * as THREE from 'three'
import Experience from '../Experience'

export default class Responsive
{
    constructor()
    {
        this.experience = new Experience()
        this.sizes = this.experience.sizes
        this.camera = this.experience.camera
        this.section = this.experience.section

        this.cameraInstance = null
        this.worldInstance = null
        this.sectionInstance = null

        this.gapForMobile = -1

        // this.sizes.on('resize', () => {
        //     this.updateCamera(this.cameraInstance)
        //     this.updateWorld(this.worldInstance)
        //     this.updateSection(this.sectionInstance)
        // })
    }

    // 카메라 설정 함수
    updateCamera(instance)
    {
        if (instance == null) return

        this.cameraInstance = instance
        // 세로가 긴 경우
        if(window.matchMedia("(max-width: 480px)").matches)
        {
            instance.fov = 55
        }
        else if(window.matchMedia("(max-width: 768px)").matches)
        {
            instance.fov = 45
        }
        // 가로가 긴 경우
        else if(window.matchMedia("(max-width: 900px)").matches)
        {
            instance.fov = 55
        }
        else if(window.matchMedia("(max-width: 1050px)").matches)
        {
            instance.fov = 50
        }
        else if(window.matchMedia("(max-width: 1150px)").matches)
        {
            instance.fov = 45
        }
        else if(window.matchMedia("(max-width: 1250px)").matches)
        {
            instance.fov = 40
        }
        else
        {
            instance.fov = 35 // 큰 화면에서 기본 시야
        }
        
        instance.updateProjectionMatrix()
    }

    // World 관련 함수
    updateWorld(instance)
    {
        if (instance == null) return

        this.worldInstance = instance

        if(window.matchMedia("(max-width: 768px)").matches)
        {
            instance.floorBody.position.y = instance.floorPosition - 2
            instance.floorMesh.position.y = instance.floorPosition - 3
            instance.floorDirectionalLight.position.y = instance.floorLightPosition - 2
        }
        else
        {
            instance.floorBody.position.y = instance.floorPosition 
            instance.floorMesh.position.y = instance.floorPosition - 1
            instance.floorDirectionalLight.position.y = instance.floorLightPosition
        }
    }

    // Section 관련 함수
    updateSection(instance)
    {
        if (instance == null) return

        this.sectionInstance = instance
        
        if(window.matchMedia("(max-width: 768px)").matches)
        {
            instance.geometrySection.mesh.position.set(0, 0 + this.gapForMobile, 0)
            instance.geometrySection.buttons.updatePosition(new THREE.Vector3(0, 0 + this.gapForMobile, 0))
            instance.geometrySection.buttons.setPosition()

            instance.materialSection.mesh.position.set(0, - instance.objectDistance + this.gapForMobile, 0)
            instance.materialSection.buttons.updatePosition(new THREE.Vector3(0, - instance.objectDistance + this.gapForMobile, 0))
            instance.materialSection.buttons.setPosition()

            instance.colorSection.mesh.position.set(0, - instance.objectDistance * 2 + this.gapForMobile, 0)
            instance.colorSection.buttons.updatePosition(new THREE.Vector3(0, - instance.objectDistance * 2 + this.gapForMobile, 0))
            instance.colorSection.buttons.setPosition()

            instance.patternSection.mesh.position.set(0, - instance.objectDistance * 3 + this.gapForMobile, 0)
            instance.patternSection.buttons.updatePosition(new THREE.Vector3(0, - instance.objectDistance * 3 + this.gapForMobile, 0))
            instance.patternSection.buttons.setPosition()
        }
        else
        {
            instance.geometrySection.mesh.position.set(3.5, 0, 0)
            instance.geometrySection.buttons.updatePosition(new THREE.Vector3(3.5, 0, 0))
            instance.geometrySection.buttons.setPosition()

            instance.materialSection.mesh.position.set(-3.5, - instance.objectDistance, 0)
            instance.materialSection.buttons.updatePosition(new THREE.Vector3(-3.5, - instance.objectDistance, 0))
            instance.materialSection.buttons.setPosition()

            instance.colorSection.mesh.position.set(3.5, - instance.objectDistance * 2, 0)
            instance.colorSection.buttons.updatePosition(new THREE.Vector3(3.5, - instance.objectDistance * 2, 0))
            instance.colorSection.buttons.setPosition()

            instance.patternSection.mesh.position.set(-3.5, - instance.objectDistance * 3, 0)
            instance.patternSection.buttons.updatePosition(new THREE.Vector3(-3.5, - instance.objectDistance * 3, 0))
            instance.patternSection.buttons.setPosition()
        }
    }
}