import GraphemeSplitter from "./grapheme-splitter.js";

function clearnotepad() {
	//Resets the note pad back to an empty state
	const page = document.getElementById("page");
	page.innerHTML = `
		<span id="newnote"><button id="addnote" label="addnote">+</button> Add Note</span>
	`;
	document.getElementById("addnote").addEventListener("click", insertForm);
}

function reloadMessages() {
	if (this.readyState == 4 && this.status == 200) {
		const response = JSON.parse(this.responseText);
		if (response.status === "Success") {
			getnotes();
		} else {
			alert("An error has occured. Please try again later.");
		}
	}
}

function getnotes() {
	const xhttp = new XMLHttpRequest();

	xhttp.open("POST", "/notes", true); // Uses post to ensure a broswer sends the request and does not merely assume that it already has the results (code 304)
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhttp.onreadystatechange = add_notes;
	xhttp.send(`method=getnotes`);
}

function completeNote(event) {
	const noteid = event.target.getAttribute("noteid");

	const xhttp = new XMLHttpRequest();

	xhttp.open("POST", "/notes", true);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhttp.onreadystatechange = reloadMessages;
	xhttp.send(`method=completenote&note=${parseInt(noteid)}`);
}
function uncompleteNote(event) {
	const noteid = event.target.getAttribute("noteid");

	const xhttp = new XMLHttpRequest();

	xhttp.open("POST", "/notes", true);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhttp.onreadystatechange = reloadMessages;
	xhttp.send(`method=uncompletenote&note=${parseInt(noteid)}`);
}

function add_notes() {
	function insertNote(note, index) {
		// Insert a note div then fill in the content. This is to prevent javascript injection into the webpage.
		// The risk here is low since injecting the webpage requires one to have stored a note as the user in the past. However, the solution is not difficult to implement.
		if (index === 0) {
			// If the note is the last one. Insert some padding between notes and the new note form.
			document.getElementById("page").insertAdjacentHTML("afterbegin", `<br /><br />`);
		}
		document.getElementById("page").insertAdjacentHTML("afterbegin", `<div class="note" noteID="${note.noteid}"></div>`);
		const container = document.getElementsByClassName("note")[0];
		container.innerText = note.message;
		if (note.flag) {
			container.innerText = `${note.flag} - ${container.innerText}`;
		}
		if (note.completed) {
			container.classList.add("completed");
			container.addEventListener("click", uncompleteNote);
		} else {
			container.addEventListener("click", completeNote);
		}
	}
	if (this.readyState == 4 && this.status == 200) {
		const response = JSON.parse(this.responseText);
		if (response.status === "Success") {
			clearnotepad();
			const notes = response.notes.reverse();
			notes.forEach(insertNote);
		} else {
			alert("An error has occured. Please try again later.");
		}
	}
}

function insertForm() {
	function lengthLimit() {
		// Only allows a single charachter into the flag box. Splits charachters into graphemes to support combined emojis.
		const splitter = new GraphemeSplitter();
		const flag = document.getElementById("flag");
		const splitvalue = splitter.splitGraphemes(flag.value); // Create an array out of the charachters in the flag box.
		flag.value = splitvalue[0];
		if (flag.value === "undefined") {
			// If the input is an unkown charachter (such as a backspace) clear the field.
			flag.value = "";
		}
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

	function sendForm() {
		const flag = document.getElementById("flag").value;
		const message = document.getElementById("message").value;
		const expires = document.getElementById("expires").checked;
		let expireyDate = "";
		if (expires) {
			expireyDate = document.getElementById("expireyDate").value;
			if (expireyDate === "") {
				alert("If the note expires. Then please provide a date on which it should expire");
				return;
			}
			const today = new Date();
			const expiresOn = new Date(expireyDate);
			const timeReamining = expiresOn - today;
			if (timeReamining < 0) {
				alert("It seems your note has already expired. Please double check the date.");
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
	document.getElementById("newnote").innerHTML = `
		<span class="note">
			<datalist id="emotes">
				<option value="❗">❗</option>
				<option value="‼️">‼️</option>
				<option value="⚠️">⚠️</option>
			</datalist>
			<input type="text" id="flag" name="flag" label="flag" list="emotes"> -
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
	document.getElementById("flag").addEventListener("input", lengthLimit);
	document.getElementById("expires").addEventListener("click", showDateInput);
	document.getElementById("cancelNewNote").addEventListener("click", hideForm);
	document.getElementById("addNewNote").addEventListener("click", sendForm);
}

function hideForm() {
	document.getElementById("newnote").innerHTML = `<button id="addnote" label="addnote">+</button> Add Note`;
	document.getElementById("addnote").addEventListener("click", insertForm);
}

getnotes();
