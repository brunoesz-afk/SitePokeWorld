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

const supabaseUrl = "https://bfgfpsymzycdjzgkhaqx.supabase.co";
const supabaseAnonKey = "sb_publishable_pW7f4bvF_EVMAMg0-eRjgw_4fHigyUt";
const authForm = document.querySelector("#auth-form");
const authTitle = document.querySelector("#auth-title");
const authSubmit = document.querySelector("#auth-submit");
const authModeToggle = document.querySelector("#auth-mode-toggle");
const authView = document.querySelector("#auth-view");
const playerView = document.querySelector("#player-view");
const accountEmail = document.querySelector("#account-email");
const accountStatus = document.querySelector("#account-status");
const playerForm = document.querySelector("#player-form");
const saveProfileButton = document.querySelector("#save-profile-button");
const partyGrid = document.querySelector("#party-grid");
const gameSyncStatus = document.querySelector("#game-sync-status");
const displayRegion = document.querySelector("#display-region");
const displayLevel = document.querySelector("#display-level");
const displayExperience = document.querySelector("#display-experience");
const progressSummary = document.querySelector("#progress-summary");
const badgeList = document.querySelector("#badge-list");
const signOutButton = document.querySelector("#sign-out-button");
let supabase;
let isSignUp = false;
let activeUser;

function setAccountStatus(message, isError = false) {
  accountStatus.textContent = message;
  accountStatus.classList.toggle("is-error", isError);
}

function setProfileLocked(locked) {
  playerForm.querySelectorAll("input, select").forEach((field) => {
    field.disabled = locked;
  });
  saveProfileButton.disabled = locked;
  saveProfileButton.textContent = locked ? "Personagem salvo" : "Salvar personagem";
  playerForm.classList.toggle("is-locked", locked);
}

function renderParty(party) {
  partyGrid.replaceChildren();
  const partyBySlot = new Map(party.map((pokemon) => [pokemon.slot, pokemon]));
  for (let slot = 1; slot <= 6; slot += 1) {
    const card = document.createElement("div");
    card.className = "party-slot";
    const pokemon = partyBySlot.get(slot);
    if (!pokemon) card.classList.add("is-empty");

    const title = document.createElement("h4");
    title.textContent = `SLOT ${String(slot).padStart(2, "0")}`;

    const name = document.createElement("p");
    name.textContent = pokemon?.nickname || pokemon?.pokemon_name || "Aguardando integração";

    const details = document.createElement("span");
    details.textContent = pokemon ? `Nível ${pokemon.pokemon_level ?? "—"}` : "Sem Pokémon sincronizado";

    card.append(title, name, details);
    partyGrid.append(card);
  }
}

function renderBadges(badges) {
  badgeList.replaceChildren();
  if (!Array.isArray(badges) || badges.length === 0) {
    const empty = document.createElement("span");
    empty.className = "badge-empty";
    empty.textContent = "Nenhuma insígnia sincronizada";
    badgeList.append(empty);
    return;
  }

  for (const badge of badges) {
    const item = document.createElement("span");
    item.className = "badge-chip";
    item.textContent = badge;
    badgeList.append(item);
  }
}

function populatePlayerForm(profile, party) {
  playerForm.elements.player_name.value = profile?.player_name ?? "";
  playerForm.elements.gender.value = profile?.gender ?? "";
  playerForm.elements.region.value = profile?.region ?? "Kanto";
  setProfileLocked(Boolean(profile?.player_name && profile?.gender && profile?.region));

  const hasGameSync = Boolean(profile?.last_game_sync_at);
  displayRegion.textContent = profile?.region || "Kanto";
  displayLevel.textContent = hasGameSync ? profile.player_level ?? "—" : "—";
  displayExperience.textContent = hasGameSync
    ? new Intl.NumberFormat("pt-BR").format(profile.experience ?? 0)
    : "—";
  progressSummary.textContent =
    profile?.progress_summary || "Após integrar o jogo, o progresso aparecerá aqui.";
  if (hasGameSync) {
    const syncDate = new Date(profile.last_game_sync_at);
    gameSyncStatus.textContent = Number.isNaN(syncDate.getTime())
      ? "Dados do jogo sincronizados."
      : `Última sincronização: ${new Intl.DateTimeFormat("pt-BR", {
          dateStyle: "short",
          timeStyle: "short",
        }).format(syncDate)}`;
  } else {
    gameSyncStatus.textContent = "Aguardando integração do jogo.";
  }
  renderBadges(profile?.badges);
  renderParty(party);
}

