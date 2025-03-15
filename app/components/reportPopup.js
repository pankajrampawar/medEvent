'use client';
import React, { useState } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import ModernReportPDF from './modernPDF'
import { generateChartImage } from '@/app/utils/generateChartImages';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { getUserFromEvent } from '@/lib/api';

// Register Chart.js components
ChartJS.register(
    ArcElement,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
    ChartDataLabels
);

export default function ReportPopup({ event, onClose }) {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [reportType, setReportType] = useState('regular'); // 'regular' or 'detailed'
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    // Convert event.startDate (ISO format) to a date string for the input field
    const eventStartDate = new Date(event.startDate).toISOString().split('T')[0];

    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];

    // Validate dates
    const validateDates = () => {
        const newErrors = {};

        if (!startDate) {
            newErrors.startDate = 'Start date is required.';
        } else if (new Date(startDate) < new Date(eventStartDate)) {
            newErrors.startDate = `Start date cannot be before ${eventStartDate}.`;
        }

        if (!endDate) {
            newErrors.endDate = 'End date is required.';
        } else if (new Date(endDate) < new Date(startDate)) {
            newErrors.endDate = 'End date cannot be before start date.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Return true if no errors
    };

    // app/components/ReportPopup.js
    const handleGenerateReport = async () => {
        if (!validateDates()) return;

        setLoading(true);

        try {
            // Generate chart images on the client side
            const usersData = await getUserFromEvent(event._id);
            if (!usersData) return;
            const users = usersData.users;
            const pieChartImage = await generateChartImage('pie-chart');
            const barChartImage = await generateChartImage('bar-chart');

            // Send the images to the API route
            const response = await fetch('/api/generate-pdf', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    startDate,
                    endDate,
                    reportType,
                    event,
                    users,
                    pieChartImage,
                    barChartImage,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to generate PDF');
            }

            // Download the PDF
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'report.pdf';
            a.click();
        } catch (error) {
            console.error('Error generating report:', error);
            alert('Failed to generate report.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white w-[50%] h-auto rounded-lg p-8">
                <h1 className="text-2xl font-bold mb-4">Report</h1>
                <p className="text-gray-600">
                    <span className="font-semibold">Event:</span> {event.title}
                </p>
                <p className="text-gray-600">
                    <span className="font-semibold">Client:</span> {event.clientName}
                </p>

                {/* Start Date */}
                <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700">Start Date</label>
                    <input
                        type="date"
                        value={startDate}
                        min={eventStartDate} // Block dates before event.startDate
                        max={today} // Block future dates
                        onChange={(e) => setStartDate(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    {errors.startDate && (
                        <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>
                    )}
                </div>

                {/* End Date */}
                <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700">End Date</label>
                    <input
                        type="date"
                        value={endDate}
                        min={startDate || eventStartDate} // Block dates before start date or event.startDate
                        max={today} // Block future dates
                        onChange={(e) => setEndDate(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    {errors.endDate && (
                        <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>
                    )}
                </div>

                {/* Report Type Dropdown */}
                <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700">Report Type</label>
                    <select
                        value={reportType}
                        onChange={(e) => setReportType(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                        <option value="regular">Regular Report</option>
                        <option value="detailed">Detailed Report</option>
                    </select>
                </div>

                {/* Generate Report Button */}
                <button
                    onClick={handleGenerateReport}
                    disabled={loading}
                    className="bg-purple-700 text-white px-4 py-2 rounded-lg mt-4 hover:bg-purple-800 transition-colors"
                >
                    {loading ? 'Generating Report...' : 'Generate Report'}
                </button>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg mt-4 ml-2 hover:bg-gray-600 transition-colors"
                >
                    Close
                </button>
            </div>
        </div>
    );
}