import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmationModalComponent } from './confirmation-modal.component';
import { By } from '@angular/platform-browser';

describe('ConfirmationModalComponent', () => {
  let component: ConfirmationModalComponent;
  let fixture: ComponentFixture<ConfirmationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfirmationModalComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit confirmAction on confirm', () => {
    spyOn(component.confirmAction, 'emit');
    const confirmButton = fixture.debugElement.query(By.css('button.confirm'));
    confirmButton.triggerEventHandler('click', null);
    expect(component.confirmAction.emit).toHaveBeenCalled();
  });

  it('should emit cancelAction on cancel', () => {
    spyOn(component.cancelAction, 'emit');
    const cancelButton = fixture.debugElement.query(By.css('button.cancel'));
    cancelButton.triggerEventHandler('click', null);
    expect(component.cancelAction.emit).toHaveBeenCalled();
  });

  it('should display the product name', () => {
    component.productName = 'Test Product';
    fixture.detectChanges();
    const productNameElement = fixture.debugElement.query(By.css('.product-name')).nativeElement;
    expect(productNameElement.textContent).toContain('Test Product');
  });
});
