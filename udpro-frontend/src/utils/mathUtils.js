/**
 * description
 *
 * @author Baizhou Zhang zhangbz
 * @project SIMForms
 * @date 2024/3/22
 * @time 14:03
 */
export default class MathUtils {
    /**
     * 将负数转换为无符号整数
     * @param decimalColor
     * @returns {{A: number, R: number, B: number, G: number}}
     */
    static convertDecimalToARGB(decimalColor) {
        // 将负数转换为无符号整数
        if (decimalColor < 0) {
            decimalColor = 4294967296 + decimalColor;
        }

        // 将十进制值转换为十六进制字符串
        let hexColor = decimalColor.toString(16);

        // 补零，使十六进制字符串长度为8
        while (hexColor.length < 8) {
            hexColor = '0' + hexColor;
        }
        // 分解ARGB分量
        const alpha = parseInt(hexColor.slice(0, 2), 16);
        const red = parseInt(hexColor.slice(2, 4), 16);
        const green = parseInt(hexColor.slice(4, 6), 16);
        const blue = parseInt(hexColor.slice(6, 8), 16);
        return {
            A: alpha,
            R: red,
            G: green,
            B: blue
        };
    }
}
