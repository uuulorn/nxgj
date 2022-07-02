export type ExactNPKOption = {
    inputPath: string,
    outputPath: string
}

export type ImgOutputInfo = {
    pathInNpk: string,
    buffer: Buffer
}

export type ImgInnerInfo = {
    offset: number,
    size: number,
    pathInNpk: string,
}

export type PicInnerInfo = {
    index: number,
    buffer: Buffer,
    width: number,
    height: number,
    colorSystem: number,
    compression: number,
    baseX: number
    baseY: number,
    size: number
    type: 1
} | { index: number, linkTo: number, type: 2 }

export type pathInNPKList = Record<string, string | void>