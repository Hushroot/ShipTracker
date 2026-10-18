let projects = JSON.parse(localStorage.getItem("projects")) || [];
let editingProject = null;
let form = document.getElementById("projectForm");

form.addEventListener("submit", function (event) {
  event.preventDefault();
  let name = document.getElementById("projectName").value.trim();
  let program = document.getElementById("projectProgram").value;
  let status = document.getElementById("projectStatus").value;
  let notes = document.getElementById("projectNotes").value.trim();
  let deadline = document.getElementById("projectDeadline").value;
  let repo = document.getElementById("projectRepo").value.trim();

  if (name === "") {
    return;
  }
  let project = {
    name: name,
    program: program,
    status: status,
    description: notes,
    deadline: deadline,
    repo: repo,
  };

  if (editingProject === null) {
    projects.push(project);
  } else {
    Object.assign(editingProject, project);
    editingProject = null;
  }
  localStorage.setItem("projects", JSON.stringify(projects));
  showProjects();
  form.reset();
  document.getElementById("cancelEdit").hidden = true;
  form.querySelector('button[type="submit"]').textContent = "Add project";
});
function showProjects() {
  let projectList = document.getElementById("projectList");
  let emptyState = document.getElementById("emptyState");

  projectList.innerHTML = "";

  document.getElementById("totalProjects").textContent = projects.length;
  let active = projects.filter(function (project) {
    return project.status === "In Progress";
  });
  let shipped = projects.filter(function (project) {
    return project.status === "Shipped";
  });

  document.getElementById("activeProjects").textContent = active.length;
  document.getElementById("shippedProjects").textContent = shipped.length;

  let search = document.getElementById("search").value.trim().toLowerCase();

  let visibleCount = 0;

  let statusFilter = document.getElementById("statusFilter").value;

  let programFilter = document.getElementById("programFilter").value;
  for (let project of projects) {
    if (!project.name.toLowerCase().includes(search)) {
      continue;
    }

    if (statusFilter !== "" && project.status !== statusFilter) {
      continue;
    }

    if (programFilter !== "" && project.program !== programFilter) {
      continue;
    }

    visibleCount++;

    let card = document.createElement("div");
    card.className = "project";

    if (project.status === "Shipped") {
      card.classList.add("shipped");
    }

    let title = document.createElement("h3");
    title.textContent = project.name;

    let details = document.createElement("p");
    details.textContent = project.program + " · " + project.status;

    card.appendChild(title);
    card.appendChild(details);

    if (project.description) {
      let notes = document.createElement("p");
      notes.textContent = project.description;
      notes.className = "notes";
      card.appendChild(notes);
    }

    if (project.deadline) {
      let deadline = document.createElement("p");
      deadline.textContent = "Deadline: " + project.deadline;
      card.appendChild(deadline);
    }

    if (project.repo && project.repo.startsWith("https://")) {
      let link = document.createElement("a");
      link.href = project.repo;
      link.textContent = "Open project";
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      card.appendChild(link);
    }

    let deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";

    deleteButton.addEventListener("click", function () {
      if (confirm("Delete " + project.name + "?")) {
        if (editingProject === project) {
          editingProject = null;
          form.reset();
          form.querySelector('button[type="submit"]').textContent =
            "Add project";
          document.getElementById("cancelEdit").hidden = true;
        }
        projects = projects.filter(function (item) {
          return item !== project;
        });
        localStorage.setItem("projects", JSON.stringify(projects));
        showProjects();
      }
    });

    card.appendChild(deleteButton);

    let editButton = document.createElement("button");
    editButton.textContent = "Edit";

    editButton.addEventListener("click", function () {
      editingProject = project;

      document.getElementById("projectName").value = project.name;
      document.getElementById("projectProgram").value = project.program;
      document.getElementById("projectStatus").value = project.status;
      document.getElementById("projectNotes").value = project.description || "";
      document.getElementById("projectDeadline").value = project.deadline || "";
      document.getElementById("projectRepo").value = project.repo || "";
      form.querySelector('button[type="submit"]').textContent = "Save changes";
      document.getElementById("projectName").focus();

      document.getElementById("cancelEdit").hidden = false;
    });
    card.appendChild(editButton);

    let shipButton = document.createElement("button");

    if (project.status === "Shipped") {
      shipButton.textContent = "Reopen";
    } else {
      shipButton.textContent = "Mark as shipped";
    }

    shipButton.addEventListener("click", function () {
      if (project.status === "Shipped") {
        project.status = "In Progress";
      } else {
        project.status = "Shipped";
      }
      localStorage.setItem("projects", JSON.stringify(projects));
      showProjects();
    });
    card.appendChild(shipButton);
    projectList.appendChild(card);
  }
  emptyState.hidden = visibleCount > 0;

  if (projects.length === 0) {
    emptyState.textContent = "No projects yet. Add your first one!";
  } else {
    emptyState.textContent = "No projects match your search or filter.";
  }
}
showProjects();
document.getElementById("search").addEventListener("input", showProjects);
document
  .getElementById("statusFilter")
  .addEventListener("change", showProjects);
document
  .getElementById("programFilter")
  .addEventListener("change", showProjects);

document.getElementById("cancelEdit").addEventListener("click", function () {
  editingProject = null;
  form.reset();

  form.querySelector('button[type="submit"]').textContent = "Add project";
  document.getElementById("cancelEdit").hidden = true;
});
