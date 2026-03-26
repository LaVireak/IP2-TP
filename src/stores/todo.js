import { defineStore } from "pinia";
import axios from "axios";

const API_URL = "http://localhost:3100";

export const useTodoStore = defineStore("todo", {
  state: () => ({
    todos: [],
  }),
  getters: {
    countTodos: (state) => state.todos.length,
  },
  actions: {
    async fetchTodos() {
      try {
        const response = await axios.get(`${API_URL}/tasks`);
        this.todos = response.data; // assuming the API returns an array of todos
      } catch (error) {
        console.error("Failed to fetch todos:", error);
      }
    },
    toggleStatus(id) {
      const foundIndex = this.todos.findIndex((t) => t.id == id);
      if (foundIndex >= 0) {
        if (this.todos[foundIndex].completedAt != null) {
          this.todos[foundIndex].completedAt = null;
        } else {
          this.todos[foundIndex].completedAt = new Date().toISOString();
        }
      }
    },
    async addTodo(todo) {
      try {
        await axios.post(`${API_URL}/tasks`, {
          name: todo,
          description: "description",
          createdAt: new Date().toISOString(),
          completedAt: null,
        });
        await this.fetchTodos(); // re-fetch from DB to stay in sync
      } catch (error) {
        console.error("Failed to add todo:", error);
      }
    },
    clearAll() {
      this.todos = [];
    },
  },
});
