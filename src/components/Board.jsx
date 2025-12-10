// src/components/Board.jsx
import { useEffect, useState } from "react";
import Lane from "./Lane";
import { mockTasks } from "../static/mockData";

const lanes = [
  { id: 1, title: "To Do" },
  { id: 2, title: "In Progress" },
  { id: 3, title: "Review" },
  { id: 4, title: "Done" },
];

function Board({ project, ws }) {
  // 初始任务：用假数据
  const [tasks, setTasks] = useState(mockTasks);

  const loading = false;
  const error = null;

  function onDrop(e, laneId) {
    const id = e.dataTransfer.getData("id");
    const numericId = Number(id); // 把字符串 id 转成数字，方便和 task.id 比较

    // 本地更新任务所在列
    const updatedTasks = tasks.map((task) => {
      if (task.id === numericId) {
        return { ...task, stage: laneId };
      }
      return task;
    });

    setTasks(updatedTasks);

    // 通过 WebSocket 广播这个移动事件
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(
        JSON.stringify({
          type: "MOVE_TASK",
          project: project.slug,
          taskId: numericId,
          stage: laneId,
        })
      );
    }
  }

  function onDragStart(event, id) {
    event.dataTransfer.setData("id", id);
  }

  function onDragOver(e) {
    e.preventDefault();
  }

  // 监听 WebSocket 消息：别的客户端移动任务时更新本地 tasks
  useEffect(() => {
    if (!ws) return; // 没连接就不挂监听

    function handleMessage(event) {
      try {
        const msg = JSON.parse(event.data);
        console.log("WS message on client:", msg);

        if (msg.type === "MOVE_TASK" && msg.project === project.slug) {
          setTasks((prev) =>
            prev.map((task) =>
              task.id === msg.taskId ? { ...task, stage: msg.stage } : task
            )
          );
        }
      } catch (err) {
        console.error("Failed to parse WS message", err);
      }
    }

    ws.addEventListener("message", handleMessage);

    return () => {
      ws.removeEventListener("message", handleMessage);
    };
  }, [ws, project.slug]);

  return (
    <div className="grow flex flex-col w-full items-center bg-gray-100 p-5 pb-0 dark:bg-gray-700">
      <div
        className="scrollbar w-full px-3 xl:px-10 max-w-8xl grid gap-5 justify-between overflow-x-auto pb-5"
        style={{ gridTemplateColumns: "1fr 1fr 1fr 1fr" }}
      >
        {lanes.map((lane) => (
          <Lane
            key={lane.id}
            title={lane.title}
            laneId={lane.id}
            loading={loading}
            error={error}
            tasks={tasks.filter((task) => +task.stage === lane.id)}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDrop={onDrop}
            project={project}
          />
        ))}
      </div>
    </div>
  );
}

export default Board;
