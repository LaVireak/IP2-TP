<template>
  <li class="list" :class="{ checked: todo.completedAt != null }" @click="toggleStatus(todo.id)">
    <input type="checkbox" :checked="todo.completedAt != null" />
    <span class="task">{{ todo.name }}</span>
    <i class="uil uil-trash-alt delete-btn" @click.stop="deleteTodo(todo.id)"></i>
  </li>
</template>
<script>
import { useTodoStore } from "../stores/todo";
export default {
  setup() {
    const todoStore = useTodoStore();
    return { todoStore };
  },
  props: ["todo"],
  methods: {
    toggleStatus(todoId) {
      console.log('TodoItem toggleStatus clicked for ID:', todoId, 'Todo object:', this.todo);
      this.todoStore.toggleStatus(todoId).catch((err) => {
        console.error('TodoStore toggleStatus failed:', err);
      });
    },
    deleteTodo(todoId) {
      console.log('TodoItem deleteTodo clicked for ID:', todoId);
      this.todoStore.deleteTodo(todoId).catch((err) => {
        console.error('TodoStore deleteTodo failed:', err);
      });
    },
  },
};
</script>
<style scoped>
.delete-btn {
  color: #ff4d4d !important;
  font-size: 20px;
}
.list.checked .task {
  text-decoration: line-through;
  color: #888;
}
</style>
