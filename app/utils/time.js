export function convertISOToLocalTime(isoTime, locale = "en-US") {
    // Create a Date object from the ISO time string
    const date = new Date(isoTime);

    // Check if the input is a valid date
    if (isNaN(date.getTime())) {
        throw new Error("Invalid ISO time format");
    }

    // Convert to a human-readable local date string (without time)
    const localDate = date.toLocaleDateString(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return localDate;
}

export function convertISOToTime(isoString) {
    // Create a Date object from the ISO string
    const date = new Date(isoString);

    // Get hours and minutes
    let hours = date.getHours();
    const minutes = date.getMinutes();

    // Determine AM/PM
    const period = hours >= 12 ? 'PM' : 'AM';

    // Convert to 12-hour format
    hours = hours % 12;
    // If hours is 0 (midnight or noon), set it to 12
    hours = hours === 0 ? 12 : hours;

    // Pad minutes with leading zero if needed
    const minutesStr = minutes < 10 ? `0${minutes}` : minutes;

    // Return formatted time string
    return `${hours}:${minutesStr} ${period}`;
}