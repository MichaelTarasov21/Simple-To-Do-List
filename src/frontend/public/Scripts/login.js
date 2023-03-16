// post function defined in publicly hosted folder /Scripts and imported through html
let form_sent = false;

async function login() {
	if (form_sent) {
		return;
	}
	form_sent = true;
	const username = document.getElementById("username").value;
	const password = document.getElementById("password").value;
	try {
		response = await post("/login", `username=${username}&password=${password}`);
	} catch {
		failedLogin();
	}
	if (response.status === "Success") {
		window.location.pathname = window.location.pathname + "/../"; // Redirects while keeping hidden path hidden
	} else {
		failedLogin();
	}
}
function failedLogin() {
	form_sent = false;
	const loginBox = document.getElementById("failed_login");
	loginBox.style.animation = "none";
	loginBox.style.display = "block";
	loginBox.offsetHeight;
	loginBox.style.animation = "";
}

document.getElementById("login").addEventListener("click", login);
document.getElementById("password").addEventListener("keydown", function (event) {
	//If key pressed is enter, send the login form
	if (event.key === "Enter") {
		login();
	}
});
