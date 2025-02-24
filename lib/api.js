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

export async function updateEvent(id, eventData) {
    console.log("id: ", id + "\ndata: ", eventData);

    const response = await fetch(`/api/events?id=${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
    })

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to update event");
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


export async function addNewDoctor(doctorData) {
    console.log("Sending docotr data to backend, DoctorData: ", doctorData);

    const response = await fetch('/api/doctor', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(doctorData),
    });

    if (!response.ok) {
        const errorText = await response.json();
        throw new Error(errorText.message || "error");
    }

    return response.json();
}

export async function upDateDoctor(id, data) {
    console.log("id: ", id + "\nData: ", data);

    try {
        const response = await fetch(`/api/doctor?id=${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorText = await response.json();
            throw new Error(errorText.error || "Failed to update doctor");
        }

        const result = await response.json();
        return result; // Return the updated doctor data
    } catch (error) {
        console.error("Error updating doctor:", error.message);
        throw error; // Re-throw the error for handling in the calling function
    }
}

export async function getDoctorsList() {

    // Construct the URL based on whether an ID is provided
    const url = `/api/doctor`;

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

export async function getDoctorByEmail(email) {
    const url = `/api/doctor?email=${email}`

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    });

    if (!response.ok) {
        const errorText = await response.json();
        throw new Error(errorText.error || "Unknown error occurred, please try again");
    }

    return response.json();
}

export async function checkCred(cred) {
    const response = await fetch('/api/auth-check', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(cred)
    });

    if (!response.ok) {
        const errorText = await response.json();
        throw new Error(errorText.error || "Unknow error occured")
    }

    return response.json();
}