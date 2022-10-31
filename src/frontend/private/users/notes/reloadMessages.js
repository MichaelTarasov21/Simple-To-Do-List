import { getnotes } from "./getnotes.js";

export function reloadMessages() {
	if (this.readyState == 4) {
		if (this.status == 200) {
			getnotes();
		} else {
			alert("An error has occured. Please try again later.");
		}
	}
}
