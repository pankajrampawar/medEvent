export async function createEvent(eventData) {
    console.log("Data being sent:", eventData); // Log the data before sending

    const response = await fetch('/api/events', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData), // Ensure the body is not empty or undefined
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to create event");
    }

    return response.json();
}


export async function getEventDetails(id) {
    console.log("Id of the Event: ", id);

    const response = await fetch(`/api/events?id=${id}`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        const errorText = await response.json();;
        throw new Error(errorText || "Unknow error occured, please try again");
    }

    return response.json();
}

export async function addNewUser(userData) {
    console.log("user data: ", userData);

    const response = await fetch("/api/user", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
    });

    if (!response.ok) {
        const errorText = await response.json();
        throw new Error(errorText || "Unknow error occured, please try again later");
    }
    return response.json();
}

export async function getUserFromEvent(eventId) {
    const response = await fetch(`/api/user?id=${eventId}`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        const errorText = await response.json();
        throw new Error(errorText || "Unknow error occured, please try again later.");
    }

    return response.json();
}