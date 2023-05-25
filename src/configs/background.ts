export const TransparentFill = 'rgba(0,0,0,0)'
export const MinSize = 30
export const MaxSize = 800

export const DesignUnitMode = [
  {id: 0, name: 'mm'}, 
  {id: 1, name: 'px'}, 
]

export const DesignSizeMode = [
  {id: 0, name: '名片', disabled: false}, 
  {id: 1, name: '单页', disabled: false}, 
  {id: 2, name: '自定义', disabled: true}
]

export const BackgroundFillMode = [
  {id: 0, name: '纯色填充'}, 
  {id: 1, name: '图片填充'}, 
  {id: 2, name: '渐变填充'},
  {id: 3, name: '网格填充'},
  {id: 4, name: '形状填充'},
  {id: 5, name: '智能填充'},
]

// 上传图片
export const BackgroundFillImageMode = [
  {id: 'contain', name: '缩放'}, 
  {id: 'repeat', name: '拼贴'}, 
  {id: 'cover', name: '铺满'},
]

// 渐变色
export const BackgroundFillGradientMode = [
  {id: 0, name: '线性渐变', value: 'linear'}, 
  {id: 1, name: '径向渐变', value: 'radial'}, 
]

// 网格图片
export const BackgroundFillGridMode = [
  {id: 0, name: '渐变', value: 'interpolateLinear'}, 
  {id: 1, name: '闪烁', value: 'sparkle'}, 
  {id: 2, name: '阴影', value: 'shadows'},
]