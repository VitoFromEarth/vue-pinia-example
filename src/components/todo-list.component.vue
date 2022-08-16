<template>
  <a-divider />
  <div class="planned-block ">
    <b>Planned</b>
    <a-button @click="completeAllTodos">Complete All</a-button>
  </div>
  <a-list item-layout="horizontal" :data-source="todos">
    <template #renderItem="{ item }">
      <TodoItem
        :key="item.id"
        :id="item.id"
        :description="item.description"
        :completed="item.completed"
        @toggle-todo="toggleTodo"
        @delete-todo="deleteTodo"
      />
    </template>
  </a-list>
  <a-divider />
  <div class="planned-block ">
    <b>Completed</b>
    <a-button danger @click="clearAllTodos">Clear All</a-button>
  </div>
   <a-list item-layout="horizontal" :data-source="todosCompleted">
    <template #renderItem="{ item }">
      <TodoItem
        :key="item.id"
        :id="item.id"
        :description="item.description"
        :completed="item.completed"
        @toggle-todo="toggleTodo"
        @delete-todo="deleteTodo"
      />
    </template>
  </a-list>
</template>

<script setup>
import { computed, onMounted } from '@vue/runtime-core';
import { todoStore } from '@/store/todo.store';
import TodoItem from '@/components/todo-item.component';

const store = todoStore();
const todos = computed(() => store.todos.filter(todo => !todo.completed));
const todosCompleted = computed(() => store.todos.filter(todo => todo.completed));

function toggleTodo(todoID) {
  store.toggleTodo(todoID);
}

function completeAllTodos() {
  store.completeAll();
}

function deleteTodo(todoID) {
  store.removeTodo(todoID);
}

function clearAllTodos() {
  store.clearCompletedTodos();
}

onMounted(() => {
  store.getTodos();
});

</script>

<style>
  .planned-block, .completed-block {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
</style>