import { erase } from "./erase.js";
import { getnotes } from "./getnotes.js";
import { insertForm } from "./insertForm.js";
import { openSettings } from "./openSettings.js";

getnotes();
document.getElementById("eraser").addEventListener("click", erase);
document.getElementById("settingsicon").addEventListener("click", openSettings);
document.getElementById("addnote").addEventListener("click", insertForm);
