import { useEffect, useMemo, useState } from "react";

type Section = "fixed" | "extras" | "deep";
type DayType = "weekday" | "weekend";

type Task = {
  id: string;
  title: string;
  section: Section;
};

type DailyRecord = {
  date: string;
  dayType: DayType;
  tasks: Task[];
  completedTaskIds: string[];
};

type AppData = {
  tasks: {
    weekday: Task[];
    weekend: Task[];
  };
  history: Record<string, DailyRecord>;
};

const DEFAULT_DATA: AppData = {
  tasks: {
    weekday: [
      {
        id: "wd-1",
        title: "Striver's sheet — DSA block",
        section: "fixed",
      },
      {
        id: "wd-2",
        title: "POTD + contest catch-up",
        section: "fixed",
      },
      {
        id: "wd-3",
        title: "Discord check",
        section: "fixed",
      },
      {
        id: "wd-4",
        title: "Tech-world skim",
        section: "fixed",
      },
      {
        id: "wd-5",
        title: "Web dev project — deep work session",
        section: "deep",
      },
    ],

    weekend: [
      {
        id: "we-1",
        title: "Striver's sheet + POTD/content catch-up",
        section: "fixed",
      },
      {
        id: "we-2",
        title: "Weekly contest",
        section: "fixed",
      },
      {
        id: "we-3",
        title: "Discord check",
        section: "fixed",
      },
      {
        id: "we-4",
        title: "Tech-world skim",
        section: "fixed",
      },
      {
        id: "we-5",
        title: "Open source — issue hunting / PR work",
        section: "extras",
      },
      {
        id: "we-6",
        title: "Cert course session",
        section: "extras",
      },
      {
        id: "we-7",
        title: "Web dev project (optional catch-up)",
        section: "deep",
      },
    ],
  },

  history: {},
};

