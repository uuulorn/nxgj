import canvas, { loadImage } from 'canvas'
import fs from 'fs'
import zlib from 'zlib'
import crypto from 'crypto'

async function main() {
    /*const typeMap = {
        neck: '1',
        coat: '2',
        pants: '3',
        belt: '4',
        shoes: '5',
        bracelet: '6',
        necklace: '7',
        ring: '8',
        support: '9',
        earrring: 'A',
        magicstone: 'B'
    } as const*/
    const typeMap = {
        neck: '肩',
        coat: '衫',
        pants: '裤',
        belt: '腰',
        shoes: '鞋',
        bracelet: '镯',
        necklace: '项',
        ring: '戒',
        support: '左',
        earrring: '耳',
        magicstone: '右'
    } as const
    const inputDir = '../output/a_改装备图标.NPK'
    const outputDir = './output'
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir)
    }
    for (const cdir of fs.readdirSync(inputDir, { withFileTypes: true })) {
        if (cdir.isDirectory()) {
            const outputPaths: [string, string] = [outputDir + '/' + cdir.name, '']
            for (const [k, v] of Object.entries(typeMap)) {
                if (new RegExp(`(?:^|_)${k}\.img`).test(cdir.name)) {
                    for (let pngPath of fs.readdirSync(inputDir + '/' + cdir.name).filter(x => /^\d+\.png$/i.test(x))) {
                        outputPaths[1] = pngPath
                        pngPath = inputDir + '/' + cdir.name + '/' + pngPath
                        const img = await canvas.loadImage(fs.readFileSync(pngPath))
                        await draw(img, v, outputPaths)
                    }
                    break
                }
            }
        }
    }
}

async function main2() {
    //await main()
    const outputPath = './outputImgs'
    const inputDir = './output'
    for (const cdir of fs.readdirSync(inputDir, { withFileTypes: true })) {
        if (cdir.isDirectory() && cdir.name.slice(-4) === '.img') {
            const buf = await toImg(`${inputDir}/${cdir.name}`)
            await fs.promises.writeFile(`${outputPath}/${cdir.name}`, buf)
        }
    }
}

async function main3() {
    await main2()
    await toNPK('./outputImgs')
}

//main()

async function draw(img: canvas.Image, text: string, outputPaths: [string, string]) {
    return new Promise((resolve) => {
        const cv0 = canvas.createCanvas(28, 28)
        const ctx0 = cv0.getContext('2d')
        ctx0.drawImage(img, 0, 0)
        let idata = ctx0.getImageData(0, 0, 28, 28)
        idata = modAlpha(idata)
        ctx0.putImageData(idata, 0, 0)
        ctx0.fillStyle = 'black'
        ctx0.font = 'bolder bolder 16px Arial,sans-serif'
        ctx0.fillText(text, 6, 21)

        const cv1 = canvas.createCanvas(28, 28)
        const ctx1 = cv1.getContext('2d')
        ctx1.fillStyle = '#fff'
        ctx1.fillRect(0, 0, 28, 28)

        const cv2 = canvas.createCanvas(28, 28)
        const ctx2 = cv2.getContext('2d')
        ctx2.drawImage(cv1, 0, 0)
        ctx2.drawImage(cv0, 0, 0)

        if (!fs.existsSync(outputPaths[0])) {
            fs.mkdirSync(outputPaths[0], { recursive: true })
        }
        const path = outputPaths.join('/')
        cv2.toBuffer((err, buf) => {
            if (err) {
                return console.log(err)
            }
            fs.promises.writeFile(path, buf).then(() => resolve(void 0))
        }, 'image/png')
    })

}

function modAlpha(idata: canvas.ImageData) {
    const arr = new Uint8ClampedArray(idata.data.length)
    for (let i = 0, l = idata.data.length; i < l; i += 4) {
        arr[i] = idata.data[i]
        arr[i + 1] = idata.data[i + 1]
        arr[i + 2] = idata.data[i + 2]
        arr[i + 3] = idata.data[i + 3] * 0.8
    }
    return canvas.createImageData(arr, idata.width, idata.height)
}

