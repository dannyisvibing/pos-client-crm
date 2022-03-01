import React from 'react';
import { RBSection, RBHeader, RBLink } from '../../../rombostrap';

const UploadReady = ({ subject, onFileDrop }) => (
  <div
    onDragOver={e => e.preventDefault()}
    onDrop={event => {
      event.preventDefault();
      if (event.dataTransfer.files.length > 0) {
        onFileDrop(event.dataTransfer.files[0]);
      }
    }}
  >
    <RBSection classes="vd-align-center">
      <i className="fa fa-cloud-upload vd-text--success vd-csv-upload-icon" />
      <RBHeader category="subpage" classes="vd-mtl">
        <span>Upload a CSV to import {subject}</span>
      </RBHeader>
      <div className="vd-mtm">
        Drag and drop the CSV file anywhere, or{' '}
        <RBLink
          secondary
          onClick={e => {
            e.preventDefault();
            document.getElementById('csv-browse').click();
          }}
        >
          browse
        </RBLink>{' '}
        your files
      </div>
      <input
        id="csv-browse"
        type="file"
        className="vd-ghost-file-dialog"
        onChange={event => {
          if (event.target.files.length > 0) {
            onFileDrop(event.target.files[0]);
          }
        }}
      />
    </RBSection>
  </div>
);

export default UploadReady;
