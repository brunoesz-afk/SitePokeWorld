const downloadButton = document.querySelector("#download-button");
const downloadLabel = document.querySelector(".download-label");
const downloadStatus = document.querySelector("#download-status");
const fileState = document.querySelector("#file-state");
const latestReleaseUrl = "https://api.github.com/repos/brunoesz-afk/SitePokeWorld/releases/latest";

downloadButton.addEventListener("click", (event) => {
  if (downloadButton.getAttribute("aria-disabled") === "true") event.preventDefault();
});

async function checkApk() {
  if (window.location.protocol === "file:") {
    downloadButton.classList.remove("is-unavailable");
    downloadButton.setAttribute("aria-disabled", "false");
    downloadLabel.textContent = "Baixar APK";
    downloadStatus.textContent = "Download disponível para Android.";
    fileState.textContent = "Disponível para baixar";
    return;
  }

  try {
    const response = await fetch(latestReleaseUrl, {
      headers: { Accept: "application/vnd.github+json" },
      cache: "no-store",
    });
    if (!response.ok) throw new Error("No published release");

    const release = await response.json();
    const apk = release.assets.find((asset) => asset.name === "PokeWorld.apk");
    if (!apk) throw new Error("APK not found in latest release");

    downloadButton.href = apk.browser_download_url;
    downloadButton.removeAttribute("download");
    downloadButton.classList.remove("is-unavailable");
    downloadButton.setAttribute("aria-disabled", "false");
    downloadLabel.textContent = "Baixar APK";
    downloadStatus.textContent = "Download disponível para Android.";
    fileState.textContent = "Disponível para baixar";
  } catch {
    downloadButton.classList.add("is-unavailable");
    downloadButton.setAttribute("aria-disabled", "true");
    downloadLabel.textContent = "APK em breve";
    downloadStatus.textContent = "O arquivo de instalação ainda não está disponível.";
    fileState.textContent = "Ainda não publicado";
  }
}

checkApk();