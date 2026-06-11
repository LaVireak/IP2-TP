<template>
  <ul class="todoLists">
    <TodoItem
      v-for="todo of filteredTasks"
      :key="todo.id"
      :todo="todo"
    />
    <li v-if="filteredTasks.length === 0" class="empty-state">
      No tasks in this category.
    </li>
  </ul>
</template>
<script>
import { mapState } from "pinia";
import TodoItem from "./TodoItem.vue";
import { useTodoStore } from "../stores/todo";

export default {
  setup() {
    const todoStore = useTodoStore();
    return { todoStore };
  },
  name: "TodoList",
  props: ["status"],
  components: {
    TodoItem,
  },
  async mounted() {
    await this.todoStore.fetchTodos();
  },
  computed: {
    ...mapState(useTodoStore, ["todos"]),
    filteredTasks() {
      if (!this.todos) return [];
      if (this.status === "completed") {
        return this.todos.filter((todo) => todo.completedAt != null);
      } else if (this.status === "pending") {
        return this.todos.filter((todo) => todo.completedAt == null);
      }
      return this.todos;
    },
  },
};
</script>
<style scoped>
.empty-state {
  text-align: center;
  color: #888;
  padding: 20px;
  list-style: none;
  font-style: italic;
}
</style>
