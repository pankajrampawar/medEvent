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