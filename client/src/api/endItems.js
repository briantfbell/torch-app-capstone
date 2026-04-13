const BASE_URL = "http://localhost:8080/end-items";

export async function getEndItemById(id) {
    const response = await fetch(`${BASE_URL}/${id}`, {
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Failed to fetch end item");
    }

    return response.json();
}

export async function updateEndItemNotes(id, notes) {
    const response = await fetch(`${BASE_URL}/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ notes }),
    });

    if (!response.ok) {
        throw new Error("Failed to save notes");
    }

    return response.json();
}