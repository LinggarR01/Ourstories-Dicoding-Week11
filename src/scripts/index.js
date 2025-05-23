// CSS imports
import "../styles/styles.css";
import App from "./pages/app";
import { setupPushSubscription } from "./data/api";
import { registerSW } from "virtual:pwa-register";

registerSW(); 

document.addEventListener("DOMContentLoaded", async () => {
  const app = new App({
    content: document.querySelector("#main-content"),
    drawerButton: document.querySelector("#drawer-button"),
    navigationDrawer: document.querySelector("#navigation-drawer"),
  });
  await app.renderPage();

  window.addEventListener("hashchange", async () => {
    await app.renderPage();
  });

  // Setup push subscription jika diizinkan
  async function handlePushSetup() {
    if (!("serviceWorker" in navigator)) {
      console.error("Service Worker API not supported.");
      return;
    }

    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.warn("Izin notifikasi ditolak oleh user");
      return;
    }

    const token = localStorage.getItem("token");
    if (token) {
      try {
        await setupPushSubscription(token);
      } catch (err) {
        console.error("Gagal subscribe push:", err.message);
      }
    }
  }

  async function isSubscribed() {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    return !!subscription;
  }

  async function unsubscribePush() {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    if (subscription) {
      await subscription.unsubscribe();
      console.log("Notifikasi berhasil dinonaktifkan");
    }
  }

  // Handler tombol aktifkan/nonaktifkan notifikasi
  document.getElementById("toggle-notif-btn")?.addEventListener("click", async () => {
    const isCurrentlySubscribed = await isSubscribed();

    if (isCurrentlySubscribed) {
      await unsubscribePush();
      alert("Notifikasi dinonaktifkan");
      toggleButtonState(false);
    } else {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        alert("Izin notifikasi ditolak");
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        alert("Silakan login terlebih dahulu.");
        return;
      }

      try {
        await setupPushSubscription(token);
        alert("Notifikasi berhasil diaktifkan!");
        toggleButtonState(true);
      } catch (err) {
        console.error("Gagal mengaktifkan notifikasi:", err);
        alert("Gagal mengaktifkan notifikasi.");
      }
    }
  });

  function toggleButtonState(subscribed) {
    const icon = document.getElementById("notif-icon");
    const label = document.getElementById("notif-label");

    if (!icon || !label) return;

    if (subscribed) {
      icon.src = "/icons/bell-off.svg";
      label.textContent = "Nonaktifkan Notifikasi";
    } else {
      icon.src = "/icons/bell.svg";
      label.textContent = "Aktifkan Notifikasi";
    }
  }

  // Trigger handlePushSetup saat window load
  window.addEventListener("load", async () => {
    await handlePushSetup();
  });
});
