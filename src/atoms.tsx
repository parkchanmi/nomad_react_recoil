import { atom,selector  } from "recoil";
import { recoilPersist } from 'recoil-persist';

const { persistAtom } = recoilPersist();

export enum Categories {
  "TO_DO" = "TO_DO",
  "DOING" = "DOING",
  "DONE" = "DONE",
}

export interface IToDo {
  text: string;
  id: number;
  category : string
  //category: Categories;
}

export interface ICategory {
  category: string;
  id: number;
}

export const categoryState = atom({
  key: "category",
  default: Categories.TO_DO,
  effects_UNSTABLE: [persistAtom],
});

export const toDoState = atom<IToDo[]>({
  key: "toDo",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const customCategoryState = atom<ICategory[]>({
  key: "customCategory",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const toDoSelector = selector({
    key: "toDoSelector",
    get: ({ get }) => {
      const toDos = get(toDoState);
      const category = get(categoryState);
      return toDos.filter((toDo) => toDo.category === category);
    },
  });

  export const categorySelector = selector({
    key: "categorySelector",
    get: ({ get }) => {
      const orgCategory = Object.keys(Categories);
      const customCategory = get(customCategoryState);
      return [...orgCategory,...customCategory.map((oneCategory) => (oneCategory.category))];
    },
  });

  export const notSelectCategorySelector = selector({
    key: "notSelectCategorySelector",
    get: ({ get }) => {
      const category = get(categoryState);
      const orgCategory = Object.keys(Categories);
      const customCategory = get(customCategoryState);
      return [...orgCategory,...customCategory.map((oneCategory) => (oneCategory.category))].filter((oneCategory) => oneCategory !== category);
    },
  });