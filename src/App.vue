<template>
  <div class="app-wrapper">
    <!-- Header with Permission Switcher -->
    <header class="app-header">
      <div class="header-logo">
        <i class="uil uil-graphql logo-icon"></i>
        <h1>GraphQL Todos</h1>
      </div>
      <div class="permission-toggle">
        <span class="label">Role:</span>
        <div class="toggle-buttons">
          <button 
            :class="{ active: currentRole === 'admin' }" 
            @click="setRole('admin')"
            class="role-btn admin-btn"
          >
            Admin
          </button>
          <button 
            :class="{ active: currentRole === 'user' }" 
            @click="setRole('user')"
            class="role-btn user-btn"
          >
            User
          </button>
        </div>
      </div>
    </header>

    <!-- Error Alert Banner -->
    <transition name="fade-slide">
      <div v-if="store.errorMessage" class="error-banner">
        <i class="uil uil-exclamation-octagon error-icon"></i>
        <span class="error-text">{{ store.errorMessage }}</span>
        <button class="close-alert-btn" @click="store.clearError">
          <i class="uil uil-times"></i>
        </button>
      </div>
    </transition>

    <div class="container">
      <!-- Input Field -->
      <AddTodo @added="handleAddTodo" />

      <!-- Filter Bar -->
      <div class="filter-bar">
        <button 
          v-for="filter in ['all', 'pending', 'completed']" 
          :key="filter"
          :class="{ active: currentFilter === filter }"
          @click="currentFilter = filter"
          class="filter-btn"
        >
          {{ filter.charAt(0).toUpperCase() + filter.slice(1) }}
        </button>
      </div>

      <!-- Todo List -->
      <div class="list-section">
        <h3 class="list-title">
          {{ currentFilter.charAt(0).toUpperCase() + currentFilter.slice(1) }} Tasks
        </h3>
        <TodoLists :status="currentFilter" />
      </div>

      <!-- Footer Info and Clear Button -->
      <div class="pending-tasks">
        <span>
          You have <span class="pending-num">{{ nbOfTodo }}</span> tasks pending
        </span>
        <button 
          class="clear-button" 
          :disabled="!hasCompletedTasks"
          :class="{ disabled: !hasCompletedTasks }"
          @click="clearCompleted"
        >
          Clear Completed
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "pinia";
import AddTodo from "./components/AddTodo.vue";
import TodoLists from "./components/TodoList.vue";
import { useTodoStore } from "./stores/todo";

export default {
  name: "App",
  components: {
    AddTodo,
    TodoLists,
  },
  setup() {
    const store = useTodoStore();
    return {
      store,
    };
  },
  data() {
    return {
      currentFilter: "all",
      currentRole: "admin",
    };
  },
  created() {
    // Initialise role from localStorage
    const savedRole = localStorage.getItem("user-role");
    if (savedRole) {
      this.currentRole = savedRole;
    } else {
      localStorage.setItem("user-role", "admin");
    }
  },
  computed: {
    ...mapState(useTodoStore, {
      nbOfTodo: "countTodos",
      todos: "todos",
    }),
    hasCompletedTasks() {
      return this.todos && this.todos.some((todo) => todo.completedAt != null);
    },
  },
  methods: {
    setRole(role) {
      this.currentRole = role;
      localStorage.setItem("user-role", role);
      this.store.clearError();
    },
    async handleAddTodo(todo) {
      if (!todo.trim()) return;
      try {
        await this.store.addTodo(todo.trim());
      } catch (err) {
        // Error is handled by store.errorMessage
      }
    },
    async clearCompleted() {
      try {
        await this.store.clearAllCompleted();
      } catch (err) {
        // Error is handled by store.errorMessage
      }
    },
  },
};
</script>

<style>
/* CSS Reset / Overrides & Modern Layout Styling */
.app-wrapper {
  max-width: 520px;
  margin: 40px auto;
  padding: 0 20px;
}

/* Header Styling */
.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  padding: 15px 20px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}
.header-logo {
  display: flex;
  align-items: center;
  gap: 8px;
}
.logo-icon {
  font-size: 28px;
  color: #e10098; /* GraphQL theme color */
}
.header-logo h1 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
}

/* Permission Switcher */
.permission-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
}
.permission-toggle .label {
  font-size: 0.85rem;
  color: #666;
  font-weight: 500;
}
.toggle-buttons {
  display: flex;
  background: #f1f3f5;
  padding: 4px;
  border-radius: 8px;
}
.role-btn {
  border: none;
  outline: none;
  padding: 4px 12px;
  font-size: 0.8rem;
  font-weight: 500;
  border-radius: 6px;
  cursor: pointer;
  background: transparent;
  color: #555;
  transition: all 0.2s ease;
}
.role-btn.active {
  background: #fff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}
.admin-btn.active {
  color: #4070f4;
}
.user-btn.active {
  color: #ff9800;
}

/* Error Banner styling */
.error-banner {
  display: flex;
  align-items: center;
  background: #ffe3e3;
  border-left: 4px solid #ff4d4d;
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 4px 12px rgba(255, 77, 77, 0.15);
  position: relative;
  animation: shake 0.3s ease-in-out;
}
.error-icon {
  font-size: 20px;
  color: #ff4d4d;
  margin-right: 12px;
}
.error-text {
  color: #cc0000;
  font-size: 0.9rem;
  font-weight: 500;
  flex-grow: 1;
}
.close-alert-btn {
  background: transparent;
  border: none;
  color: #cc0000;
  font-size: 18px;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.2s;
  display: flex;
  align-items: center;
}
.close-alert-btn:hover {
  opacity: 1;
}

/* Container Adjustments */
.container {
  margin-top: 0 !important;
  border-radius: 12px !important;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05) !important;
}

/* Filter Bar Styling */
.filter-bar {
  display: flex;
  justify-content: space-around;
  background: #f8f9fa;
  padding: 6px;
  border-radius: 10px;
  margin: 20px 0;
}
.filter-btn {
  border: none;
  background: transparent;
  padding: 8px 16px;
  font-size: 0.9rem;
  font-weight: 500;
  color: #666;
  border-radius: 8px;
  cursor: pointer;
  flex: 1;
  transition: all 0.2s ease;
}
.filter-btn:hover {
  color: #4070f4;
}
.filter-btn.active {
  background: #4070f4;
  color: #fff;
  box-shadow: 0 4px 10px rgba(64, 112, 244, 0.25);
}

/* List section styling */
.list-section {
  margin: 15px 0;
}
.list-title {
  font-size: 1.05rem;
  font-weight: 600;
  color: #444;
  margin-bottom: 10px;
}

/* Clear Button styling update */
.clear-button.disabled {
  background-color: #ccc !important;
  cursor: not-allowed !important;
  opacity: 0.6;
}

/* Transitions & Animations */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-4px); }
  75% { transform: translateX(4px); }
}
</style>
