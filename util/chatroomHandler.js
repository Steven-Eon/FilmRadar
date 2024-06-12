const roomId = document.getElementById("room").textContent;
const userName = document.getElementById("userName").value;


const form = document.getElementById("messageForm");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = document.getElementById("message").value;
  const userName = document.getElementById("userName").value;
  console.log(roomId);
  fetch("/room/" + roomId, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userName: userName, message: message }),
  }).then((response) => {
    if (response.status === 200) {
      document.getElementById("message").value = "";
    }
  });
});

function handle(e) {
  console.log(e)
  let text = e.target.parentElement.parentElement.parentElement.children[1].children[0].textContent
  let messageId = e.target.parentElement.parentElement.parentElement.id
  let updatedMessage = prompt(`Editing message, please edit here.`, text);

  const data = {message: updatedMessage, messageId: messageId};
  const putRequest = {
    method: 'PUT',
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(data)
  }
  
  fetch(window.location.href, putRequest)
}


let refresh = setInterval(async () => {
  try {
    const res = await fetch(`http://127.0.0.1:8080/room/${roomId}/messages`);
    if (res.ok) {
      const chatbox = document.getElementById("chatContent");
      chatbox.innerHTML = "";
      const data = await res.json();
      for (let i of data) {
        let html = (i.userName == userName) ? `<div id=${i.messageId} class="editable messageBox"><div class="messageBoxName"><p>@${i.userName}</p><div class="flex flex-row"><p class="time">${i.time}</p><button class="ml-4" onClick="handle(event)">✎</p></div></div><div class="messageBoxContent"><p>${i.message}</p></div></div>` : `<div id=${i.messageId} class="messageBox"><div class="messageBoxName"><p>@${i.userName}</p><p class="time">${i.time}</p></div><div class="messageBoxContent"><p>${i.message}</p></div></div>`;
        chatbox.innerHTML = html + chatbox.innerHTML;
      }
    }
    return;
  } catch (e) {
    console.log(e);
  }
}, 3000);

