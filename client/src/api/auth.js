const API_URL = "http://localhost:8080";

const parseJsonSafely = async (res) => {
    const text = await res.text();
    const contentType = res.headers.get("content-type") ?? "";

    if (!text) {
        return null;
    }

    if (!contentType.includes("application/json")) {
        return {
            error: `Unexpected response from server (${res.status}).`,
            status: res.status,
            raw: text,
        };
    }

    try {
        return JSON.parse(text);
    } catch (e) {
        return {
            error: `Unexpected response from server (${res.status}).`,
            status: res.status,
        };
    }
};

export const getToken = () => localStorage.getItem("token");

export const logout = () => localStorage.removeItem("token");
export const logoutFunc = async () => {
    await fetch('http://localhost:8080/auth/logout', {
        method: 'POST',
        credentials: 'include',
    })
}

export const getCurrentUser = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    return JSON.parse(atob(token.split(".")[1]));
};

<<<<<<< HEAD
export const tryLogin = async (username, password) => {

    try {
        const res = await fetch(`${API_URL}/auth/login/`, {
            method: "POST",
            credentials: "include",
            body: JSON.stringify({email: username, password}),
=======
export const tryLogin = async (email, password) => {
    try {
        // console.log(email, password)
        const res = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            body: JSON.stringify({ email, password }),
>>>>>>> origin/main
            headers: { "Content-type": "application/json; charset=UTF-8" },
        });
        const data = await parseJsonSafely(res);

        if (data.token) {
            localStorage.setItem("token", data.token);
            alert(`Successfully logged in as: ${data.token}`)
        }
        return data;
    } catch (e) {
        console.error(e);
    }
};