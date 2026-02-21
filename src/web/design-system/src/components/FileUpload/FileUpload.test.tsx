import React from 'react';
import { describe, it, expect } from '@jest/globals';
import { render, screen, fireEvent } from '@testing-library/react';
import { FileUpload, UploadProgress } from './FileUpload';

describe('FileUpload', () => {
  it('renders the drop zone', () => {
    render(<FileUpload onFilesSelected={jest.fn()} />);
    expect(screen.getByTestId('file-upload')).toBeInTheDocument();
  });

  it('renders browse link', () => {
    render(<FileUpload onFilesSelected={jest.fn()} />);
    expect(screen.getByTestId('file-upload-browse')).toBeInTheDocument();
  });

  it('opens file dialog on click', () => {
    render(<FileUpload onFilesSelected={jest.fn()} />);
    const input = screen.getByTestId('file-upload-input') as HTMLInputElement;
    const clickSpy = jest.spyOn(input, 'click');
    fireEvent.click(screen.getByTestId('file-upload'));
    expect(clickSpy).toHaveBeenCalled();
  });

  it('does not open file dialog when disabled', () => {
    render(<FileUpload onFilesSelected={jest.fn()} disabled />);
    const input = screen.getByTestId('file-upload-input') as HTMLInputElement;
    const clickSpy = jest.spyOn(input, 'click');
    fireEvent.click(screen.getByTestId('file-upload'));
    expect(clickSpy).not.toHaveBeenCalled();
  });

  it('has correct accessibility label', () => {
    render(<FileUpload onFilesSelected={jest.fn()} accessibilityLabel="Upload documents" />);
    expect(screen.getByTestId('file-upload')).toHaveAttribute('aria-label', 'Upload documents');
  });

  it('uses default accessibility label when none provided', () => {
    render(<FileUpload onFilesSelected={jest.fn()} />);
    expect(screen.getByTestId('file-upload')).toHaveAttribute('aria-label', 'File upload');
  });

  it('calls onFilesSelected when files are dropped', () => {
    const onFilesSelected = jest.fn();
    render(<FileUpload onFilesSelected={onFilesSelected} />);
    const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
    const dropZone = screen.getByTestId('file-upload');
    fireEvent.drop(dropZone, {
      dataTransfer: { files: [file] },
    });
    expect(onFilesSelected).toHaveBeenCalledWith([file]);
  });

  it('does not call onFilesSelected when disabled and files dropped', () => {
    const onFilesSelected = jest.fn();
    render(<FileUpload onFilesSelected={onFilesSelected} disabled />);
    const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
    const dropZone = screen.getByTestId('file-upload');
    fireEvent.drop(dropZone, {
      dataTransfer: { files: [file] },
    });
    expect(onFilesSelected).not.toHaveBeenCalled();
  });

  it('filters files exceeding maxSize', () => {
    const onFilesSelected = jest.fn();
    render(<FileUpload onFilesSelected={onFilesSelected} maxSize={100} />);
    const smallFile = new File(['sm'], 'small.pdf', { type: 'application/pdf' });
    Object.defineProperty(smallFile, 'size', { value: 50 });
    const largeFile = new File(['large content here'], 'large.pdf', { type: 'application/pdf' });
    Object.defineProperty(largeFile, 'size', { value: 200 });
    const dropZone = screen.getByTestId('file-upload');
    fireEvent.drop(dropZone, {
      dataTransfer: { files: [smallFile, largeFile] },
    });
    expect(onFilesSelected).toHaveBeenCalledWith([smallFile]);
  });

  it('renders with journey prop', () => {
    render(<FileUpload onFilesSelected={jest.fn()} journey="health" />);
    expect(screen.getByTestId('file-upload')).toBeInTheDocument();
  });
});

describe('UploadProgress', () => {
  it('renders file name', () => {
    render(<UploadProgress fileName="report.pdf" progress={50} status="uploading" />);
    expect(screen.getByTestId('upload-filename')).toHaveTextContent('report.pdf');
  });

  it('shows progress percentage when uploading', () => {
    render(<UploadProgress fileName="report.pdf" progress={50} status="uploading" />);
    expect(screen.getByTestId('upload-status')).toHaveTextContent('50%');
  });

  it('shows completed status', () => {
    render(<UploadProgress fileName="report.pdf" progress={100} status="completed" />);
    expect(screen.getByTestId('upload-status')).toHaveTextContent('Completed');
  });

  it('shows error status', () => {
    render(<UploadProgress fileName="report.pdf" progress={30} status="error" />);
    expect(screen.getByTestId('upload-status')).toHaveTextContent('Failed');
  });

  it('shows cancel button when uploading', () => {
    const onCancel = jest.fn();
    render(<UploadProgress fileName="report.pdf" progress={50} status="uploading" onCancel={onCancel} />);
    fireEvent.click(screen.getByTestId('upload-cancel'));
    expect(onCancel).toHaveBeenCalled();
  });

  it('shows retry button on error', () => {
    const onRetry = jest.fn();
    render(<UploadProgress fileName="report.pdf" progress={30} status="error" onRetry={onRetry} />);
    fireEvent.click(screen.getByTestId('upload-retry'));
    expect(onRetry).toHaveBeenCalled();
  });

  it('does not show cancel button when not uploading', () => {
    render(<UploadProgress fileName="report.pdf" progress={100} status="completed" onCancel={jest.fn()} />);
    expect(screen.queryByTestId('upload-cancel')).not.toBeInTheDocument();
  });

  it('does not show retry button when not in error state', () => {
    render(<UploadProgress fileName="report.pdf" progress={50} status="uploading" onRetry={jest.fn()} />);
    expect(screen.queryByTestId('upload-retry')).not.toBeInTheDocument();
  });

  it('renders progress bar', () => {
    render(<UploadProgress fileName="report.pdf" progress={75} status="uploading" />);
    expect(screen.getByTestId('upload-progress-bar')).toBeInTheDocument();
  });
});
