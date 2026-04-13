const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080";


//Get all

export const tryGetEndItems = async () => {
    try {
        const res = await fetch(`${API_URL}/end-items`, {
            method: "GET",
            headers: {"Content-type": "application/json; charset=UTF-8"},
            credentials: 'include'
        });
        const data = await res.json();

        if (!res.ok) {
            return data;
        }

        return data;
    } catch (e) {
        console.error(e);
        return {message: "Unable to reach the server."};
    }
};

export const tryGetSerialItems = async () => {
    try {
        const res = await fetch(`${API_URL}/serial-items`, {
            method: "GET",
            headers: {"Content-type": "application/json; charset=UTF-8"},
            credentials: 'include'
        });
        const data = await res.json();

        if (!res.ok) {
            return data;
        }

        return data;
    } catch (e) {
        console.error(e);
        return {message: "Unable to reach the server."};
    }
};

export const tryGetComponents = async () => {
    try {
        const res = await fetch(`${API_URL}/components`, {
            method: "GET",
            headers: {"Content-type": "application/json; charset=UTF-8"},
            credentials: 'include'
        });
        const data = await res.json();

        if (!res.ok) {
            return data;
        }

        return data;
    } catch (e) {
        console.error(e);
        return {message: "Unable to reach the server."};
    }
};


//Component current history and archived

export const tryGetHistoryComponent = async () => {
    try {
        const res = await fetch(`${API_URL}/current-history/components`, {
            method: "GET",
            headers: {"Content-type": "application/json; charset=UTF-8"},
            credentials: 'include'
        });
        const data = await res.json();

        if (!res.ok) {
            return data;
        }

        return data;
    } catch (e) {
        console.error(e);
        return {message: "Unable to reach the server."};
    }
};

export const tryGetHistoryComponentArchive = async () => {
    try {
        const res = await fetch(`${API_URL}/archived-history/components`, {
            method: "GET",
            headers: {"Content-type": "application/json; charset=UTF-8"},
            credentials: 'include'
        });
        const data = await res.json();

        if (!res.ok) {
            return data;
        }

        return data;
    } catch (e) {
        console.error(e);
        return {message: "Unable to reach the server."};
    }
};


//End items current history and archived

export const tryGetHistoryEndItems = async () => {
    try {
        const res = await fetch(`${API_URL}/current-history/end-items`, {
            method: "GET",
            headers: {"Content-type": "application/json; charset=UTF-8"},
            credentials: 'include'
        });
        const data = await res.json();

        if (!res.ok) {
            return data;
        }

        return data;
    } catch (e) {
        console.error(e);
        return {message: "Unable to reach the server."};
    }
};

export const tryGetHistoryEndItemArchive = async () => {
    try {
        const res = await fetch(`${API_URL}/archived-history/end-items`, {
            method: "GET",
            headers: {"Content-type": "application/json; charset=UTF-8"},
            credentials: 'include'
        });
        const data = await res.json();

        if (!res.ok) {
            return data;
        }

        return data;
    } catch (e) {
        console.error(e);
        return {message: "Unable to reach the server."};
    }
};