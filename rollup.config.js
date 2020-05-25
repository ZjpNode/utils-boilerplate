/*
 * @Author       : jiapeng.Zheng
 * @Date         : 2020-04-13 11:32:14
 * @LastEditors  : jiapeng.Zheng
 * @LastEditTime : 2020-05-12 17:10:57
 * @Description  :
 */
import typescript from 'rollup-plugin-typescript2';
import ttypescript from 'ttypescript';
import webWorkerLoader from 'rollup-plugin-web-worker-loader';
import { terser } from 'rollup-plugin-terser';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import sourceMaps from 'rollup-plugin-sourcemaps';
import babel from 'rollup-plugin-babel';
import { DEFAULT_EXTENSIONS } from '@babel/core';

import pkg from './package.json';

const banner = `/*!
 * ${pkg.name}.js v${pkg.version}
 * (c) 2018-${new Date().getFullYear()} Russell
 * Released under the MIT License.
 */`;

export default {
  input: 'src/index.ts',
  output: [
    {
      format: 'cjs',
      file: pkg.main,
      banner,
      sourcemap: true,
    },
    {
      format: 'es',
      file: pkg.module,
      banner,
      sourcemap: true,
    },
    {
      format: 'umd',
      name: 'HxUtil',
      file: pkg.browser,
      banner,
      sourcemap: true,
    },
  ],
  plugins: [
    // typescript 支持 -> https://www.npmjs.com/package/rollup-plugin-typescript2#usage
    typescript({
      // ttypescript -> https://github.com/cevek/ttypescript
      typescript: ttypescript, // Over TypeScript tool to use custom transformers in the tsconfig.json
      useTsconfigDeclarationDir: true, // 使用 tsconfig.json 中的 declarationDir 作为声明文件的目录
      tsconfigOverride: {
        exclude: ['**/*.spec.ts', '**/*.spec.js'],
      },
    }),
    // babel 转换 https://www.npmjs.com/package/rollup-plugin-babel#usage
    babel({
      // https://www.npmjs.com/package/rollup-plugin-typescript2#rollup-plugin-babel
      extensions: [...DEFAULT_EXTENSIONS, '.ts', '.tsx'],
    }),
    webWorkerLoader(),
    commonjs(),
    resolve(),
    // terser(),// 代码压缩
    sourceMaps(),
  ],
};
