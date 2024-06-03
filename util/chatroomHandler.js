const userName = prompt('Enter your name: ');
document.getElementById('userName').value = userName;
const roomId = document.getElementById('room').textContent;

const form = document.getElementById('messageForm');
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = document.getElementById('message').value;
    const userName = document.getElementById('userName').value;
    console.log(roomId)
    fetch('/room/' + roomId, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({userName: userName, message: message})
    })
        .then((response) => {
            if (response.status === 200) {
                document.getElementById('message').value = '';
            }
        })
})

let refresh = setInterval(async () => {
    try {
        const res = await fetch(`http://localhost:8080/room/${roomId}/messages`)
        if (res.ok)
        {
            const chatbox = document.getElementById("chatContent")
            chatbox.innerHTML = ''
            const data = await res.json()
            for (let i of data)
            {
                let html = `<div class="messageBox"><div class="messageBoxName"><p>@${i.userName}</p><p class="time">${i.time}</p></div><div class="messageBoxContent"><p>${i.message}</p></div></div>`
                chatbox.innerHTML = html + chatbox.innerHTML
            }
        }
        return;
    }
    catch (e) {
        console.log(e);
    }
}, 3000)

