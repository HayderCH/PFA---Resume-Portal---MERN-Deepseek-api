// src/components/PdfReactPdf.jsx
import React, { useState } from 'react';
import { Document, Page } from 'react-pdf';
import { pdfjs } from 'react-pdf';

// Set up the pdf worker for react-pdf
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function PdfReactPdf({ src }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const nextPage = () => {
    if (pageNumber < numPages) setPageNumber(prev => prev + 1);
  };

  const prevPage = () => {
    if (pageNumber > 1) setPageNumber(prev => prev - 1);
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <div>
        <button onClick={prevPage} disabled={pageNumber <= 1}>
          Previous
        </button>
        <button onClick={nextPage} disabled={pageNumber >= numPages}>
          Next
        </button>
      </div>
      <Document file={src} onLoadSuccess={onDocumentLoadSuccess}>
        <Page pageNumber={pageNumber} />
      </Document>
      <p>
        Page {pageNumber} of {numPages}
      </p>
    </div>
  );
}
