document.querySelectorAll(".brand-mark").forEach((mark) => {
  mark.style.backgroundImage = "url('assets/img/logo-mark.svg')";
  mark.style.backgroundSize = "cover";
  mark.innerHTML = "";
});
const brands = [
  "Nike",
  "Adidas",
  "Puma",
  "Poker",
  "Mizuno",
  "Mikasa",
  "Fila",
  "Spalding",
  "Topper",
  "Joma",
  "Oxn",
  "Coca-Cola",
  "Vans",
  "Act Vita",
  "Umbro",
];
const brandFilter = document.getElementById("brandFilter");
brands.forEach((brand) => brandFilter.add(new Option(brand, brand)));
const categories = [
  "Calçados",
  "Roupas Esportivas",
  "Futebol",
  "Basquete",
  "Vôlei",
  "Academia e Fitness",
  "Acessórios",
  "Ciclismo",
  "Natação",
  "Lutas e Artes Marciais",
  "Corrida",
];
const categoryFilter = document.getElementById("categoryFilter");
categories.forEach((category) =>
  categoryFilter.add(new Option(category, category)),
);
document.getElementById("styleFilter")?.closest("label")?.remove();
const filters = [
  "catalogSearch",
  "brandFilter",
  "categoryFilter",
  "minPrice",
  "maxPrice",
  "catalogPromo",
  "catalogStock",
  "catalogNew",
  "catalogSort",
];
const filterState = Object.fromEntries(
  filters.map((id) => [id, document.getElementById(id)]),
);
const filterInputs = filters.map((id) => filterState[id]);
function updateEmptyState() {
  const active = filterInputs.some(
    (input) =>
      input.id !== "catalogSort" &&
      (input.type === "checkbox" ? input.checked : input.value),
  );
  document.getElementById("resultCount").textContent = active
    ? "0 itens encontrados"
    : "0 itens";
  document.querySelector(".empty-catalog h2").textContent = active
    ? "Nenhum produto corresponde aos filtros."
    : "Nenhum produto disponível ainda.";
}
function resetFilters() {
  filterInputs.forEach((input) => {
    if (input.type === "checkbox") input.checked = false;
    else if (input.id !== "catalogSort") input.value = "";
  });
  filterState.catalogSort.value = "recent";
  updateEmptyState();
}
filterInputs.forEach((input) =>
  input.addEventListener(
    input.tagName === "SELECT" || input.type === "checkbox"
      ? "change"
      : "input",
    updateEmptyState,
  ),
);
document.getElementById("clearFilters").addEventListener("click", resetFilters);
document
  .getElementById("catalogCart")
  .addEventListener("click", () => (location.href = "index.html#cart"));
updateEmptyState();
if (window.lucide) lucide.createIcons();
