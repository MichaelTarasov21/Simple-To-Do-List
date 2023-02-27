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

async function setEmail() {
	const email = document.getElementById("email").value;

	if ((/.+@.+\..+/.test(email) || email === "") && email.length < 255) {
		try {
			await post("/users/email", `email=${email}`);
			document.getElementById("email").setAttribute("value", email);
		} catch (err) {
			console.log(err);
			alert("An error has occured");
			window.location.reload(true); // Refresh the page to attempt recovery
		}
	} else {
		alert("Invalid email entered");
	}
	document.getElementById("email").setvalue = email;
}

async function setPassword() {
	const oldpassword = document.getElementById("oldPassword").value;
	const newpassword = document.getElementById("newPassword").value;

	const xhttp = new XMLHttpRequest();
	try {
		await post("/users/password", `oldpassword=${oldpassword}&newpassword=${newpassword}`);
	} catch (err) {
		console.log(err);
		switch (err.message) {
			case "400":
				alert("Your current password is incorrect");
				break;
			case "500":
				alert("An error has occured");
				window.location.reload(true); // Refresh the page to attempt recovery
		}
	}
}

async function deleteAccount() {
	const password = document.getElementById("oldPassword").value;

	try {
		await post("/users/delete", `password=${password}`);
		logout();
	} catch (err) {
		console.log(err);
		switch (err.message) {
			case "400":
				alert("Your current password is incorrect");
				abortDeletion();
				break;
			case "418":
				// Left behind in case an admin gets to this page. Admins should be routed to the admin panel
				alert("You are the last administrator. Make sure that there is at least one other admin account before deleting this one.");
				abortDeletion();
				break;
			case "500":
				alert("An error has occured");
				window.location.reload(true); // Refresh the page to attempt recovery
		}
	}
}

function closeSettings() {
	// Close the settings window and return to notes
	window.location.pathname = window.location.pathname + "/../";
}

function parseSettings() {
	const email = document.getElementById("email").value;
	const originalEmail = document.getElementById("email").getAttribute("value");
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
