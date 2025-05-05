import routes from "../routes/routes";
import { getActiveRoute } from "../routes/url-parser";

class App {
  #content = null;
  #drawerButton = null;
  #navigationDrawer = null;
  #drawerOverlay = null;

  constructor({ navigationDrawer, drawerButton, content }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#navigationDrawer = navigationDrawer;

    // Buat overlay untuk drawer
    this.#drawerOverlay = document.createElement("div");
    this.#drawerOverlay.className = "drawer-overlay";
    document.body.appendChild(this.#drawerOverlay);

    this.#setupDrawer();
    document.addEventListener("DOMContentLoaded", () => {
      const skipLink = document.querySelector(".skip-to-content");
      const mainContent = document.getElementById("mainContent");

      if (!skipLink || !mainContent) return;

      skipLink.addEventListener("click", (e) => {
        // cegah default pindah hash
        e.preventDefault();
        // cegah SPA meng-handle perubahan hash
        e.stopPropagation();

        if (!document.startViewTransition) {
          mainContent.focus();
          return;
        }

        document.startViewTransition(() => {
          mainContent.focus();
        });
      });
    });
  }

  #setupDrawer() {
    // Toggle drawer
    this.#drawerButton.addEventListener("click", (e) => {
      e.stopPropagation();
      this.#toggleDrawer();
    });

    // Tutup saat klik overlay
    this.#drawerOverlay.addEventListener("click", () => {
      this.#closeDrawer();
    });

    // Tutup saat klik link
    this.#navigationDrawer.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        this.#closeDrawer();
      });
    });
  }

  #toggleDrawer() {
    this.#navigationDrawer.classList.toggle("open");
    this.#drawerOverlay.classList.toggle("active");
  }

  #closeDrawer() {
    this.#navigationDrawer.classList.remove("open");
    this.#drawerOverlay.classList.remove("active");
  }

  async renderPage() {
    const url = getActiveRoute();
    const page = routes[url];

    if (!page) {
      this.#content.innerHTML = "<h1>404 - Halaman tidak ditemukan</h1>";
      return;
    }

    const token = localStorage.getItem("token");

    const navItems = {
      homeItem: "#/",
      savedItem: "#/saved",
      addstoryItem: "#/addstory",
      logoutItem: null,
    };

    Object.entries(navItems).forEach(([id, route]) => {
      const element = document.getElementById(id);
      if (element) {
        element.style.display = token ? "block" : "none";

        if (route && window.location.hash === route) {
          element.classList.add("active");
        } else {
          element.classList.remove("active");
        }
      }
    });

    const publicRoutes = ["/login", "/register"];

    if (!token && !publicRoutes.includes(url)) {
      window.location.hash = "#/login";
      return;
    }

    // Transisi keluar jika ada halaman sebelumnya
    const oldPage = this.#content.querySelector(".page-transition");
    if (oldPage) {
      oldPage.classList.remove("show");
      oldPage.classList.add("hide");

      await new Promise((resolve) => setTimeout(resolve, 300));
      this.#content.innerHTML = "";
    }

    const newPageHTML = await page.render();

    const transitionHandler = () => {
      const wrapper = document.createElement("div");
      wrapper.classList.add("page-transition");
      wrapper.innerHTML = newPageHTML;
      this.#content.innerHTML = "";
      this.#content.appendChild(wrapper);

      requestAnimationFrame(() => {
        wrapper.classList.add("show");
      });
    };

    // Eksekusi transisi baru jalankan afterRender
    if (document.startViewTransition) {
      await document.startViewTransition(() => {
        transitionHandler();
      });
    } else {
      transitionHandler();
    }

    //  Panggil afterRender setelah konten tampil
    await page.afterRender();

    // Setting visibility tombol logout/home dll.
    ["logoutItem", "homeItem", "savedItem", "addstoryItem"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.style.display = token ? "block" : "none";
    });

    const logoutButton = document.getElementById("logoutButton");
    if (logoutButton) {
      logoutButton.addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.removeItem("token");
        window.location.hash = "#/login";
      });
    }

    if (!token && !publicRoutes.includes(url)) {
      window.location.hash = "#/login";
      return;
    }

    if (token && publicRoutes.includes(url)) {
      window.location.hash = "#/";
      return;
    }
  }
}

export default App;
