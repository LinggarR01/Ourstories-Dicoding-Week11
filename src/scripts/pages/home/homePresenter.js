import { getAllStory } from "../../data/api";

class HomePresenter {
  constructor(view) {
    this.view = view;
    this.map = null;
    this.icon = L.icon({
      iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
      iconSize: [30, 40],
      iconAnchor: [15, 40],
      popupAnchor: [0, -40],
    });
  }

  async init() {
    this._initMap();
    await this._loadStories();
  }

  _initMap() {
    this.map = L.map("map").setView([-2.5489, 118.0149], 5); // Pusat Indonesia
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(this.map);
  }

  async _loadStories() {
    const container = document.getElementById("story-list");
    console.log("Container:", container);
    if (!container) {
      alert("#story-list belum ada di DOM saat _loadStories dijalankan!");
    }

    try {
      const result = await getAllStory(1, 20, 1);

      if (result.listStory && result.listStory.length > 0) {
        container.innerHTML = result.listStory
          .map(
            (story) => `
              <div class="story-card">
                <img src="${story.photoUrl}" alt="${story.name}" />
                <div>
                  <h3>${story.name}</h3>
                  <p>Dibuat Pada: ${new Date(
                    story.createdAt
                  ).toLocaleString()}</p>
                  <p>${story.description.substring(0, 20)}...</p>
                </div>
                <a href="#/stories/${story.id}">Baca Selengkapnya</a>
              </div>
            `
          )
          .join("");

        result.listStory.forEach((story) => {
          if (story.lat && story.lon) {
            L.marker([story.lat, story.lon], { icon: this.icon })
              .addTo(this.map)
              .bindPopup(`<b>${story.name}</b><br>${story.description}`);
          }
        });
      } else {
        container.innerHTML = "<p>Tidak ada cerita untuk ditampilkan.</p>";
      }
    } catch (error) {
      console.error("Gagal mengambil data story:", error);
      container.innerHTML =
        "<p>Gagal memuat cerita. Silakan coba lagi nanti.</p>";
    }
  }
}

export default HomePresenter;
