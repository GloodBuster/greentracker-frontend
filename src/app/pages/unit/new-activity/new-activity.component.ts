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
import { Router } from '@angular/router';
import { routes } from '../../../routes';
import { IndicatorDetails } from '../../../interfaces/indicator/indicator';
import { TooltipModule } from 'primeng/tooltip';
import { AuthService } from '../../../services/auth/auth.service';
import { EvidencesService } from '../../../services/evidences/evidences.service';
import { catchError, forkJoin, of, tap } from 'rxjs';
import { ChargePeriodService } from '../../../services/charge-period/charge-period.service';

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
    TooltipModule,
  ],
  templateUrl: './new-activity.component.html',
  styleUrl: './new-activity.component.scss',
})
export class NewActivityComponent {
  evidences: (ImageEvidence | LinkEvidence | DocumentEvidence)[] = [];
  indicators: IndicatorDetails[] = [];
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
  dropdownLoading = false;
  isChargePeriod = true;

  constructor(
    private readonly indicatorService: IndicatorService,
    private readonly toastService: ToastrService,
    private readonly activitiesService: ActivitiesService,
    private readonly authService: AuthService,
    private readonly evidencesService: EvidencesService,
    private readonly chargePeriodService: ChargePeriodService,
    private readonly router: Router
  ) {
    this.dropdownLoading = true;
    this.authService.getMe().subscribe({
      next: (response) => {
        this.unitId = response.data.id;
      },
      error: (error) => {},
    });
    this.indicatorService.getAllIndicators().subscribe({
      next: (response) => {
        this.dropdownLoading = false;
        this.indicators = response.data.filter(
          (indicator) => indicator.categories.length > 0
        );
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

    this.chargePeriodService.getChargePeriod().subscribe({
      next: (response) => {
        const startDate = new Date(response.data.startTimestamp);
        const endDate = new Date(response.data.endTimestamp);
        const currentDate = new Date();
        if (currentDate >= startDate && currentDate <= endDate) {
          this.isChargePeriod = true;
        } else {
          this.toastService.info(
            'No se puede crear actividades fuera del periodo de carga'
          );
          this.isChargePeriod = false;
        }
      },
      error: (error: CustomHttpErrorResponse) => {},
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
      const imageEvidences = this.evidences.filter(
        (evidence) => evidence.value.type === 'image'
      ) as ImageEvidence[];
      const documentEvidences = this.evidences.filter(
        (evidence) => evidence.value.type === 'document'
      ) as DocumentEvidence[];
      const linkEvidences = this.evidences.filter(
        (evidence) => evidence.value.type === 'link'
      ) as LinkEvidence[];
      this.activitiesService
        .createActivity({
          name: this.activityForm.value.name ?? '',
          summary: this.activityForm.value.summary ?? '',
          indicatorIndex,
          categoryName: this.activityForm.value.category?.name ?? '',
          unitId: this.unitId,
        })
        .subscribe({
          next: (response) => {
            this.toastService.success('Actividad creada con éxito');
            this.toastService.info('Cargando evidencias');

            const activityId = response.data.id;

            const imageEvidenceObservables = imageEvidences.map(
              (evidence, index) =>
                this.evidencesService
                  .createImageEvidence(activityId, evidence)
                  .pipe(
                    tap(() => {
                      this.toastService.success(
                        `Imagen ${index + 1} cargada con éxito`
                      );
                    }),
                    catchError((error: CustomHttpErrorResponse) => {
                      this.toastService.error(
                        `Ha ocurrida un error al cargar la imágen ${index + 1}`
                      );
                      return of(null); // Return a null observable to continue the forkJoin
                    })
                  )
            );
            const documentEvidenceObservables = documentEvidences.map(
              (evidence, index) =>
                this.evidencesService
                  .createDocumentEvidence(activityId, evidence)
                  .pipe(
                    tap(() => {
                      this.toastService.success(
                        `Documento ${index + 1} cargado con éxito`
                      );
                    }),
                    catchError((error: CustomHttpErrorResponse) => {
                      this.toastService.error(
                        `Ha ocurrida un error al cargar el documento ${
                          index + 1
                        }`
                      );
                      return of(null); // Return a null observable to continue the forkJoin
                    })
                  )
            );
            const linkEvidenceObservables = linkEvidences.map(
              (evidence, index) =>
                this.evidencesService
                  .createLinkEvidence(activityId, evidence)
                  .pipe(
                    tap(() => {
                      this.toastService.success(
                        `Link ${index + 1} cargado con éxito`
                      );
                    }),
                    catchError((error: CustomHttpErrorResponse) => {
                      this.toastService.error(
                        `Ha ocurrida un error al cargar el link ${index + 1}`
                      );
                      return of(null); // Return a null observable to continue the forkJoin
                    })
                  )
            );

            const allEvidenceObservables = [
              ...imageEvidenceObservables,
              ...documentEvidenceObservables,
              ...linkEvidenceObservables,
            ];

            forkJoin(allEvidenceObservables).subscribe({
              next: () => {
                this.router.navigate([routes.unitActivities]);
              },
            });
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
