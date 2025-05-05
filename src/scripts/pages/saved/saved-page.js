import SavedStoryPresenter from "./savedPresenter";

export default class SavedPage {
  async render() {
    return `
      <section class="container">
        <div class="saved-header">
          <h1>Laporan Tersimpan</h1>
          <button id="delete-all-button" class="btn-delete-all">Hapus Semua</button>
        </div>
        <div id="saved-story-list" class="story-list"></div>
      </section>
    `;
  }

  async afterRender() {
    await new Promise((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(resolve))
    );
    
    const presenter = new SavedStoryPresenter();
    presenter.init({
      container: document.getElementById("saved-story-list"),
      deleteAllButton: document.getElementById("delete-all-button"),
    });
  }
}