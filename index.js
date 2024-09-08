document.addEventListener("DOMContentLoaded", () => {
    const userName = document.getElementById("inputUserName");
    const passWord = document.getElementById("inputPassWord");
    const enterButton = document.getElementById("loginButton");

    function keyPressEnter(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            authentication();
        }
    }

    enterButton.addEventListener("click", authentication);
    if (userName) userName.addEventListener("keydown", keyPressEnter);
    if (passWord) passWord.addEventListener("keydown", keyPressEnter);

    function authentication() {
        const getValueUserName = userName.value.trim();
        const getValuePassWord = passWord.value.trim();

        fetch('http://localhost:3000/login', { // Ensure the protocol (http/https) and port are correct
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: getValueUserName,
                password: getValuePassWord
            })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                alert("Login successful");
                userName.value = "";
                passWord.value = "";
                window.location.href = "drrtForm.html";
            })
            .catch(error => {
                console.error('Error:', error);
                userName.value = "";
                passWord.value = "";
                alert("Wrong credentials");
            });
    }
});
