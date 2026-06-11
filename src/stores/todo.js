import { defineStore } from "pinia";
import { gql } from "@apollo/client/core";
import { apolloClient } from "../apollo";

// GraphQL Queries and Mutations
const GET_TODOS = gql`
  query GetTodos {
    tasks {
      id
      name
      description
      createdAt
      completedAt
    }
  }
`;

const ADD_TODO = gql`
  mutation CreateTask($name: String!) {
    createTask(name: $name) {
      id
      name
      description
      createdAt
      completedAt
    }
  }
`;

const TOGGLE_TODO = gql`
  mutation ToggleTaskStatus($id: ID!) {
    toggleTaskStatus(id: $id) {
      id
      name
      description
      createdAt
      completedAt
    }
  }
`;

const DELETE_TODO = gql`
  mutation DeleteTask($id: ID!) {
    deleteTask(id: $id)
  }
`;

const DELETE_COMPLETED_TODOS = gql`
  mutation DeleteCompletedTasks {
    deleteCompletedTasks
  }
`;

export const useTodoStore = defineStore("todo", {
  state: () => ({
    todos: [],
    errorMessage: "", // Store error messages for UI alerts
  }),
  getters: {
    countTodos: (state) => state.todos.filter((t) => t.completedAt == null).length,
  },
  actions: {
    // Clear any active error messages
    clearError() {
      this.errorMessage = "";
    },
    
    async fetchTodos() {
      try {
        const response = await apolloClient.query({
          query: GET_TODOS,
          fetchPolicy: "network-only",
        });
        this.todos = [...response.data.tasks];
      } catch (error) {
        console.error("Failed to fetch todos:", error);
        this.errorMessage = "Failed to load tasks from server.";
      }
    },

    async addTodo(todo) {
      const tempId = "temp-" + Date.now();
      const newTodo = {
        id: tempId,
        name: todo,
        description: "",
        createdAt: new Date().toISOString(),
        completedAt: null,
      };

      const originalTodos = [...this.todos];
      // Optimistic update
      this.todos.push(newTodo);
      this.clearError();

      try {
        const response = await apolloClient.mutate({
          mutation: ADD_TODO,
          variables: { name: todo },
        });

        // Replace optimistic task with the response from backend
        const index = this.todos.findIndex((t) => t.id === tempId);
        if (index !== -1) {
          this.todos[index] = response.data.createTask;
        }
      } catch (error) {
        console.error("Failed to add todo:", error);
        // Rollback
        this.todos = originalTodos;
        this.errorMessage = error.message || "Failed to add task.";
        throw error;
      }
    },

    async toggleStatus(id) {
      const originalTodos = JSON.parse(JSON.stringify(this.todos));
      // Optimistic update
      const foundIndex = this.todos.findIndex((t) => t.id == id);
      if (foundIndex >= 0) {
        const todoCopy = { ...this.todos[foundIndex] };
        todoCopy.completedAt = todoCopy.completedAt ? null : new Date().toISOString();
        this.todos[foundIndex] = todoCopy;
      }
      this.clearError();

      try {
        const response = await apolloClient.mutate({
          mutation: TOGGLE_TODO,
          variables: { id: parseInt(id) },
        });

        // Sync with resolver response
        const index = this.todos.findIndex((t) => t.id == id);
        if (index !== -1) {
          this.todos[index] = response.data.toggleTaskStatus;
        }
      } catch (error) {
        console.error("Failed to toggle task:", error);
        // Rollback
        this.todos = originalTodos;
        this.errorMessage = error.message || "Failed to toggle task status.";
        throw error;
      }
    },

    async deleteTodo(id) {
      const originalTodos = [...this.todos];
      // Optimistic update
      this.todos = this.todos.filter((t) => t.id != id);
      this.clearError();

      try {
        await apolloClient.mutate({
          mutation: DELETE_TODO,
          variables: { id: parseInt(id) },
        });
      } catch (error) {
        console.error("Failed to delete task:", error);
        // Rollback
        this.todos = originalTodos;
        this.errorMessage = error.message || "Failed to delete task.";
        throw error;
      }
    },

    async clearAllCompleted() {
      const originalTodos = [...this.todos];
      // Optimistic update
      this.todos = this.todos.filter((t) => t.completedAt == null);
      this.clearError();

      try {
        await apolloClient.mutate({
          mutation: DELETE_COMPLETED_TODOS,
        });
      } catch (error) {
        console.error("Failed to clear completed tasks:", error);
        // Rollback
        this.todos = originalTodos;
        this.errorMessage = error.message || "Failed to clear completed tasks.";
        throw error;
      }
    },
  },
});
