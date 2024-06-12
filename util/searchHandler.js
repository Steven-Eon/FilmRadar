const roomId = document.getElementById("room").textContent;
const userName = document.getElementById("userName").value;


const form = document.getElementById("messageForm");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = document.getElementById("message").value;
  const userName = document.getElementById("userName").value;
  console.log(roomId);
  fetch("/room/" + roomId + "/search", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message: message }),
  }).then((response) => {
    if (response.status === 200) {
      document.getElementById("message").value = "";
      // console.log(response.body)

      return response.json()
    }
  }).then((data) => {
    const parse = JSON.parse(data)
    const chatbox = document.getElementById("chatContent");
    chatbox.innerHTML = "";

    for (i of parse) {
      let html = `<div id=${i.messageId} class="messageBox"><div class="messageBoxName"><p>@${i.userName}</p><p class="time">${i.time}</p></div><div class="messageBoxContent"><p>${i.message}</p></div></div>`;
      chatbox.innerHTML = html + chatbox.innerHTML;

      console.log(i)
    }
  });
});


