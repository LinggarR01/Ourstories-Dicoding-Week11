const DB_NAME = "OurStoriesDB";
const DB_VERSION = 1;
const STORE_NAME = "stories";

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveStory(story) {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, "readwrite");
  const store = tx.objectStore(STORE_NAME);
  store.put({ ...story, id: String(story.id) }); // pastikan id bertipe string
  console.log(await getAllStories());
  return tx.done || tx.complete;
}

export async function getAllStories() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}


export async function getStoryById(id) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.get(String(id));

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}


export async function deleteStory(id) {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, "readwrite");
  return tx.objectStore(STORE_NAME).delete(String(id)); // ubah jadi string!
}

export async function clearAllStories() {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, "readwrite");
  return tx.objectStore(STORE_NAME).clear();
}
