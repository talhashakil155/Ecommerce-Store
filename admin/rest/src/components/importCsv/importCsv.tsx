import { useRef } from 'react';
import React from 'react';
import Papa from 'papaparse';
import Button from '@/components/ui/button';

const ImportCsv: React.FC<{ setFiles: any }> = ({ setFiles }) => {
  const uploadRef = useRef<HTMLInputElement>(null);
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.data.length) {
            console.log(results.data);
          }
        },
      });
    }
  };
  return (
    <>
      <input
        type="file"
        accept=".csv"
        ref={uploadRef}
        onChange={handleFileUpload}
        className="hidden"
      />
      <Button
        className="w-32"
        size="small"
        onClick={() => uploadRef.current?.click()}
      >
        Import
      </Button>
    </>
  );
};

export default ImportCsv;
