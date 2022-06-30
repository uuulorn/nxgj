import * as genPic from './加字图片生成器'
import * as packNpk from './npk打包器'

void async function () {
    await genPic.run()
    await packNpk.run()
}()
