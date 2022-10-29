import GraphemeSplitter from "./grapheme-splitter.js";
import { hideForm } from "./hideForm.js";
import { reloadMessages } from "./reloadMessages.js";

export function insertForm() {
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

	function showRepetitions() {
		const repeats = document.getElementById("frequency").value;
		const repetition_input = document.getElementById("repetitionconfig");
		if (repeats) {
			repetition_input.style.visibility = "visible";
		} else {
			repetition_input.style.visibility = "";
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
		<span class="note hoverDisable">
			<datalist id="emotes">
				<option value="❗">❗</option>
				<option value="‼️">‼️</option>
				<option value="⚠️">⚠️</option>
			</datalist>
			<input type="text" id="flag" name="flag" label="flag" list="emotes"> -
			<input type="text" id="message" name="message" label="message" placeholder="Your note" maxlength="1000" required>
		</span>
		<div class="note hoverDisable optionLine">
			<span>
				Expires: <input type="checkbox" id="expires"></input>
			</span>
			<span id="dateInput"  class="option">
				On: <input type="date" id="expireyDate"></input>
			</span>
		</div>
		<div class="note hoverDisable optionLine">
			<span>
			Repeats:
			<select id="frequency">
			<option value="">Never</option>
			<option value="1">Daily</option>
			<option value="2">Weekly</option>
			<option value="3">Monthly</option>
			<option value="4">Yearly</option>
			</select>
			</span>
			<span id="repetitionconfig" class="option">
				Staring: <input type="date" id="startDate"></input>
			</span>
		</div>
		<div id="actionButtons">
			<button id="addNewNote">Save</button>
			<button id="cancelNewNote">Cancel</button>
		</div>
	`;
	document.getElementById("flag").addEventListener("input", lengthLimit);
	document.getElementById("expires").addEventListener("click", showDateInput);
	document.getElementById("frequency").addEventListener("change", showRepetitions);
	document.getElementById("cancelNewNote").addEventListener("click", hideForm);
	document.getElementById("addNewNote").addEventListener("click", sendForm);
}

