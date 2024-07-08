import { DocumentEvidence, ImageEvidence } from './formsTypes';

export const parseImageEvidence = (evidence: ImageEvidence): FormData => {
  const formData = new FormData();
  formData.append('imageFile', evidence.value.file as File);
  formData.append('description', evidence.value.description as string);
  if (evidence.value.linkToRelatedResource) {
    formData.append(
      'linkToRelatedResource',
      evidence.value.linkToRelatedResource
    );
  }
  return formData;
};

export const parseDocumentEvidence = (evidence: DocumentEvidence): FormData => {
  const formData = new FormData();
  formData.append('documentFile', evidence.value.file as File);
  formData.append('description', evidence.value.description as string);
  return formData;
};
