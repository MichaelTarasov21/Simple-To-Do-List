let form_sent = false;
function login() {
	if (form_sent) {
		return;
	}
	form_sent = true;
	const username = document.getElementById("username").value;
	const password = document.getElementById("password").value;

	const xhttp = new XMLHttpRequest();

	xhttp.open("POST", "/login", true);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhttp.onreadystatechange = process_result;
	xhttp.send(`username=${username}&password=${password}`);
}
function process_result() {
	if (this.readyState == 4 && this.status == 200) {
		const response = JSON.parse(this.responseText);
		if (response.status === "Success") {
			window.location.replace(window.location.href + "notes.html");
		} else {
			failedLogin();
		}
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
