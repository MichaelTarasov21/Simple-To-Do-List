function getnotes() {
	const xhttp = new XMLHttpRequest();

	xhttp.open("POST", "/notes", true); // Uses post to ensure a broswer sends the request and does not merely assume that it already has the results (code 304)
	xhttp.onreadystatechange = add_notes;
	xhttp.send(`method=getnotes`);
}
function add_notes() {
	if (this.readyState == 4 && this.status == 200) {
		const response = JSON.parse(this.responseText);
		if (response.status === "Success") {
		}
	}
}

getnotes();

function insertForm() {
	document.getElementById("newnote").innerHTML = `
		<span class="note">
			<datalist id="emotes">
				<option value="❗">❗</option>
				<option value="‼️">‼️</option>
				<option value="⚠️">⚠️</option>
			</datalist>
			<input type="text" id="flag" name="flag" label="flag" list="emotes" maxlength="1" onmouseover="focus()"> - 
			<input type="text" id="message" name="message" label="message" placeholder="Your note" maxlength="1000" required>
		</span>
		<div id="expireyLine" class="note">
			<span>
				Expires: <input type="checkbox" id="expires"></input>
			</span>
			<span id="dateInput">
				On: <input type="date" id="expireyDate"></input>
			</span>
		</div>
		<div id="actionButtons">
			<button id="addNewNote">Save</button>
			<button id="cancelNewNote">Cancel</button>
		</div>
	`;
	document.getElementById("expires").addEventListener("click", showDateInput);
	document.getElementById("cancelNewNote").addEventListener("click", hideForm);
	document.getElementById("addNewNote").addEventListener("click", sendForm);
}
function showDateInput() {
	const expires = document.getElementById("expires").checked;
	const dateInput = document.getElementById("dateInput");
	if (expires) {
		dateInput.style.visibility = "visible";
	} else {
		dateInput.style.visibility = "";
	}
}
function hideForm() {
	document.getElementById("newnote").innerHTML = `<button id="addnote" label="addnote">+</button> Add Note`;
	document.getElementById("addnote").addEventListener("click", insertForm);
}
function sendForm() {
	function reloadMessages() {
		if (this.readyState == 4 && this.status == 200) {
			//clear messages
			//load messages
			//yay
		}
	}

	const flag = document.getElementById("flag").value;
	const message = document.getElementById("message").value;
	const expires = document.getElementById("expires").checked;
	let expireyDate = null;
	if (expires) {
		expireyDate = document.getElementById("expireyDate").value;
		if (expireyDate === "") {
			alert("If the note expires. Then please provide a date on which it should expire");
			return;
		}
	}
	if (message === "") {
		alert("Message can not be blank");
		return;
	}

	const xhttp = new XMLHttpRequest();
	xhttp.open("POST", "/notes", true);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhttp.onreadystatechange = reloadMessages;
	xhttp.send(`method=addnote&flag=${flag}&message=${message}&expires=${expireyDate}`);

	hideForm();
}

document.getElementById("addnote").addEventListener("click", insertForm);
