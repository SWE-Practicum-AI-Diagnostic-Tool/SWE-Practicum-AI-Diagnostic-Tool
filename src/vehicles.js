function isSameVehicle(veh1, veh2) {
  const fields = [];

  // Check for same keys
  const keys1 = Object.keys(veh1);
  const keys2 = Object.keys(veh2);

  if (keys1.length !== keys2.length || keys1.length === 0) return false;

  // Check for same values
  for (const key in veh1) {
    if (veh1[key] !== veh2[key]) {
      return false;
    }
  }

  return true;
}

// Add vehicle data to local storage
function addVehicle(vehicle) {
  const vehicles = getVehicles();
  vehicles.push(vehicle);

  // Remove duplicates based on all fields
  const uniqueVehicles = [];
  for (const veh of vehicles) {
    if (!uniqueVehicles.some(v => isSameVehicle(v, veh))) {
      uniqueVehicles.push(veh);
    }
  }

  localStorage.setItem("vehicles", JSON.stringify(uniqueVehicles));
}

function getVehicles() {
  return JSON.parse(localStorage.getItem("vehicles") || "[]");
}

export { addVehicle, getVehicles };