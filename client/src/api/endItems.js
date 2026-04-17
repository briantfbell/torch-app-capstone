const BASE_URL = "http://localhost:8080";

export async function getEndItemById(id) {
  const response = await fetch(`${BASE_URL}/end-items/${id}`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch end item");
  }

  return response.json();
}

export async function updateEndItemNotes(id, note) {
  const response = await fetch(`${BASE_URL}/serial-items/${id}`, {
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

export async function getEndItemSeenStatus(serialEndItemId) {
  const response = await fetch(
    `${BASE_URL}/current-history/end-items/${serialEndItemId}`,
    {
      credentials: "include",
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch seen status");
  }

  const data = await response.json();
  return data.currentHistory;
}

export async function getEndItemHistoryBySerial(serial_number) {
  const response = await fetch(
    `${BASE_URL}/current-history/end-items/serial/${serial_number}`,
    {
      credentials: "include",
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch seen status");
  }

  const data = await response.json();
  return data.currentHistory;
}

export async function getEndItemHistoryBySerialId(serial_number) {
  const response = await fetch(
    `${BASE_URL}/current-history/end-items/serialid/${serial_number}`,
    {
      credentials: "include",
    },
  );

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error("Failed to fetch seen status");
  }

  const data = await response.json();
  return data.currentHistory;
}

export async function getEndItemCurrentHistory() {
  const response = await fetch(`${BASE_URL}/current-history/end-items/`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch seen status");
  }

  const data = await response.json();
  return await data.currentHistory;
}

export async function postEndItemSeen(
  seen,
  location,
  last_seen,
  user_id,
  end_item_id,
  serial_number,
) {
  const response = await fetch(`${BASE_URL}/current-history/end-items`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      seen,
      location,
      last_seen,
      user_id,
      end_item_id,
      serial_number,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Failed to save new end item history: ${response.status} ${errorText}`,
    );
  }

  return response.json();
}
