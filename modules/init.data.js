// Initialize hospital data - must complete before other modules use it
export const dataInitialized = fetch("../../Data/data.json")
  .then(res => res.json())
  .then(data => {
    // Save complete hospital data
    if (!localStorage.getItem("hospitalDB")) {
      localStorage.setItem("hospitalDB", JSON.stringify(data));
    }
    
    // Save doctors and patients separately for authentication
    if (!localStorage.getItem("doctors")) {
      localStorage.setItem("doctors", JSON.stringify(data.doctors || []));
    }
    if (!localStorage.getItem("patients")) {
      localStorage.setItem("patients", JSON.stringify(data.patients || []));
    }
    
    return data;
  })
  .catch(err => {
    console.error("Failed to load hospital data:", err);
    return null;
  });