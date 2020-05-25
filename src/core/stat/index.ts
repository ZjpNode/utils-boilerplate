/*
 * @Author       : jiapeng.Zheng
 * @Date         : 2020-04-24 09:59:13
 * @LastEditors  : jiapeng.Zheng
 * @LastEditTime : 2020-05-13 15:17:02
 * @Description  :
 */
import DataFormat from './dataFormat';
// import DataFormatAsync from './dataFormatWorker';
import { DeviceStatInfo, StatOption, DeviceFormatStat } from '@/core/stat/type';
/* eslint @typescript-eslint/ban-ts-ignore: 0 */
// @ts-ignore
import DataFormatWorker from 'web-worker:./dataFormatWorker.ts';
function DataFormatAsync(data: Array<DeviceStatInfo>, option: StatOption): Promise<DeviceFormatStat> {
  return new Promise((resolve, reject) => {
    const worker = new DataFormatWorker();
    worker.postMessage({ data, option });
    worker.onmessage = (e: MessageEvent): void => {
      resolve(e.data);
    };
    worker.onerror = (e: MessageEvent): void => {
      reject(e);
    };
  });
}

export default {
  DataFormat,
  DataFormatAsync,
};
