const HOME_VIEW = "visao-geral";

function requireElement(selector) {
  const element = document.querySelector(selector);

  if (!element) {
    throw new Error(`Elemento obrigatório não encontrado: ${selector}`);
  }

  return element;
}

const elements = {
  app: requireElement(".admin-app"),
  viewContent: requireElement("#view-content"),
  navigationButtons: document.querySelectorAll("[data-view]"),
};

const sectionDetails = {
  [HOME_VIEW]: {
    file: "visao-geral.html",
  },
  estrutura: {
    file: "estrutura.html",
    title: "Configurar estrutura",
  },
  cameras: {
    file: "placeholder.html",
    kicker: "MONITORAMENTO",
    title: "Câmeras",
    description:
      "Aqui você poderá acompanhar e gerenciar as câmeras do estacionamento.",
  },
  historico: {
    file: "placeholder.html",
    kicker: "ATIVIDADES",
    title: "Histórico",
    description:
      "Aqui você poderá consultar o histórico de atividades do estacionamento.",
  },
  usuarios: {
    file: "placeholder.html",
    kicker: "ACESSOS",
    title: "Gerenciamento de usuários",
    description:
      "Aqui você poderá visualizar e gerenciar os usuários e seus acessos.",
  },
};

const routeViews = new Map();
const pendingViews = new Map();
let routeRequestId = 0;

function getViewFromHash() {
  return window.location.hash.slice(1) || HOME_VIEW;
}

function isKnownView(viewName) {
  return Object.prototype.hasOwnProperty.call(sectionDetails, viewName);
}

function resetToHome() {
  window.history.replaceState(
    null,
    "",
    `${window.location.pathname}${window.location.search}#${HOME_VIEW}`,
  );
}

function renderNavigation(viewName) {
  elements.navigationButtons.forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.view === viewName));
  });
}

function setPlaceholderDetails(view, viewName) {
  if (viewName === HOME_VIEW || viewName === "estrutura") {
    return;
  }

  const details = sectionDetails[viewName];
  view.querySelector("[data-section-kicker]").textContent = details.kicker;
  view.querySelector("[data-section-title]").textContent = details.title;
  view.querySelector("[data-section-description]").textContent =
    details.description;
}

async function loadView(viewName) {
  if (routeViews.has(viewName)) {
    return routeViews.get(viewName);
  }

  if (pendingViews.has(viewName)) {
    return pendingViews.get(viewName);
  }

  const loadPromise = (async () => {
    if (window.location.protocol === "file:") {
      throw new Error(
        "Para carregar telas HTML separadas sem recarregar a SPA, abra o projeto por um servidor HTTP.",
      );
    }

    const response = await fetch(`views/${sectionDetails[viewName].file}`);
    if (!response.ok) {
      throw new Error(
        `Não foi possível carregar a tela (${response.status} ${response.statusText}).`,
      );
    }

    const markup = await response.text();
    const parsedDocument = new DOMParser().parseFromString(markup, "text/html");
    const view = document.createElement("div");
    view.className = "route-view";
    view.dataset.route = viewName;
    view.hidden = true;

    Array.from(parsedDocument.body.childNodes).forEach((node) => {
      view.append(document.importNode(node, true));
    });

    setPlaceholderDetails(view, viewName);

    if (viewName === "estrutura") {
      const { mountStructurePage } = await import("./estrutura.js");
      mountStructurePage(view);
    }

    routeViews.set(viewName, view);
    return view;
  })();

  pendingViews.set(viewName, loadPromise);

  try {
    return await loadPromise;
  } finally {
    pendingViews.delete(viewName);
  }
}

function showRouteError(error) {
  elements.viewContent.replaceChildren();
  const message = document.createElement("p");
  message.className = "route-error";
  message.setAttribute("role", "alert");
  message.textContent = `Não foi possível abrir esta tela: ${error.message}`;
  elements.viewContent.append(message);
}

async function handleRoute() {
  let viewName = getViewFromHash();

  if (!isKnownView(viewName)) {
    resetToHome();
    viewName = HOME_VIEW;
  } else if (!window.location.hash) {
    resetToHome();
  }

  const requestId = ++routeRequestId;
  renderNavigation(viewName);

  try {
    const activeView = await loadView(viewName);
    if (requestId !== routeRequestId) {
      return;
    }

    routeViews.forEach((view) => {
      view.hidden = view !== activeView;
    });
    elements.viewContent.replaceChildren(...routeViews.values());
  } catch (error) {
    if (requestId === routeRequestId) {
      showRouteError(error);
    }
  }
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
  if (viewName && isKnownView(viewName)) {
    window.location.hash = viewName;
  }
}

elements.app.addEventListener("click", handleNavigationClick);
window.addEventListener("hashchange", handleRoute);
handleRoute();
