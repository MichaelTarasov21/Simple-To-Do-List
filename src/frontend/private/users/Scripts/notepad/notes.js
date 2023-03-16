import { erase } from "./erase.js";
import { getnotes } from "./getnotes.js";
import { insertForm } from "./insertForm.js";

getnotes();
document.getElementById("eraser").addEventListener("click", erase);
document.getElementById("addnote").addEventListener("click", insertForm);
