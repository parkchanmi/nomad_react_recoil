import { useRecoilState, useRecoilValue } from "recoil";
import { Categories, categoryState, toDoSelector } from "../atoms";
import CreateToDo from "./CreateToDo";
import ToDo from "./ToDo";
import React from "react";
import CreateCategory from "./CreateCategory";
import Select from "./Select";

function ToDoList() {
  const toDos = useRecoilValue(toDoSelector);
    return (
      <div>
      <h1>To Dos</h1>
      <hr />
      <CreateCategory/>
      <Select/>
      <CreateToDo />
      {toDos?.map((toDo) => (
        <ToDo key={toDo.id} {...toDo} />
      ))}
    </div>
  );
}
export default ToDoList;