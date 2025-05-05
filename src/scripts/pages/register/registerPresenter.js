import { getRegistered } from "../../data/api";

class RegisterPresenter {
  constructor(view) {
    this.view = view;
  }

  async handleRegister(name, email, password) {
    const messageBox = document.getElementById("messageBox");

    try {
      const result = await getRegistered(name, email, password);

      if (result.ok) {
        messageBox.textContent = "Registrasi berhasil!";
        messageBox.style.color = "green";
        window.location.href = "#/login";
      } else {
        messageBox.textContent = result.message || "Registrasi gagal.";
        messageBox.style.color = "red";
      }
    } catch (error) {
      console.error("Error saat registrasi:", error);
      messageBox.textContent = "Terjadi kesalahan saat koneksi ke server.";
      messageBox.style.color = "red";
    }
  }
}

export default RegisterPresenter;
