type ConnectivityEvent = "online" | "offline";
type Listener = (event: ConnectivityEvent) => void;

const listeners = new Set<Listener>();
let currentIsOnline =
  typeof navigator !== "undefined" ? navigator.onLine : true;

function emit(event: ConnectivityEvent) {
  listeners.forEach((fn) => fn(event));
}

export function onConnectivityChange(callback: Listener): () => void {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

export function isOnlineNow(): boolean {
  return currentIsOnline;
}

// Set up browser online/offline listeners at module load
if (typeof window !== "undefined") {
  window.addEventListener("online", () => {
    if (!currentIsOnline) {
      currentIsOnline = true;
      emit("online");
    }
  });

  window.addEventListener("offline", () => {
    if (currentIsOnline) {
      currentIsOnline = false;
      emit("offline");
    }
  });
}
