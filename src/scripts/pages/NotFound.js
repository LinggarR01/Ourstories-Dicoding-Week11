export default class NotFound {
  async render() {
    return `
      <section class="not-found">
        <h2>404 - Halaman Tidak Ditemukan</h2>
        <p>Ups! Halaman yang kamu cari tidak tersedia.</p>
        <a href="#/">⬅ Kembali ke Beranda</a>
      </section>
    `;
  }
  async afterRender() {}
};
