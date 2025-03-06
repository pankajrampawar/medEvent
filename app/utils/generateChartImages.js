// utils/generateChartImage.js
import { toPng } from 'html-to-image';

export const generateChartImage = async (chartId) => {
    const chartElement = document.getElementById(chartId);
    if (!chartElement) return null;

    try {
        const dataUrl = await toPng(chartElement);
        return dataUrl;
    } catch (error) {
        console.error('Error generating chart image:', error);
        return null;
    }
};