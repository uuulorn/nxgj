import fs from 'fs'
import canvas from 'canvas'
import { resolve as pRes } from 'path'
import { giOpt } from './info'

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
    //加粗，要错位fillText两次
    ctx.fillText(text.slice(0, 2), 2 - 0.5, 12)
    ctx.fillText(text.slice(0, 2), 2, 12 - 0.5)
    ctx.fillText(text.slice(2), 2 - 0.5, 24)
    ctx.fillText(text.slice(2), 2, 24 - 0.5)
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
    ctx1.fillStyle = '#000'
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
        pRes(__dirname, giOpt.inputPath).includes(pRes(__dirname, giOpt.outputPath)) ||
        pRes(__dirname, giOpt.outputPath).includes(pRes(__dirname, giOpt.inputPath))
    ) {
        throw new Error(`输(出)入目录不能是输(入)出目录的子目录!`)
    }
    const flag0 = giOpt.placementMark
    const flag1 = giOpt.placementMarkOther
    const r0 = /\.img$/i
    const r1 = /^\d+\.png$/i
    const imgDirs = fs.readdirSync(pRes(__dirname, giOpt.inputPath), { withFileTypes: true })
        .filter(x => x.isDirectory() && r0.test(x.name))
    if (!imgDirs.length) {
        throw new Error(`没有找到名字以.img结尾的文件夹!`)
    }
    for (const cdir of imgDirs) {
        const u = giOpt.tag[cdir.name]
        const v = giOpt.placement[cdir.name]
        if (u) {
            for (const img of fs.readdirSync(
                pRes(__dirname, giOpt.inputPath, cdir.name), { withFileTypes: true }
            )
                .filter(x => x.isFile() && r1.test(x.name))
            ) {
                const index = img.name.slice(0, img.name.indexOf('.'))
                const imgInfo = u[index]
                let cv = canvas.createCanvas(28, 28)
                const eim = await getImage(pRes(__dirname, giOpt.inputPath, cdir.name, img.name))
                cv.getContext('2d').drawImage(eim, 0, 0)
                if (imgInfo) {
                    cv = await drawTag(cv, imgInfo.text, imgInfo.color, giOpt.tagFillRectColor)
                }
                if (v) {
                    if (imgInfo) {
                        if (flag0) {
                            cv = await drawPlacement(cv, v.text, v.color)
                        }
                    } else {
                        if (flag1) {
                            alphaMultiply(cv, 0.8)
                            cv = await drawPlacement(cv, v.text, v.color)
                        }
                    }
                }
                const buf = await canvasToBuffer(cv)
                const od = pRes(__dirname, giOpt.outputPath, cdir.name)
                if (!fs.existsSync(od)) {
                    fs.mkdirSync(od, { recursive: true })
                }
                await fs.promises.writeFile(pRes(__dirname, od, img.name), buf)
            }
        }
    }
}

function alphaMultiply(cv: canvas.Canvas, n: number): void {
    const dt = cv.getContext('2d').getImageData(0, 0, 28, 28).data
    for (let i = 3; i < dt.length; i += 4) {
        dt[i] *= n
    }
    cv.getContext('2d').putImageData(canvas.createImageData(dt, 28, 28), 0, 0)
}
