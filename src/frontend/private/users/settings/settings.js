function logout() {
	const xhttp = new XMLHttpRequest();

	xhttp.open("GET", "/logout", true);
	xhttp.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			window.location.reload(true); // Refresh the page to complete logout
		} else if (this.readyState == 4 && this.status == 500) {
			alert("An error has occured");
			window.location.reload(true); // Refresh the page to attempt recovery
		}
	};
	xhttp.send();
}

function setEmail() {
	const email = document.getElementById("email").value;

	if (/.+@.+\..+/.test(email) && email.length < 255) {
		const xhttp = new XMLHttpRequest();

		xhttp.open("POST", "/users/email", true);
		xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

		xhttp.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				console.log("Set");
			} else if (this.readyState == 4 && this.status == 500) {
				alert("An error has occured");
				window.location.reload(true); // Refresh the page to attempt recovery
			}
		};
		xhttp.send(`email=${email}`);
	} else {
		alert("Invalid email entered");
	}
}

function closeSettings() {
	// Close the settings window and return to notes
	window.location.pathname = window.location.pathname + "../";
}

function parseSettings() {
	const email = document.getElementById("email");

	if (email) {
		setEmail();
	}
}

document.getElementById("logout").addEventListener("click", logout);
document.getElementById("close").addEventListener("click", closeSettings);
document.getElementById("update").addEventListener("click", parseSettings);
