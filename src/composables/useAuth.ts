// src/composables/useAuth.ts
import { computed } from 'vue';
import authService from '../services/authService';

export function useAuth() {
  const isAuthenticated = computed(() => authService.isAuthenticated());
  const currentUser = computed(() => authService.getUser());
  const isAdmin = computed(() => authService.isAdmin());

  return {
    isAuthenticated,
    currentUser,
    isAdmin
  };
}