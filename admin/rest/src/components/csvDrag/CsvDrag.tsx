import React from 'react';
import { Importer, ImporterField } from 'react-csv-importer';
import 'react-csv-importer/dist/index.css'; // Import the styles
import { useRouter } from 'next/router';

const CsvDrag = () => {
  const router = useRouter();

  const handleData = (data: any) => {
    // sessionStorage.setItem('csvImportedData', JSON.stringify(data));
    console.log(data);
  };

  return (
    <div>
      <Importer
        dataHandler={handleData}
        onError={(error: any) => console.error(error)}
        chunkSize={10000}
        defaultNoHeader={false}
        restartable={true}
        onStart={({ file, fields }) => {}}
        onComplete={({ file, fields }) => {}}
        onClose={() => {
          router.back();
        }}
      >
        <ImporterField name="name" label="Name" />
        <ImporterField name="product_slug" label="Slug" />
        <ImporterField name="unit" label="Unit" />
        <ImporterField name="description" label="Description" />
      </Importer>
    </div>
  );
};

export default CsvDrag;
