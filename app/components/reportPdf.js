// 'use client';
// import { getEventDetails, getUserFromEvent } from '@/lib/api';
// import React, { useEffect, useState } from 'react';
// import { PDFDownloadLink } from '@react-pdf/renderer';
// import ModernReportPDF from './modernPDF';
// import { generateChartImage } from '../utils/generateChartImages';

// export default function Report({ params }) {
//     const { id } = React.use(params);
//     const [event, setEvent] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [users, setUsers] = useState([]);
//     const [loadingUser, setLoadingUser] = useState(false);
//     const [pieChartImage, setPieChartImage] = useState('');
//     const [barChartImage, setBarChartImage] = useState('');

//     useEffect(() => {
//         const getResult = async () => {
//             const result = await getEventDetails(id);
//             if (!result) alert('Error');
//             setEvent(result.event);
//             setLoading(false);
//             setLoadingUser(true);
//             const usersData = await getUserFromEvent(id);
//             if (!usersData) alert('Error');
//             setUsers(usersData.users);
//             setLoadingUser(false);

//             // Generate chart images
//             const pieChartImage = await generateChartImage('pie-chart');
//             const barChartImage = await generateChartImage('bar-chart');
//             setPieChartImage(pieChartImage);
//             setBarChartImage(barChartImage);
//         };

//         getResult();
//     }, []);

//     if (loading) return <div>Loading Event details</div>;
//     if (loadingUser) return <div>Loading user data</div>;

//     return (
//         <div>
//             <h1>Report</h1>
//             <PDFDownloadLink
//                 document={<ModernReportPDF event={event} users={users} pieChartImage={pieChartImage} barChartImage={barChartImage} />}
//                 fileName="modern_daily_report.pdf"
//             >
//                 {({ loading }) => (loading ? 'Generating PDF...' : 'Download PDF')}
//             </PDFDownloadLink>

//             {/* Hidden charts for image generation */}
//             <div id="pie-chart" style={{ display: 'none' }}>
//                 {/* Render your pie chart here */}
//             </div>
//             <div id="bar-chart" style={{ display: 'none' }}>
//                 {/* Render your bar chart here */}
//             </div>
//         </div>
//     );
// }