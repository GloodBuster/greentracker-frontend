import { FormControl, FormGroup, Validators } from '@angular/forms';

export type ImageEvidence = FormGroup<{
  file: FormControl<File | null>;
  description: FormControl<string>;
  type: FormControl<'image'>;
  linkToRelatedResource: FormControl<string | null>;
}>;

export type LinkEvidence = FormGroup<{
  link: FormControl<string>;
  description: FormControl<string>;
  type: FormControl<'link'>;
}>;

export type DocumentEvidence = FormGroup<{
  file: FormControl<File | null>;
  description: FormControl<string>;
  type: FormControl<'document'>;
}>;

export const getImageEvidenceForm = (
  file: File | null = null,
  description = '',
  linkToRelatedResource = ''
): ImageEvidence => {
  return new FormGroup({
    file: new FormControl<File | null>(file, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    description: new FormControl<string>(description, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    type: new FormControl<'image'>('image', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    linkToRelatedResource: new FormControl<string>(linkToRelatedResource, {
      validators: [],
    }),
  });
};

export const getLinkEvidenceForm = (
  link = '',
  description = ''
): LinkEvidence => {
  return new FormGroup({
    link: new FormControl<string>(link, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    description: new FormControl<string>(description, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    type: new FormControl<'link'>('link', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });
};

export const getDocumentEvidenceForm = (
  file: File | null = null,
  description = ''
): DocumentEvidence => {
  return new FormGroup({
    file: new FormControl<File | null>(file, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    description: new FormControl<string>(description, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    type: new FormControl<'document'>('document', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });
};
