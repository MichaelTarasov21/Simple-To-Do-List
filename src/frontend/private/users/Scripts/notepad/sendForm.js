import { hideForm } from "./hideForm.js";
import { getnotes } from "./getnotes.js";

export async function sendForm() {
	const flag = document.getElementById("flag").value;
	const message = document.getElementById("message").value;
	const repetitions = document.getElementById("frequency").value;
	const starting = document.getElementById("startDate").value;
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
		if (timeReamining <= -86400000) {
			// 86400000 is the amount of milliseconds in a day
			alert("It seems your note has already expired. Please double check the date.");
			return;
		}
	}
	if (message === "") {
		alert("Message can not be blank");
		return;
	}

	await post("/users/notes", `method=addnote&flag=${flag}&message=${message}&repetitions=${repetitions}&starting=${starting}&expires=${expireyDate}`);

	getnotes();

	hideForm();
}
