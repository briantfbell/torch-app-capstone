const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

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

export const getCurrentUser = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
        return JSON.parse(atob(token.split(".")[1]));
    } catch (e) {
        console.error(e);
        return null;
    }
};

export const tryLogin = async (email, password) => {
    try {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            body: JSON.stringify({ email, password }),
            headers: { "Content-type": "application/json; charset=UTF-8" },
            credentials: "include",
        });
        const data = await parseJsonSafely(res);

        if (!res.ok) {
            return data;
        }

        if (data?.token) {
            localStorage.setItem("token", data.token);
        }
        return data;
    } catch (e) {
        console.error(e);
        return { message: "Unable to reach the server." };
    }
};
