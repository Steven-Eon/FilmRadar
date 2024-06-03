const userName = prompt('Enter your name: ');
document.getElementById('userName').value = userName;

const form = document.getElementById('messageForm');
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = document.getElementById('message').value;
    const userName = document.getElementById('userName').value;
    const roomId = document.getElementById('room').textContent;
    console.log(roomId)
    fetch('/room/' + roomId + "/", {
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


