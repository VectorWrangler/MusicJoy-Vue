// 简单的颜色处理工具函数

export const setColorSchemes = (color: string, themeType: string) => {
  // 这里应该实现颜色方案的计算逻辑
  // 为了简化，我们返回一个基本的对象结构
  return {
    primary: color,
    background: themeType === 'dark' ? '#1e1e1e' : '#ffffff',
    'surface-container': themeType === 'dark' ? '#2d2d2d' : '#f5f5f5'
  };
};

// RGB转HEX的简单实现
export const rgbToHex = (r: number, g: number, b: number) => {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
};