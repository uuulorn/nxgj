import { ExactNPKOption } from "./type";
import { readFileSync } from 'fs';
import { resolve } from 'path';

export const enOpt: ExactNPKOption = JSON.parse(readFileSync(resolve(__dirname, 'info.json')).toString())
/*
export const enOpt: ExactNPKOption = {//样本
    inputPath: './input',//输入目录路径,应包含npk文件
    outputPath: './output'//输出目录
}*/