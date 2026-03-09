import React from 'react';

interface FileUploaderProps {
    claimId: string;
    onUpload?: (files: File[]) => void;
    accept?: string;
    multiple?: boolean;
}

/**
 * A reusable file uploader component with drag and drop support.
 * Used for uploading claim documents and other files.
 */
export const FileUploader: React.FC<FileUploaderProps> = ({
    claimId,
    onUpload,
    accept,
    multiple,
}): React.ReactElement => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const files = Array.from(event.target.files || []);
        if (onUpload && files.length > 0) {
            onUpload(files);
        }
    };

    return (
        <div data-testid="file-uploader" data-claim-id={claimId}>
            <input type="file" accept={accept} multiple={multiple} onChange={handleChange} aria-label="Upload files" />
        </div>
    );
};

export default FileUploader;
