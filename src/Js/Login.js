// ========== SISTEMA DE ABAS ==========
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const API_BASE = '/api';

tabBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        const tabName = this.getAttribute('data-tab');

        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));

        this.classList.add('active');
        document.getElementById(tabName).classList.add('active');
    });
});

// ========== LOGIN ==========
const loginForm = document.getElementById('login-form');
const loginBtn = document.getElementById('login-btn');

loginForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const usuario = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const errorMsg = document.getElementById('loginErrorMsg');

    if (usuario === "" || password === "") {
        errorMsg.textContent = "Por favor, preencha todos os campos!";
        return;
    }

    try {
        loginBtn.disabled = true;
        const res = await fetch(`${API_BASE}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: usuario, password }),
        });
        const data = await res.json();

        if (!res.ok) {
            errorMsg.textContent = data.error || 'Usuario ou senha incorretos';
            return;
        }

        salvarUsuarioLogado(data.user);
        window.location.href = "index.html";
    } catch (err) {
        errorMsg.textContent = 'Nao foi possivel conectar ao backend.';
    } finally {
        loginBtn.disabled = false;
    }
});

// ========== CADASTRO ==========
const signupForm = document.getElementById('signup-form');
const signupBtn = document.getElementById('signup-btn');

signupForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const username = document.getElementById('signup-username').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const errorMsg = document.getElementById('signupErrorMsg');

    errorMsg.textContent = "";
    errorMsg.style.color = "";

    if (username === "" || email === "" || password === "" || confirmPassword === "") {
        errorMsg.textContent = "Por favor, preencha todos os campos!";
        return;
    }

    if (username.length < 3) {
        errorMsg.textContent = "O usuario deve ter no minimo 3 caracteres!";
        return;
    }

    if (!email.includes('@') || !email.includes('.')) {
        errorMsg.textContent = "Por favor, insira um email valido!";
        return;
    }

    if (password.length < 6) {
        errorMsg.textContent = "A senha deve ter no minimo 6 caracteres!";
        return;
    }

    if (password !== confirmPassword) {
        errorMsg.textContent = "As senhas nao correspondem!";
        return;
    }

    try {
        signupBtn.disabled = true;
        const res = await fetch(`${API_BASE}/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password }),
        });
        const data = await res.json();

        if (!res.ok) {
            errorMsg.textContent = data.error || 'Erro ao cadastrar usuario';
            return;
        }

        errorMsg.textContent = "Cadastro realizado com sucesso! Voce sera redirecionado...";
        errorMsg.style.color = "#27ae60";
        salvarUsuarioLogado(data.user);

        setTimeout(() => {
            window.location.href = "index.html";
        }, 1000);
    } catch (err) {
        errorMsg.textContent = 'Nao foi possivel conectar ao backend.';
    } finally {
        signupBtn.disabled = false;
    }
});

function salvarUsuarioLogado(user) {
    localStorage.setItem('logged', 'true');
    localStorage.setItem('userId', user.id);
    localStorage.setItem('username', user.username);
    localStorage.setItem('userEmail', user.email);
}
