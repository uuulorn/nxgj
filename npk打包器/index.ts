import fs from 'fs'
import { resolve as pRes, dirname } from 'path'
import { pnOpt } from './info'
import { NPKStuff, PicBuffer } from './type'
import { createHash } from 'crypto'
import canvas from 'canvas'
import { deflateSync } from 'zlib'

//|BBBBBBBB|GGGGGGGG|RRRRRRRR|AAAAAAAA|
function rgbaToArgb8888LE(data: Uint8ClampedArray): Uint8ClampedArray {
    const res = new Uint8ClampedArray(data)
    for (let i = 0; i < data.length; i += 4) {
        res[i] = data[i + 2]
        res[i + 1] = data[i + 1]
        res[i + 2] = data[i]
        res[i + 3] = data[i + 3]
    }
    return res
}

//|GGGBBBBB|ARRRRRGG|
function rgbaToArgb1555LE(data: Uint8ClampedArray): Uint8ClampedArray {
    const res = new Uint8ClampedArray(data.length / 2)
    for (let i = 0; i < data.length; i += 4) {
        const $r = data[i] >> 3
        const $g = data[i + 1] >> 3
        const $b = data[i + 2] >> 3
        const $a = data[i + 3] >> 7
        const j = i >> 1
        res[j] = (($g << 5) & 255) | $b
        res[j + 1] = (($a << 7) & 255) | (($r << 2) & 255) | ($g >> 3)
    }
    return res
}
//|GGGGBBBB|AAAARRRR|
function rgbaToArgb4444LE(data: Uint8ClampedArray): Uint8ClampedArray {
    const res = new Uint8ClampedArray(data.length / 2)
    for (let i = 0; i < data.length; i += 4) {
        const $r = data[i] >> 4
        const $g = data[i + 1] >> 4
        const $b = data[i + 2] >> 4
        const $a = data[i + 3] >> 4
        const j = i >> 1
        res[j] = (($g << 4) & 255) | $b
        res[j + 1] = (($a << 4) & 255) | $r
    }
    return res
}

async function toImg(pin: string, stuffs: PicBuffer[]): Promise<NPKStuff> {
    const cv = canvas.createCanvas(28, 28)
    const ctx = cv.getContext('2d')
    const { colorSpaceType: picType } = pnOpt
    stuffs = await Promise.all(
        stuffs.map(async stuff => {
            ctx.clearRect(0, 0, 28, 28)
            ctx.drawImage(await canvas.loadImage(stuff), 0, 0, 28, 28)
            return deflateSync(
                (function () {
                    switch (picType) {
                        case 'argb8888': return rgbaToArgb8888LE(ctx.getImageData(0, 0, 28, 28).data)
                        case 'argb4444': return rgbaToArgb4444LE(ctx.getImageData(0, 0, 28, 28).data)
                        case 'argb1555': return rgbaToArgb1555LE(ctx.getImageData(0, 0, 28, 28).data)
                    }
                })()
            )
        })
    )

    const buf = Buffer.alloc(32 + stuffs.map(x => x.length).reduce((acc, val) => acc + val, 0) + stuffs.length * 36)
    let pos = 0
    buf.write('Neople Img File\0')
    pos += 16
    buf.writeIntLE(stuffs.length * 36, pos, 4)
    pos += 4
    buf.writeIntLE(0, pos, 4)
    pos += 4
    buf.writeIntLE(2, pos, 4)
    pos += 4
    buf.writeIntLE(stuffs.length, pos, 4)
    pos += 4

    const pt = (function () {
        switch (pnOpt.colorSpaceType) {
            case 'argb1555': return 0x0e
            case 'argb4444': return 0x0f
            case 'argb8888': return 0x10
        }
    })()
    for (const stuff of stuffs) {
        buf.writeIntLE(pt, pos, 4)
        pos += 4
        buf.writeIntLE(0x06, pos, 4)
        pos += 4
        buf.writeIntLE(28, pos, 4)
        pos += 4
        buf.writeIntLE(28, pos, 4)
        pos += 4
        buf.writeIntLE(stuff.length, pos, 4)
        pos += 4
        buf.writeIntLE(0, pos, 4)
        pos += 4
        buf.writeIntLE(0, pos, 4)
        pos += 4
        buf.writeIntLE(28, pos, 4)
        pos += 4
        buf.writeIntLE(28, pos, 4)
        pos += 4
    }
    for (const stuff of stuffs) {
        stuff.copy(buf, pos)
        pos += stuff.length
    }
    return {
        pin: pin,
        imgBuffer: buf
    }
}

