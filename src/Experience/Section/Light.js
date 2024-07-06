import * as THREE from 'three'
import Experience from '../Experience'

export default class Light
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
    }

    setAmbientLight()
    {
        this.ambientLight = new THREE.AmbientLight('#ffffff')
        this.ambientLight.position.set(0,0,0)
        this.scene.add(this.ambientLight)
    }
    
    setDirectionalLight()
    {       
        this.directionalLight = new THREE.DirectionalLight('#ffffff',3)
        this.directionalLight.position.set(0, 0, 3)
        this.scene.add(this.directionalLight)
    }
}