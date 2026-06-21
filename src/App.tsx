import { useEffect } from "react";

import { Board } from "./components/board/Board";
import { todayKey } from "./lib/date-key";
import { ensureDay } from "./lib/notes-api";
import { useBoardStore } from "./state/board-store";

function App() {
  const loadDay = useBoardStore((s) => s.loadDay);

  useEffect(() => {
    const key = todayKey();
    void (async () => {
      await ensureDay(key);
      await loadDay(key);
    })();
  }, [loadDay]);

  return <Board />;
}

export default App;
