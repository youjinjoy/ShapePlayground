import * as THREE from 'three'

export default class Pattern
{
    constructor()
    {
        this.canvas = document.createElement('canvas')
        this.canvas.resolution = 512
        this.canvas.width = this.canvas.resolution
        this.canvas.height = this.canvas.resolution

        this.context = this.canvas.getContext('2d')
    }

    createHeightStripe() {
    
        // 흰색 배경
        this.context.fillStyle = '#ffffff'
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height)
    
        // 검은색 줄무늬
        this.context.fillStyle = '#000000'
        for (let i = 0; i < this.canvas.width; i += this.canvas.resolution / 8)
        {
            this.context.fillRect(i, 0, this.canvas.resolution / 16, this.canvas.height)
        }
    
        return new THREE.CanvasTexture(this.canvas)
    }

    createWidthStripe()
    {

        // 흰색 배경
        this.context.fillStyle = '#ffffff'
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height)
    
        // 검은색 줄무늬
        this.context.fillStyle = '#000000'
        for (let i = 0; i < this.canvas.height; i += this.canvas.resolution / 8)
        {
            this.context.fillRect(0, i, this.canvas.width, this.canvas.resolution / 16)
        }
    
        return new THREE.CanvasTexture(this.canvas)
    }

    createDiagonalGrid()
    {
        // 캔버스 초기화
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
    
        // 흰색 배경
        this.context.fillStyle = '#ffffff'
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height)
    
        // 검은색 사선 격자
        this.context.strokeStyle = '#000000'
        this.context.lineWidth = this.canvas.resolution / 32
        for (let i = -this.canvas.width; i < this.canvas.width; i += this.canvas.resolution / 8)
        {
            this.context.beginPath()
            this.context.moveTo(i, 0)
            this.context.lineTo(i + this.canvas.width, this.canvas.height)
            this.context.stroke()
    
            this.context.beginPath()
            this.context.moveTo(i, this.canvas.height)
            this.context.lineTo(i + this.canvas.width, 0)
            this.context.stroke()
        }
    
        return new THREE.CanvasTexture(this.canvas)
    }
}