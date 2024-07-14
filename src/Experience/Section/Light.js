import * as THREE from 'three'
import Experience from '../Experience'

export default class Light
{
    constructor(target)
    {
        this.experience = new Experience()
        this.scene = this.experience.scene

        this.target = target

    }
    
    setDirectionalLight()
    {       
        this.directionalLight = new THREE.DirectionalLight('#ffffff', 16)
        // this.directionalLight.target = this.target
        this.directionalLight.position.set(this.target.position.x + 1, this.target.position.y, this.target.position.z + 3)
        this.scene.add(this.directionalLight)
        
        
        this.pointLight = new THREE.PointLight('#ffffff', 20)
        this.pointLight.position.set(this.target.position.x - 1, this.target.position.y, this.target.position.z + 3)
        this.scene.add(this.pointLight)
    }
}