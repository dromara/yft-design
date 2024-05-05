import { ICardItem } from "@/types/templates";
import { card1, card2 } from "@/mocks/cards";

const colorArr = ["#409eff", "#67c23a", "#e6a23c", "#f56c6c", "#909399"];

const list1: ICardItem[] = card1.data.items.map((i) => ({
  id: i.id,
  width: i.note_card.cover.width,
  height: i.note_card.cover.height,
  title: i.note_card.display_title,
  author: i.note_card.user.nickname,
}));

const list2: ICardItem[] = card2.data.items.map((i) => ({
  id: i.id,
  width: i.note_card.cover.width,
  height: i.note_card.cover.height,
  title: i.note_card.display_title,
  author: i.note_card.user.nickname,
}));

const list = [...list1, ...list2].map((item, index) => ({ bgColor: colorArr[index % (colorArr.length - 1)], ...item }));

export default list;