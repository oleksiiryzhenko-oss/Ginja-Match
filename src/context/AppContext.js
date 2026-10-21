import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import initialState from "../utils/initialState";
import { removeDemoData } from "../utils/cleanupDemo.mjs";
import { isState, uid, dayKey } from "../utils/model.mjs";
const Context = createContext(null);
const STORAGE_KEY = "@ginja-match/training/v1";
export function AppProvider({ children }) {
  const [state, setState] = useState(initialState);
  const [ready, setReady] = useState(false);
  const [storageError, setStorageError] = useState("");
  const writable = useRef(false);
  const queue = useRef(Promise.resolve());
  useEffect(() => {
    let alive = true;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        const saved = raw ? JSON.parse(raw) : initialState;
        if (!isState(saved)) throw new Error("Geçersiz yerel veri");
        if (alive) {
          setState(removeDemoData(saved));
          writable.current = true;
        }
      })
      .catch(() => {
        if (alive)
          setStorageError(
            "Kayıtlı günlüğünüz okunamadı. Mevcut veriler değiştirilmedi. Tekrar denemek için uygulamayı yeniden başlatın.",
          );
      })
      .finally(() => {
        if (alive) setReady(true);
      });
    return () => {
      alive = false;
    };
  }, []);
  useEffect(() => {
    if (!ready || !writable.current) return;
    const snapshot = JSON.stringify(state);
    queue.current = queue.current
      .catch(() => {})
      .then(() => AsyncStorage.setItem(STORAGE_KEY, snapshot))
      .then(() => setStorageError(""))
      .catch(() =>
        setStorageError(
          "Değişiklikler kaydedilemedi. Cihazınızda yer açıp tekrar deneyin.",
        ),
      );
  }, [state, ready]);
  const update = (transform) => {
    if (!writable.current)
      throw new Error(
        "Yerel verilere erişilemiyor. Değişiklik yapmadan önce uygulamayı yeniden başlatın.",
      );
    setState((previous) => transform(previous));
  };
  const saveSkill = (input) => {
    const id = input.id || uid();
    update((s) => ({
      ...s,
      skills: input.id
        ? s.skills.map((v) => (v.id === id ? { ...v, ...input } : v))
        : [...s.skills, { ...input, id, archived: false }],
    }));
    return id;
  };
  const archiveSkill = (id) =>
    update((s) => ({
      ...s,
      skills: s.skills.map((v) =>
        v.id === id ? { ...v, archived: !v.archived } : v,
      ),
    }));
  const saveSession = (input) => {
    const id = input.id || uid();
    update((s) => ({
      ...s,
      sessions: input.id
        ? s.sessions.map((v) => (v.id === id ? { ...v, ...input } : v))
        : [
            { ...input, id, day: dayKey(), createdAt: Date.now() },
            ...s.sessions,
          ],
    }));
  };
  const removeSession = (id) =>
    update((s) => ({ ...s, sessions: s.sessions.filter((v) => v.id !== id) }));
  const saveChallenge = (input) => {
    const date = new Date();
    date.setDate(date.getDate() + input.days - 1);
    update((s) => ({
      ...s,
      challenges: [
        { ...input, id: uid(), startDay: dayKey(), endDay: dayKey(date) },
        ...s.challenges,
      ],
    }));
  };
  const removeChallenge = (id) =>
    update((s) => ({
      ...s,
      challenges: s.challenges.filter((v) => v.id !== id),
    }));
  const retrySave = () => {
    if (writable.current) setState((s) => ({ ...s }));
  };
  const restore = async (data) => {
    if (!isState(data)) throw new Error("Geçersiz yedek");
    await queue.current.catch(() => {});
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    writable.current = true;
    setState(data);
    setStorageError("");
  };
  const reset = async () => {
    await queue.current.catch(() => {});
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(initialState));
    writable.current = true;
    setState({ ...initialState });
    setStorageError("");
  };
  return (
    <Context.Provider
      value={{
        ...state,
        ready,
        storageError,
        saveSkill,
        archiveSkill,
        saveSession,
        removeSession,
        saveChallenge,
        removeChallenge,
        reset,
        restore,
        retrySave,
      }}
    >
      {children}
    </Context.Provider>
  );
}
export const useApp = () => useContext(Context);
