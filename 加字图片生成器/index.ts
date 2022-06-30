import fs from 'fs'
import canvas from 'canvas'
import { resolve as pRes } from 'path'
import { option as OPT } from './info'

async function drawTag(cv: canvas.Canvas, text: string, color: string, fillRectColor?: string): Promise<canvas.Canvas> {
    if (text.length !== 4) {
        throw new Error(`文本长度应该为4.错误文本:#${text}#`)
    }
    const ctx = cv.getContext('2d')
    ctx.save()
    if (fillRectColor) {
        ctx.clearRect(0, 0, 28, 28)
        ctx.fillStyle = fillRectColor
        ctx.fillRect(0, 0, 28, 28)
    }
    ctx.fillStyle = color
    ctx.font = `bolder bolder 12px Arial,sans-serif`
    ctx.fillText(text.slice(0, 2), 2, 12)
    ctx.fillText(text.slice(2), 2, 24)
    ctx.restore()
    return cv
}

async function drawPlacement(cv0: canvas.Canvas, text: string, color: string): Promise<canvas.Canvas> {
    if (text.length !== 1) {
        throw new Error(`文本长度应该为1.错误文本:#${text}#`)
    }
    const cv1 = canvas.createCanvas(28, 28)
    const ctx1 = cv1.getContext('2d')
    ctx1.save()
    ctx1.clearRect(0, 0, 28, 28)
    ctx1.fillStyle = '#fff'
    ctx1.fillRect(0, 0, 28, 28)
    ctx1.drawImage(cv0, 0, 0)
    ctx1.fillStyle = color
    ctx1.font = 'bolder bolder 16px Arial,sans-serif'
    ctx1.fillText(text, 6, 21)
    ctx1.restore()
    return cv1
}

async function canvasToBuffer(cv: canvas.Canvas): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        cv.toBuffer((err, buf) => {
            if (err) {
                reject(err)
            } else {
                resolve(buf)
            }
        }, 'image/png')
    })
}

async function getImage(p: string): Promise<canvas.Image> {
    p = pRes(__dirname, p)
    if (fs.existsSync(p)) {
        return await canvas.loadImage(fs.readFileSync(p))
    } else {
        return await canvas.loadImage(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAIAAAD9b0jDAAAAJ0lEQVRIie3MMQEAAAgDILV/51nCwwMC0Enq2pyPUqlUKpVKpS/TBdFiAzX2qiqMAAAAAElFTkSuQmCC`)
    }
}

export async function run() {
    if (
        pRes(__dirname, OPT.inputPath).includes(pRes(__dirname, OPT.outputPath)) ||
        pRes(__dirname, OPT.outputPath).includes(pRes(__dirname, OPT.inputPath))
    ) {
        throw new Error(`输(出)入目录不能是输(入)出目录的子目录!`)
    }
    const r0 = /\.img$/i
    const r1 = /^\d+\.png$/i
    const imgDirs = fs.readdirSync(pRes(__dirname, OPT.inputPath), { withFileTypes: true })
        .filter(x => x.isDirectory() && r0.test(x.name))
    if (!imgDirs.length) {
        throw new Error(`没有找到名字以.img结尾的文件夹!`)
    }
    for (const cdir of imgDirs) {
        const u = OPT.tag[cdir.name]
        const v = OPT.placement?.[cdir.name]
        if (u) {
            for (const img of fs.readdirSync(
                pRes(__dirname, OPT.inputPath, cdir.name), { withFileTypes: true }
            )
                .filter(x => x.isFile() && r1.test(x.name))
            ) {
                const key = img.name.slice(0, img.name.indexOf('.'))
                const imgInfo = u[key]
                if (imgInfo) {
                    const tcv = canvas.createCanvas(28, 28)
                    tcv.getContext('2d').drawImage(
                        await getImage(pRes(__dirname, OPT.inputPath, cdir.name, img.name)),
                        0,
                        0
                    )
                    let cv = await drawTag(tcv, imgInfo.text, imgInfo.color, OPT.fillRectColor)
                    if (v) {
                        cv = await drawPlacement(cv, v.text, v.color)
                    }
                    const buf = await canvasToBuffer(cv)
                    const od = pRes(__dirname, OPT.outputPath, cdir.name)
                    if (!fs.existsSync(od)) {
                        fs.mkdirSync(od, { recursive: true })
                    }
                    await fs.promises.writeFile(pRes(__dirname, od, img.name), buf)
                }
            }
        }
    }
}