module.exports = {
  plugins: {
    "postcss-px-to-viewport": {
      // 需要转换的单位
      unitToConvert: "px",
      // 设计稿的视口宽度
      viewportWidth: 375,
      // 单位转换后保留的精度
      unitPrecision: 4,
    },
  },
};
