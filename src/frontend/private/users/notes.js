function getnotes() {
	const xhttp = new XMLHttpRequest();

	xhttp.open("POST", "/notes", true); // Uses post to ensure a broswer sends the request and does not merely assume that it already has the results (code 304)
	xhttp.onreadystatechange = add_notes;
	xhttp.send();
}
function add_notes() {
	if (this.readyState == 4 && this.status == 200) {
		const response = JSON.parse(this.responseText);
		if (response.status === "Success") {
			alert("Your notes have been found. In the next update they will be displayed");
		}
	}
}

getnotes();