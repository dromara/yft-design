import { AxiosPromise } from 'axios'
import request from '@/utils/request'
import { randomText, ranInt } from "@/utils";
import { ItemList, PageParams, PageResult } from "./types"


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


export const getList = (total: number): Promise<{ code: number, data: ItemList }> => {
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
    }, ranInt(100, 1000));
  });
}


export const getTemplatePages = (params: PageParams): AxiosPromise<PageResult> => {
  return request({
    url: '/api/template/pages',
    method: 'get',
    params,
  })
}
