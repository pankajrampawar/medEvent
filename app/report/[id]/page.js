'use client';
import { getEventDetails, getUserFromEvent } from '@/lib/api';
import React, { useEffect, useState } from 'react';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import ModernReportPDF from '@/app/components/modernPDF';
import { generateChartImage } from '@/app/utils/generateChartImages';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import LoadingSpinner from '@/app/components/loader';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ChevronLeft } from 'lucide-react';

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
    const router = useRouter();
    const { id } = React.use(params);
    const [event, setEvent] = useState([]);
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [showPdfPreview, setShowPdfPreview] = useState(false);
    const [loadingUser, setLoadingUser] = useState(false);
    const [pieChartData, setPieChartData] = useState({ labels: [], datasets: [] });
    const [barChartData, setBarChartData] = useState({ labels: [], datasets: [] });
    const [loadingPdf, setLoadingPdf] = useState(true)
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

        // Initialize category counts
        const categoryCounts = {};
        categories.forEach((category) => {
            categoryCounts[category] = 0;
        });

        // Count occurrences
        users.forEach((user) => {
            const category = user.conditionCategory;
            if (categoryCounts.hasOwnProperty(category)) {
                categoryCounts[category] += 1;
            }
        });

        // Sort categories by count (descending)
        const sortedCategories = Object.entries(categoryCounts)
            .sort((a, b) => b[1] - a[1])
            .map(entry => ({ name: entry[0], count: entry[1] }));

        // Take top 3 and calculate the sum of others
        const top3 = sortedCategories.slice(0, 3);
        const othersCount = sortedCategories
            .slice(3)
            .reduce((sum, category) => sum + category.count, 0);

        // Create final dataset
        const finalLabels = [...top3.map(item => item.name)];
        const finalCounts = [...top3.map(item => item.count)];
        const finalColors = ['#FF6384', '#36A2EB', '#FFCE56'];

        // Add "Others" category if there are values to show
        if (othersCount > 0) {
            finalLabels.push('Others');
            finalCounts.push(othersCount);
            finalColors.push('#4BC0C0');
        }

        return {
            labels: finalLabels,
            datasets: [
                {
                    data: finalCounts,
                    backgroundColor: finalColors,
                },
            ],
        };
    };
    useEffect(() => { // to get the user data and event data
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
                setShowPdfPreview(true)
                setLoadingPdf(false);
            }, 6000); // Adjust delay if necessary
        };
        getResult();
    }, [id]);

    useEffect(() => { // to generate the bar chart data
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
            setLoadingBarData(false)
        }
    }, [users, loadingUser]);

    useEffect(() => {
        if (users.length < 1) {
            const timer = setTimeout(() => {
                router.back();
            }, 5000);

            return () => clearTimeout(timer); // Cleanup the timer if component unmounts
        }
    }, [users, router]);


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

    if (users.length < 1) {
        return (
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100vh',
                    backgroundColor: '#f8f9fa',
                    textAlign: 'center',
                    color: '#333',
                    padding: '20px',
                    border: '1px solid #ddd',
                    borderRadius: '10px',
                }}
            >
                <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#ff4d4d' }}>
                    No Patient Data Found
                </h1>
                <p style={{ fontSize: '1rem', marginBottom: '1.5rem' }}>
                    Unable to generate the report as there is no patient data available. You will
                    be redirected to the previous page shortly.
                </p>
                <p style={{ fontSize: '0.9rem', color: '#555' }}>
                    If you are not redirected automatically, please click the back button below.
                </p>

                <div className='underline underline-offset-4 mt-3'>
                    <button onClick={() => router.back()} className='flex gap-1 items-center text-primary'><ArrowLeft />Go Back</button>
                </div>
            </div>
        );
    }

    const handleBack = () => {
        // Attempt to go back, but provide a fallback
        if (window.history.length > 1) {
            router.back();
        } else {
            router.push('/dashboard'); // Redirect to a fallback route
        }
    };

    return (
        <div className='mx-[10%]'>
            {loadingPdf &&
                <div className=''>
                    <div><LoadingSpinner message="Generating PDF" /></div>
                </div>
            }
            {barChartData.labels.length > 0 && (
                <div>
                    <h1 className='my-10 text-3xl flex items-center gap-1'>
                        <button className="hover:bg-gray-200 p-2 rounded-full" onClick={handleBack}>
                            <ChevronLeft />
                        </button>
                        Event Report
                    </h1>
                    <button
                        onClick={() => setShowPdfPreview(!showPdfPreview)}
                        className="px-4 py-2 rounded-md bg-gray-200 text-gray-800 font-medium hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
                    >
                        {showPdfPreview ? 'Hide PDF Preview' : 'Show PDF Preview'}
                    </button>
                    {
                        showPdfPreview && (
                            <div className="border border-gray-300 rounded-md overflow-hidden" style={{ height: '600px' }}>
                                <PDFViewer width="100%" height="100%" className="border-0">
                                    <ModernReportPDF
                                        event={event}
                                        users={users}
                                        pieChartImage={pieChartImage}
                                        barChartImage={barChartImage}
                                    />
                                </PDFViewer>
                            </div>
                        )
                    }
                    <PDFDownloadLink
                        document={<ModernReportPDF event={event} users={users} pieChartImage={pieChartImage} barChartImage={barChartImage} />}
                        fileName="modern_daily_report.pdf"
                        className="inline-flex items-center px-4 py-2 rounded-md bg-blue-600 text-white font-medium shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                    >
                        {({ loading }) => (
                            <>
                                {loading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Generating PDF...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-4 h-4 mr-2" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                        Download PDF
                                    </>
                                )}
                            </>
                        )}
                    </PDFDownloadLink>

                    {/* Hidden charts for image generation */}
                    <div className='relative bg-red-200'>
                        <div id="pie-chart" style={{ width: '300px', height: '300px' }} className=''>
                            <Pie data={pieChartData} />
                        </div>
                        <div className='absolute top-0 left-0 w-full h-full bg-background'>
                        </div>
                    </div>
                </div >
            )
            }
        </div >
    );
}