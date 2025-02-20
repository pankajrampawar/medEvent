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


export async function getEventDetails(id = null) {
    console.log("Id of the Event: ", id);

    // Construct the URL based on whether an ID is provided
    const url = id ? `/api/events?id=${id}` : `/api/events`;

    const response = await fetch(url, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        const errorText = await response.json();
        throw new Error(errorText.error || "Unknown error occurred, please try again");
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

export async function updateUser(userId, updatedData) {
    console.log("Updating user with ID:", userId, "Data:", updatedData);


    const finalId = {
        userId: userId, // Include the userId
        ...updatedData, // Include all the updated data
    };

    console.log("Final data being sent:", finalId)

    const response = await fetch(`/api/user/`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(finalId),
    });

    if (!response.ok) {
        const errorText = await response.json();
        throw new Error(errorText.message || "Unknown error occurred, please try again later");
    }

    return response.json();
}