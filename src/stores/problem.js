import { defineStore } from 'pinia'

export const useProblemStore = defineStore('problem', {
  state: () => ({
    problemDescription: '',
  }),
  actions: {
    setProblemDescription(description) {
      this.problemDescription = description
    }
  }
})