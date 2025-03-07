'use client';
import { getEventDetails, getUserFromEvent } from '@/lib/api';
import React, { useEffect, useState } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import ModernReportPDF from '@/app/components/modernPDF';
import { generateChartImage } from '@/app/utils/generateChartImages';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import LoadingSpinner from '@/app/components/loader';

// Register Chart.js components
ChartJS.register(
    ArcElement, // Required for Pie charts
    BarElement, // Required for Bar charts
    CategoryScale, // Required for Bar charts
    LinearScale, // Required for Bar charts
    Tooltip,
    Legend
);

export default function Report({ params }) {
    const { id } = React.use(params);
    const [event, setEvent] = useState([]);
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [loadingUser, setLoadingUser] = useState(false);
    const [pieChartData, setPieChartData] = useState({ labels: [], datasets: [] });
    const [barChartData, setBarChartData] = useState({ labels: [], datasets: [] });
    const [loadingBardata, setLoadingBarData] = useState(false);
    const [loadingPieData, setLoadingPieData] = useState(false);
    const [pieChartImage, setPieChartImage] = useState('');
    const [barChartImage, setBarChartImage] = useState('');

    // Function to generate Pie chart data
    const generatePieChartData = (users) => {
        const categories = [
            'Allergy',
            'Cardiovascular',
            'Covid Testing',
            'Dermatology',
            'ENT (Ear, Nose, Throat)',
            'First Aid',
            'Gastrointestinal',
            'Genitourinary',
            'Medication',
            'Mental Health',
            'Metabolic',
            'Neurology',
            'OB/GYN',
            'Ophthalmology',
            'Oral/Dental',
            'Orthopedics',
            'Positive Result',
            'Respiratory Infections',
            'Vitals Check',
            'Advise/Consultation',
        ];

        const categoryCounts = {};
        categories.forEach((category) => {
            categoryCounts[category] = 0;
        });

        users.forEach((user) => {
            const category = user.conditionCategory;
            if (categoryCounts.hasOwnProperty(category)) {
                categoryCounts[category] += 1;
            }
        });

        return {
            labels: categories,
            datasets: [
                {
                    data: categories.map((category) => categoryCounts[category]),
                    backgroundColor: [
                        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
                        '#FF9F40', '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
                        '#9966FF', '#FF9F40', '#FF6384', '#36A2EB', '#FFCE56',
                        '#4BC0C0', '#9966FF', '#FF9F40', '#FF6384', '#36A2EB',
                    ],
                },
            ],
        };
    };

    useEffect(() => {
        const getResult = async () => {
            const result = await getEventDetails(id);
            if (!result) alert('Error');
            setEvent(result.event);
            setLoading(false);
            setLoadingUser(true);
            const usersData = await getUserFromEvent(id);
            if (!usersData) alert('Error');
            setUsers(usersData.users);
            setLoadingUser(false);

            // Generate chart images after a short delay to ensure charts are rendered
            setTimeout(async () => {
                const pieChartImage = await generateChartImage('pie-chart');
                const barChartImage = await generateChartImage('bar-chart');
                setPieChartImage(pieChartImage);
                setBarChartImage(barChartImage);
            }, 5000); // Adjust delay if necessary
        };

        getResult();
    }, [id]);

    useEffect(() => {
        const geneBarChartData = () => {
            const result = {
                labels: [],
                datasets: [
                    {
                        label: 'Referrals',
                        data: [],
                        backgroundColor: [],
                    },
                ],
            };

            const backgroundColors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];

            users.forEach((user) => {
                const reffered = user.reffered;
                const existingLabelIndex = result.labels.indexOf(reffered);

                if (existingLabelIndex !== -1) {
                    result.datasets[0].data[existingLabelIndex] += 1;
                } else {
                    result.labels.push(reffered);
                    result.datasets[0].data.push(1);
                    result.datasets[0].backgroundColor.push(backgroundColors[result.labels.length % backgroundColors.length]);
                }
            });

            setBarChartData(result);
        };

        if (!loadingUser) {
            setLoadingBarData(true);
            geneBarChartData();
            setLoadingBarData(false);
        }
    }, [users, loadingUser]);

    useEffect(() => {
        if (!loadingUser) {
            setLoadingPieData(true)
            const pieChartData = generatePieChartData(users);
            setPieChartData(pieChartData);
            setLoadingPieData(false)
        }
    }, [users, loadingUser]);

    if (loading) return <div><LoadingSpinner message="Loading Event details" /></div>;
    if (loadingUser) return <div><LoadingSpinner message="Loading user data" /></div>;
    if (loadingBardata) return <div><LoadingSpinner message="Loading bar data" /> </div>;
    if (loadingPieData) return <div><LoadingSpinner message="Loading pie chart data" /></div>

    return (
        <div>
            {barChartData.labels.length > 0 && (
                <div>
                    <h1>Report</h1>
                    <PDFDownloadLink
                        document={<ModernReportPDF event={event} users={users} pieChartImage={pieChartImage} barChartImage={barChartImage} />}
                        fileName="modern_daily_report.pdf"
                    >
                        {({ loading }) => (loading ? 'Generating PDF...' : 'Download PDF')}
                    </PDFDownloadLink>

                    {/* Hidden charts for image generation */}
                    <div id="pie-chart" style={{ width: '400px', height: '400px' }}>
                        <Pie data={pieChartData} />
                    </div>
                    <div id="bar-chart" style={{ width: '600px', height: '300px' }}>
                        <Bar data={barChartData} />
                    </div>
                </div>
            )}
        </div>
    );
}