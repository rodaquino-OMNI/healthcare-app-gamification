/**
 * @file plan.mutations.ts
 * @description GraphQL mutations for the Plan journey, enabling operations 
 * such as submitting claims, uploading claim documents, updating claims, 
 * and canceling claims. These mutations are used by the frontend to interact 
 * with the backend services for insurance-related functionality.
 */

import { gql } from '@apollo/client'; // v3.7.17
import { ClaimFragment } from '../fragments/plan.fragments';

/**
 * GraphQL mutation to submit a new insurance claim
 */
export const SUBMIT_CLAIM = gql`
  mutation SubmitClaim(
    $planId: String!,
    $type: String!,
    $procedureCode: String!,
    $providerName: String!,
    $serviceDate: String!,
    $amount: Float!,
    $documents: [String!]
  ) {
    submitClaim(
      planId: $planId,
      type: $type,
      procedureCode: $procedureCode,
      providerName: $providerName,
      serviceDate: $serviceDate,
      amount: $amount,
      documents: $documents
    ) {
      ...ClaimFragment
    }
  }
  ${ClaimFragment}
`;

/**
 * GraphQL mutation to upload a document to an existing claim
 */
export const UPLOAD_CLAIM_DOCUMENT = gql`
  mutation UploadClaimDocument($claimId: String!, $file: Upload!) {
    uploadClaimDocument(claimId: $claimId, file: $file) {
      id
      fileName
      fileType
      fileSize
      uploadedAt
    }
  }
`;

/**
 * GraphQL mutation to update an existing claim with additional information
 */
export const UPDATE_CLAIM = gql`
  mutation UpdateClaim($id: String!, $additionalInfo: JSON) {
    updateClaim(id: $id, additionalInfo: $additionalInfo) {
      ...ClaimFragment
    }
  }
  ${ClaimFragment}
`;

/**
 * GraphQL mutation to cancel an existing claim
 */
export const CANCEL_CLAIM = gql`
  mutation CancelClaim($id: String!) {
    cancelClaim(id: $id) {
      ...ClaimFragment
    }
  }
  ${ClaimFragment}
`;