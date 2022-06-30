import { MarkOption } from './type'
export const giOpt = {
    placement: {//部位
        'cloth_belt.img': { text: '腰', color: 'black' }, //全等匹配子目录名 //text为单字
        'cloth_coat.img': { text: '衫', color: 'black' },
        'cloth_neck.img': { text: '肩', color: 'black' },
        'cloth_pants.img': { text: '裤', color: 'black' },
        'cloth_shoes.img': { text: '鞋', color: 'black' },
        'harmor_belt.img': { text: '腰', color: 'black' },
        'harmor_coat.img': { text: '衫', color: 'black' },
        'harmor_neck.img': { text: '肩', color: 'black' },
        'harmor_pants.img': { text: '裤', color: 'black' },
        'harmor_shoes.img': { text: '鞋', color: 'black' },
        'larmor_belt.img': { text: '腰', color: 'black' },
        'larmor_coat.img': { text: '衫', color: 'black' },
        'larmor_neck.img': { text: '肩', color: 'black' },
        'larmor_pants.img': { text: '裤', color: 'black' },
        'larmor_shoes.img': { text: '鞋', color: 'black' },
        'leather_belt.img': { text: '腰', color: 'black' },
        'leather_coat.img': { text: '衫', color: 'black' },
        'leather_neck.img': { text: '肩', color: 'black' },
        'leather_pants.img': { text: '裤', color: 'black' },
        'leather_shoes.img': { text: '鞋', color: 'black' },
        'plate_belt.img': { text: '腰', color: 'black' },
        'plate_coat.img': { text: '衫', color: 'black' },
        'plate_neck.img': { text: '肩', color: 'black' },
        'plate_pants.img': { text: '裤', color: 'black' },
        'plate_shoes.img': { text: '鞋', color: 'black' },
        'bracelet.img': { text: '镯', color: 'black' },
        'necklace.img': { text: '项', color: 'black' },
        'ring.img': { text: '戒', color: 'black' },
        'support.img': { text: '左', color: 'black' },
        'magicstone.img': { text: '右', color: 'black' },
        'earrring.img': { text: '耳', color: 'black' },
    },
    tag: {//标签
        'cloth_belt.img': {//全等匹配子目录名
            88: { text: '火抗速度', color: 'purple' },//text为四字
            89: { text: '晶体技攻', color: 'red' },
            90: { text: '附魔翻倍', color: 'red' },
        },
        'cloth_coat.img': {
            98: { text: '灼烧伤害', color: 'blue' },
            99: { text: '狂暴增攻', color: 'blue' },
            100: { text: '附魔翻倍', color: 'blue' },
        },
        'cloth_neck.img': {
            90: { text: '灼烧伤害', color: 'blue' },
            91: { text: 'MP增攻', color: 'red' },
            92: { text: '附魔翻倍', color: 'red' },
        },
        'cloth_pants.img': {
            94: { text: '火强物体', color: 'red' },
            95: { text: '卖血增攻', color: 'red' },
            96: { text: '附魔翻倍', color: 'purple' },
        },
        'cloth_shoes.img': {
            92: { text: '灼烧增攻', color: 'blue' },
            93: { text: '卖血增攻', color: 'red' },
            94: { text: '附魔翻倍', color: 'red' },
        },
        'harmor_belt.img': {
            92: { text: '出血增攻', color: 'blue' },
            95: { text: 'MP增攻', color: 'red' },
            96: { text: '冰强冰抗', color: 'blue' },
        },
        'harmor_coat.img': {
            100: { text: '苟命5s', color: 'purple' },
            103: { text: 'CD回复', color: 'blue' },
            104: { text: '全属附魔', color: 'red' },
        },
        'harmor_neck.img': {
            91: { text: '出血伤害', color: 'blue' },
            94: { text: '灵魂增攻', color: 'blue' },
            95: { text: '火强火抗', color: 'blue' },
        },
        'harmor_pants.img': {
            95: { text: '火强火抗', color: 'red' },
            98: { text: '伪装回避', color: 'purple' },
            99: { text: '光强光抗', color: 'blue' },
        },
        'harmor_shoes.img': {
            91: { text: '异常增攻', color: 'blue' },
            94: { text: 'MP核心', color: 'red' },
            95: { text: '暗强暗抗', color: 'blue' },
        },
        'larmor_belt.img': {
            101: { text: '感电特效', color: 'blue' },
            102: { text: '中毒增攻', color: 'blue' },
            103: { text: '异抗减伤', color: 'purple' },
            104: { text: '减伤堆血', color: 'purple' },
            105: { text: '感电伤害', color: 'blue' },
        },
        'larmor_coat.img': {
            114: { text: '灼烧特效', color: 'blue' },
            115: { text: '瞬移增攻', color: 'blue' },
            116: { text: '护盾回复', color: 'purple' },
            117: { text: '瞬移属强', color: 'blue' },
            118: { text: '变小回避', color: 'purple' },
        },
        'larmor_neck.img': {
            103: { text: '冰冻特效', color: 'blue' },
            104: { text: '中毒伤害', color: 'blue' },
            105: { text: '灼烧增攻', color: 'blue' },
            106: { text: '减伤回复', color: 'purple' },
            107: { text: 'CD减攻', color: 'blue' },
        },
        'larmor_pants.img': {
            107: { text: '灼烧增攻', color: 'blue' },
            108: { text: '中毒伤害', color: 'blue' },
            109: { text: '保护回蓝', color: 'purple' },
            110: { text: '弹反技攻', color: 'purple' },
            111: { text: '暗强暗抗', color: 'red' },
        },
        'larmor_shoes.img': {
            104: { text: '失明特效', color: 'blue' },
            105: { text: '中毒伤害', color: 'blue' },
            106: { text: '滞空暴击', color: 'purple' },
            107: { text: '手搓技攻', color: 'red' },
            108: { text: '冷却自电', color: 'blue' },
        },
        'leather_belt.img': {
            88: { text: '失明特效', color: 'blue' },
            89: { text: '中毒伤害', color: 'blue' },
            90: { text: '滞空暴击', color: 'purple' },
            91: { text: '手搓技攻', color: 'red' },
        },
        'leather_coat.img': {
            98: { text: '搬砖指令', color: 'purple' },
            99: { text: '诅咒增伤', color: 'blue' },
            100: { text: '躺就完事', color: 'purple' },
            101: { text: '果汁气魄', color: 'red' },
        },
        'leather_neck.img': {
            86: { text: '搬砖捡物', color: 'purple' },
            87: { text: '基础平A', color: 'blue' },
            88: { text: '蹲伏增伤', color: 'blue' },
            89: { text: '感电伤害', color: 'blue' },
        },
        'leather_pants.img': {
            91: { text: '搬砖范围', color: 'purple' },
            92: { text: '基础经停', color: 'red' },
            93: { text: '后跳强化', color: 'purple' },
            94: { text: '光强光抗', color: 'red' },
        },
        'leather_shoes.img': {
            92: { text: '冲击护罩', color: 'purple' },
            93: { text: '基础精通', color: 'red' },
            94: { text: '蹲伏延长', color: 'purple' },
            95: { text: '感电增攻', color: 'blue' },
        },
        'plate_belt.img': {
            87: { text: '冲击护罩', color: 'purple' },
            88: { text: '基础精通', color: 'red' },
            90: { text: '蹲伏延长', color: 'purple' },
            91: { text: '感电增攻', color: 'blue' },
        },
        'plate_coat.img': {
            96: { text: '变大回复', color: 'purple' },
            97: { text: '全属属强', color: 'blue' },
            99: { text: '芜湖起飞', color: 'purple' },
            100: { text: '无敌速度', color: 'purple' },
        },
        'plate_neck.img': {
            88: { text: '石化伤害', color: 'blue' },
            89: { text: '卖血技攻', color: 'red' },
            91: { text: '背刺异常', color: 'purple' },
            92: { text: '出血伤害', color: 'blue' },
        },
        'plate_pants.img': {
            91: { text: '卖血CD', color: 'blue' },
            92: { text: '回血省蓝', color: 'purple' },
            94: { text: '增伤霸体', color: 'red' },
            95: { text: '冰强冰抗', color: 'red' },
        },
        'plate_shoes.img': {
            90: { text: '石化增强', color: 'blue' },
            91: { text: '蓝耗CD', color: 'blue' },
            93: { text: '回避速度', color: 'purple' },
            94: { text: '技等移速', color: 'blue' },
        },
        'bracelet.img': {
            274: { text: '灼烧核心', color: 'blue' },
            275: { text: '无色特化', color: 'red' },
            276: { text: '附魔翻倍', color: 'red' },
            278: { text: '紧急瞬移', color: 'purple' },
            279: { text: '小技平A', color: 'red' },
            280: { text: '受伤缓化', color: 'purple' },
            281: { text: '感电核心', color: 'blue' },
            283: { text: '眩晕技攻', color: 'blue' },
            284: { text: '中毒核心', color: 'blue' },
            285: { text: '异常同化', color: 'blue' },
            286: { text: '攻击强化', color: 'red' },
            287: { text: '灼烧属强', color: 'purple' },
            288: { text: '出血核心', color: 'blue' },
            291: { text: '蓝耗CD', color: 'blue' },
            292: { text: '石化技攻', color: 'blue' },
            293: { text: '果汁核心', color: 'blue' },
            295: { text: '破极兵刃', color: 'red' },
            296: { text: '流星一条', color: 'purple' },
        },
        'necklace.img': {
            281: { text: '灼烧火强', color: 'blue' },
            282: { text: '卖血增伤', color: 'red' },
            283: { text: '附魔翻倍', color: 'red' },
            285: { text: '猛虎落地', color: 'purple' },
            286: { text: '近战特化', color: 'red' },
            287: { text: '赖床不起', color: 'purple' },
            288: { text: '自击光强', color: 'blue' },
            290: { text: '灼烧伤害', color: 'purple' },
            291: { text: '自击冰强', color: 'blue' },
            292: { text: '破招技攻', color: 'red' },
            293: { text: '手搓特化', color: 'red' },
            294: { text: '自击暗强', color: 'blue' },
            295: { text: '自击火强', color: 'blue' },
            298: { text: '技等属强', color: 'blue' },
            299: { text: '弱点技攻', color: 'blue' },
            300: { text: '无视防御', color: 'red' },
            302: { text: '金币增伤', color: 'red' },
            303: { text: '加速回避', color: 'purple' },
            305: { text: '技等属强', color: 'blue' },
        },
        'ring.img': {
            320: { text: '灼烧技攻', color: 'blue' },
            321: { text: '卖血增攻', color: 'red' },
            322: { text: '附魔翻倍', color: 'red' },
            324: { text: '分摊增攻', color: 'blue' },
            325: { text: '黑白恍惚', color: 'red' },
            326: { text: '吃药增攻', color: 'blue' },
            327: { text: '感电技攻', color: 'blue' },
            329: { text: '失明技攻', color: 'blue' },
            330: { text: '异常增攻', color: 'blue' },
            331: { text: '不破特化', color: 'red' },
            332: { text: 'CD重置', color: 'red' },
            333: { text: '卖血回复', color: 'blue' },
            334: { text: '出血伤害', color: 'blue' },
            337: { text: '耗蓝增攻', color: 'red' },
            338: { text: '眩晕增攻', color: 'blue' },
            339: { text: '冰冻技攻', color: 'red' },
            341: { text: '出血CD', color: 'purple' },
            342: { text: '冰冻技攻', color: 'blue' },
            344: { text: '技等属强', color: 'blue' },
        },
        'support.img': {
            315: { text: '灼烧技攻', color: 'blue' },
            316: { text: '卖血强化', color: 'red' },
            317: { text: '附魔翻倍', color: 'red' },
            319: { text: '攻换CD', color: 'blue' },
            320: { text: '小技异常', color: 'blue' },
            321: { text: '睡眠增强', color: 'purple' },
            322: { text: '光抗光强', color: 'blue' },
            324: { text: '冰冻技攻', color: 'blue' },
            325: { text: '冰抗冰强', color: 'blue' },
            326: { text: '芜湖起飞', color: 'purple' },
            327: { text: '空投舔包', color: 'blue' },
            328: { text: '暗抗暗强', color: 'blue' },
            329: { text: '火抗火强', color: 'purple' },
            332: { text: '高蓝维持', color: 'purple' },
            333: { text: '无力强化', color: 'blue' },
            334: { text: '减伤加攻', color: 'blue' },
            336: { text: '二段跳跃', color: 'purple' },
            337: { text: '手搓特化', color: 'red' },
            339: { text: '技等属强', color: 'blue' },
        },
        'magicstone.img': {
            299: { text: '被击转化', color: 'purple' },
            300: { text: '破招强化', color: 'blue' },
            301: { text: '附魔翻倍', color: 'red' },
            303: { text: '异常抗性', color: 'purple' },
            304: { text: '小招特化', color: 'red' },
            305: { text: '睡眠回血', color: 'purple' },
            306: { text: '被击转化', color: 'purple' },
            308: { text: '被击转化', color: 'purple' },
            309: { text: '被击转化', color: 'purple' },
            310: { text: '出血加速', color: 'purple' },
            311: { text: '近战强化', color: 'blue' },
            312: { text: '自爆加速', color: 'purple' },
            313: { text: '异常CD', color: 'blue' },
            316: { text: 'MP强化', color: 'red' },
            317: { text: '眩晕CD', color: 'purple' },
            318: { text: '耗蓝加速', color: 'blue' },
            320: { text: '宠物增伤', color: 'red' },
            321: { text: '无色CD', color: 'blue' },
            323: { text: '技等属强', color: 'blue' },
        },
        'earrring.img': {
            97: { text: '雨露均沾', color: 'purple' },
            98: { text: '无色技攻', color: 'red' },
            99: { text: '附魔翻倍', color: 'red' },
            101: { text: '瞬时加速', color: 'purple' },
            102: { text: '小招特化', color: 'red' },
            103: { text: '自冻回血', color: 'purple' },
            104: { text: '雨露均沾', color: 'purple' },
            106: { text: '雨露均沾', color: 'purple' },
            107: { text: '雨露均沾', color: 'purple' },
            108: { text: '出血技攻', color: 'blue' },
            109: { text: '纯纯加速', color: 'purple' },
            110: { text: '大技特化', color: 'red' },
            111: { text: '出血技攻', color: 'blue' },
            114: { text: 'MP技攻', color: 'red' },
            115: { text: '石化技攻', color: 'blue' },
            116: { text: 'MP节约', color: 'purple' },
            118: { text: '时快时慢', color: 'purple' },
            119: { text: '追击属强', color: 'purple' },
            121: { text: '反击眩晕', color: 'purple' },
        },
    },
    inputPath: '../output',//输入目录路径
    outputPath: './output',//输出目录路径
    tagFillRectColor: 'white'//非空则在添加标签时,先填充一次值指定的颜色
} as MarkOption