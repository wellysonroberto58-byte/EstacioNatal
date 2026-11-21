const navigationButtons = Array.from(document.querySelectorAll("[data-view]"));
const quickAccessButtons = document.querySelectorAll("[data-open-view]");
const homeContent = document.querySelector("[data-home-content]");
const homeOnlyContent = document.querySelectorAll("[data-home-only]");
const sectionContent = document.querySelector("[data-section-content]");
const sectionKicker = document.querySelector("[data-section-kicker]");
const sectionTitle = document.querySelector("[data-section-title]");
const sectionDescription = document.querySelector("[data-section-description]");

const sectionDetails = {
  estrutura: {
    kicker: "CONFIGURAÇÃO",
    title: "Configurar estrutura",
    description:
      "Aqui você poderá organizar os pisos, setores e vagas do estacionamento.",
  },
  cameras: {
    kicker: "MONITORAMENTO",
    title: "Câmeras",
    description:
      "Aqui você poderá acompanhar e gerenciar as câmeras do estacionamento.",
  },
  historico: {
    kicker: "ATIVIDADES",
    title: "Histórico",
    description:
      "Aqui você poderá consultar o histórico de atividades do estacionamento.",
  },
  usuarios: {
    kicker: "ACESSOS",
    title: "Gerenciamento de usuários",
    description:
      "Aqui você poderá visualizar e gerenciar os usuários e seus acessos.",
  },
};

function renderView(viewName) {
  const isHome = viewName === "visao-geral";
  const details = sectionDetails[viewName];

  if (!isHome && !details) {
    return false;
  }

  navigationButtons.forEach((button) => {
    button.setAttribute(
      "aria-pressed",
      String(button.dataset.view === viewName),
    );
  });

  homeContent.hidden = !isHome;
  homeOnlyContent.forEach((element) => {
    element.hidden = !isHome;
  });
  sectionContent.hidden = isHome;

  if (!isHome) {
    sectionKicker.textContent = details.kicker;
    sectionTitle.textContent = details.title;
    sectionDescription.textContent = details.description;
  }

  return true;
}

function navigateToView(viewName) {
  const nextHash = `#${viewName}`;

  if (!renderView(viewName)) {
    return;
  }

  if (window.location.hash === nextHash) {
    return;
  }

  window.location.hash = viewName;
}

navigationButtons.forEach((button) => {
  button.addEventListener("click", () => {
    navigateToView(button.dataset.view);
  });
});

quickAccessButtons.forEach((button) => {
  button.addEventListener("click", () => {
    navigateToView(button.dataset.openView);
  });
});

window.addEventListener("hashchange", () => {
  const viewName = window.location.hash.slice(1) || "visao-geral";

  if (!renderView(viewName)) {
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${window.location.search}#visao-geral`,
    );
    renderView("visao-geral");
  }
});

const initialView = window.location.hash.slice(1) || "visao-geral";
if (renderView(initialView)) {
  if (!window.location.hash) {
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${window.location.search}#visao-geral`,
    );
  }
} else {
  window.history.replaceState(
    null,
    "",
    `${window.location.pathname}${window.location.search}#visao-geral`,
  );
  renderView("visao-geral");
}
