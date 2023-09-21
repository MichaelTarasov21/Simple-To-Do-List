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

document.getElementById("general_settings").addEventListener("click", function () {
	window.location.pathname = "/admin/general";
});
