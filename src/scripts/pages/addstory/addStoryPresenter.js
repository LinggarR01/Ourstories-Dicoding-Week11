import { addNewStory } from "../../data/api";
import Swal from "sweetalert2";

class AddStoryPresenter {
  constructor(view) {
    this.view = view;
    this.cameraStream = null;
    this.capturedBlob = null;
    this.selectedLat = null;
    this.selectedLon = null;
    this.currentMarker = null;
  }

  async init() {
    this._initCamera();
    this._initMap();
    this._bindEvents();
  }

  async _initCamera() {
    const video = document.getElementById("camera-video");
    const canvas = document.getElementById("snapshotCanvas");
    const previewImage = document.getElementById("photo-preview");
    const captureButton = document.getElementById("captureButton");

    try {
      this.cameraStream = await navigator.mediaDevices.getUserMedia({ video: true });
      video.srcObject = this.cameraStream;

      captureButton.addEventListener("click", () => {
        const context = canvas.getContext("2d");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        canvas.toBlob((blob) => {
          this.capturedBlob = blob;

          const imageURL = URL.createObjectURL(blob);
          previewImage.src = imageURL;
          previewImage.style.display = "block";
        }, "image/jpeg");
      });

      // Stop kamera ketika hash berubah (keluar dari halaman)
      window.addEventListener("hashchange", () => {
        this._stopCamera();
      });
    } catch (err) {
      console.error("Gagal mengakses kamera:", err);
    }
  }

  _stopCamera() {
    if (this.cameraStream) {
      this.cameraStream.getTracks().forEach((track) => track.stop());
    }
  }

  _initMap() {
    const map = L.map("map").setView([-2.5489, 118.0149], 5);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    const icon = L.icon({
      iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
      iconSize: [30, 40],
      iconAnchor: [15, 40],
      popupAnchor: [0, -40],
    });

    map.on("click", (e) => {
      this.selectedLat = e.latlng.lat;
      this.selectedLon = e.latlng.lng;

      if (this.currentMarker) {
        this.currentMarker.setLatLng(e.latlng);
      } else {
        this.currentMarker = L.marker(e.latlng, { icon }).addTo(map);
      }
    });
  }

  _bindEvents() {
    const addButton = document.getElementById("addStoryButton");
    addButton.addEventListener("click", () => this._handleSubmit());
  }

  async _handleSubmit() {
    const description = document.getElementById("description").value;
    const token = localStorage.getItem("token");

    if (!this.capturedBlob || !description || !this.selectedLat || !this.selectedLon) {
      await Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Lengkapi deskripsi cerita, ambil foto, dan pilih lokasi!',
        confirmButtonColor: '#4caf50',
      });
      return;
    }

    try {
      const result = await addNewStory(token, {
        photo: this.capturedBlob,
        description,
        lat: this.selectedLat,
        lon: this.selectedLon,
      });

      if (result.ok) {
        await Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Cerita berhasil ditambahkan!',
          confirmButtonColor: '#4caf50',
        });
        location.hash = "#/";
      } else {
        await Swal.fire({
          icon: 'error',
          title: 'Gagal',
          text: result.message || 'Gagal menambahkan cerita',
          confirmButtonColor: '#4caf50',
        });
      }
    } catch (err) {
      console.error("Terjadi kesalahan saat mengirim data:", err);
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Terjadi kesalahan saat mengirim data.',
        confirmButtonColor: '#4caf50',
      });
    }
  }
}

export default AddStoryPresenter;