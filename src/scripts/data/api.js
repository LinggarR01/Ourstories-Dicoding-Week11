import { CONFIG } from "../config";
import { urlBase64ToUint8Array } from "../utils/vapid";

const ENDPOINTS = {
  // POST METHOD
  REGISTER: `${CONFIG.BASE_URL}/register`,
  LOGIN: `${CONFIG.BASE_URL}/login`,
  ADD_NEW_STORY: `${CONFIG.BASE_URL}/stories`,
  ADD_NEW_STORY_GUEST: `${CONFIG.BASE_URL}/stories/guest`,
  // GET METHOD
  ALL_STORY: `${CONFIG.BASE_URL}/stories`,
  DETAIL_STORY: (id) => `${CONFIG.BASE_URL}/stories/${id}`,
  // SUBS/UNSUBS
  SUBSCRIBE: `${CONFIG.BASE_URL}/notifications/subscribe`,
  UNSUBSCRIBE: `${CONFIG.BASE_URL}/notifications/subscribe`,
};

// export async function subscribePushNotifications({ endpoint, keys }, token) {
//   const response = await fetch(ENDPOINTS.SUBSCRIBE, {
//     method: "POST",
//     headers: {
//       Authorization: `Bearer ${token}`,
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       endpoint,
//       keys,
//     }),
//   });

//   const json = await response.json();

//   return {
//     ...json,
//     ok: response.ok,
//     status: response.status,
//   };
// }

export async function setupPushSubscription(token) {
  const registration = await navigator.serviceWorker.ready;

  let subscription = await registration.pushManager.getSubscription();
  if (!subscription) {
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(CONFIG.VAPID_KEYS),
    });
  }

  const rawP256dh = subscription.getKey("p256dh");
  const rawAuth = subscription.getKey("auth");

  if (!rawP256dh || !rawAuth) {
    throw new Error("Gagal mengambil key subscription");
  }

  const p256dh = btoa(String.fromCharCode(...new Uint8Array(rawP256dh)));
  const auth = btoa(String.fromCharCode(...new Uint8Array(rawAuth)));

  const payload = {
    endpoint: subscription.endpoint,
    keys: { p256dh, auth },
  };

  const response = await fetch(`${CONFIG.BASE_URL}/notifications/subscribe`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const json = await response.json();
  if (!response.ok) throw new Error(json.message || "Subscribe gagal");
  console.log("Berhasil subscribe push:", json);
}

export async function getAllStory(page, size, location) {
  const token = localStorage.getItem("token");
  const queryParams = `?page=${page}&size=${size}&location=${location}`;

  const response = await fetch(`${ENDPOINTS.ALL_STORY}${queryParams}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const json = await response.json();
  return {
    ...json,
    ok: response.ok,
    status: response.status,
  };
}

export async function getRegistered(name, email, password) {
  const data = JSON.stringify({ name, email, password });
  const response = await fetch(ENDPOINTS.REGISTER, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: data,
  });

  const json = await response.json();
  return {
    ...json,
    ok: response.ok,
    status: response.status,
  };
}

export async function getLogin(email, password) {
  const data = JSON.stringify({ email, password });
  const response = await fetch(ENDPOINTS.LOGIN, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: data,
  });

  const json = await response.json();
  return {
    ...json,
    ok: response.ok,
    status: response.status,
  };
}

export async function getStoryDetail(id, token) {
  const response = await fetch(`${ENDPOINTS.DETAIL_STORY(id)}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const json = await response.json();
  return {
    ...json,
    ok: response.ok,
    status: response.status,
  };
}

export async function addNewStory(token, { photo, description, lat, lon }) {
  const formData = new FormData();
  formData.append("photo", photo);
  formData.append("description", description);
  if (lat) formData.append("lat", lat);
  if (lon) formData.append("lon", lon);

  const response = await fetch(ENDPOINTS.ADD_NEW_STORY, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const json = await response.json();
  return {
    ...json,
    ok: response.ok,
    status: response.status,
  };
}

export async function addNewStoryGuest({ photo, description, name, lat, lon }) {
  const formData = new FormData();
  formData.append("photo", photo);
  formData.append("description", description);
  formData.append("name", name);
  if (lat) formData.append("lat", lat);
  if (lon) formData.append("lon", lon);

  const response = await fetch(ENDPOINTS.ADD_NEW_STORY_GUEST, {
    method: "POST",
    body: formData,
  });

  const json = await response.json();
  return {
    ...json,
    ok: response.ok,
    status: response.status,
  };
}
