import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { renderToStream } from '@react-pdf/renderer';
import { imgString } from '../utils/options';
import { convertISOToTime } from '../utils/time';

const styles = StyleSheet.create({
    page: {
        padding: 40,
        backgroundColor: '#ffffff',
        fontFamily: 'Helvetica',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2d3748',
        marginBottom: 20,
        textAlign: 'center',
        borderBottom: '2px solid #4a5568',
        paddingBottom: 10,
    },
    logo: {
        width: 100,
        height: 'auto',
        marginBottom: 20,
        alignSelf: 'center',
    },
    section: {
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#4a5568',
        marginBottom: 15,
        borderBottom: '1px solid #e2e8f0',
        paddingBottom: 5,
    },
    table: {
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid #e2e8f0',
        borderRadius: 8,
        overflow: 'hidden',
        marginBottom: 20,
    },
    tableRow: {
        display: 'flex',
        flexDirection: 'row',
        borderBottom: '1px solid #e2e8f0',
        backgroundColor: '#ffffff',
        wrap: false, // Prevent row from splitting across pages
    },
    tableHeader: {
        backgroundColor: '#edf2f7',
        fontWeight: 'bold',
        color: '#4a5568',
    },
    tableCell: {
        flex: 1,
        padding: 10,
        fontSize: 12,
        color: '#2d3748',
        textAlign: 'center',
    },
    chartContainer: {
        marginTop: 20,
        marginBottom: 30,
    },
    chartImage: {
        width: '48%',
        height: 'auto',
        maxWidth: '100%',
    },
    footer: {
        position: 'absolute',
        bottom: 20,
        left: 40,
        right: 40,
        fontSize: 10,
        color: '#718096',
        textAlign: 'center',
    },
});

