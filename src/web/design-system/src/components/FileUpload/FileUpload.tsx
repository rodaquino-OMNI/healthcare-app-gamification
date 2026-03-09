import React, { useRef, useState, useCallback } from 'react';
import styled from 'styled-components';

import { borderRadius } from '../../tokens/borderRadius';
import { colors } from '../../tokens/colors';
import { shadows } from '../../tokens/shadows';
import { spacing } from '../../tokens/spacing';
import { typography } from '../../tokens/typography';

export interface FileUploadProps {
    onFilesSelected: (files: File[]) => void;
    accept?: string;
    maxSize?: number;
    multiple?: boolean;
    disabled?: boolean;
    journey?: 'health' | 'care' | 'plan';
    accessibilityLabel?: string;
}

export interface UploadProgressProps {
    fileName: string;
    progress: number;
    status: 'uploading' | 'completed' | 'error';
    onCancel?: () => void;
    onRetry?: () => void;
}

const getJourneyColor = (journey?: string): string => {
    if (journey && colors.journeys[journey as keyof typeof colors.journeys]) {
        return colors.journeys[journey as keyof typeof colors.journeys].primary;
    }
    return colors.brand.primary;
};

const DropZone = styled.div<{ isDragging: boolean; disabled?: boolean; journey?: string }>`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: ${spacing.sm};
    padding: ${spacing['2xl']} ${spacing.md};
    border: 2px dashed ${(props) => (props.isDragging ? getJourneyColor(props.journey) : colors.neutral.gray300)};
    border-radius: ${borderRadius.lg};
    background-color: ${(props) => (props.isDragging ? `${getJourneyColor(props.journey)}08` : colors.neutral.white)};
    cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
    opacity: ${(props) => (props.disabled ? 0.6 : 1)};
    transition: all 0.2s ease-in-out;

    &:hover {
        border-color: ${(props) => (!props.disabled ? getJourneyColor(props.journey) : colors.neutral.gray300)};
    }
`;

const DropZoneText = styled.p`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize.sm};
    color: ${colors.neutral.gray600};
    margin: 0;
    text-align: center;
`;

const BrowseLink = styled.span<{ journey?: string }>`
    color: ${(props) => getJourneyColor(props.journey)};
    font-weight: ${typography.fontWeight.semiBold};
    cursor: pointer;
    text-decoration: underline;
`;

const HiddenInput = styled.input`
    display: none;
`;

const UploadIcon = styled.div`
    font-size: ${typography.fontSize.xl};
    color: ${colors.neutral.gray500};
`;

const ProgressContainer = styled.div`
    display: flex;
    align-items: center;
    gap: ${spacing.sm};
    padding: ${spacing.sm} ${spacing.md};
    background-color: ${colors.neutral.gray100};
    border-radius: ${borderRadius.md};
    box-shadow: ${shadows.sm};
`;

const ProgressInfo = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: ${spacing['3xs']};
`;

const FileName = styled.span`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize.sm};
    font-weight: ${typography.fontWeight.medium};
    color: ${colors.neutral.gray900};
`;

const ProgressBarTrack = styled.div`
    width: 100%;
    height: ${spacing['3xs']};
    background-color: ${colors.neutral.gray300};
    border-radius: ${borderRadius.full};
    overflow: hidden;
`;

const ProgressBarFill = styled.div<{ progress: number; status: string }>`
    height: 100%;
    width: ${(props) => props.progress}%;
    background-color: ${(props) => {
        if (props.status === 'error') {
            return colors.semantic.error;
        }
        if (props.status === 'completed') {
            return colors.semantic.success;
        }
        return colors.brand.primary;
    }};
    border-radius: ${borderRadius.full};
    transition: width 0.3s ease-in-out;
`;

const StatusText = styled.span<{ status: string }>`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize.xs};
    color: ${(props) => {
        if (props.status === 'error') {
            return colors.semantic.error;
        }
        if (props.status === 'completed') {
            return colors.semantic.success;
        }
        return colors.neutral.gray500;
    }};
`;

const ActionButton = styled.button`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize.xs};
    font-weight: ${typography.fontWeight.medium};
    color: ${colors.brand.primary};
    background: none;
    border: none;
    cursor: pointer;
    padding: ${spacing['3xs']};

    &:hover {
        text-decoration: underline;
    }
`;

export const FileUpload: React.FC<FileUploadProps> = ({
    onFilesSelected,
    accept,
    maxSize,
    multiple = false,
    disabled = false,
    journey,
    accessibilityLabel = 'File upload',
}) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleFiles = useCallback(
        (fileList: FileList | null) => {
            if (!fileList) {
                return;
            }
            let files = Array.from(fileList);
            if (maxSize) {
                files = files.filter((f) => f.size <= maxSize);
            }
            if (files.length > 0) {
                onFilesSelected(files);
            }
        },
        [onFilesSelected, maxSize]
    );

    const handleDragOver = (e: React.DragEvent): void => {
        e.preventDefault();
        if (!disabled) {
            setIsDragging(true);
        }
    };

    const handleDragLeave = (e: React.DragEvent): void => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent): void => {
        e.preventDefault();
        setIsDragging(false);
        if (!disabled) {
            handleFiles(e.dataTransfer.files);
        }
    };

    return (
        <DropZone
            isDragging={isDragging}
            disabled={disabled}
            journey={journey}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => !disabled && inputRef.current?.click()}
            role="button"
            aria-label={accessibilityLabel}
            data-testid="file-upload"
        >
            <UploadIcon aria-hidden="true">&#128193;</UploadIcon>
            <DropZoneText>
                Drag and drop files here, or{' '}
                <BrowseLink journey={journey} data-testid="file-upload-browse">
                    browse
                </BrowseLink>
            </DropZoneText>
            <HiddenInput
                ref={inputRef}
                type="file"
                accept={accept}
                multiple={multiple}
                onChange={(e) => handleFiles(e.target.files)}
                data-testid="file-upload-input"
            />
        </DropZone>
    );
};

export const UploadProgress: React.FC<UploadProgressProps> = ({ fileName, progress, status, onCancel, onRetry }) => {
    const statusLabels = {
        uploading: `${progress}%`,
        completed: 'Completed',
        error: 'Failed',
    };

    return (
        <ProgressContainer data-testid="upload-progress">
            <ProgressInfo>
                <FileName data-testid="upload-filename">{fileName}</FileName>
                <ProgressBarTrack
                    role="progressbar"
                    aria-valuenow={progress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${fileName} upload progress`}
                >
                    <ProgressBarFill progress={progress} status={status} data-testid="upload-progress-bar" />
                </ProgressBarTrack>
                <StatusText status={status} data-testid="upload-status">
                    {statusLabels[status]}
                </StatusText>
            </ProgressInfo>
            {status === 'uploading' && onCancel && (
                <ActionButton
                    onClick={onCancel}
                    aria-label={`Cancel uploading ${fileName}`}
                    data-testid="upload-cancel"
                >
                    Cancel
                </ActionButton>
            )}
            {status === 'error' && onRetry && (
                <ActionButton onClick={onRetry} aria-label={`Retry uploading ${fileName}`} data-testid="upload-retry">
                    Retry
                </ActionButton>
            )}
        </ProgressContainer>
    );
};
