const PAGE_WIDTH = 595;
const PAGE_HEIGHT = 842;
const CONTENT_X = 38;
const CONTENT_Y = 64;
const CONTENT_WIDTH = PAGE_WIDTH - CONTENT_X * 2;
const CONTENT_HEIGHT = PAGE_HEIGHT - CONTENT_Y * 2;

const sanitizeAscii = (value = '') =>
    String(value)
        .replace(/[^\x20-\x7E]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

const escapePdfText = (value = '') =>
    sanitizeAscii(value)
        .replace(/\\/g, '\\\\')
        .replace(/\(/g, '\\(')
        .replace(/\)/g, '\\)');

const wrapText = (value = '', maxChars = 54) => {
    const text = sanitizeAscii(value);
    if (!text) return ['N/A'];
    if (text.length <= maxChars) return [text];

    const words = text.split(' ');
    const lines = [];
    let current = '';

    words.forEach((word) => {
        const next = current ? `${current} ${word}` : word;
        if (next.length <= maxChars) {
            current = next;
            return;
        }
        if (current) lines.push(current);
        current = word;
    });

    if (current) lines.push(current);
    return lines;
};

const formatDateTime = (isoValue) => {
    if (!isoValue) return 'N/A';
    try {
        return new Date(isoValue).toLocaleString('en-LK', {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
        });
    } catch {
        return sanitizeAscii(isoValue);
    }
};

const approxTextWidth = (text, size) => sanitizeAscii(text).length * size * 0.52;

const addRect = (commands, x, y, width, height, options = {}) => {
    const {
        fill = null,
        stroke = null,
        lineWidth = 1,
        mode = 'B',
    } = options;

    commands.push('q');
    if (fill) commands.push(`${fill[0]} ${fill[1]} ${fill[2]} rg`);
    if (stroke) commands.push(`${stroke[0]} ${stroke[1]} ${stroke[2]} RG`);
    commands.push(`${lineWidth} w`);
    commands.push(`${x} ${y} ${width} ${height} re ${mode}`);
    commands.push('Q');
};

const addLine = (commands, x1, y1, x2, y2, options = {}) => {
    const { color = [0.6, 0.65, 0.72], width = 1 } = options;
    commands.push('q');
    commands.push(`${color[0]} ${color[1]} ${color[2]} RG`);
    commands.push(`${width} w`);
    commands.push(`${x1} ${y1} m ${x2} ${y2} l S`);
    commands.push('Q');
};

const addText = (commands, options) => {
    const {
        x,
        y,
        text,
        size = 11,
        font = 'F1',
        color = [0.08, 0.1, 0.13],
        align = 'left',
    } = options;

    const safeText = escapePdfText(text);
    const textWidth = approxTextWidth(safeText, size);
    let drawX = x;

    if (align === 'center') drawX = x - textWidth / 2;
    if (align === 'right') drawX = x - textWidth;

    commands.push(
        `BT /${font} ${size} Tf ${color[0]} ${color[1]} ${color[2]} rg 1 0 0 1 ${drawX.toFixed(2)} ${y.toFixed(2)} Tm (${safeText}) Tj ET`
    );
};

const downloadBlob = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
};

