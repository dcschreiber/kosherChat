document.addEventListener('DOMContentLoaded', function() {
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');
    const resultDisplay = document.getElementById('result-display'); // Add this line to get the result display element

    sendButton.addEventListener('click', function() {
        const message = messageInput.value.trim();

        if (message.length < 3) {
            alert('Message must be at least 3 characters long.');
            return;
        }

        fetch('/new-message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: message })
        })
            .then(response => {
                if (response.ok) {
                    return response.text();
                } else {
                    throw new Error('Network response was not ok.');
                }
            })
            .then(data => {
                console.log('Success:', data);
                messageInput.value = '';
                resultDisplay.textContent = data;
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    });
});
