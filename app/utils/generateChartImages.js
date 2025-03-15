// utils/generateChartImage.js
import { toPng } from 'html-to-image';

// app/utils/generateChartImages.js
export const generateChartImage = async (chartId) => {
    const chartElement = document.getElementById(chartId);
    if (!chartElement) return null;

    try {
        // Use a library like html2canvas to convert the chart to an image
        const html2canvas = (await import('html2canvas')).default;
        const canvas = await html2canvas(chartElement);
        return canvas.toDataURL('image/png'); // Return the image as a data URL
    } catch (error) {
        console.error('Error generating chart image:', error);
        return null;
    }
};