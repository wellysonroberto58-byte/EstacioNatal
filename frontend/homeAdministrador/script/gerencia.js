const HOME_VIEW = "visao-geral";

function requireElement(selector) {
  const element = document.querySelector(selector);

  if (!element) {
    throw new Error(`Elemento obrigatório não encontrado: ${selector}`);
  }

  return element;
}

function requireElements(selector) {
  const elements = document.querySelectorAll(selector);

  if (elements.length === 0) {
    throw new Error(`Nenhum elemento obrigatório encontrado: ${selector}`);
  }

  return elements;
}

const elements = {
  app: requireElement(".admin-app"),
  navigationButtons: requireElements("[data-view]"),
  homeContent: requireElement("[data-home-content]"),
  homeOnlyContent: requireElements("[data-home-only]"),
  sectionContent: requireElement("[data-section-content]"),
  sectionKicker: requireElement("[data-section-kicker]"),
  sectionTitle: requireElement("[data-section-title]"),
  sectionDescription: requireElement("[data-section-description]"),
};

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

function getViewFromHash() {
  return window.location.hash.slice(1) || HOME_VIEW;
}

function isKnownView(viewName) {
  return (
    viewName === HOME_VIEW ||
    Object.prototype.hasOwnProperty.call(sectionDetails, viewName)
  );
}

function renderView(viewName) {
  const isHome = viewName === HOME_VIEW;
  const details = sectionDetails[viewName];

  elements.navigationButtons.forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.view === viewName));
  });

  elements.homeContent.hidden = !isHome;
  elements.homeOnlyContent.forEach((element) => {
    element.hidden = !isHome;
  });
  elements.sectionContent.hidden = isHome;

  if (!isHome) {
    elements.sectionKicker.textContent = details.kicker;
    elements.sectionTitle.textContent = details.title;
    elements.sectionDescription.textContent = details.description;
  }
}

function resetToHome() {
  window.history.replaceState(
    null,
    "",
    `${window.location.pathname}${window.location.search}#${HOME_VIEW}`,
  );

  // replaceState não dispara hashchange, então a rota corrigida é renderizada aqui.
  renderView(HOME_VIEW);
}

function handleRoute() {
  const currentHash = window.location.hash;
  const viewName = getViewFromHash();

  if (!currentHash || !isKnownView(viewName)) {
    resetToHome();
    return;
  }

  renderView(viewName);
}

function handleNavigationClick(event) {
  if (!(event.target instanceof Element)) {
    return;
  }

  const routeButton = event.target.closest("[data-view], [data-open-view]");

  if (!routeButton || !elements.app.contains(routeButton)) {
    return;
  }

  const viewName = routeButton.dataset.view || routeButton.dataset.openView;

  if (viewName) {
    window.location.hash = viewName;
  }
}

elements.app.addEventListener("click", handleNavigationClick);
window.addEventListener("hashchange", handleRoute);
handleRoute();
