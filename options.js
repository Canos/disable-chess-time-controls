// options.js
document.addEventListener("DOMContentLoaded", async () => {
    const stored = await chrome.storage.sync.get(["disabledTimes"]);
    const disabledTimes = stored.disabledTimes || [];
  
    // Marcar los checkboxes según la configuración guardada
    const checkboxes = document.querySelectorAll('input[name="times"]');
    checkboxes.forEach((cb) => {
      if (disabledTimes.includes(cb.value)) {
        cb.checked = true;
      }
    });
  });
  
  // Manejo del formulario
  document.getElementById("timeForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    
    // Obtenemos los valores marcados
    const checkboxes = document.querySelectorAll('input[name="times"]:checked');
    const timesSelected = [...checkboxes].map(cb => cb.value);
  
    // Guardamos en chrome.storage
    debugger;
    await chrome.storage.sync.set({ disabledTimes: timesSelected });
    document.getElementById("status").textContent = "Saved!";
  });
  