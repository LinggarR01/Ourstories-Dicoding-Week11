import StoryPresenter from "./storyPresenter";

export default class StoryPage {
  async render() {
    return `
      <div class="container">
        <div id="map" style="height: 300px; margin-top: 20px;"></div>
        <div id="story-detail" class="story-detail"></div>
        <button id="saveStoryButton" class="btn-save-story">Save Story</button>
      </div>
    `;
  }

  async afterRender() {
    await new Promise((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(resolve))
    );
    
    const detailContainer = document.getElementById("story-detail");
    const mapContainer = document.getElementById("map");

    await StoryPresenter.init({ detailContainer, mapContainer });
  }
}
