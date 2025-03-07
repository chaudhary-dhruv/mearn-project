document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");
    const signupForm = document.getElementById("signup-form");
    const todoForm = document.getElementById("todo-form");

    //login 
    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const email = document.getElementById("login-email").value;
            const password = document.getElementById("login-password").value;

            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();
            if (data.token) {
                localStorage.setItem("token", data.token);
                window.location.href = "todo.html";
            } else {
                alert("Login Failed!" + data.message);
            }
        });
    }

    // SIGNUP FORM
    if (signupForm) {
        signupForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const name = document.getElementById("signup-name").value;
            const email = document.getElementById("signup-email").value;
            const password = document.getElementById("signup-password").value;

            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await res.json();
            if (data.success) {
                alert("Signup successful! Please login.");
                window.location.href = "login.html";
            } else {
                alert("Signup Failed!" + data.message);
            }
        });
    }

    // FETCH TO-DO LIST
    async function fetchTodos() {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/todo", {
            headers: { "Authorization": `Bearer ${token}` },
        });

        const todos = await res.json();
        const todoList = document.getElementById("todo-list");
        todoList.innerHTML = "";

        todos.forEach(todo => {
            const li = document.createElement("li");
            li.textContent = todo.task;
            todoList.appendChild(li);
        });
    }

    // ADD NEW TODO
    if (todoForm) {
        todoForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const task = document.getElementById("todo-input").value;
            const token = localStorage.getItem("token");

            await fetch("http://localhost:5000/api/todo", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ task }),
            });

            document.getElementById("todo-input").value = "";
            fetchTodos();
        });

        fetchTodos();
    }

    // LOGOUT FUNCTION
    document.getElementById("logout-btn")?.addEventListener("click", () => {
        localStorage.removeItem("token");
        window.location.href = "login.html";
    });
});