function getLocalDate(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getToday() {
  return getLocalDate();
}

function getDayType(date = new Date()): DayType {
  const day = date.getDay();

  return day === 0 || day === 6 ? "weekend" : "weekday";
}

function formatDate(dateString: string) {
  const date = new Date(`${dateString}T00:00:00`);

  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function createId() {
  return crypto.randomUUID();
}

function App() {
  const today = getToday();
  const automaticDayType = getDayType();

  const [data, setData] = useState<AppData>(DEFAULT_DATA);
  const [dayType, setDayType] = useState<DayType>(automaticDayType);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(true);
  const [loaded, setLoaded] = useState(false);

  // Load data
  useEffect(() => {
    async function loadData() {
      const result = await chrome.storage.local.get("dailyStack");

      const savedData = result.dailyStack as AppData | undefined;

      if (savedData) {
        setData(savedData);

        const savedToday = savedData.history?.[today];

        if (savedToday) {
          setCompletedIds(savedToday.completedTaskIds);
        }
      }

      setLoaded(true);
    }

    loadData();
  }, [today]);

  const currentTasks = data.tasks[dayType];

  const fixedTasks = currentTasks.filter(
    (task) => task.section === "fixed"
  );

  const extraTasks = currentTasks.filter(
    (task) => task.section === "extras"
  );

  const deepTasks = currentTasks.filter(
    (task) => task.section === "deep"
  );

  const completedCount = completedIds.length;
  const totalCount = currentTasks.length;

  const progress =
    totalCount === 0 ? 0 : (completedCount / totalCount) * 100;

  // Save today's record
  useEffect(() => {
    if (!loaded) return;

    const record: DailyRecord = {
      date: today,
      dayType,
      tasks: currentTasks,
      completedTaskIds: completedIds,
    };

    const updatedData: AppData = {
      ...data,
      history: {
        ...data.history,
        [today]: record,
      },
    };

    chrome.storage.local.set({
      dailyStack: updatedData,
    });

    setData(updatedData);
  }, [completedIds]);

  function toggleTask(taskId: string) {
    setCompletedIds((current) => {
      if (current.includes(taskId)) {
        return current.filter((id) => id !== taskId);
      }

      return [...current, taskId];
    });
  }

  function addTask(section: Section, title: string) {
    if (!title.trim()) return;

    const newTask: Task = {
      id: createId(),
      title: title.trim(),
      section,
    };

    setData((current) => ({
      ...current,
      tasks: {
        ...current.tasks,
        [dayType]: [...current.tasks[dayType], newTask],
      },
    }));
  }

  function deleteTask(taskId: string) {
    setData((current) => ({
      ...current,
      tasks: {
        ...current.tasks,
        [dayType]: current.tasks[dayType].filter(
          (task) => task.id !== taskId
        ),
      },
    }));

    setCompletedIds((current) =>
      current.filter((id) => id !== taskId)
    );
  }

  const streak = useMemo(() => {
  let count = 0;
  const date = new Date();

  while (true) {
    const dateString = getLocalDate(date);
    const record = data.history[dateString];

    if (!record) break;

    const hasCompletedTask =
      record.completedTaskIds.length > 0;

    if (!hasCompletedTask) break;

    count++;

    date.setDate(date.getDate() - 1);
  }

  return count;
  }, [data.history]);

  function getLast112Days() {
  const activeDates = Object.values(data.history)
    .filter((record) => record.completedTaskIds.length > 0)
    .map((record) => record.date)
    .sort();

  // No activity yet
  if (activeDates.length === 0) {
    const days: string[] = [];
    const today = new Date();

    for (let i = 111; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);

      days.push(getLocalDate(date));
    }

    return days;
  }

  // First activity = starting point
  const startDate = new Date(`${activeDates[0]}T00:00:00`);

  const days: string[] = [];

  // Always generate exactly 112 days
  for (let i = 0; i < 112; i++) {
    const date = new Date(startDate);

    date.setDate(startDate.getDate() + i);

    days.push(getLocalDate(date));
  }

  return days;
}

  function getCompletionLevel(date: string) {
    const record = data.history[date];

    if (!record || record.tasks.length === 0) {
      return 0;
    }

    return Math.round(
      (record.completedTaskIds.length / record.tasks.length) * 5
    );
  }

  const heatmapDays = getLast112Days();

  const selectedRecord = selectedDate
    ? data.history[selectedDate]
    : null;

  if (!loaded) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className={darkMode ? "app dark" : "app light"}>
      <div className="container">

        {/* HEADER */}
        <header className="header">
          <div>
            <h1>The Daily Stack</h1>
          </div>

          <div className="header-right">

            <div className="streak">
              🔥 {streak}
            </div>

            <button
              className="theme-toggle"
              onClick={() => setDarkMode((current) => !current)}
              title="Toggle theme"
            >
              {darkMode ? "☾" : "☀"}
            </button>

          </div>
        </header>

        {/* DAY TABS */}
        <div className="tabs">

          <button
            className={dayType === "weekday" ? "tab active" : "tab"}
            onClick={() => setDayType("weekday")}
          >
            Weekday
          </button>

          <button
            className={dayType === "weekend" ? "tab active" : "tab"}
            onClick={() => setDayType("weekend")}
          >
            Weekend
          </button>

        </div>

        {/* PROGRESS */}
        <div className="progress-row">

          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>

          <span>
            {completedCount}/{totalCount} done
          </span>

        </div>

        {/* TASK SECTIONS */}

        <TaskSection
          title="Fixed habits"
          tasks={fixedTasks}
          completedIds={completedIds}
          onToggle={toggleTask}
          onDelete={deleteTask}
          onAdd={(title) => addTask("fixed", title)}
        />

        <TaskSection
          title="Extras"
          tasks={extraTasks}
          completedIds={completedIds}
          onToggle={toggleTask}
          onDelete={deleteTask}
          onAdd={(title) => addTask("extras", title)}
        />

        <TaskSection
          title="Deep work"
          tasks={deepTasks}
          completedIds={completedIds}
          onToggle={toggleTask}
          onDelete={deleteTask}
          onAdd={(title) => addTask("deep", title)}
        />

        {/* HISTORY */}
        <section className="history-section">

          <div className="section-divider" />

          <div className="history-header">

            <h2>Completion history</h2>

            <div className="legend">
              <span>less</span>

              <i className="heat level-0" />
              <i className="heat level-1" />
              <i className="heat level-2" />
              <i className="heat level-3" />
              <i className="heat level-4" />
              <i className="heat level-5" />

              <span>more</span>
            </div>

          </div>

          <div className="heatmap">

            {heatmapDays.map((date) => (
              <button
                key={date}
                className={`heat level-${getCompletionLevel(date)} ${
                  selectedDate === date ? "selected" : ""
                }`}
                onClick={() => {
                  if (data.history[date]) {
                    setSelectedDate(
                      selectedDate === date ? null : date
                    );
                  }
                }}
                title={date}
              />
            ))}

          </div>

          {/* ONLY SHOW WHEN A DAY IS SELECTED */}
          {selectedRecord && (
            <HistoryDetails record={selectedRecord} />
          )}

          {!selectedRecord && (
            <p className="history-hint">
              Tap a square to see that day.
            </p>
          )}

        </section>

        <div className="history-note">
          <p>Past days can't be edited</p>
          <a
            className="github-link"
            href="https://github.com/divanshsingh/daily-stack"
            target="_blank"
            rel="noreferrer">
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true">
              <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.1 3.3 9.42 7.88 10.95.58.1.79-.25.79-.56v-2.17c-3.2.7-3.87-1.54-3.87-1.54-.53-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.2 1.77 1.2 1.04 1.77 2.73 1.26 3.4.96.1-.75.41-1.26.74-1.55-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.29 1.2-3.1-.12-.29-.52-1.46.11-3.05 0 0 .98-.31 3.2 1.18a11.1 11.1 0 0 1 5.82 0c2.22-1.49 3.2-1.18 3.2-1.18.63 1.59.23 2.76.11 3.05.75.81 1.2 1.84 1.2 3.1 0 4.43-2.69 5.4-5.25 5.68.42.36.79 1.08.79 2.18v3.23c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
            </svg>
            <span>GitHub</span>
          </a>
        </div>
      </div>
    </div>
  );
}

