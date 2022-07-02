import fs from 'fs'
import canvas from 'canvas'
import { resolve as pRes, basename as pBase, extname as pExt } from 'path'
import { inflateSync } from 'zlib'
import { ImgInnerInfo, ImgOutputInfo, pathInNPKRecord, PicInnerInfo } from './type'
import { createHash } from 'crypto'

function getImgInfos(npkBuffer: Buffer): ImgOutputInfo[] {
    const MAGIC_HEAD = Buffer.from(`NeoplePack_Bill\0`, 'ascii')
    if (!npkBuffer.subarray(0, 16).equals(MAGIC_HEAD)) {
        throw new Error(`这个不是NPK文件!`)
    }
    const imgsCount = npkBuffer.readUInt32LE(16)
    if (imgsCount > 0) {
        const l = 20 + imgsCount * 264
        const hash0 = npkBuffer.subarray(l, l + 32)
        const hash1 = createHash('sha256').update(npkBuffer.subarray(0, l - l % 17)).digest()
        console.log(`哈希校检结果:${hash0.equals(hash1)}`)
    }
    let pos = 20
    const result: ImgOutputInfo[] = []
    for (let i = 0; i < imgsCount; i++) {
        const { offset, size, pathInNpk } = parseImgIIF(npkBuffer.subarray(pos, pos + 264))
        result.push({
            pathInNpk: pathInNpk.replace(/\0+$/, ''),
            buffer: npkBuffer.subarray(offset, offset + size)
        })
        pos += 264
    }
    return result
}

function parseImgIIF(imgIndex: Buffer): ImgInnerInfo {
    const MAGIC_PASSWORD = Buffer.from(`puchikon@neople dungeon and fighter DNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNF\0`, 'ascii')
    if (imgIndex.length !== 264) {
        throw new Error(`IMG索引块大小必须是264字节!`)
    }
    return {
        offset: imgIndex.readUInt32LE(0),
        size: imgIndex.readUInt32LE(4),
        pathInNpk: bufferXor(imgIndex.subarray(8), MAGIC_PASSWORD).toString('ascii')
    }
}

function genPinRecord(infos: ImgOutputInfo[]): pathInNPKRecord {
    const result: pathInNPKRecord = Object.create(null)
    for (const info of infos) {
        const pinBase = pBase(info.pathInNpk)
        const ext = pExt(info.pathInNpk)
        const pinBaseWithoutExt = pinBase.slice(0, pinBase.lastIndexOf(ext))
        if (!(pinBase in result)) {
            result[pinBase] = info.pathInNpk
        } else {
            let newBase = pinBase
            let c = 1
            while (newBase in result) {
                newBase = `${pinBaseWithoutExt}_${c++}${ext}`
            }
            result[newBase] = info.pathInNpk
        }
    }
    return result
}

function getPicIIFs(imgBuffer: Buffer): PicInnerInfo[] {
    const MAGIC_HEAD = Buffer.from(`Neople Img File\0`, 'ascii')
    if (!imgBuffer.subarray(0, 16).equals(MAGIC_HEAD)) {
        throw new Error(`这个不是IMG文件!`)
    }
    const indexesFilesize = imgBuffer.readUInt32LE(16)
    const version = imgBuffer.readUInt32LE(24)
    const indexesCount = imgBuffer.readUInt32LE(28)
    const result: PicInnerInfo[] = []
    let pos = 32
    let offset = indexesFilesize + pos
    switch (version) {
        case 2: {
            for (let i = 0; i < indexesCount; i++) {
                const colorSystem = imgBuffer.readUInt32LE(pos)
                pos += 4
                if (colorSystem === 0x11) {
                    result.push({ index: i, type: 2, linkTo: imgBuffer.readUInt32LE(pos) })
                    pos += 4
                } else {
                    const compression = imgBuffer.readUInt32LE(pos)
                    pos += 4
                    const width = imgBuffer.readUInt32LE(pos)
                    pos += 4
                    const height = imgBuffer.readUInt32LE(pos)
                    pos += 4
                    const size = imgBuffer.readUInt32LE(pos)
                    pos += 4
                    const baseX = imgBuffer.readUInt32LE(pos)
                    pos += 4
                    const baseY = imgBuffer.readUInt32LE(pos)
                    pos += 4
                    pos += 8
                    result.push({
                        index: i,
                        colorSystem,
                        compression,
                        width,
                        height,
                        size,
                        baseX,
                        baseY,
                        buffer: imgBuffer.subarray(offset, offset + size),
                        type: 1
                    })
                    offset += size
                }
            }
        }
            break
        default: throw new Error(`暂时只支持IMGV2的解包`)
    }
    return result
}

