import { useEffect } from "react";

const ServiceWorkerUpdater = () => {
  useEffect(() => {
    if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) {
      return;
    }

    const onControllerChange = () => {
      window.location.reload();
    };

    const onChunkLoadError = (event: ErrorEvent) => {
      const message = event.message || "";
      const source = event.filename || "";
      const isChunkError = /dynamically imported module|Loading chunk|ChunkLoadError/i.test(message) ||
        /\/assets\/.*\.js/i.test(source);

      if (!isChunkError || sessionStorage.getItem("renix-chunk-reload")) return;

      sessionStorage.setItem("renix-chunk-reload", "true");
      window.location.reload();
    };

    const onUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason instanceof Error ? event.reason.message : String(event.reason || "");
      if (/dynamically imported module|Loading chunk|ChunkLoadError/i.test(reason)) {
        onChunkLoadError(new ErrorEvent("error", { message: reason }));
      }
    };

    window.addEventListener("error", onChunkLoadError);
    window.addEventListener("unhandledrejection", onUnhandledRejection);

    navigator.serviceWorker.addEventListener("controllerchange", onControllerChange);

    navigator.serviceWorker.getRegistration().then((registration) => {
      if (registration?.waiting) {
        registration.waiting.postMessage({ type: "SKIP_WAITING" });
      }
    });

    return () => {
      navigator.serviceWorker.removeEventListener("controllerchange", onControllerChange);
      window.removeEventListener("error", onChunkLoadError);
      window.removeEventListener("unhandledrejection", onUnhandledRejection);
    };
  }, []);

  return null;
};

export default ServiceWorkerUpdater;
