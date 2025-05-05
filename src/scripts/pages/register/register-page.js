import RegisterPresenter from "./registerPresenter";

export default class RegisterPage {
  constructor() {
    this.presenter = new RegisterPresenter(this);
  }

  async render() {
    return `
      <div id="messageBox" class="register-message-box d-none"></div>
      <div class="register-container">
        <div class="register-card">
          <h1 class="register-title">Daftar ke Aplikasi</h1>
          <form id="registerForm" class="register-form">
            <div class="register-form-group">
              <label for="name">Nama</label>
              <input 
                type="text" 
                id="name" 
                class="register-form-control" 
                placeholder="Linggar Riza"
                required
              >
            </div>
            <div class="register-form-group">
              <label for="email">Email</label>
              <input 
                type="email" 
                id="email" 
                class="register-form-control" 
                placeholder="contoh@email.com"
                required
              >
            </div>
            <div class="register-form-group">
              <label for="password">Password</label>
              <input 
                type="password" 
                id="password" 
                class="register-form-control" 
                placeholder="Masukkan password"
                required
                minlength="6"
              >
            </div>
            <button type="submit" class="register-btn" id="registerButton">
              <span id="buttonText">Daftar</span>
              <div id="loadingSpinner" class="register-loader d-none"></div>
            </button>
          </form>
          <div class="register-footer">
            Sudah punya akun? <a href="#/login" class="register-link">Masuk disini</a>
          </div>
        </div>
      </div>
    `;
  }

  async afterRender() {
    await new Promise((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(resolve))
    );
    const form = document.getElementById("registerForm");

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      this.presenter.handleRegister(name, email, password);
    });
  }
}
