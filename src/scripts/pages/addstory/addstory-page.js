// import { addNewStory } from "../../data/api";
import AddStoryPresenter from "./addStoryPresenter";

export default class AddStoryPage {
  camerastream = null;
  render() {
    return `
      <div class="add-story-container">
        <div class="add-story-card">
          <h1 class="add-story-title">Tambah Cerita</h1>
          <form class="add-story-form" id="addStoryForm">
            <div class="form-group">
              <label for="description">Deskripsi</label>
              <input type="text" id="description" class="form-control" placeholder="Masukkan deskripsi cerita" required></input>
            </div>
  
            <div class="form-group">
              <label for="camera">Ambil Foto</label>
              <video id="camera-video" autoplay playsinline class="camera-preview"></video>
              <button type="button" id="captureButton" class="btn-secondary">Ambil Foto</button>
              <label for="photo">Foto</label>
              <canvas id="snapshotCanvas" style="display: none;"></canvas>
              <img id="photo-preview" alt="Preview Foto" class="preview-image" style="display: none;" />
            </div>
  
            <div class="form-group">
              <label for="map">Tentukan Lokasi</label>
              <div id="map" class="map-area"></div>
            </div>
  
            <button type="button" id="addStoryButton" class="btn-primary">Tambah Cerita</button>
          </form>
        </div>
      </div>
    `;
  }
  

  async afterRender() {
    await new Promise((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(resolve))
    );
    
    const presenter = new AddStoryPresenter(this);
    await presenter.init();
  }
}