import HomePresenter from "./homePresenter";

export default class HomePage {
  async render() {
    return `
      <section class="container">
        <div id="map"></div>
        <h1 style = "">Daftar Cerita</h1>
        <div id="story-list" class="story-list"></div>
      </section>
    `;
  }

  async afterRender() {
    await new Promise((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(resolve))
    );

    const presenter = new HomePresenter(this);
    await presenter.init();
  }
}