async function genPngFromPicIIF(info: PicInnerInfo): Promise<Buffer | null> {
    if (info.type === 2) {
        return null
    }
    let buf = Buffer.from(info.buffer)
    if (info.compression === 0x06) {
        buf = inflateSync(buf)
    }
    buf = toRGBA(buf, info.colorSystem)
    return new Promise((resolve, reject) => {
        const cv = canvas.createCanvas(info.width, info.height)
        const ctx = cv.getContext('2d')
        ctx.putImageData(
            canvas.createImageData(new Uint8ClampedArray(buf), info.width, info.height),
            0,
            0
        )
        cv.toBuffer((err, buf) => {
            if (err) {
                reject(err)
            } else {
                resolve(buf)
            }
        }, 'image/png')
    })
}

function toRGBA(buf: Buffer, colorSystem: number): Buffer {
    switch (colorSystem) {
        //argb8888le
        case 0x10: {
            const res = Buffer.alloc(buf.length)
            for (let i = 0; i < buf.length; i += 4) {
                res[i] = buf[i + 2]
                res[i + 1] = buf[i + 1]
                res[i + 2] = buf[i]
                res[i + 3] = buf[i + 3]
            }
            return res
        }
            break
        //argb4444le
        case 0x0f: {
            const res = Buffer.alloc(buf.length * 2)
            let j = 0
            for (let i = 0; i < buf.length; i += 2) {
                const $0 = buf[i]
                const $1 = buf[i + 1]
                const g = ($0 & 0xf0) / 0xf0 * 0xff
                const b = ($0 & 0x0f) / 0x0f * 0xff
                const a = ($1 & 0xf0) / 0xf0 * 0xff
                const r = ($1 & 0x0f) / 0x0f * 0xff
                res[j++] = r
                res[j++] = g
                res[j++] = b
                res[j++] = a
            }
            return res
        }
            break
        //argb1555le
        case 0x0e: {
            const res = Buffer.alloc(buf.length * 2)
            let j = 0
            for (let i = 0; i < buf.length; i += 2) {
                const $0 = buf[i]
                const $1 = buf[i + 1]
                const g = (($1 & 0x03) << 3) | (($0 & 0xe0) >> 5)// / 0x1f * 0xff
                const b = ($0 & 0x1f)// / 0x1f * 0xff
                const a = ($1 & 0x80) / 0x80 * 0xff
                const r = ($1 & 0x7c)// / 0x7c * 0xff
                res[j++] = r
                res[j++] = g
                res[j++] = b
                res[j++] = a
            }
            return res

        }
            break
        default:
            throw new Error(`错误的颜色系统标志:${colorSystem}`)
    }
}

function bufferXor(a: Buffer, b: Buffer) {
    const r = Buffer.alloc(b.length)
    for (let i = 0; i < b.length; i++) {
        r[i] = (a[i] ?? 0) ^ b[i]
    }
    return r
}

async function run() {
    const imgInfos = getImgInfos(fs.readFileSync(pRes(__dirname, 'input/sprite_item_new_equipment_04_larmor_coat.NPK')))
    for (const imgInfo of imgInfos) {
        const piciifs = getPicIIFs(imgInfo.buffer)
        console.log(piciifs)
        for (const piciif of piciifs) {
            const pngBuf = await genPngFromPicIIF(piciif)
            if (pngBuf) {
                await fs.promises.writeFile(pRes(__dirname, 'test', piciif.index + '.png'), pngBuf)
            }
        }
    }
}

function test() {
    run()
}

test()