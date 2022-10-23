import { getnotes } from "./getnotes.js";

export function reloadMessages() {
	if (this.readyState == 4 && this.status == 200) {
		const response = JSON.parse(this.responseText);
		if (response.status === "Success") {
			getnotes();
		} else {
			alert("An error has occured. Please try again later.");
		}
	}
}
