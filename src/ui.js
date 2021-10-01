document.addEventListener("DOMContentLoaded", () => {
  App.init();
});

/**
 * Task form
 */
const todoForm = document.querySelector("#todoForm");

todoForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = todoForm["title"].value;
  const description = todoForm["description"].value;
  App.createTodo(title, description);
});