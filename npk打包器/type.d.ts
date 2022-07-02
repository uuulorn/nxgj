export type PackNPKOption = {
    inputPath: string,
    outputPath: string,
    pathInNPKRecord: Record<string, string | void>//图片文件夹名对应的npk内的img的路径
    colorSpaceType: 'argb8888' | 'argb4444' | 'argb1555'
    usePinJsonFile: boolean //是否使用pathInNpk.json文件,若是,则优先使用json文件的配置
}

export type NPKStuff = {
    pin: string,
    imgBuffer: Buffer
}

export type PicBuffer = Buffer