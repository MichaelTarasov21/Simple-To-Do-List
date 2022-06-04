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

	if ((/.+@.+\..+/.test(email) || email === "") && email.length < 255) {
		const xhttp = new XMLHttpRequest();

		xhttp.open("POST", "/users/email", true);
		xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

		xhttp.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				document.getElementById("email").setvalue = email;
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

function setPassword() {
	const oldpassword = document.getElementById("oldPassword").value;
	const newpassword = document.getElementById("newPassword").value;

	const xhttp = new XMLHttpRequest();

	xhttp.open("POST", "/users/password", true);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

	xhttp.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			console.log("Set");
		} else if (this.readyState == 4 && this.status == 500) {
			alert("An error has occured");
			window.location.reload(true); // Refresh the page to attempt recovery
		} else if (this.readyState == 4 && this.status == 400) {
			alert("Your current password is incorrect");
		}
	};
	xhttp.send(`oldpassword=${oldpassword}&newpassword=${newpassword}`);
}

function deleteAccount() {
	const password = document.getElementById("oldPassword").value;

	const xhttp = new XMLHttpRequest();

	xhttp.open("POST", "/users/delete", true);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhttp.onreadystatechange = function () {
		if (this.readyState == 4)
			switch (this.status) {
				case 400:
					alert("Your current password is incorrect");
					abortDeletion();
					break;
				case 418:
					alert("You are the last administrator. Make sure that there is at least one other admin account before deleting this one.");
					abortDeletion();
					break;
				case 500:
					alert("An error has occured");
				default:
					window.location.reload(true); // Refresh the page to attempt recovery or complete deletion
			}
	};

	xhttp.send(`password=${password}`);
}

function closeSettings() {
	// Close the settings window and return to notes
	window.location.pathname = window.location.pathname + "../";
}

function parseSettings() {
	const email = document.getElementById("email").value;
	const originalEmail = document.getElementById("email").setvalue;
	const oldpassword = document.getElementById("oldPassword").value;
	const newpassword = document.getElementById("newPassword").value;

	if (email !== originalEmail) {
		setEmail();
	}

	if (oldpassword && newpassword) {
		setPassword();
	} else if (oldpassword || newpassword) {
		alert("You must provide both an old password and a new password in order to update your password");
	}
}

function confirmDeletion() {
	const oldpassword = document.getElementById("oldPassword").value;

	if (oldpassword === "") {
		alert("Please enter your password in order to delete your account");
		return;
	} else {
		document.getElementById("confirmation").style.display = "block";
	}
}

document.getElementById("logout").addEventListener("click", logout);
document.getElementById("close").addEventListener("click", closeSettings);
document.getElementById("update").addEventListener("click", parseSettings);
document.getElementById("delete").addEventListener("click", confirmDeletion);

// Clear confirmation on page load
document.getElementById("acknowledgement").value = "";

function checkConfirmation() {
	// Check if the text inside of the acknowledgement box is a predefined value
	// Unlock the confirmation button only if text matches preset value
	const text = document.getElementById("acknowledgement").value;

	if (text === "Delete My Account") {
		document.getElementById("confirm").style.visibility = "visible";
	} else {
		document.getElementById("confirm").style.visibility = "hidden";
	}
}

function abortDeletion() {
	document.getElementById("confirmation").style.display = "";
}

document.getElementById("acknowledgement").addEventListener("input", checkConfirmation);
document.getElementById("cancelDeletion").addEventListener("click", abortDeletion);
document.getElementById("confirm").addEventListener("click", deleteAccount);

function getEmail() {
	// Get the email value already on file for this account
	const xhttp = new XMLHttpRequest();

	xhttp.open("GET", "/users/email", true);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

	xhttp.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			// Set the email field value to the email on file for a user account
			const response = JSON.parse(this.responseText);
			document.getElementById("email").value = response[0].email;
			document.getElementById("email").setvalue = response[0].email;
		} else if (this.readyState == 4 && this.status == 500) {
			alert("An error has occured");
			window.location.reload(true); // Refresh the page to attempt recovery
		}
	};
	xhttp.send();
}

getEmail();
