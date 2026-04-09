const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

export const tryGetEndItems = async () => {
    try {
        const res = await fetch(`${API_URL}/end-items`, {
            method: "GET",
            headers: { "Content-type": "application/json; charset=UTF-8" },
            credentials: 'include'
        });
        const data = res.json();

        if (!res.ok) {
            return data;
        }

        return data;
    } catch (e) {
        console.error(e);
        return { message: "Unable to reach the server." };
    }
};

export const tryGetSerialItems = async () => {
    try {
        const res = await fetch(`${API_URL}/serial-items`, {
            method: "GET",
            headers: { "Content-type": "application/json; charset=UTF-8" },
            credentials: 'include'
        });
        const data = res.json();

        if (!res.ok) {
            return data;
        }

        return data;
    } catch (e) {
        console.error(e);
        return { message: "Unable to reach the server." };
    }
};