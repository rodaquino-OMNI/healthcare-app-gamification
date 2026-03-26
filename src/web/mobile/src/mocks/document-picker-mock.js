/**
 * DEMO_MODE mock for expo-document-picker
 */
module.exports = {
    getDocumentAsync: () => Promise.resolve({ type: 'cancel' }),
    DocumentPickerResult: {},
    types: { allFiles: '*/*', images: 'image/*', pdf: 'application/pdf' },
};
