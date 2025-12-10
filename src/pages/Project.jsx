import React, { useEffect, useState } from "react";
// import axios from "axios";
import Navbar from "../components/Navbar";
import ProjectHeader from "../components/ProjectHeader";
import Board from "../components/Board";
// import AuthContext from "../context/AuthContext";
import SideBar from "../components/SideBar";
import notFound from "../static/24.svg";
import Loading from "../components/Loading";
import ProjectForm from "../components/ProjectForm";
import { mockProject } from "../static/mockData"; 

// const baseURL = process.env.REACT_APP_BACKEND_URL;
const wsURL = process.env.REACT_APP_WS_URL;   

function Project() {
  const [sidebar, setSidebar] = useState(false);
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState(null);
  const [open, setOpen] = useState(false);

   const [ws, setWs] = useState(null);

  // ⭐ 第一个 effect：直接用 mockProject 填充，不再请求后端
  useEffect(() => {
    setProject(mockProject);
    setLoading(false);
  }, []);

    useEffect(() => {
    if (!project || !wsURL) return;

    const socket = new WebSocket(wsURL);
    setWs(socket);                 // ⭐ 用 state 保存

    socket.onopen = () => {
      console.log("WS connected");
      socket.send(
        JSON.stringify({
          type: "JOIN_PROJECT",
          project: project.slug,
        })
      );
    };

    socket.onclose = () => {
      console.log("WS closed");
    };

    socket.onerror = (err) => {
      console.error("WS error:", err);
    };

    return () => {
      socket.close();
    };
  }, [project, wsURL]);


  return (
    <>
      {open && project && (
        <ProjectForm
          close={() => setOpen(false)}
          projectName={project.name}
          projectDescription={project.description}
          id={project.id}
        />
      )}
      {sidebar && (
        <SideBar
          sidebar={() => {
            setSidebar(false);
          }}
        />
      )}
      <div className="flex flex-col items-center h-screen w-screen dark:bg-gray-900 overflow-y-auto home">
        <Navbar
          sidebar={() => {
            setSidebar(true);
          }}
        />
        <div className="grow flex flex-col w-full items-center">
          {project ? (
            <>
              <ProjectHeader data={project} open={() => setOpen(true)} />
              <Board project={project} ws={ws} />
            </>
          ) : (
            <div className="grow grid items-center justify-center py-10">
              {loading ? (
                <Loading />
              ) : (
                <div>
                  <h1 className="text-center text-xl md:text-4xl font-semibold text-notFound">
                    Project{" "}
                    <span className="text-gray-900 dark:text-white">
                      not found!
                    </span>
                  </h1>
                  <img
                    src={notFound}
                    className="h-96 w-auto spin"
                    alt="not found"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Project;

