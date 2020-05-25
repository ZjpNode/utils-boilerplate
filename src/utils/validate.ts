/*
 * @Author       : jiapeng.Zheng
 * @Date         : 2020-04-17 17:13:41
 * @LastEditors  : jiapeng.Zheng
 * @LastEditTime : 2020-04-21 11:48:10
 * @Description  : 校验
 */
/**
 * 判断字符串是否为json格式的字符串
 * @param str
 */
function isJsonString(str: string): boolean {
  let isTrue = false;
  if (typeof str === 'string') {
    try {
      const obj = JSON.parse(str);
      if (typeof obj === 'object' && obj) {
        isTrue = true;
      } else {
        isTrue = false;
      }
    } catch (e) {
      isTrue = false;
    }
  }
  return isTrue;
}

export default {
  isJsonString,
};
