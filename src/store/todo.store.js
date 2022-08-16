import { defineStore } from 'pinia';
import { message } from 'ant-design-vue';
import apiClient from '@/api/api.client';
import { Todo } from '@/store/entities';

export const todoStore = defineStore('todos', {
  state: () => ({ todos: [], }),
  actions: {
    async getTodos() {
      const response = await apiClient.get('/todos');
      this.todos = response.data.map(todo => new Todo(todo));
    },
    async addTodo (description) {
      if (!description || !description.length) {
        message.error("Todo can't be empty!!!");
        return;
      }
      const response = await apiClient.post('/todos', new Todo({ description }));
      this.todos = [...this.todos, new Todo(response.data)];
    },
    async removeTodo(todoID) {
      await apiClient.delete(`/todos/${todoID}`);
      await this.getTodos();
      message.success("Todo removed!");
    },
    async toggleTodo(todoID) {
      const todo = this.todos.find((todo) => todo.id === todoID);
  
      if (todo) {
        const response = await apiClient.put(`/todos/${todo.id}`, {
          ...todo,
          completed: !todo.completed,
        })
        const updatedTodos = this.todos.map(todo => {
          if (todo.id === todoID) {
            return new Todo(response.data);
          }
  
          return new Todo(todo);
        })
        this.todos = updatedTodos;
      }
    },
    async completeAll() {
      const updatedTodosRequests = this.todos.filter(todo => !todo.completed)
        .map(todo => apiClient.put(`/todos/${todo.id}`, new Todo({
          ...todo,
          completed: true,
        })));
  
      await Promise.all(updatedTodosRequests);
      this.getTodos();
      message.success("All todos completed!");
    },
    async clearCompletedTodos() {
      const toRemoveRequests = this.todos.filter(todo => todo.completed)
        .map((todo) => apiClient.delete(`/todos/${todo.id}`));
  
      await Promise.all(toRemoveRequests);
      this.todos = this.todos.filter(todo => !todo.completed)
      message.success("All todos removed!");
    }
  },
})