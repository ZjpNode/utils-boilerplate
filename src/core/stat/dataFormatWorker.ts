/*
 * @Author       : jiapeng.Zheng
 * @Date         : 2020-05-11 14:55:13
 * @LastEditors  : jiapeng.Zheng
 * @LastEditTime : 2020-05-13 10:15:13
 * @Description  :
 */
import DataFormat from './dataFormat';
import { DeviceStatInfo, StatOption, DeviceFormatStat } from '@/core/stat/type';
type msgData = {
  data: DeviceStatInfo[];
  option: StatOption;
};
self.onmessage = function (e: MessageEvent): void {
  const msg: msgData = e.data;
  const data: DeviceFormatStat = DataFormat(msg.data, msg.option);
  self.postMessage(data);
  self.close();
};
// export default function DataFormatWorker(): void {
//   self.onmessage = function (e: MessageEvent): void {
//     const msg: msgData = e.data;
//     // const DataFormat: DataFormatFn = this.importScripts('./dataFormat');
//     const data: DeviceFormatStat = DataFormat(msg.data, msg.option);
//     self.postMessage(data);
//     self.close();
//   };
// }

// function DataFormatAsync(data: Array<DeviceStatInfo>, option: StatOption): Promise<DeviceFormatStat> {
//   return new Promise((resolve, reject) => {
//     const code = DataFormatWorker.toString();
//     const blob = new Blob(['(' + code + ')()']);
//     const worker = new Worker(URL.createObjectURL(blob));
//     worker.postMessage({ data, option });
//     worker.onmessage = (e: MessageEvent): void => {
//       resolve(e.data.resData);
//     };
//     worker.onerror = (e): void => {
//       reject(e);
//     };
//   });
// }