async function loadPlayer(user) {
  setAccountStatus("Carregando seus dados...");
  const [profileResult, partyResult] = await Promise.all([
    supabase.from("player_profiles").select("player_name, gender, region, player_level, experience, progress_summary, badges, last_game_sync_at").eq("user_id", user.id).maybeSingle(),
    supabase.from("pokemon_party").select("slot, pokemon_name, pokemon_level, species_id, nickname").eq("user_id", user.id).order("slot"),
  ]);
  if (profileResult.error) throw profileResult.error;
  if (partyResult.error) throw partyResult.error;

  populatePlayerForm(profileResult.data, partyResult.data);
  setAccountStatus(
    profileResult.data
      ? "Personagem carregado. Os dados pessoais estão bloqueados após o salvamento."
      : "Preencha apenas nome, gênero e região para criar seu personagem."
  );
}

async function applySession(session) {
  activeUser = session?.user ?? null;
  authView.hidden = Boolean(activeUser);
  playerView.hidden = !activeUser;
  if (!activeUser) {
    accountEmail.textContent = "";
    playerForm.reset();
    populatePlayerForm(null, []);
    return;
  }

  accountEmail.textContent = activeUser.email ?? "";
  populatePlayerForm(null, []);
  try {
    await loadPlayer(activeUser);
  } catch (error) {
    setAccountStatus(`Não foi possível carregar seus dados: ${error.message}`, true);
  }
}

async function initializeAccount() {
  renderParty([]);
  renderBadges([]);
  if (!supabaseUrl || !supabaseAnonKey) {
    authForm.querySelectorAll("input, button").forEach((element) => {
      element.disabled = true;
    });
    authModeToggle.disabled = true;
    setAccountStatus("Login ainda não configurado. Siga os passos de configuração no README.");
    return;
  }

  try {
    const { createClient } = await import("https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm");
    supabase = createClient(supabaseUrl, supabaseAnonKey);
    supabase.auth.onAuthStateChange((_event, session) => {
      void applySession(session);
    });
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    await applySession(data.session);
  } catch (error) {
    setAccountStatus(`Não foi possível iniciar o login: ${error.message}`, true);
  }
}

authModeToggle.addEventListener("click", () => {
  isSignUp = !isSignUp;
  authTitle.textContent = isSignUp ? "Criar minha conta" : "Entrar na minha conta";
  authSubmit.textContent = isSignUp ? "Criar conta" : "Entrar";
  authModeToggle.textContent = isSignUp ? "Já tem conta? Entrar" : "Ainda não tem conta? Criar conta";
  document.querySelector("#auth-password").autocomplete = isSignUp ? "new-password" : "current-password";
  setAccountStatus("");
});

authForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!supabase) return;

  try {
    const formData = new FormData(authForm);
    const email = formData.get("email");
    const password = formData.get("password");
    setAccountStatus(isSignUp ? "Criando sua conta..." : "Entrando...");

    const result = isSignUp
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password });
    if (result.error) {
      setAccountStatus(`Não foi possível ${isSignUp ? "criar a conta" : "entrar"}: ${result.error.message}`, true);
      return;
    }
    if (isSignUp && !result.data.session) {
      setAccountStatus("Conta criada. Confirme seu e-mail e depois entre.");
      return;
    }
    await applySession(result.data.session);
  } catch (error) {
    setAccountStatus(`Não foi possível concluir o acesso: ${error.message}`, true);
  }
});

playerForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!supabase || !activeUser) return;

  try {
    const formData = new FormData(playerForm);
    const profile = {
      user_id: activeUser.id,
      player_name: formData.get("player_name").trim(),
      gender: formData.get("gender"),
      region: formData.get("region"),
    };

    setAccountStatus("Salvando seu personagem...");
    const { error: profileError } = await supabase.from("player_profiles").upsert(profile);
    if (profileError) {
      setAccountStatus(`Não foi possível salvar o personagem: ${profileError.message}`, true);
      return;
    }
    await loadPlayer(activeUser);
    setAccountStatus("Personagem salvo. Nome, gênero e região não podem mais ser alterados.");
  } catch (error) {
    setAccountStatus(`Não foi possível salvar seus dados: ${error.message}`, true);
  }
});

signOutButton.addEventListener("click", async () => {
  if (!supabase) return;
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      setAccountStatus(`Não foi possível sair: ${error.message}`, true);
      return;
    }
    playerForm.reset();
    setAccountStatus("Você saiu da sua conta.");
  } catch (error) {
    setAccountStatus(`Não foi possível sair: ${error.message}`, true);
  }
});

initializeAccount();