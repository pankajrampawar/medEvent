import { get } from "mongoose";

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
    console.log("Event data being sent", eventData);

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

    const response = await fetch("/api/user/", {
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
        console.log(errorText)
        return errorText
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

export async function addDirectUser(formData) {
    const response = await fetch('/api/addDirectUser', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    });

    if (!response.ok) {
        const errorText = await response.json();
        throw new Error(errorText.error || "Unknown Error Occured");
    }

    return response.json();
}

export async function getAllItems() {
    const response = await fetch('/api/item', {
        method: 'GET',
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

export const fetchMasterById = async (id) => {
    try {
        const response = await fetch(`/api/master?id=${id}`);
        if (!response.ok) {
            throw new Error("Failed to fetch master");
        }
        const data = await response.json();
        console.log("Master by ID:", data.master);
        return data.master;
    } catch (error) {
        console.error("Error fetching master by ID:", error);
        throw error;
    }
};


export async function addNewItem(itemName, status) {
    try {
        // Prepare the request body
        const requestBody = status ? { name: itemName, status } : { name: itemName };

        // Send the POST request to the API
        const response = await fetch('/api/item', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody), // Send the appropriate body
        });

        // Check if the response is OK (status code 2xx)
        if (!response.ok) {
            // Log the response status and status text for debugging
            console.error(`HTTP error! Status: ${response.status}, Message: ${response.statusText}`);
            throw new Error(`Failed to add item: ${response.statusText}`);
        }

        // Parse the JSON response
        const data = await response.json();
        return data; // Return the parsed data
    } catch (error) {
        // Handle network errors or JSON parsing errors
        console.error('Error adding new item:', error);
        throw error; // Re-throw the error for the caller to handle
    }
}

export async function getMasterList() {
    try {
        const response = await fetch('/api/master', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.json();
    } catch (error) {
        console.error('Error getting master list:', error);
        throw error;
    }
}


export async function addNewMaster(masterData) {
    console.log("Master data being sent:", masterData);

    try {
        const response = await fetch('/api/master', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(masterData),
        });

        // Log the raw response for debugging
        const responseText = await response.text();
        console.log("Raw response:", responseText);

        if (!response.ok) {
            // Try to parse the error response as JSON
            let errorMessage = "Failed to create master";
            try {
                const errorResponse = JSON.parse(responseText);
                errorMessage = errorResponse.error || errorResponse.message || errorMessage;
            } catch (e) {
                // If the response is not JSON, use the raw text
                errorMessage = responseText || errorMessage;
            }
            throw new Error(errorMessage);
        }

        // Parse the successful response as JSON
        const responseData = JSON.parse(responseText);
        console.log("Master created successfully:", responseData);
        return responseData;
    } catch (error) {
        console.error('Error adding new master:', error);
        throw error;
    }
}

export async function updateKit(id, updatedData) {
    try {
        const response = await fetch("/api/master", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id, ...updatedData }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to update kit");
        }

        const result = await response.json();
        console.log("Kit updated successfully:", result);
        return result;
    } catch (error) {
        console.error("Error updating kit:", error);
        throw error;
    }
}

export async function updateItem(id) {
    try {
        // Send the PUT request to the API
        const response = await fetch("/api/item", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id }), // Send the ID as a JSON object
        });

        // Check if the response is OK (status code 200-299)
        if (!response.ok) {
            // Parse the error response
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to update item");
        }

        // Parse the success response
        const result = await response.json();
        console.log("Item updated successfully:", result);
        return result; // Return the updated item
    } catch (error) {
        console.error("Error updating item:", error);
        throw error; // Re-throw the error for the caller to handle
    }
}

export async function deleteItem(id) {
    try {
        // Send a DELETE request to the API endpoint
        const response = await fetch('/api/item', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id }), // Send the item ID in the request body
        });

        // Check if the response is OK (status code 200-299)
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to delete item');
        }

        // Parse the success response
        const result = await response.json();
        console.log('Item deleted successfully:', result);
        return result; // Return the deleted item
    } catch (error) {
        console.error('Error deleting item:', error);
        throw error; // Re-throw the error for the caller to handle
    }
}