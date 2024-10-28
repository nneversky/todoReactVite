import { createSlice } from "@reduxjs/toolkit";

const todoSlice = createSlice({
  name: "todo",
  initialState: {
    tasks: [{ text: "Buy car", id: new Date().toISOString() }],
  },
  reducers: {
    addTask(state, action) {
      if (action.payload.trim() !== "")
        state.tasks.push({
          text: action.payload,
          id: new Date().toISOString(),
        });
    },
    removeTask(state, action) {
      const newTasks = state.tasks.filter((value) => {
        if (value.id !== action.payload) return value;
      });
      state.tasks = newTasks;
    },
    resetTask(state, action) {
      let [id, newTask] = action.payload;
      const newTasks = state.tasks.map((value) => {
        if (value.id === id && newTask.trim() === "") throw Error("Empty str");

        if (value.id === id && newTask.trim() !== "") value.text = newTask;

        return value;
      });
      state.tasks = newTasks;
    },
  },
});

export const { addTask, removeTask, resetTask } = todoSlice.actions;
export default todoSlice.reducer;