const ModernReportPDF = ({ startDate, endDate, event, users, pieChartImage, reportType }) => {
    const totalVisits = users.length;
    const referralsToday = users.filter((user) => user.reffered === 'urgentCare' || user.reffered === 'ER' || user.reffered === 'Specialist' || user.reffered === 'Diagnostic').length;

    const reportDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    // Function to chunk users into groups that fit on a page
    const chunkUsers = (usersArray, itemsPerPage = 10) => {
        const chunks = [];
        for (let i = 0; i < usersArray.length; i += itemsPerPage) {
            chunks.push(usersArray.slice(i, i + itemsPerPage));
        }
        return chunks;
    };

    const referralUsers = users.filter((user) => user.reffered === 'urgentCare' || user.reffered === 'ER');
    const referralChunks = chunkUsers(referralUsers, 10); // Adjust itemsPerPage based on your needs
    const sortedUsers = [...users].sort((a, b) => {
        // Define the custom order for conditionCategory
        const categoryOrder = {
            'Allergy': 1,
            'Cardiovascular': 2,
            'Covid Testing': 3,
            'Dermatology': 4,
            'ENT (Ear, Nose, Throat)': 5,
            'First Aid': 6,
            'Gastrointestinal': 7,
            'Genitourinary': 8,
            'Medication': 9,
            'Mental Health': 10,
            'Metabolic': 11,
            'Neurology': 12,
            'OB/GYN': 13,
            'Ophthalmology': 14,
            'Oral/Dental': 15,
            'Orthopedics': 16,
            'Positive Result': 17,
            'Respiratory Infections': 18,
            'Vitals Check': 19,
            'Advise/Consultation': 20
        };

        // Get the order values for comparison
        const orderA = categoryOrder[a.conditionCategory] || 999; // Default to high number if category not found
        const orderB = categoryOrder[b.conditionCategory] || 999;

        // Primary sort: by conditionCategory
        if (orderA !== orderB) {
            return orderA - orderB; // Sort based on predefined order
        }

        // Secondary sort: by updatedAt (earlier dates come first)
        const dateA = a.updatedAt ? new Date(a.updatedAt) : new Date(0); // Default to epoch if missing
        const dateB = b.updatedAt ? new Date(b.updatedAt) : new Date(0);
        return dateA - dateB; // Ascending order for dates
    });

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <Image src={imgString} style={styles.logo} />
                <Text style={styles.header}>
                    {`Nightly Summary Report for ${event.clientName} - ${event.title}`}
                </Text>
                <Text style={{ textAlign: 'center', fontSize: 14, color: '#4a5568', marginBottom: 20 }}>
                    {`Date: ${reportDate}`}
                </Text>

                {/* Summary Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Summary</Text>
                    <View style={styles.table}>
                        <View style={[styles.tableRow, styles.tableHeader]}>
                            <Text style={styles.tableCell}>Total Medical Visits</Text>
                            <Text style={styles.tableCell}>Visits Today</Text>
                            <Text style={styles.tableCell}>Referrals Today</Text>
                        </View>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableCell}>{totalVisits}</Text>
                            <Text style={styles.tableCell}>{totalVisits}</Text>
                            <Text style={styles.tableCell}>{referralsToday}</Text>
                        </View>
                    </View>
                </View>

                {/* Referral Details - First Page */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Referral Details</Text>
                    <View style={styles.table}>
                        <View style={[styles.tableRow, styles.tableHeader]}>
                            <Text style={styles.tableCell}>Time of Day</Text>
                            <Text style={styles.tableCell}>Diagnosis</Text>
                            <Text style={styles.tableCell}>Referral To</Text>
                        </View>
                        {referralChunks[0]?.map((user, index) => (
                            <View key={index} style={styles.tableRow} wrap={false}>
                                <Text style={styles.tableCell}>{convertISOToTime(user.updatedAt)}</Text>
                                <Text style={styles.tableCell}>{user.primaryDiagnosis}</Text>
                                <Text style={styles.tableCell}>{user.reffered}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Medical Visits by Condition */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Medical Visits by Condition</Text>
                    {reportType === 'detailed' && (
                        <View style={styles.table}>
                            <View style={[styles.tableRow, styles.tableHeader]}>
                                <Text style={styles.tableCell}>Complaint Category</Text>
                                <Text style={styles.tableCell}>Primary Diagnosis</Text>
                                <Text style={styles.tableCell}>Created At</Text>
                            </View>
                            {sortedUsers.map((user, index) => (
                                <View key={index} style={styles.tableRow} wrap={false}>
                                    <Text style={styles.tableCell}>{user.conditionCategory}</Text>
                                    <Text style={styles.tableCell}>{user.primaryDiagnosis}</Text>
                                    <Text style={styles.tableCell}>{convertISOToTime(user.updatedAt)}</Text>
                                </View>
                            ))}
                        </View>
                    )}
                    <View style={styles.chartContainer}>
                        {pieChartImage && <Image src={pieChartImage} style={styles.chartImage} />}
                    </View>
                </View>

                <Text style={styles.footer}>Generated on {new Date().toLocaleDateString()}</Text>
            </Page>

            {/* Additional Pages for Referral Details */}
            {referralChunks.slice(1).map((chunk, pageIndex) => (
                <Page key={pageIndex} size="A4" style={styles.page}>
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Referral Details (Continued)</Text>
                        <View style={styles.table}>
                            <View style={[styles.tableRow, styles.tableHeader]}>
                                <Text style={styles.tableCell}>Time of Day</Text>
                                <Text style={styles.tableCell}>Diagnosis</Text>
                                <Text style={styles.tableCell}>Referral To</Text>
                            </View>
                            {chunk.map((user, index) => (
                                <View key={index} style={styles.tableRow} wrap={false}>
                                    <Text style={styles.tableCell}>{convertISOToTime(user.timestamp)}</Text>
                                    <Text style={styles.tableCell}>{user.primaryDiagnosis}</Text>
                                    <Text style={styles.tableCell}>{user.reffered}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                    <Text style={styles.footer}>Generated on {new Date().toLocaleDateString()}</Text>
                </Page>
            ))}
        </Document>
    );
};

export const generatePDFStream = async ({ event, users, pieChartImage, barChartImage, reportType }) => {
    const pdfStream = await renderToStream(
        <ModernReportPDF
            event={event}
            users={users}
            pieChartImage={pieChartImage}
            barChartImage={barChartImage}
            reportType={reportType}
        />
    );
    return pdfStream;
};

export default ModernReportPDF;