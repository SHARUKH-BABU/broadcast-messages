const socket = io();

document.addEventListener("DOMContentLoaded", () => {
  let inputMsg = document.getElementById("input-msg");
  let chatMessages = document.querySelector(".chat-messages");
  let sendBtn = document.getElementById("sendBtn");

  const name = prompt("Enter your name: ");

  sendBtn.addEventListener("click", function () {
    let msg = inputMsg.value.trim();
    if (msg !== "") {
      let currentTime = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      let message = document.createElement("div");
      message.classList.add("message", "my-msg");
      message.innerHTML = `
                <img src="https://randomuser.me/api/portraits/men/1.jpg" alt="User Avatar" class="message-avatar">
                <div class="message-bubble">${msg} <span class="message-time">${currentTime}</span></div>
            `;
      chatMessages.appendChild(message);

      socket.emit("user-msg", { name, msg, time: currentTime });

      inputMsg.value = "";
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  });

  socket.on("sendAll", ({ name, msg, time }) => {
    let message = document.createElement("div");
    message.classList.add("message");
    message.innerHTML = `
            <img src="https://randomuser.me/api/portraits/men/1.jpg" alt="User Avatar" class="message-avatar">
            <div class="message-bubble"><strong>${name}:</strong> ${msg} <span class="message-time">${time}</span></div>
        `;
    chatMessages.appendChild(message);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  });

  socket.on("user-join", ({ name, msg }) => {
    let message = document.createElement("div");
    message.classList.add("message");
    message.innerHTML = `
            <div class="message-bubble text-center text-gray-500"><em>${msg}</em></div>
        `;
    chatMessages.appendChild(message);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  });

  socket.on("online-count", (count) => {
    let onlineCountElement = document.querySelector(".online-count");
    if (onlineCountElement) {
      onlineCountElement.textContent = `Online: ${count}`;
    }
  });
});
