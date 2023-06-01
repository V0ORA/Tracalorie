// Alert message timeout
function alertMessageTimeout() {
  setTimeout(() => {
    const alertMessage = document.getElementById("alert");
    alertMessage.classList.remove("hidden");
    setTimeout(() => {
      alertMessage.classList.add("hidden");
    }, 2000);
  }, 0);
}

// addEventListener functionality
function addEvent(id, type, cbFunction) {
  document.getElementById(id).addEventListener(type, cbFunction);
}

export { alertMessageTimeout, addEvent };
