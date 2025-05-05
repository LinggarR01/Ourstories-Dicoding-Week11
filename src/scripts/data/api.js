import { CONFIG } from "../config";

const ENDPOINTS = {
  // POST METHOD
  REGISTER: `${CONFIG.BASE_URL}/register`,
  LOGIN: `${CONFIG.BASE_URL}/login`,
  ADD_NEW_STORY: `${CONFIG.BASE_URL}/stories`,
  ADD_NEW_STORY_GUEST: `${CONFIG.BASE_URL}/stories/guest`,
  // GET METHOD
  ALL_STORY: `${CONFIG.BASE_URL}/stories`,
  DETAIL_STORY: (id) => `${CONFIG.BASE_URL}/stories/${id}`,
};

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
