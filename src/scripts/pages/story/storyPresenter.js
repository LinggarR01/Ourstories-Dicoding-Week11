import { getStoryDetail } from "../../data/api";
import { parseActivePathname } from "../../routes/url-parser";
import Swal from "sweetalert2";
import { saveStory, getStoryById } from "../../utils/indexedDB"; // pastikan path ini sesuai

const StoryPresenter = {
  async init({ detailContainer, mapContainer }) {
    this.detailContainer = detailContainer;
    this.mapContainer = mapContainer;
    this.token = localStorage.getItem("token");

    if (!this.token) {
      await this._showMessage("Silakan login terlebih dahulu.", "error");
      return;
    }

    const { id } = parseActivePathname();
    await this._loadStoryDetail(id);
  },

  async _loadStoryDetail(id) {
    try {
      const result = await getStoryDetail(id, this.token);

      if (result.ok) {
        this._renderStory(result.story);
      } else {
        await this._showMessage(result.message || "Gagal memuat cerita.", "error");
      }
    } catch (error) {
      console.error("Terjadi kesalahan saat memuat data:", error);
      await this._showMessage("Terjadi kesalahan saat memuat data.", "error");
    }
  },

  async _showMessage(message, icon = "info") {
    await Swal.fire({
      icon,
      text: message,
      confirmButtonColor: "#4caf50",
    });
    this.detailContainer.innerHTML = `<p>${message}</p>`;
    this.mapContainer.innerHTML = "";
  },

  _renderStory(story) {
    this.storyData = story;

    this.detailContainer.innerHTML = `
      <div class="story-card-detail">
        <h2 class="story-name">${story.name}</h2>  
        <p class="story-date">Diposting pada: ${new Date(story.createdAt).toLocaleString()}</p>
        <img src="${story.photoUrl}" alt="Foto oleh ${story.name}" class="story-image" />
        <p class="story-desc">${story.description}</p>
      </div>
    `;

    this._setupSaveButton();

    if (story.lat && story.lon) {
      const map = L.map(this.mapContainer).setView([story.lat, story.lon], 13);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(map);

      L.marker([story.lat, story.lon])
        .addTo(map)
        .bindPopup(`Lokasi oleh ${story.name}`)
        .openPopup();
    } else {
      this.mapContainer.innerHTML = "<p>Lokasi tidak tersedia.</p>";
    }
  },

  async _setupSaveButton() {
    const buttonExists = document.getElementById("saveStoryButton");
    if (!buttonExists) {
      const saveButton = document.createElement("button");
      saveButton.id = "saveStoryButton";
      saveButton.className = "btn-save-story";
      saveButton.textContent = "Simpan Laporan";
      this.detailContainer.querySelector(".story-card-detail").appendChild(saveButton);
    }

    const button = document.getElementById("saveStoryButton");

    const alreadySaved = await getStoryById(String(this.storyData.id));
    if (alreadySaved) {
      button.disabled = true;
      button.textContent = "Tersimpan";
      button.style.backgroundColor = "#8bc34a";
      return;
    }

    button.addEventListener("click", async () => {
      await saveStory(this.storyData);

      button.disabled = true;
      button.textContent = "Tersimpan";
      button.style.backgroundColor = "#8bc34a";

      await Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Cerita berhasil disimpan",
        confirmButtonColor: "#4caf50",
        timer: 1500,
        showConfirmButton: false,
      });
    });
  },
};

export default StoryPresenter;