async function toNPK(stuffs: NPKStuff[]): Promise<Buffer> {
    const magicPassword = Buffer.from(`puchikon@neople dungeon and fighter DNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNF\0`, 'ascii')
    const magicHead = Buffer.from(`NeoplePack_Bill\0`, 'ascii')
    const buf = Buffer.alloc(
        16 + 4 + 264 * stuffs.length + 32 + stuffs.reduce((acc, stuff) => acc + stuff.imgBuffer.length, 0)
    )
    let pos = 0
    magicHead.copy(buf, pos)
    pos += 16
    buf.writeIntLE(stuffs.length, pos, 4)
    pos += 4

    let offset = 20 + 264 * stuffs.length + 32
    for (const stuff of stuffs) {
        buf.writeIntLE(offset, pos, 4)
        pos += 4
        buf.writeIntLE(stuff.imgBuffer.length, pos, 4)
        pos += 4
        bufferXor(Buffer.from(stuff.pin, 'ascii'), magicPassword).copy(buf, pos)
        pos += 256
        offset += stuff.imgBuffer.length
    }
    if (stuffs.length > 0) {
        const hash = createHash('sha256').update(buf.subarray(0, pos - pos % 17)).digest()
        hash.copy(buf, pos)
        pos += 32
    }
    for (const stuff of stuffs) {
        stuff.imgBuffer.copy(buf, pos)
        pos += stuff.imgBuffer.length
    }
    return buf
}

function bufferXor(a: Buffer, b: Buffer) {
    const r = Buffer.alloc(b.length)
    for (let i = 0; i < b.length; i++) {
        r[i] = (a[i] ?? 0) ^ b[i]
    }
    return r
}

export async function run() {
    if (pnOpt.outputPath.slice(-4) !== '.NPK') {
        console.log(`提示:输出文件名[${pnOpt.outputPath}]没有以.NPK结尾`)
    }
    const r0 = /\.img$/i
    const r1 = /^\d+\.png$/i
    const picDirs = fs.readdirSync(pRes(__dirname, pnOpt.inputPath), { withFileTypes: true }).filter(x => x.isDirectory() && r0.test(x.name))
    const stuffs: NPKStuff[] = []
    for (const picDir of picDirs) {
        const pin = pnOpt.pathInNPKRecord[picDir.name]
        if (!pin) {
            throw new Error(`没有找到${picDir.name}对应的npk内的img路径,请修改配置文件!`)
        }
        const pics = fs.readdirSync(pRes(__dirname, pnOpt.inputPath, picDir.name), { withFileTypes: true }).filter(x => x.isFile() && r1.test(x.name)).sort((a, b) => {
            const an = +a.name.slice(0, a.name.indexOf('.'))
            const bn = +b.name.slice(0, b.name.indexOf('.'))
            return an - bn
        })
        stuffs.push(await toImg(
            pin,
            await Promise.all(pics.map(
                pic => fs.promises.readFile(pRes(
                    __dirname,
                    pnOpt.inputPath,
                    picDir.name,
                    pic.name
                ))
            ))
        ))
    }
    const tPath = pRes(__dirname, pnOpt.outputPath)
    const prPath = dirname(tPath)
    if (!fs.existsSync(prPath)) {
        fs.mkdirSync(prPath, { recursive: true })
    }
    await fs.promises.writeFile(tPath, await toNPK(stuffs))
}