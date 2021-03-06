import supFetch from "../../../SupClient/src/fetch";

let electron: GitHubElectron.Electron = nodeRequire("electron");

/* tslint:disable */
// Must use require rather than fs so that it gets browserified
let packageInfo = require("../../../package.json");
/* tslint:enable */

let splash = <HTMLDivElement>document.querySelector(".splash");

splash.addEventListener("click", (event) => {
  if ((<Element>event.target).tagName === "A") {
    event.preventDefault();
    electron.shell.openExternal((<HTMLAnchorElement>event.target).href);
    return;
  }

  if (event.target !== splash) return;
  splash.parentElement.removeChild(splash);
});

// Check for new releases
document.querySelector(".splash .version").textContent = `v${packageInfo.version}`;
let updateStatus = <HTMLDivElement>document.querySelector(".splash .update-status");

supFetch("https://api.github.com/repos/superpowers/superpowers/releases/latest", "json", (err, lastRelease) => {
  if (err != null) {
    updateStatus.textContent = "Failed to check for updates.";
    return;
  }

  let lastVersion = lastRelease.tag_name;
  if (lastVersion === `v${packageInfo.version}`) updateStatus.textContent = "";
  else {
    updateStatus.innerHTML = `UPDATE: ${lastVersion} is available. ` +
    `<a href="http://superpowers-html5.com/" target="_blank">Download it now</a>.`;
  }
});
