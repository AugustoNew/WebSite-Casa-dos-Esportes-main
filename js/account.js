document.querySelectorAll(".brand-mark").forEach((mark) => {
  mark.style.backgroundImage = "url('assets/img/logo-mark.svg')";
  mark.style.backgroundSize = "cover";
  mark.innerHTML = "";
});
const hasSupabase =
  window.SUPABASE_CONFIG?.url && window.SUPABASE_CONFIG?.anonKey;
let supabaseClient =
  hasSupabase && window.supabase
    ? window.supabase.createClient(
        window.SUPABASE_CONFIG.url,
        window.SUPABASE_CONFIG.anonKey,
      )
    : null;
async function getSupabase() {
  if (supabaseClient) return supabaseClient;
  if (!hasSupabase) return null;
  await new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
  supabaseClient = window.supabase.createClient(
    window.SUPABASE_CONFIG.url,
    window.SUPABASE_CONFIG.anonKey,
  );
  return supabaseClient;
}
const $ = (selector) => document.querySelector(selector);
const goHome = () => {
  location.href = "index.html";
};
const guestLink = document.createElement("a");
guestLink.className = "guest-link";
guestLink.href = "index.html";
guestLink.textContent = "Continuar como convidado";
$(".account-panel").insertBefore(guestLink, $(".database-status"));
const message = (text, error = false) => {
  $("#formMessage").textContent = text;
  $("#formMessage").classList.toggle("error", error);
};
const setTab = (tab) => {
  document
    .querySelectorAll(".tab")
    .forEach((button) =>
      button.classList.toggle("active", button.dataset.tab === tab),
    );
  $("#loginForm").classList.toggle("hidden", tab !== "login");
  $("#signupForm").classList.toggle("hidden", tab !== "signup");
  message("");
};

document
  .querySelectorAll("[data-tab]")
  .forEach((button) =>
    button.addEventListener("click", () => setTab(button.dataset.tab)),
  );
$("#forgotButton").addEventListener("click", async () => {
  const email = $("#loginForm [name=email]").value.trim();
  if (!email)
    return message(
      "Informe seu e-mail para receber o link de recuperação.",
      true,
    );
  const client = await getSupabase();
  if (client) {
    const { error } = await client.auth.resetPasswordForEmail(email, {
      redirectTo: `${location.origin}${location.pathname}`,
    });
    if (error) return message(error.message, true);
  }
  message(
    "Se o e-mail estiver cadastrado, enviaremos as instruções de recuperação.",
  );
});
$("#loginForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(event.currentTarget));
  const client = await getSupabase();
  if (client) {
    const { data: result, error } = await client.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });
    if (error) return message(error.message, true);
    localStorage.setItem(
      "cde-session",
      JSON.stringify({
        name:
          result.user.user_metadata?.name || result.user.email.split("@")[0],
        email: result.user.email,
      }),
    );
    goHome();
    return;
  }
  const users = JSON.parse(localStorage.getItem("cde-users") || "[]");
  const user = users.find(
    (item) => item.email === data.email && item.password === data.password,
  );
  if (!user) return message("E-mail ou senha incorretos.", true);
  localStorage.setItem(
    "cde-session",
    JSON.stringify({ name: user.name, email: user.email }),
  );
  goHome();
});
$("#signupForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(event.currentTarget));
  const client = await getSupabase();
  if (client) {
    const { data: result, error } = await client.auth.signUp({
      email: data.email,
      password: data.password,
      options: { data: { name: data.name, phone: data.phone || "" } },
    });
    if (error) return message(error.message, true);
    localStorage.setItem(
      "cde-session",
      JSON.stringify({ name: data.name, email: data.email }),
    );
    goHome();
    return;
  }
  const users = JSON.parse(localStorage.getItem("cde-users") || "[]");
  if (users.some((item) => item.email === data.email))
    return message("Este e-mail já está cadastrado.", true);
  users.push({
    name: data.name,
    email: data.email,
    phone: data.phone || "",
    password: data.password,
    createdAt: new Date().toISOString(),
  });
  localStorage.setItem("cde-users", JSON.stringify(users));
  localStorage.setItem(
    "cde-session",
    JSON.stringify({ name: data.name, email: data.email }),
  );
  goHome();
});
$("#databaseStatus").textContent = hasSupabase
  ? "Supabase conectado"
  : "Cadastro local ativo até conectar o Supabase";
if (window.lucide) lucide.createIcons();
