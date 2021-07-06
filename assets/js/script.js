"use strict";

// SELECTORS
const formEl = document.getElementById("form");
const todoInputEl = document.getElementById("todoInput");
const todoListContainer = document.querySelector(".todo__list");
const currentDay = document.getElementById("currentDay");
const currentDate = document.getElementById("currentDate");

const date = new Date();
const day = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const month = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

currentDay.textContent = day[date.getDay()];
currentDate.textContent = `${
  month[date.getMonth()]
} ${date.getDate()}, ${date.getFullYear()}`;

// FUNCTIONS
// add todo from input to list
function addTodo(todo) {
  const liEl = document.createElement("li");
  liEl.classList.add("bounceIn");
  liEl.innerHTML = `
    <span class="text">${todo}</span>
    <div class="options">
      <span id="check" class="fas fa-check"></span>
      <span id="edit" class="fas fa-edit"></span>
      <span id="delete" class="fas fa-trash-alt"></span>
    </div>
  `;
  todoListContainer.appendChild(liEl);
}

// delete todo
function deleteTodo(todo) {
  if (todo.classList.contains("fa-trash-alt") || todo.id === "delete") {
    const todoLiEl = todo.closest("li"); // selects closest li node
    todoLiEl.classList.remove("bounceIn");
    todoLiEl.classList.add("bounceOutDown");

    setTimeout(() => {
      todoLiEl.remove();
    }, 1000);

    deleteFromLocalStorage(todo);
  }
}

// edit todo
function editTodo(todo) {
  if (todo.classList.contains("fa-edit") || todo.id === "edit") {
    const todoLiEl = todo.closest("li");
    todoInputEl.value = todoLiEl.textContent.trim();
    todoLiEl.remove();
    deleteFromLocalStorage(todo);
  }
}

// complete todo
function completeTodo(todo) {
  if (todo.classList.contains("fa-check") || todo.id === "check") {
    const crossTodo = todo.closest("li");
    crossTodo.firstElementChild.classList.toggle("completed");
  }
}

// save todos to local storage
function saveToLocalStorage(todo) {
  let todoArr;
  if (localStorage.getItem("todos") === null) {
    todoArr = [];
  } else {
    todoArr = JSON.parse(localStorage.getItem("todos")); // JSON string --> obj
  }
  todoArr.push(todo);
  localStorage.setItem("todos", JSON.stringify(todoArr)); // obj or array --> JSON string
}

// get and display todos from local storage
function getFromLocalStorage() {
  const todoArr = JSON.parse(localStorage.getItem("todos"));
  if (todoArr) {
    todoArr.forEach((todo) => {
      addTodo(todo);
    });
  }
}

// delete todo from local storage
function deleteFromLocalStorage(todo) {
  const todoArr = JSON.parse(localStorage.getItem("todos"));
  const todoLiEl = todo.closest("li");

  const todoItemRemaining = todoArr.filter(
    (todo) => todoLiEl.textContent.trim() !== todo
  );

  localStorage.setItem("todos", JSON.stringify(todoItemRemaining));
}

// add/enter button to create
function displayTodo(todo) {
  todo.preventDefault();

  const inputTodo = todoInputEl.value;
  if (inputTodo != "" && inputTodo != " ") {
    addTodo(inputTodo);
    saveToLocalStorage(inputTodo);
  }
  todoInputEl.value = "";
}

// EVENT LISTENERS
// get todos from local storage on document load
document.addEventListener("DOMContentLoaded", getFromLocalStorage);

todoListContainer.addEventListener("click", (e) => {
  deleteTodo(e.target);
  editTodo(e.target);
  completeTodo(e.target);
});

// click button to add todo
formEl.addEventListener("click", displayTodo);

// press enter key to add todo
formEl.addEventListener("submit", displayTodo);
