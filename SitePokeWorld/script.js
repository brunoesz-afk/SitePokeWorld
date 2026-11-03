const downloadButton = document.querySelector("#download-button");
const downloadLabel = document.querySelector(".download-label");
const downloadStatus = document.querySelector("#download-status");
const fileState = document.querySelector("#file-state");

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
    const response = await fetch("PokeWorld.apk", { method: "HEAD", cache: "no-store" });
    if (!response.ok) throw new Error("APK not found");

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