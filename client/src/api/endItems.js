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

export async function updateEndItemNotes(id, note) {
    const response = await fetch(`http://localhost:8080/end-items/${id}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ note }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to save notes: ${response.status} ${errorText}`);
    }

    return response.json();
}