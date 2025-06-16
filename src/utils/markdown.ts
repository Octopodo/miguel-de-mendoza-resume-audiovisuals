export interface CVData {
    name: string;
    title: string;
    contact: string;
    sections: Array<{
        title: string;
        content: string;
        items?: string[];
    }>;
}

export function parseMarkdownCV(content: string): CVData {
    const lines = content.split('\n').filter((line) => line.trim());

    // Extract name (first line in brackets)
    const nameMatch = lines[0].match(/\[(.*?)\]/);
    const name = nameMatch ? nameMatch[1] : lines[0];

    // Extract title (second line)
    const title = lines[1] || '';

    // Extract contact (third line)
    const contact = lines[2] || '';

    const sections: Array<{
        title: string;
        content: string;
        items?: string[];
    }> = [];
    let currentSection: {
        title: string;
        content: string;
        items?: string[];
    } | null = null;

    for (let i = 3; i < lines.length; i++) {
        const line = lines[i].trim();

        if (!line) continue;

        // Check if it's a section header (standalone line that's not a bullet point or job entry)
        const isHeader =
            !line.startsWith('•') &&
            !line.startsWith('-') &&
            !line.includes('|') &&
            !line.includes(':') &&
            !line.match(/^\d{4}/) &&
            line.length > 2 &&
            !line.startsWith('Carné') &&
            !line.startsWith('Técnico') &&
            !line.startsWith('KT ') &&
            // Check if next line exists and provides context
            i + 1 < lines.length &&
            lines[i + 1].trim().length > 0;

        if (isHeader) {
            // Save previous section
            if (currentSection) {
                sections.push(currentSection);
            }

            // Start new section
            currentSection = {
                title: line,
                content: '',
                items: [],
            };
        } else if (currentSection) {
            // Add content to current section
            if (currentSection.content) {
                currentSection.content += '\n\n' + line;
            } else {
                currentSection.content = line;
            }
        }
    }

    // Add the last section
    if (currentSection) {
        sections.push(currentSection);
    }

    return {
        name,
        title,
        contact,
        sections,
    };
}

export function formatContent(content: string): string {
    return (
        content
            // Convert job entries with company and dates
            .replace(
                /^(.+)\n(.+\s\|\s.+)$/gm,
                '<div class="job-entry"><h4>$1</h4><div class="company-date">$2</div></div>',
            )
            // Convert bullet points
            .replace(/^([•\-])\s(.+)$/gm, '<li>$2</li>')
            // Wrap consecutive list items in ul tags
            .replace(/(<li>.*<\/li>\s*)+/gs, '<ul>$&</ul>')
            // Convert bold text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            // Convert line breaks to paragraphs
            .replace(/\n\n/g, '</p><p>')
            .replace(/^(.+)$/gm, '<p>$1</p>')
            // Clean up empty paragraphs
            .replace(/<p><\/p>/g, '')
            // Fix nested paragraph issues
            .replace(/<p>(<[^>]+>)/g, '$1')
            .replace(/(<\/[^>]+>)<\/p>/g, '$1')
    );
}
