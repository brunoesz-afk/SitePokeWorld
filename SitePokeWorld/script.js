const downloadButton = document.querySelector("#download-button");
const downloadLabel = document.querySelector(".download-label");
const downloadStatus = document.querySelector("#download-status");
const fileState = document.querySelector("#file-state");
const latestReleaseUrl = "https://api.github.com/repos/brunoesz-afk/SitePokeWorld/releases/latest";
const latestReleasePage = "https://github.com/brunoesz-afk/SitePokeWorld/releases/latest";
const releaseVersion = document.querySelector("#release-version");
const releaseDate = document.querySelector("#release-date");
const releaseNotes = document.querySelector("#release-notes");
const releasePageLink = document.querySelector("#release-page-link");

downloadButton.addEventListener("click", (event) => {
  if (downloadButton.getAttribute("aria-disabled") === "true") event.preventDefault();
});

async function checkApk() {
  let release;

  try {
    const response = await fetch(latestReleaseUrl, {
      headers: { Accept: "application/vnd.github+json" },
      cache: "no-store",
    });
    if (!response.ok) throw new Error("No published release");

    release = await response.json();
  } catch {
    releaseVersion.textContent = "Indisponível";
    releaseDate.textContent = "—";
    releaseNotes.textContent = "Não foi possível carregar os dados da atualização. Consulte a página de releases do projeto.";
    releasePageLink.href = latestReleasePage;
    downloadButton.classList.add("is-unavailable");
    downloadButton.setAttribute("aria-disabled", "true");
    downloadLabel.textContent = "APK indisponível";
    downloadStatus.textContent = "Não foi possível verificar o APK. Consulte as releases do projeto.";
    fileState.textContent = "Não foi possível verificar";
    return;
  }

  const apk =
    release.assets.find((asset) => asset.name === "PokeWorld.apk") ??
    release.assets.find((asset) => /\.apk$/i.test(asset.name));
  const publishedAt = release.published_at ?? release.created_at;

  releaseVersion.textContent = release.tag_name || "Não informada";
  releasePageLink.href = release.html_url || latestReleasePage;

  if (publishedAt) {
    const date = new Date(publishedAt);
    if (!Number.isNaN(date.getTime())) {
      releaseDate.dateTime = date.toISOString();
      releaseDate.textContent = new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }).format(date);
    }
  }

  releaseNotes.textContent =
    release.body?.trim() || "Esta versão ainda não tem notas de atualização publicadas.";

  if (!apk) {
    downloadButton.classList.add("is-unavailable");
    downloadButton.setAttribute("aria-disabled", "true");
    downloadLabel.textContent = "APK indisponível";
    downloadStatus.textContent = "A release mais recente não contém um APK.";
    fileState.textContent = "APK não encontrado";
    return;
  }

  downloadButton.href = apk.browser_download_url;
  downloadButton.removeAttribute("download");
  downloadButton.classList.remove("is-unavailable");
  downloadButton.setAttribute("aria-disabled", "false");
  downloadLabel.textContent = "Baixar APK";
  downloadStatus.textContent = "Download disponível para Android.";
  fileState.textContent = "Disponível para baixar";
}

checkApk();