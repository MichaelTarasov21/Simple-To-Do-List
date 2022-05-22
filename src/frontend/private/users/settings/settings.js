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

document.getElementById("logout").addEventListener("click", logout);
document.getElementById("close").addEventListener("click", function () {
	// Close the settings window and return to notes
	window.location.pathname = window.location.pathname + "../";
});
