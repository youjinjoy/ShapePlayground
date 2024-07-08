import * as THREE from 'three'
import Experience from '../Experience.js'
import Buttons from './Buttons.js'
import Light from './Light.js'

export default class GeometrySection
{
    constructor(section)
    {
        this.section = section

        this.currentGeometry = this.section.currentGeometry

        this.buttonGap = this.section.buttonGap
        this.buttonSize = this.section.buttonSize

        this.size = this.section.modelSize
        this.color = this.section.modelColor

        this.experience = new Experience()
        this.scene = this.experience.scene
        this.time = this.experience.time

        this.setMaterial()
        this.setMesh()

        this.setButtons()
        this.setLight()
    }

    setMaterial()
    {
        this.list = ['standard', 'metal', 'rubber']
        this.materials = {
            'standard' : new THREE.MeshStandardMaterial( {color: 'red'} ),
            'metal' : new THREE.MeshStandardMaterial( {color: 'red', metalness: 1, roughness: 0.3} ),
            'rubber' :  new THREE.MeshPhysicalMaterial({
                color: 'red',         // 기본 색상
                metalness: 0,            // 금속성
                roughness: 0.9,            // 거칠기
                clearcoat: 1,            // 클리어코트
                clearcoatRoughness: 0,   // 클리어코트 거칠기
                reflectivity: 1,         // 반사율
                envMapIntensity: 1       // 환경 맵 강도
              })
              
        }

        this.current = 0
        this.currentMaterial = this.materials[this.list[this.current]]
    }

    setMesh()
    {
        this.mesh = new THREE.Mesh(this.currentGeometry, this.currentMaterial)
        this.mesh.scale.set(0.5, 0.5, 0.5)
        this.mesh.position.set(-3.5, -9, 0)
        this.scene.add(this.mesh)
    }

    setButtons()
    {
        this.buttons = new Buttons(this.mesh.position, this.buttonSize, this.buttonGap)
        this.section.selectableObjects.push(this.buttons.leftButton)
        this.section.selectableObjects.push(this.buttons.rightButton)
    }

    setLight()
    {
        this.light = new Light(this.mesh)
        this.light.setDirectionalLight()
    }

    updateGeometry()
    {
        if (this.currentGeometry)
        {
            this.currentGeometry.dispose()
            this.scene.remove(this.mesh)
        }
        this.currentGeometry = this.section.currentGeometry
        this.setMesh()
    }

    updateMaterial()
    {
        if (this.currentMaterial)
        {
            this.currentMaterial.dispose()
            this.scene.remove(this.mesh)
        }
        
        this.currentMaterial = this.materials[this.list[this.current]]
        this.section.currentMaterial = this.currentMaterial
        
        this.setMesh()
    }
    
    update()
    {
        this.elapsed = this.time.elapsed

        this.mesh.rotation.set(this.elapsed * 0.0001, this.elapsed * 0.00012, 0)

        if(this.buttons)
        {
            this.buttons.update()
        }
    }
}