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

    setAmbientLight()
    {
        this.ambientLight = new THREE.AmbientLight('#ffffff')
        this.ambientLight.position.set(0,0,0)
        this.scene.add(this.ambientLight)
    }
    
    setDirectionalLight()
    {       
        this.directionalLight = new THREE.DirectionalLight('#ffffff', 4)
        this.directionalLight.target = this.target
        this.directionalLight.position.set(this.target.position.x, this.target.position.y, this.target.position.z + 3)
        this.scene.add(this.directionalLight)
    }
}