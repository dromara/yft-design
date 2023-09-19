export const ratioClipOptions = [
  {
    label: '纵横比（方形）',
    children: [
      { key: '1:1', ratio: 1 / 1 },
    ],
  },
  {
    label: '纵横比（纵向）',
    children: [
      { key: '2:3', ratio: 3 / 2 },
      { key: '3:4', ratio: 4 / 3 },
      { key: '3:5', ratio: 5 / 3 },
      { key: '4:5', ratio: 5 / 4 },
    ],
  },
  {
    label: '纵横比（横向）',
    children: [
      { key: '3:2', ratio: 2 / 3 },
      { key: '4:3', ratio: 3 / 4 },
      { key: '5:3', ratio: 3 / 5 },
      { key: '5:4', ratio: 4 / 5 },
    ],
  },
  {
    children: [
      { key: '16:9', ratio: 9 / 16 },
      { key: '16:10', ratio: 10 / 16 },
    ],
  },
]

export const PatternImages = [
  { name: 'escheresque', url: new URL(`/src/assets/images/escheresque.png`, import.meta.url).href },
  { name: 'greyfloral', url: new URL(`/src/assets/images/greyfloral.png`, import.meta.url).href },
  { name: 'honey_im_subtle', url: new URL(`/src/assets/images/honey_im_subtle.png`, import.meta.url).href },
  { name: 'nasty_fabric', url: new URL(`/src/assets/images/nasty_fabric.png`, import.meta.url).href },
  { name: 'retina_wood', url: new URL(`/src/assets/images/retina_wood.png`, import.meta.url).href },
]


export const SharpenMatrix = [ 0, -1, 0, -1, 5, -1, 0, -1, 0 ]
export const EmbossMatrix = [ 0, -1, 0, -1, 5, -1, 0, -1, 0 ]