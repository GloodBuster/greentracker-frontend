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
import { CategoriesData } from '../../../interfaces/units/units';
import { ActivitiesService } from '../../../services/activities/activities.service';
import { ActivatedRoute, Router } from '@angular/router';
import { routes } from '../../../routes';
import { IndicatorDetails } from '../../../interfaces/indicator/indicator';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { urlToFile } from '../../../utils/files';

const removeCriteriaFromIndicatorCategories = (
  indicators: IndicatorDetails[]
): IndicatorDetails[] => {
  return indicators.map((indicator) => {
    return {
      ...indicator,
      categories: indicator.categories.map((category) => {
        return {
          name: category.name,
          criteria: [],
        };
      }),
    };
  });
};

@Component({
  selector: 'app-activity-details',
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
    ConfirmPopupModule,
    ToastModule,
    DialogModule,
  ],
  templateUrl: './activity-details.component.html',
  styleUrl: './activity-details.component.scss',
  providers: [ConfirmationService, MessageService],
})
export class ActivityDetailsComponent {
  evidences: (ImageEvidence | LinkEvidence | DocumentEvidence)[] = [];
  indicators: IndicatorDetails[] = [];
  activityId = '';
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
  visibleDelete = false;
  deleteLoading = false;

  constructor(
    private readonly indicatorService: IndicatorService,
    private readonly toastService: ToastrService,
    private readonly activitiesService: ActivitiesService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private confirmationService: ConfirmationService
  ) {
    this.indicatorService.getAllIndicators().subscribe({
      next: (response) => {
        this.indicators = removeCriteriaFromIndicatorCategories(
          response.data.filter((indicator) => indicator.categories.length > 0)
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
    this.route.params.subscribe((params) => {
      if (params) {
        const activityId = params['activityId'];
        this.activityId = activityId;
        this.activitiesService.getMyActivity(activityId).subscribe({
          next: (response) => {
            this.activityForm.controls.name.setValue(response.data.name);
            this.activityForm.controls.summary.setValue(response.data.summary);
            this.activityForm.controls.category.setValue({
              name: response.data.categoryName,
              criteria: [],
            });
          },
          error: (error: CustomHttpErrorResponse) => {
            if (error.error.statusCode === 500) {
              toastService.error(
                'Ha ocurrida un error inesperado al cargar la actividad'
              );
            } else {
              toastService.error(error.error.message);
            }
          },
        });
      }
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

  showDelete() {
    this.visibleDelete = true;
  }

  hideDelete() {
    this.visibleDelete = false;
  }

  deleteActivity() {
    this.deleteLoading = true;
    this.activitiesService.deleteMyActivity(this.activityId).subscribe({
      next: (response) => {
        this.toastService.success(
          'La actividad ha sido eliminada correctamente'
        );
        this.router.navigate([routes.unitActivities]);
      },
      error: (error: CustomHttpErrorResponse) => {
        this.deleteLoading = false;
        if (error.error.statusCode === 500) {
          this.toastService.error(
            'Ha ocurrida un error inesperado al cargar la actividad'
          );
        } else {
          this.toastService.error(error.error.message);
        }
      },
    });
  }

  confirm(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      acceptIcon: 'pi pi-trash mr-5',
      acceptLabel: 'Eliminar',
      acceptButtonStyleClass:
        'p-button-sm p-button-danger no-outline button-separation',
      rejectVisible: false, // hide reject button
      accept: () => {
        this.showDelete();
      },
    });
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
        .updateMyActivity(this.activityId, {
          name: this.activityForm.value.name ?? '',
          summary: this.activityForm.value.summary ?? '',
          indicatorIndex,
          categoryName: this.activityForm.value.category?.name ?? '',
        })
        .subscribe({
          next: (response) => {
            this.toastService.success('Actividad guardada con éxito');
            this.router.navigate([routes.unitActivities]);
          },
          error: (error: CustomHttpErrorResponse) => {
            if (error.error.statusCode === 500) {
              this.toastService.error(
                'Ha ocurrido un error inesperado al guardar la actividad'
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
