import LoginPresenter from "./loginPresenter";

export default class LoginPage {
  constructor() {
    this.presenter = new LoginPresenter(this);
  }

  async render() {
    return `
      <div id="messageBox" class="message-box"></div>
      <div id="overlayLoader" class="overlay-loader d-none">
        <div class="loader"></div>
      </div>
      <div class="login-container">
        <div class="login-card">
          <h1 class="login-title">Masuk ke Aplikasi</h1>
          <form id="loginForm" class="login-form">
            <div class="form-group">
              <label for="email">Email</label>
              <input 
                type="email" 
                id="email" 
                class="form-control" 
                placeholder="contoh@email.com"
                required
              >
            </div>
            <div class="form-group">
              <label for="password">Password</label>
              <input 
                type="password" 
                id="password" 
                class="form-control" 
                placeholder="Masukkan password"
                required
                minlength="6"
              >
            </div>
            <button type="submit" class="btn-login" id="loginButton">
              <span id="buttonText">Masuk</span>
              <div id="loadingSpinner" class="loader d-none"></div>
            </button>
          </form>
          <div class="login-footer">
            Belum punya akun? <a href="#/register" class="register-link">Daftar disini</a>
          </div>
        </div>
      </div>
    `;
  }

  async afterRender() {
    await new Promise((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(resolve))
    );

    const form = document.getElementById("loginForm"); // pindahkan ke bawah!
    const loginCard = document.querySelector(".login-card");

    // animasi login card
    loginCard.style.opacity = "0";
    loginCard.style.transform = "translateY(20px)";
    loginCard.style.transition = "opacity 0.5s ease, transform 0.5s ease";
    setTimeout(() => {
      loginCard.style.opacity = "1";
      loginCard.style.transform = "translateY(0)";
    }, 100);

    // form submit
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      this.presenter.handleLogin(email, password);
    });
  }
}