async function toImg(inputPath: string): Promise<Buffer> {
    const reg = /^\d+\.png$/i
    const fileList = fs.readdirSync(inputPath, { withFileTypes: true }).filter(x => x.isFile()).filter(x => reg.test(x.name))
    fileList.sort((a, b) => {
        const an = +a.name.slice(0, a.name.indexOf('.'))
        const bn = +b.name.slice(0, b.name.indexOf('.'))
        return an - bn
    })
    const imgBufs = [] as Buffer[]
    for (const file of fileList) {
        const cv = canvas.createCanvas(28, 28)
        const ctx = cv.getContext('2d')
        const p = inputPath + '/' + file.name
        const image = await canvas.loadImage(fs.readFileSync(p))
        ctx.drawImage(image, 0, 0, 28, 28)
        const tmpBuf = rbswap(ctx.getImageData(0, 0, 28, 28).data)
        imgBufs.push(zlib.deflateSync(tmpBuf))
    }
    console.log(inputPath, imgBufs[0].length)
    const size = 32 + imgBufs.map(x => x.length).reduce((acc, val) => acc + val, 0) + imgBufs.length * 36
    const buf = Buffer.alloc(size)
    let pos = 0
    buf.write('Neople Img File\0')
    pos += 16
    buf.writeIntLE(imgBufs.length * 36, pos, 4)
    pos += 4
    buf.writeIntLE(0, pos, 4)
    pos += 4
    buf.writeIntLE(2, pos, 4)
    pos += 4
    buf.writeIntLE(imgBufs.length, pos, 4)
    pos += 4
    for (let i = 0; i < imgBufs.length; i++) {
        buf.writeIntLE(0x10, pos, 4)
        pos += 4
        buf.writeIntLE(0x06, pos, 4)
        pos += 4
        buf.writeIntLE(28, pos, 4)
        pos += 4
        buf.writeIntLE(28, pos, 4)
        pos += 4
        buf.writeIntLE(imgBufs[i].length, pos, 4)
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

    for (let i = 0; i < imgBufs.length; i++) {
        const tmpBuf = imgBufs[i]
        tmpBuf.copy(buf, pos)
        pos += tmpBuf.length
    }
    return buf
}


async function toNPK(inputDirPath: string) {
    const outputParentPath = './outputNpks'
    if (!fs.existsSync(outputParentPath)) {
        fs.mkdirSync(outputParentPath, { recursive: true })
    }
    const fnrc: Record<string, string | void> = JSON.parse(fs.readFileSync(inputDirPath + '/filename.json') + '')
    const reg = /\.img$/i
    const filelist = fs.readdirSync(inputDirPath, { withFileTypes: true })
        .filter(x => x.isFile())
        .filter(x => reg.test(x.name))
    const imgBufs = filelist.map(x => fs.readFileSync(inputDirPath + '/' + x.name))
    const magicPassword = Buffer.from(`puchikon@neople dungeon and fighter DNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNFDNF\0`, 'ascii')
    const magicHead = Buffer.from(`NeoplePack_Bill\0`, 'ascii')
    const resultSize = 16 + 4 + 264 * imgBufs.length + 32 + imgBufs.reduce((acc, buf) => acc + buf.length, 0)
    const result = Buffer.alloc(resultSize)

    let pos = 0
    magicHead.copy(result, pos)
    pos += 16
    result.writeIntLE(imgBufs.length, pos, 4)
    pos += 4
    for (let i = 0, l = imgBufs.length, offset = 20 + 264 * l + 32; i < l; i++) {
        const fn = fnrc[filelist[i].name]
        if (!fn) {
            throw new Error(`没有找到${filelist[i].name}对应的文件名`)
        }
        const bfn = Buffer.from(fn, 'ascii')
        const ul = imgBufs[i].length

        result.writeIntLE(offset, pos, 4)
        pos += 4
        result.writeIntLE(ul, pos, 4)
        pos += 4
        bufferXor(bfn, magicPassword).copy(result, pos)
        pos += 256

        offset += ul
    }
    if (imgBufs.length > 0) {
        const hash = crypto.createHash('sha256').update(result.subarray(0, pos - pos % 17)).digest()
        hash.copy(result, pos)
        pos += 32
    }
    for (let i = 0; i < imgBufs.length; i++) {
        imgBufs[i].copy(result, pos)
        pos += imgBufs[i].length
    }
    await fs.promises.writeFile(`${outputParentPath}/${inputDirPath}.NPK`, result)
}

function bufferXor(a: Buffer, b: Buffer) {
    const r = Buffer.alloc(b.length)
    for (let i = 0; i < b.length; i++) {
        r[i] = (a[i] ?? 0) ^ b[i]
    }
    return r
}

function rbswap(data: Uint8ClampedArray): Uint8ClampedArray {
    const result = new Uint8ClampedArray(data.length)
    for (let i = 0; i < data.length; i += 4) {
        result[i] = data[i + 2]
        result[i + 1] = data[i + 1]
        result[i + 2] = data[i]
        result[i + 3] = data[i + 3]
    }
    return result
}
