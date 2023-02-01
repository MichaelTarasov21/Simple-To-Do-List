export function post(path = String, data = String) {
	// Sends a post request to the specified path containg specified data
	// Returns a promise that resolves to the return message when a message is received
	return new Promise(function (resolve) {
		function checkReply() {
			if (this.readyState == 4) {
				if (this.status == 200) {
					let response;
					if (this.responseText.length > 0) {
						response = JSON.parse(this.responseText);
					}
					resolve(response);
				} else {
					// Pass to error handler
					alert("An error has occured. Please try again later.");
					location.reload();
				}
			}
		}

		const xhttp = new XMLHttpRequest();
		xhttp.open("POST", path, true);
		xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xhttp.onreadystatechange = checkReply;
		xhttp.send(data);
	});
}
