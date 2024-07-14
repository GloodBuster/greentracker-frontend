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
import { AuthService } from '../../../services/auth/auth.service';
import {
  Evidence,
  EvidenceWithFeedback,
} from '../../../interfaces/evidences/evidences';
import { environment } from '../../../../environments/environment';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { EvidencesService } from '../../../services/evidences/evidences.service';
import { catchError, forkJoin, of, tap } from 'rxjs';
import { SkeletonModule } from 'primeng/skeleton';

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
    ProgressSpinnerModule,
    SkeletonModule,
  ],
  templateUrl: './activity-details.component.html',
  styleUrl: './activity-details.component.scss',
  providers: [ConfirmationService, MessageService],
})
export class ActivityDetailsComponent {
  evidences: (ImageEvidence | LinkEvidence | DocumentEvidence)[] = [];
  activityEvidences: EvidenceWithFeedback[] = [];
  newEvidences: number[] = [];
  evidencesToDelete: { number: number; type: string }[] = [];
  indicators: IndicatorDetails[] = [];
  activityId = '';
  unitId = '';
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
  dropdownLoading = false;
  chargingEvidences = false;
  chargingActivity = false;

  constructor(
    private readonly indicatorService: IndicatorService,
    private readonly toastService: ToastrService,
    private readonly activitiesService: ActivitiesService,
    private readonly authService: AuthService,
    private readonly evidencesService: EvidencesService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private confirmationService: ConfirmationService
  ) {
    this.dropdownLoading = true;
    this.chargingActivity = true;
    this.authService.getMe().subscribe({
      next: (response) => {
        this.unitId = response.data.id;
      },
      error: (error) => {},
    });
    this.indicatorService.getAllIndicators().subscribe({
      next: (response) => {
        this.indicators = removeCriteriaFromIndicatorCategories(
          response.data.filter((indicator) => indicator.categories.length > 0)
        );
        this.dropdownLoading = false;
      },
      error: (error: CustomHttpErrorResponse) => {
        this.dropdownLoading = false;
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
        this.chargingEvidences = true;
        this.activitiesService.getActivityById(activityId).subscribe({
          next: (response) => {
            this.activityForm.controls.name.setValue(response.data.name);
            this.activityForm.controls.summary.setValue(response.data.summary);
            this.activityForm.controls.category.setValue({
              name: response.data.categoryName,
              criteria: [],
            });
            this.chargingActivity = false;
            if (response.data.evidences.length === 0)
              this.chargingEvidences = false;
            const evidences = response.data.evidences;
            this.activityEvidences = evidences;
            this.chargeEvidences(evidences).then((evidences) => {
              this.evidences = evidences;
              this.chargingEvidences = false;
              this.scrollToTop();
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

  async chargeEvidences(
    evidences: Evidence[]
  ): Promise<(ImageEvidence | LinkEvidence | DocumentEvidence)[]> {
    const results = await Promise.all(
      evidences.map(async (evidence) => {
        if (evidence.type === 'image') {
          return getImageEvidenceForm(
            await urlToFile(environment.BASE_URL + evidence.link),
            evidence.description,
            evidence.linkToRelatedResource
          );
        } else if (evidence.type === 'link') {
          return getLinkEvidenceForm(evidence.link, evidence.description);
        } else if (evidence.type === 'document') {
          return getDocumentEvidenceForm(
            await urlToFile(environment.BASE_URL + evidence.link),
            evidence.description
          );
        }
        return undefined;
      })
    );
    return results.filter((result) => result !== undefined) as (
      | ImageEvidence
      | LinkEvidence
      | DocumentEvidence
    )[];
  }

  addImageEvidence() {
    this.evidences.push(getImageEvidenceForm());
    this.newEvidences.push(this.evidences.length - 1);
    this.scrollToTop();
  }

  addLinkEvidence() {
    this.evidences.push(getLinkEvidenceForm());
    this.newEvidences.push(this.evidences.length - 1);
    this.scrollToTop();
  }

  addDocumentEvidence() {
    this.evidences.push(getDocumentEvidenceForm());
    this.newEvidences.push(this.evidences.length - 1);
    this.scrollToTop();
  }

  removeEvidence(index: number) {
    if (this.newEvidences.includes(index)) {
      this.newEvidences = this.newEvidences.filter((newEvidence) => {
        return newEvidence !== index;
      });
    } else {
      this.evidencesToDelete.push({
        number: this.activityEvidences[index].evidenceNumber,
        type: this.activityEvidences[index].type,
      });
      this.newEvidences = this.newEvidences.map((newEvidence) => {
        return newEvidence - 1;
      });
      this.activityEvidences = [
        ...this.activityEvidences.slice(0, index),
        ...this.activityEvidences.slice(index + 1),
      ];
    }
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
    this.activitiesService.deleteActivity(this.activityId).subscribe({
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

  saveChanges() {
    if (this.activityForm.valid && this.validEvidences) {
      this.loading = true;
      const indicatorIndex =
        this.indicators.find((indicator) =>
          indicator.categories.some(
            (category) =>
              category.name === this.activityForm.value.category?.name
          )
        )?.index ?? 0;
      this.toastService.info('Actualizando información de la actividad');
      this.activitiesService
        .updateActivity(this.activityId, {
          name: this.activityForm.value.name ?? '',
          summary: this.activityForm.value.summary ?? '',
          indicatorIndex,
          categoryName: this.activityForm.value.category?.name ?? '',
          unitId: this.unitId,
        })
        .subscribe({
          next: (response) => {
            const activityId = response.data.id;
            this.toastService.info('Guardando los cambios en las evidencias');
            const newEvidences = this.newEvidences.map((evidence) => {
              if (this.evidences[evidence].value.type === 'image') {
                return this.evidencesService
                  .createImageEvidence(
                    activityId,
                    this.evidences[evidence] as ImageEvidence
                  )
                  .pipe(
                    tap(() => {}),
                    catchError((error: CustomHttpErrorResponse) => {
                      if (error.error.statusCode === 500) {
                        this.toastService.error(
                          `Ha ocurrida un error al agregar una evidencia`
                        );
                      } else {
                        this.toastService.error(error.error.message);
                      }
                      return of(null); // Return a null observable to continue the forkJoin
                    })
                  );
              }
              if (this.evidences[evidence].value.type === 'link') {
                return this.evidencesService
                  .createLinkEvidence(
                    activityId,
                    this.evidences[evidence] as LinkEvidence
                  )
                  .pipe(
                    tap(() => {}),
                    catchError((error: CustomHttpErrorResponse) => {
                      if (error.error.statusCode === 500) {
                        this.toastService.error(
                          `Ha ocurrida un error al agregar una evidencia`
                        );
                      } else {
                        this.toastService.error(error.error.message);
                      }
                      return of(null); // Return a null observable to continue the forkJoin
                    })
                  );
              }
              if (this.evidences[evidence].value.type === 'document') {
                return this.evidencesService
                  .createDocumentEvidence(
                    activityId,
                    this.evidences[evidence] as DocumentEvidence
                  )
                  .pipe(
                    tap(() => {}),
                    catchError((error: CustomHttpErrorResponse) => {
                      if (error.error.statusCode === 500) {
                        this.toastService.error(
                          `Ha ocurrida un error al agregar una evidencia`
                        );
                      } else {
                        this.toastService.error(error.error.message);
                      }
                      return of(null); // Return a null observable to continue the forkJoin
                    })
                  );
              }
              return of(null);
            });

            const deletedEvidences = this.evidencesToDelete.map((evidence) => {
              if (evidence.type === 'image') {
                return this.evidencesService
                  .deleteImageEvidence(activityId, evidence.number)
                  .pipe(
                    tap(() => {}),
                    catchError((error: CustomHttpErrorResponse) => {
                      if (error.error.statusCode === 500) {
                        this.toastService.error(
                          `Ha ocurrida un error al eliminar una evidencia`
                        );
                      } else {
                        this.toastService.error(error.error.message);
                      }
                      return of(null); // Return a null observable to continue the forkJoin
                    })
                  );
              }
              if (evidence.type === 'link') {
                return this.evidencesService
                  .deleteLinkEvidence(activityId, evidence.number)
                  .pipe(
                    tap(() => {}),
                    catchError((error: CustomHttpErrorResponse) => {
                      if (error.error.statusCode === 500) {
                        this.toastService.error(
                          `Ha ocurrida un error al eliminar una evidencia`
                        );
                      } else {
                        this.toastService.error(error.error.message);
                      }
                      return of(null); // Return a null observable to continue the forkJoin
                    })
                  );
              }
              if (evidence.type === 'document') {
                return this.evidencesService
                  .deleteDocumentEvidence(activityId, evidence.number)
                  .pipe(
                    tap(() => {}),
                    catchError((error: CustomHttpErrorResponse) => {
                      if (error.error.statusCode === 500) {
                        this.toastService.error(
                          `Ha ocurrida un error al eliminar una evidencia`
                        );
                      } else {
                        this.toastService.error(error.error.message);
                      }
                      return of(null); // Return a null observable to continue the forkJoin
                    })
                  );
              }
              return of(null);
            });

            const updateEvidences = this.activityEvidences.map(
              (evidence, index) => {
                if (evidence.type === 'image') {
                  return this.evidencesService
                    .updateImageEvidence(
                      activityId,
                      evidence.evidenceNumber,
                      this.evidences[index] as ImageEvidence
                    )
                    .pipe(
                      tap(() => {}),
                      catchError((error: CustomHttpErrorResponse) => {
                        if (error.error.statusCode === 500) {
                          this.toastService.error(
                            `Ha ocurrida un error al actualizar una evidencia`
                          );
                        } else {
                          this.toastService.error(error.error.message);
                        }
                        return of(null); // Return a null observable to continue the forkJoin
                      })
                    );
                }
                if (evidence.type === 'link') {
                  return this.evidencesService
                    .updateLinkEvidence(
                      activityId,
                      this.activityEvidences[index].evidenceNumber,
                      this.evidences[index] as LinkEvidence
                    )
                    .pipe(
                      tap(() => {}),
                      catchError((error: CustomHttpErrorResponse) => {
                        if (error.error.statusCode === 500) {
                          this.toastService.error(
                            `Ha ocurrida un error al actualizar una evidencia`
                          );
                        } else {
                          this.toastService.error(error.error.message);
                        }
                        return of(null); // Return a null observable to continue the forkJoin
                      })
                    );
                }
                if (evidence.type === 'document') {
                  return this.evidencesService
                    .updateDocumentEvidence(
                      activityId,
                      this.activityEvidences[index].evidenceNumber,
                      this.evidences[index] as DocumentEvidence
                    )
                    .pipe(
                      tap(() => {}),
                      catchError((error: CustomHttpErrorResponse) => {
                        if (error.error.statusCode === 500) {
                          this.toastService.error(
                            `Ha ocurrida un error al actualizar una evidencia`
                          );
                        } else {
                          this.toastService.error(error.error.message);
                        }
                        return of(null); // Return a null observable to continue the forkJoin
                      })
                    );
                }
                return of(null);
              }
            );

            this.activitiesService.deleteAllFeedbacks(activityId).subscribe({
              next: (response) => {},
              error: (error: CustomHttpErrorResponse) => {},
            });

            const allEvidenceObservables = [
              ...newEvidences,
              ...updateEvidences,
              ...deletedEvidences,
            ];

            forkJoin(allEvidenceObservables).subscribe({
              next: () => {
                this.toastService.success('Cambios guardados correctamente');
                this.router.navigate([routes.unitActivities]);
              },
            });
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