export const downloadOfficialReceiptPdf = (receipt = {}) => {
    try {
        const fineId = sanitizeAscii(receipt.fineId || 'N/A');
        const rows = [
            { label: 'Receipt No', value: sanitizeAscii(receipt.receiptNo || 'N/A') },
            { label: 'Transaction ID', value: sanitizeAscii(receipt.transactionId || 'N/A') },
            { label: 'Payment Date/Time', value: formatDateTime(receipt.paidAt) },
            { label: 'Fine Reference', value: fineId },
            { label: 'Violation', value: sanitizeAscii(receipt.violation || 'N/A') },
            {
                label: 'Amount (LKR)',
                value: Number(receipt.amount || 0).toLocaleString('en-LK', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                }),
            },
            { label: 'Location', value: sanitizeAscii(receipt.location || 'N/A') },
            { label: 'Vehicle Number', value: sanitizeAscii(receipt.vehicleNo || 'N/A') },
            { label: 'Driver NIC', value: sanitizeAscii(receipt.offenderNic || 'N/A') },
            { label: 'Paid Via', value: sanitizeAscii(receipt.paymentMethod || 'N/A') },
            { label: 'Payer Account', value: sanitizeAscii(receipt.payerId || 'N/A') },
        ];

        const commands = [];

        addRect(commands, CONTENT_X, CONTENT_Y, CONTENT_WIDTH, CONTENT_HEIGHT, {
            fill: [1, 1, 1],
            stroke: [0.72, 0.77, 0.84],
            lineWidth: 1.1,
            mode: 'B',
        });

        addRect(commands, CONTENT_X, CONTENT_Y + CONTENT_HEIGHT - 84, CONTENT_WIDTH, 84, {
            fill: [0.92, 0.96, 1],
            stroke: [0.72, 0.77, 0.84],
            mode: 'B',
        });

        addText(commands, {
            x: PAGE_WIDTH / 2,
            y: CONTENT_Y + CONTENT_HEIGHT - 32,
            text: 'DEPARTMENT OF MOTOR TRAFFIC - SRI LANKA',
            size: 12,
            font: 'F2',
            align: 'center',
        });
        addText(commands, {
            x: PAGE_WIDTH / 2,
            y: CONTENT_Y + CONTENT_HEIGHT - 50,
            text: 'E-Traffic Fine System',
            size: 11,
            align: 'center',
            color: [0.18, 0.24, 0.36],
        });
        addText(commands, {
            x: PAGE_WIDTH / 2,
            y: CONTENT_Y + CONTENT_HEIGHT - 71,
            text: 'OFFICIAL PAYMENT RECEIPT',
            size: 16,
            font: 'F2',
            align: 'center',
            color: [0.05, 0.08, 0.12],
        });

        addText(commands, {
            x: CONTENT_X + 18,
            y: CONTENT_Y + CONTENT_HEIGHT - 104,
            text: `Generated: ${formatDateTime(new Date().toISOString())}`,
            size: 9,
            color: [0.32, 0.36, 0.44],
        });
        addText(commands, {
            x: CONTENT_X + CONTENT_WIDTH - 18,
            y: CONTENT_Y + CONTENT_HEIGHT - 104,
            text: `Receipt Ref: ${fineId}`,
            size: 9,
            color: [0.32, 0.36, 0.44],
            align: 'right',
        });

        const labelX = CONTENT_X + 18;
        const valueX = CONTENT_X + 182;
        const tableWidth = CONTENT_WIDTH - 36;
        let y = CONTENT_Y + CONTENT_HEIGHT - 130;

        rows.forEach((row, index) => {
            const wrappedValue = wrapText(row.value, 52);
            const rowHeight = Math.max(28, 12 + wrappedValue.length * 13);
            const rowBottom = y - rowHeight + 8;

            addRect(commands, CONTENT_X + 18, rowBottom, tableWidth, rowHeight, {
                fill: index % 2 === 0 ? [0.985, 0.988, 0.995] : [1, 1, 1],
                stroke: [0.84, 0.87, 0.92],
                lineWidth: 0.7,
                mode: 'B',
            });

            addText(commands, {
                x: labelX + 8,
                y: y - 11,
                text: `${row.label}:`,
                size: 10,
                font: 'F2',
                color: [0.15, 0.18, 0.23],
            });

            wrappedValue.forEach((line, lineIndex) => {
                addText(commands, {
                    x: valueX,
                    y: y - 11 - lineIndex * 13,
                    text: line,
                    size: 10,
                    color: [0.08, 0.1, 0.13],
                });
            });

            y -= rowHeight;
        });

        addLine(commands, CONTENT_X + 18, CONTENT_Y + 112, CONTENT_X + CONTENT_WIDTH - 18, CONTENT_Y + 112, {
            color: [0.7, 0.74, 0.8],
            width: 1,
        });

        addText(commands, {
            x: CONTENT_X + 18,
            y: CONTENT_Y + 92,
            text: 'This is a computer-generated receipt and does not require a physical signature.',
            size: 9,
            color: [0.26, 0.3, 0.37],
        });
        addText(commands, {
            x: CONTENT_X + 18,
            y: CONTENT_Y + 76,
            text: 'Keep this document for official verification and audit purposes.',
            size: 9,
            color: [0.26, 0.3, 0.37],
        });

        const stream = commands.join('\n') + '\n';
        const streamLength = new TextEncoder().encode(stream).length;

        let pdf = '%PDF-1.4\n';
        const offsets = [0];

        const appendObject = (index, body) => {
            offsets[index] = pdf.length;
            pdf += `${index} 0 obj\n${body}\nendobj\n`;
        };

        appendObject(1, '<< /Type /Catalog /Pages 2 0 R >>');
        appendObject(2, '<< /Type /Pages /Kids [3 0 R] /Count 1 >>');
        appendObject(
            3,
            `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_WIDTH} ${PAGE_HEIGHT}] /Resources << /Font << /F1 4 0 R /F2 6 0 R >> >> /Contents 5 0 R >>`
        );
        appendObject(4, '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>');
        appendObject(5, `<< /Length ${streamLength} >>\nstream\n${stream}endstream`);
        appendObject(6, '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>');

        const xrefStart = pdf.length;
        pdf += 'xref\n0 7\n0000000000 65535 f \n';

        for (let i = 1; i <= 6; i += 1) {
            pdf += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`;
        }

        pdf += `trailer\n<< /Size 7 /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;

        const filename = `Official-Fine-Receipt-${fineId || 'Record'}.pdf`;
        downloadBlob(new Blob([new TextEncoder().encode(pdf)], { type: 'application/pdf' }), filename);
        return true;
    } catch {
        return false;
    }
};
