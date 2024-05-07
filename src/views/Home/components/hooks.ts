import { randomText, ranInt } from "@/utils";
import loadFail from "@/assets/images/loading.gif";

export interface ItemInfo {
  id: number
  title: string
  text: string
  /** 图片路径 */
  photo: string
  /** 图片的宽度，前端获取图片信息之后设置 */
  width?: number
  /** 图片的高度，前端获取图片信息之后设置 */
  height?: number
  /** 
   * 当前节点的所在列的高度
   * - 非列的总高度，只是调试用
   */
  currentColumnHeight?: number
}

export type ItemList = Array<ItemInfo>;

let id = 0;

/**
 * 图片前缀
 * [图片来源](https://lol.qq.com/data/info-heros.shtml)
 */
const photoPrefix = "https://game.gtimg.cn/images/lol/act/img";

const list1 = [
  "/champion/Talon.png",
  "/champion/Quinn.png",
  "/champion/Vladimir.png",
  "/champion/Sona.png",
  "/champion/Zed.png",
  "/champion/MissFortune.png",
  "/champion/Lux.png",
];

const list2 = [
  "/skinloading/106000.jpg",
  "/skinloading/107000.jpg",
  "/skinloading/110000.jpg",
  "/skinloading/111000.jpg",
  "/skinloading/112000.jpg",
  "/skinloading/113000.jpg",
  "/skinloading/114000.jpg"
];

const getPhotoList = () => !Math.round(Math.random()) ? list1 : list2;

/**
 * 
 * @param maxDelay 最大延迟毫秒数，不能低于`100`
 */
export function useRequest(maxDelay = 1000) {
  /**
   * 模拟接口请求列表
   * @param total 条数
   */
  function getList(total: number): Promise<{ code: number, data: ItemList }> {
    return new Promise(function(resolve, reject) {
      const list: ItemList = [];
      for (let i = 0; i < total; i++) {
        id++;
        const photos = getPhotoList();
        list.push({
          id: id,
          title: "卡片标题-" + id,
          text: randomText(4, 58),
          // photo: `https://picsum.photos/300/${ranInt(200, 500)}`, // 大陆被墙了
          photo: photoPrefix + photos[ranInt(0, photos.length - 1)]
        });
      }
      setTimeout(function() {
        resolve({ code: 1, data: list});
      }, ranInt(100, maxDelay));
    });
  }

  const defaultPic = {
    data: loadFail,
    width: 200,
    height: 200
  };

  return {
    getList,
    defaultPic
  }
}
