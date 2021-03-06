import { readFileSync } from 'fs';
import { resolve } from 'path';
import { PackNPKOption } from './type';

export const pnOpts: PackNPKOption[] = JSON.parse(readFileSync(resolve(__dirname, 'info.json')).toString())

/*
export const pnOpt_sample: PackNPKOption[] = [//样本
    {
        inputPath: './input',//输入目录,其子目录应为包含^\d+\.png$文件名的png图片的,以.img结尾的目录
        outputPath: './output/test.NPK',//npk文件输出路径
        pathInNPKRecord: {
            'test.img': 'test.img',
            'cloth_belt.img': 'sprite/item/new_equipment/02_cloth/belt/cloth_belt.img',
            'cloth_coat.img': 'sprite/item/new_equipment/02_cloth/coat/cloth_coat.img',
            'cloth_neck.img': 'sprite/item/new_equipment/02_cloth/neck/cloth_neck.img',
            'cloth_pants.img': 'sprite/item/new_equipment/02_cloth/pants/cloth_pants.img',
            'cloth_shoes.img': 'sprite/item/new_equipment/02_cloth/shoes/cloth_shoes.img',
            'harmor_belt.img': 'sprite/item/new_equipment/05_harmor/belt/harmor_belt.img',
            'harmor_coat.img': 'sprite/item/new_equipment/05_harmor/coat/harmor_coat.img',
            'harmor_neck.img': 'sprite/item/new_equipment/05_harmor/neck/harmor_neck.img',
            'harmor_pants.img': 'sprite/item/new_equipment/05_harmor/pants/harmor_pants.img',
            'harmor_shoes.img': 'sprite/item/new_equipment/05_harmor/shoes/harmor_shoes.img',
            'larmor_belt.img': 'sprite/item/new_equipment/04_larmor/belt/larmor_belt.img',
            'larmor_coat.img': 'sprite/item/new_equipment/04_larmor/coat/larmor_coat.img',
            'larmor_neck.img': 'sprite/item/new_equipment/04_larmor/neck/larmor_neck.img',
            'larmor_pants.img': 'sprite/item/new_equipment/04_larmor/pants/larmor_pants.img',
            'larmor_shoes.img': 'sprite/item/new_equipment/04_larmor/shoes/larmor_shoes.img',
            'leather_belt.img': 'sprite/item/new_equipment/03_leather/belt/leather_belt.img',
            'leather_coat.img': 'sprite/item/new_equipment/03_leather/coat/leather_coat.img',
            'leather_neck.img': 'sprite/item/new_equipment/03_leather/neck/leather_neck.img',
            'leather_pants.img': 'sprite/item/new_equipment/03_leather/pants/leather_pants.img',
            'leather_shoes.img': 'sprite/item/new_equipment/03_leather/shoes/leather_shoes.img',
            'plate_belt.img': 'sprite/item/new_equipment/06_plate/belt/plate_belt.img',
            'plate_coat.img': 'sprite/item/new_equipment/06_plate/coat/plate_coat.img',
            'plate_neck.img': 'sprite/item/new_equipment/06_plate/neck/plate_neck.img',
            'plate_pants.img': 'sprite/item/new_equipment/06_plate/pants/plate_pants.img',
            'plate_shoes.img': 'sprite/item/new_equipment/06_plate/shoes/plate_shoes.img',
            'bracelet.img': 'sprite/item/new_equipment/09_bracelet/bracelet.img',
            'necklace.img': 'sprite/item/new_equipment/08_necklace/necklace.img',
            'ring.img': 'sprite/item/new_equipment/07_ring/ring.img',
            'support.img': 'sprite/item/new_equipment/10_support/support.img',
            'magicstone.img': 'sprite/item/new_equipment/11_magicstone/magicstone.img',
            'earrring.img': 'sprite/item/new_equipment/13_earrring/earrring.img',
        },//img文件名对应的img在npk内的路径
        colorSpaceType: 'argb1555' //颜色类型
        usePinJsonFile:true
    }
]*/