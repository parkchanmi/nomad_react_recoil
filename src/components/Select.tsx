
import React from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { categorySelector, categoryState } from "../atoms";


function Select() {
  const categories = useRecoilValue(categorySelector);
  const [category, setCategory] = useRecoilState(categoryState);
  const onInput = (event: React.FormEvent<HTMLSelectElement>) => {
    setCategory(event.currentTarget.value as any);
  };
  return (
    <select value={category} onInput={onInput}>
        {categories?.map((oneCategory) => (
          <option value={oneCategory}>{oneCategory}</option>
        ))}
    </select>
  );
}

export default Select;