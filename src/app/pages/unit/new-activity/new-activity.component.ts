import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import {
  DocumentEvidence,
  getDocumentEvidenceForm,
  getImageEvidenceForm,
  getLinkEvidenceForm,
  ImageEvidence,
  LinkEvidence,
} from '../../../utils/formsTypes';
import { LinkEvidenceFormComponent } from '../../../components/unit/link-evidence-form/link-evidence-form.component';
import { ImageEvidenceFormComponent } from '../../../components/unit/image-evidence-form/image-evidence-form.component';
import { DocumentEvidenceFormComponent } from '../../../components/unit/document-evidence-form/document-evidence-form.component';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { IndicatorService } from '../../../services/indicator/indicator.service';
import { CustomHttpErrorResponse } from '../../../interfaces/responses/error';
import { ToastrService } from 'ngx-toastr';
import { CategoriesData, Indicators } from '../../../interfaces/units/units';
import { ActivitiesService } from '../../../services/activities/activities.service';
import { Router } from '@angular/router';
import { routes } from '../../../routes';

@Component({
  selector: 'app-new-activity',
  standalone: true,
  imports: [
    ButtonModule,
    OverlayPanelModule,
    ReactiveFormsModule,
    LinkEvidenceFormComponent,
    ImageEvidenceFormComponent,
    DocumentEvidenceFormComponent,
    InputTextModule,
    DropdownModule,
    InputTextareaModule,
  ],
  templateUrl: './new-activity.component.html',
  styleUrl: './new-activity.component.scss',
})
export class NewActivityComponent {
  evidences: (ImageEvidence | LinkEvidence | DocumentEvidence)[] = [];
  indicators: Indicators[] = [];
  activityForm = new FormGroup({
    name: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    summary: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    category: new FormControl<CategoriesData | null>(null, {
      validators: [Validators.required],
    }),
  });
  get validEvidences(): boolean {
    return this.evidences.every((evidence) => evidence.valid);
  }
  loading = false;

  constructor(
    private readonly indicatorService: IndicatorService,
    private readonly toastService: ToastrService,
    private readonly activitiesService: ActivitiesService,
    private readonly router: Router
  ) {
    this.indicatorService.getAllIndicators().subscribe({
      next: (response) => {
        this.indicators = response.data.filter(
          (indicator) => indicator.categories.length > 0
        );
      },
      error: (error: CustomHttpErrorResponse) => {
        if (error.error.statusCode === 500) {
          this.toastService.error(
            'Ha ocurrido un error el cargar las categorías '
          );
        } else {
          this.toastService.error(error.error.message);
        }
      },
    });
  }

  addImageEvidence() {
    this.evidences.push(getImageEvidenceForm());
    this.scrollToTop();
  }

  addLinkEvidence() {
    this.evidences.push(getLinkEvidenceForm());
    this.scrollToTop();
  }

  addDocumentEvidence() {
    this.evidences.push(getDocumentEvidenceForm());
    this.scrollToTop();
  }

  removeEvidence(index: number) {
    this.evidences = [
      ...this.evidences.slice(0, index),
      ...this.evidences.slice(index + 1),
    ];
  }

  scrollToTop() {
    setTimeout(() => {
      const topElement = document.getElementById('topOfPage');
      const lastChild = topElement?.lastElementChild;
      if (lastChild) {
        lastChild.scrollIntoView({ behavior: 'smooth' });
        console.log('Subiendo');
      }
    }, 0);
  }

  createActivity() {
    if (this.activityForm.valid && this.validEvidences) {
      this.loading = true;
      const indicatorIndex =
        this.indicators.find((indicator) =>
          indicator.categories.some(
            (category) =>
              category.name === this.activityForm.value.category?.name
          )
        )?.index ?? 0;
      this.activitiesService
        .createUnitActivity({
          name: this.activityForm.value.name ?? '',
          summary: this.activityForm.value.summary ?? '',
          indicatorIndex,
          categoryName: this.activityForm.value.category?.name ?? '',
        })
        .subscribe({
          next: (response) => {
            this.toastService.success('Actividad creada con éxito');
            this.router.navigate([routes.unitActivities]);
          },
          error: (error: CustomHttpErrorResponse) => {
            if (error.error.statusCode === 500) {
              this.toastService.error(
                'Ha ocurrido un error inesperado al crear la actividad'
              );
            } else {
              this.toastService.error(error.error.message);
            }
            this.loading = false;
          },
        });
    }
  }
}