function TaskSection({
  title,
  tasks,
  completedIds,
  onToggle,
  onDelete,
  onAdd,
}: {
  title: string;
  tasks: Task[];
  completedIds: string[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onAdd: (title: string) => void;
}) {
  const [input, setInput] = useState("");

  function submit() {
    if (!input.trim()) return;

    onAdd(input);
    setInput("");
  }

  return (
    <section className="task-section">

      <h2>{title}</h2>

      {tasks.map((task) => {
        const completed = completedIds.includes(task.id);

        return (
          <div className="task-row" key={task.id}>

            <button
              className={
                completed
                  ? "checkbox checked"
                  : "checkbox"
              }
              onClick={() => onToggle(task.id)}
            >
              {completed && "✓"}
            </button>

            <span
              className={
                completed
                  ? "task-title completed"
                  : "task-title"
              }
            >
              {task.title}
            </span>

            <button
              className="delete"
              onClick={() => onDelete(task.id)}
            >
              ×
            </button>

          </div>
        );
      })}

      <div className="add-row">

        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              submit();
            }
          }}
          placeholder="Add task..."
        />

        <button className="plus-button" onClick={submit}>+</button>

      </div>

    </section>
  );
}

function HistoryDetails({
  record,
}: {
  record: DailyRecord;
}) {
  return (
    <div className="history-details">

      <h3>
        {formatDate(record.date)} · {record.dayType}
      </h3>

      {record.tasks.map((task) => {
        const completed = record.completedTaskIds.includes(
          task.id
        );

        return (
          <div
            className={
              completed
                ? "history-task completed"
                : "history-task"
            }
            key={task.id}
          >
            <span>{completed ? "✓" : "○"}</span>
            {task.title}
          </div>
        );
      })}

    </div>
  );
}

export default App;