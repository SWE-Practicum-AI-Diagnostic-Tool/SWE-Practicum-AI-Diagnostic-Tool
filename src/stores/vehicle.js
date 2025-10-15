import { defineStore } from 'pinia';

export const useVehicleStore = defineStore('vehicle', {
  state: () => ({
    year: '',
    make: '',
    model: '',
    trim: ''
  }),
  actions: {
    setVehicle({ year, make, model, trim }) {
      this.year = year;
      this.make = make;
      this.model = model;
      this.trim = trim;
    },
    clearVehicle() {
      this.year = '';
      this.make = '';
      this.model = '';
      this.trim = '';
    }
  }
});
