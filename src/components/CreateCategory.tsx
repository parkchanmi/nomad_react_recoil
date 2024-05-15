import { useForm } from "react-hook-form";
import { useRecoilValue,useRecoilState } from "recoil";
import { categorySelector, customCategoryState } from "../atoms";
import React from "react";

interface IForm {
  customCategory: string;
}

function CreateCategory() {
  const categories = useRecoilValue(categorySelector);
  const [customCategory, setCustomCategory] = useRecoilState(customCategoryState);
  const { register, handleSubmit, setValue } = useForm<IForm>();
  const handleValid = ({ customCategory }: IForm) => {
    setCustomCategory((oldCategory) => [
      { category: customCategory, id: Date.now() },
      ...oldCategory,
    ]);
    setValue("customCategory", "");
  };

  
  return (
    <form onSubmit={handleSubmit(handleValid)}>
      <input
        {...register("customCategory", {
          required: "Please write a To Do",
        })}
        placeholder="Make Custom Category"
      />
      <button>Add</button>
      <hr/>
    </form>
  );
}

export default CreateCategory;