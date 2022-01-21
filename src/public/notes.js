function getnotes() {
	const xhttp = new XMLHttpRequest();

	xhttp.open("POST", "/notes", true); // Uses post to ensure a broswer sends the request and does not merely assume that it already has the results (code 304)
	xhttp.onreadystatechange = add_notes;
	xhttp.send();
}
function add_notes() {
	if (this.readyState == 4 && this.status == 200) {
		const response = JSON.parse(this.responseText);
		if (response.status === "Success"){
			alert("Your notes have been found. In the next update they will be displayed")
		} else if (response.status === "Invalid Cookie"){
			alert("Your session has expired")
			window.location.replace(window.location.href.replace("notes.html", "")) // Redirect to login page
		} else {
			alert("An error has occured")
			window.location.replace(window.location.href.replace("notes.html", "")) // Redirect to login page
		}
	}
}

getnotes();
