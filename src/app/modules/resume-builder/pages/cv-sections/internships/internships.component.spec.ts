import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternshipsComponent } from './internships.component';

describe('InternshipsComponent', () => {
  let component: InternshipsComponent;
  let fixture: ComponentFixture<InternshipsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [InternshipsComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(InternshipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
