import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AsignaturaPage } from './asignatura.page';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';
import { of } from 'rxjs';

const barcodeScannerMock = {
  scan: jasmine.createSpy('scan').and.returnValue(
    Promise.resolve({ text: 'mocked-code', format: 'QR_CODE', cancelled: false })
  ),
  checkPermission: jasmine.createSpy('checkPermission').and.returnValue(
    Promise.resolve({ granted: true })
  ),
  stopScan: jasmine.createSpy('stopScan').and.returnValue(Promise.resolve()),
};

describe('AsignaturaPage', () => {
  let component: AsignaturaPage;
  let fixture: ComponentFixture<AsignaturaPage>;

  beforeEach(async () => {
    const activatedRouteSpy = {
      snapshot: { paramMap: { get: () => '123' } },
      queryParams: of({}),
    };

    await TestBed.configureTestingModule({
      declarations: [AsignaturaPage],
      imports: [
        IonicModule.forRoot(),
        HttpClientTestingModule, 
      ],
      providers: [
        { provide: BarcodeScanner, useValue: barcodeScannerMock }, 
        { provide: ActivatedRoute, useValue: activatedRouteSpy }, 
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AsignaturaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Debería crear el componente', () => {
    expect(component).toBeTruthy();
  });
});
