// app/api/generate-pdf/route.js
import { NextResponse } from 'next/server';
import { generatePDFStream } from '@/app/components/modernPDF';
import fs from 'fs';
import path from 'path';

export async function POST(request) {
    try {
        const { startDate, endDate, reportType, pieChartImage, barChartImage, users, event } = await request.json();


        // Fetch the logo from the public folder and convert it to base64
        const logoPath = path.join(process.cwd(), 'public', 'IHP_Logo.png');
        const logoBase64 = fs.readFileSync(logoPath, { encoding: 'base64' });


        // Generate PDF stream
        const pdfStream = await generatePDFStream({
            startDate,
            endDate,
            event,
            users,
            pieChartImage,
            logoBase64: `data:image/png;base64,${logoBase64}`,
        });

        // Set response headers for PDF download
        const headers = new Headers();
        headers.set('Content-Type', 'application/pdf');
        headers.set('Content-Disposition', 'attachment; filename=report.pdf');

        // Return the PDF as a response
        return new Response(pdfStream, {
            headers,
        });
    } catch (error) {
        console.error('Error generating PDF:', error);
        return NextResponse.json(
            { error: 'Failed to generate PDF' },
            { status: 500 }
        );
    }
}