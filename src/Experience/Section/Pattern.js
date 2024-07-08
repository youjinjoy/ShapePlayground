import * as THREE from 'three'

export default class Pattern
{
    constructor()
    {
        this.canvas = document.createElement('canvas')
        this.canvas.width = 64
        this.canvas.height = 64

        this.context = this.canvas.getContext('2d')
    }

    createStripe() {
    
        // 흰색 배경
        this.context.fillStyle = '#ffffff'
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height)
    
        // 검은색 줄무늬
        this.context.fillStyle = '#000000'
        for (let i = 0; i < this.canvas.width; i += 8)
        {
            this.context.fillRect(i, 0, 5, this.canvas.height)
        }
    
        return new THREE.CanvasTexture(this.canvas)
    }
}