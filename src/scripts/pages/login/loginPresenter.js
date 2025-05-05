import { getLogin } from "../../data/api";

class LoginPresenter {
  constructor(view) {
    this.view = view;
  }

  async handleLogin(email, password) {
    const messageBox = document.getElementById("messageBox");
    const loadingSpinner = document.getElementById("loadingSpinner");
    const loginButton = document.getElementById("loginButton");
    const buttonText = document.getElementById("buttonText");

    // Reset UI
    messageBox.className = "message-box";
    messageBox.textContent = "";
    loadingSpinner.classList.remove("d-none");
    loginButton.disabled = true;
    buttonText.style.opacity = '0';
    setTimeout(() => (buttonText.style.display = 'none'), 300);

    try {
      const result = await getLogin(email, password);

      loadingSpinner.classList.add("d-none");
      loginButton.disabled = false;

      if (result.ok && result.loginResult?.token) {
        localStorage.setItem("userId", result.loginResult.userId);
        localStorage.setItem("userName", result.loginResult.name);
        localStorage.setItem("token", result.loginResult.token);

        messageBox.textContent = "Login berhasil!";
        messageBox.classList.add("show", "success");

        setTimeout(() => {
          window.location.replace("#/");
        }, 1500);
      } else {
        messageBox.textContent = result.message || "Login gagal.";
        messageBox.classList.add("show", "error");
      }
    } catch (error) {
      console.error("Error saat Login:", error);
      messageBox.textContent = "Terjadi kesalahan saat koneksi ke server.";
      messageBox.classList.add("show", "error");
    }
  }
}

export default LoginPresenter;
