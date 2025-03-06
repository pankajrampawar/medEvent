'use client';
import { getEventDetails, getUserFromEvent } from '@/lib/api';
import React, { useEffect, useState } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import ModernReportPDF from '@/app/components/modernPDF';
import { generateChartImage } from '@/app/utils/generateChartImages';
import { Pie } from 'react-chartjs-2';
import { Bar } from 'react-chartjs-2';

export default function Report({ params }) {
    const { id } = React.use(params);
    const [event, setEvent] = useState([]);
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [loadingUser, setLoadingUser] = useState(false);
    const [pieChartImage, setPieChartImage] = useState('');
    const [barChartImage, setBarChartImage] = useState('');

    const pieChartData = {
        labels: ['Respiratory', 'Musculoskeletal', 'First Aid', 'Other'],
        datasets: [
            {
                data: [45, 25, 20, 10], // Example data
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
            },
        ],
    };

    const barChartData = {
        labels: ['Referrals Today'],
        datasets: [
            {
                label: 'Referrals',
                data: [2], // Example data
                backgroundColor: '#36A2EB',
            },
            {
                label: 'Referrals',
                data: [25], // Example data
                backgroundColor: '#36A2EB',
            },
        ],
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

            // Generate chart images
            setTimeout(async () => {
                const pieChartImage = await generateChartImage('pie-chart');
                const barChartImage = await generateChartImage('bar-chart');
                setPieChartImage(pieChartImage);
                setBarChartImage(barChartImage);
            }, 500); // Adjust delay if necessary
        };

        getResult();
    }, []);

    if (loading) return <div>Loading Event details</div>;
    if (loadingUser) return <div>Loading user data</div>;
    console.log('Pie Chart Image:', pieChartImage);
    console.log('Bar Chart Image:', barChartImage);
    return (
        <div>
            <h1>Report</h1>
            <PDFDownloadLink
                document={<ModernReportPDF event={event} users={users} pieChartImage={pieChartImage} barChartImage={barChartImage} />}
                fileName="modern_daily_report.pdf"
            >
                {({ loading }) => (loading ? 'Generating PDF...' : 'Download PDF')}
            </PDFDownloadLink>

            <div id="pie-chart" style={{ width: '400px', height: '400px', }}>
                <Pie data={pieChartData} />
            </div>
            <div id="bar-chart" style={{ width: '600px', height: '300px', }}>
                <Bar data={barChartData} />
            </div>
        </div>
    );
}