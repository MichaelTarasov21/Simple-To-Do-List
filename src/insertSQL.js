const mysql = require("mysql");

function insertSQL(table = String, columns = Array, values_to_insert = Array) {
	// Takes two arrays of strings as parameters and a string
	// Returns an SQL statement that will insert the values from the second array into the columns from the first
	// The table to use will be specified as a single string
	headings = "";
	values = "";

	if (columns.length !== values_to_insert.length) {
		console.log("The amount of values you are attempting to insert into MYSQL does not match the amount of columns you specified.");
		return;
	}

	columns.forEach(function (element) {
		headings = headings + element + ", ";
	});
	headings = headings.slice(0, -2); // Remove trailing comma and space

	values_to_insert.forEach(function (element) {
		values = values + mysql.escape(element) + ", ";
	});
	values = values.slice(0, -2); // Remove trailing comma and space

	const result = `INSERT INTO ${table}(${headings}) VALUES (${values})`;
	return result;
}

module.exports = insertSQL;
