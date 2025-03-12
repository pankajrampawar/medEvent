import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: {
        padding: 40,
        backgroundColor: '#ffffff',
        fontFamily: 'Helvetica',
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#2d3748',
        marginBottom: 20,
        textAlign: 'center',
        borderBottom: '2px solid #4a5568',
        paddingBottom: 10,
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
        width: '48%', // Use full width of the container
        height: 'auto', // Maintain aspect ratio
        maxWidth: '100%', // Ensure it doesn't overflow
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

const ModernReportPDF = ({ event, users, pieChartImage, barChartImage }) => {
    // Calculate total medical visits and referrals
    const totalVisits = users.length;
    const referralsToday = users.filter((user) => user.reffered === 'urgentCare' || user.reffered === 'ER').length;

    // Group medical visits by condition
    const conditions = users.reduce((acc, user) => {
        const condition = user.conditionCategory || 'Other';
        acc[condition] = (acc[condition] || 0) + 1;
        return acc;
    }, {});

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <Text style={styles.header}>M & E DAILY CLIENT REPORT</Text>

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

                {/* Referral Details */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Referral Details</Text>
                    <View style={styles.table}>
                        <View style={[styles.tableRow, styles.tableHeader]}>
                            <Text style={styles.tableCell}>Time of Day</Text>
                            <Text style={styles.tableCell}>Diagnosis</Text>
                            <Text style={styles.tableCell}>Referral To</Text>
                        </View>
                        {users
                            .filter((user) => user.reffered === 'urgentCare' || user.reffered === 'ER')
                            .map((user, index) => (
                                <View key={index} style={styles.tableRow}>
                                    <Text style={styles.tableCell}>{new Date().toLocaleTimeString()}</Text>
                                    <Text style={styles.tableCell}>{user.primaryDiagnosis}</Text>
                                    <Text style={styles.tableCell}>{user.reffered}</Text>
                                </View>
                            ))}
                    </View>
                </View>

                {/* Medical Visits by Condition (Pie Chart) */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Medical Visits by Condition</Text>
                    <View style={styles.chartContainer}>
                        {pieChartImage && (
                            <Image
                                src={pieChartImage}
                                style={styles.chartImage} // Use the new style
                            />
                        )}
                    </View>
                </View>


                {/* Footer */}
                <Text style={styles.footer}>Generated on {new Date().toLocaleDateString()}</Text>
            </Page>
        </Document>
    );
};

export default ModernReportPDF;