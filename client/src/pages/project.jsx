import { useEffect, useState } from "react";
import {
  fetchProjects,
  addTaskToProject,
  deleteProject,
} from "../api/projectApi"; // Ensure addTaskToProject is defined
import { BsThreeDots } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from "chart.js";

ChartJS.register(Title, Tooltip, Legend, ArcElement);

function Project() {
  const storedUserToken = localStorage.getItem("User");
  let user = null;

  if (storedUserToken) {
    try {
      user = jwtDecode(storedUserToken);
    } catch (error) {
      console.error("Failed to decode token:", error);
    }
  }

  const isAdmin = user && user.role === "Admin";

  const [projects, setProjects] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(null);
  const [showModal, setShowModal] = useState(false); // Modal visibility
  const [selectedProjectId, setSelectedProjectId] = useState(null); // Track selected project ID
  const [taskName, setTaskName] = useState(""); // Task name
  const [taskDescription, setTaskDescription] = useState(""); // Task description
  const [showDeleteModal, setShowDeleteModal] = useState(false); // To show/hide delete modal
  const [projectToDelete, setProjectToDelete] = useState(null); // Store the project to delete
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOption, setFilterOption] = useState("newest"); // State to track filter
  const navigate = useNavigate();

  // Handle project addition
  const handleAddProject = () => {
    navigate("/add-project");
  };

  // Handle dropdown toggle
  const toggleDropdown = (index) => {
    setDropdownVisible(dropdownVisible === index ? null : index);
  };

  // Delete project
  const openDeleteModal = (projectId, e) => {
    e.stopPropagation();
    setProjectToDelete(projectId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteProject(projectToDelete);
      setProjects(await fetchProjects());
      setShowDeleteModal(false);
      setProjectToDelete(null);
    } catch (error) {
      console.error("Failed to delete project:", error);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setProjectToDelete(null);
  };

  // Handle task addition
  const handleAddTask = (projectId, e) => {
    e.stopPropagation();
    setSelectedProjectId(projectId);
    setShowModal(true);
  };

  const clickCard = (projectId) => {
    navigate(`/project/${projectId}`);
  };

  // Fetch projects
  useEffect(() => {
    const getProjects = async () => {
      try {
        const data = await fetchProjects();
        setProjects(data);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      }
    };
    getProjects();
  }, []);

  // Search input change handler
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter projects based on filter option
  const filteredProjects = projects
    .filter((project) =>
      `${project.projectName} ${project.clientName}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (filterOption) {
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "priority": {
          const priorityMap = { high: 3, medium: 2, low: 1 };
          return (
            priorityMap[b.priorityLevel.toLowerCase()] -
            priorityMap[a.priorityLevel.toLowerCase()]
          );
        }
        case "deadline":
          return new Date(a.deadline) - new Date(b.deadline); // Shorter deadline comes first
        default:
          return 0;
      }
    });

  // Task submission
  const handleAddTaskSubmit = async () => {
    if (!taskName || !taskDescription) {
      alert("Please fill in both fields");
      return;
    }

    try {
      await addTaskToProject(selectedProjectId, {
        name: taskName,
        description: taskDescription,
      });
      setTaskName("");
      setTaskDescription("");
      setShowModal(false);
      const updatedProjects = await fetchProjects();
      setProjects(updatedProjects);
    } catch (error) {
      console.error("Failed to add task:", error);
    }
  };

  const handleCancel = () => {
    setShowModal(false);
    setTaskName("");
    setTaskDescription("");
  };

  // Pie chart completion data
  const getCompletionData = (project) => {
    const completedTasks = project.tasks.filter(
      (task) => task.status === "Completed"
    ).length;
    const totalTasks = project.tasks.length;
    const completionPercentage =
      totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    return {
      labels: ["Completed", "Remaining"],
      datasets: [
        {
          data: [completionPercentage, 100 - completionPercentage],
          backgroundColor: ["#4caf50", "#f44336"],
          borderWidth: 1,
        },
      ],
    };
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".dropdown")) {
        setDropdownVisible(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <section className="p-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Projects</h1>
        {isAdmin && (
          <button
            onClick={handleAddProject}
            className="bg-blue-600 text-white px-5 py-2 rounded-md shadow-lg hover:bg-blue-600 transition duration-200"
          >
            Add New Project
          </button>
        )}
      </div>

      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Search Name"
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-1/5 px-4 py-2 border rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Filter Dropdown */}
        <div className="relative dropdown">
          <button
            className="px-4 py-2 bg-gray-200 rounded-md shadow hover:bg-gray-300"
            onClick={() => toggleDropdown("filter")}
          >
            Filter
          </button>
          {dropdownVisible === "filter" && (
            <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-md z-10">
              <button
                className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => {
                  setFilterOption("newest");
                  toggleDropdown(null);
                }}
              >
                Newest
              </button>
              <button
                className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => {
                  setFilterOption("priority");
                  toggleDropdown(null);
                }}
              >
                Priority
              </button>
              <button
                className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => {
                  setFilterOption("deadline");
                  toggleDropdown(null);
                }}
              >
                Deadline
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project, index) => (
          <div
            key={index}
            className="bg-white p-5 shadow-lg rounded-lg relative cursor-pointer transform transition-transform duration-300 hover:scale-105 max-w-xs mx-auto dropdown"
            onClick={() => clickCard(project._id)}
          >
            <div className="flex flex-col space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">{project.projectName}</h3>
                <div className="relative">
                  {isAdmin && (
                    <>
                      <BsThreeDots
                        className="text-gray-600 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleDropdown(index);
                        }}
                      />
                      {dropdownVisible === index && (
                        <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-md">
                          <button
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={(e) => handleAddTask(project._id, e)}
                          >
                            Add Task
                          </button>
                          <button
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={(e) => openDeleteModal(project._id, e)}
                          >
                            Delete Project
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              <p className="text-sm text-gray-600">
                Client Name: {project.clientName}
              </p>
              <p className="text-sm text-gray-600">
                Tasks: {project.tasks.length}
              </p>
              <p className="text-sm text-gray-700">
                Priority: {project.priorityLevel}
              </p>
              <p className="text-sm text-gray-700">
                Deadline: {new Date(project.deadline).toLocaleDateString()}
              </p>

              <div className="mt-4">
                <h4 className="text-sm font-semibold mb-2">Team Members:</h4>
                <ul className="flex flex-wrap gap-2 text-sm text-gray-600">
                  {project.teamMembers.length > 0 ? (
                    project.teamMembers.map((member, i) => (
                      <li key={i} className="bg-gray-200 px-2 py-1 rounded-md">
                        {member.label}
                      </li>
                    ))
                  ) : (
                    <li>No team members</li>
                  )}
                </ul>
              </div>

              <div className="mt-4">
                <h4 className="text-sm font-semibold mb-2">
                  Completion Status:
                </h4>
                <div style={{ height: "150px", width: "100%" }}>
                  <Pie
                    data={getCompletionData(project)}
                    options={{ responsive: true, maintainAspectRatio: false }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Task Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl mb-4">Add New Task</h2>
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">
                Task Name
              </label>
              <input
                type="text"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">
                Task Description
              </label>
              <textarea
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                rows="4"
              />
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTaskSubmit}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Add Task
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm text-center">
            <h2 className="text-xl font-semibold mb-4">Delete Project</h2>
            <p className="mb-6">
              Are you sure you want to permanently delete this project?
            </p>
            <div className="flex justify-between gap-4">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-200 text-black rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default Project;
