import Swal from 'sweetalert2';

export default class SavedStoryPresenter {
  constructor() {
    this._apiStories = [];
  }

  init({ container, deleteAllButton }) {
    this._container = container;
    this._deleteAllButton = deleteAllButton;
    
    this._loadSavedStories();
    this._setupDeleteAllButton();
  }

  _setupDeleteAllButton() {
    if (this._deleteAllButton) {
      this._deleteAllButton.addEventListener('click', async () => {
        const savedStories = JSON.parse(localStorage.getItem("savedStories")) || [];
        
        if (savedStories.length === 0) {
          await Swal.fire({
            icon: 'info',
            title: 'Tidak ada laporan',
            text: 'Tidak ada laporan yang bisa dihapus',
            confirmButtonColor: '#4caf50',
          });
          return;
        }

        const result = await Swal.fire({
          icon: 'warning',
          title: 'Hapus semua laporan?',
          text: 'Anda yakin ingin menghapus semua laporan tersimpan?',
          showCancelButton: true,
          confirmButtonColor: '#d33',
          cancelButtonColor: '#3085d6',
          confirmButtonText: 'Ya, hapus!',
          cancelButtonText: 'Batal'
        });

        if (result.isConfirmed) {
          localStorage.removeItem("savedStories");
          await Swal.fire({
            icon: 'success',
            title: 'Berhasil dihapus!',
            text: 'Semua laporan telah dihapus',
            confirmButtonColor: '#4caf50',
          });
          this._loadSavedStories();
        }
      });
    }
  }

  _loadSavedStories() {
    const savedStories = JSON.parse(localStorage.getItem("savedStories")) || [];
    
    // Update delete button visibility
    if (this._deleteAllButton) {
      this._deleteAllButton.style.display = savedStories.length > 0 ? 'block' : 'none';
    }

    if (savedStories.length === 0) {
      this._container.innerHTML = "<p>Tidak ada cerita yang disimpan.</p>";
      return;
    }

    this._container.innerHTML = savedStories
      .map(
        (story) => `
          <div class="story-card">
            <img src="${story.photoUrl}" alt="${story.name}" />
            <div>
              <h3>${story.name}</h3>
              <p>${story.description.substring(0, 20)}...</p>
            </div>
            <a href="#/stories/${story.id}">Lihat Detail</a>
            <button class="btn-delete-story" data-id="${story.id}">Hapus</button>
          </div>
        `
      )
      .join("");

    // Add event listeners for individual delete buttons
    document.querySelectorAll('.btn-delete-story').forEach(button => {
      button.addEventListener('click', (e) => this._deleteSingleStory(e));
    });
  }

  async _deleteSingleStory(event) {
    const storyId = event.target.getAttribute('data-id');
    const savedStories = JSON.parse(localStorage.getItem("savedStories")) || [];
    
    const result = await Swal.fire({
      icon: 'question',
      title: 'Hapus laporan ini?',
      text: 'Anda yakin ingin menghapus laporan ini?',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
      const updatedStories = savedStories.filter(story => story.id !== storyId);
      localStorage.setItem("savedStories", JSON.stringify(updatedStories));
      
      await Swal.fire({
        icon: 'success',
        title: 'Berhasil dihapus!',
        text: 'Laporan telah dihapus',
        confirmButtonColor: '#4caf50',
      });
      
      this._loadSavedStories();
    }
  }
}