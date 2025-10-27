import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateObjectionComponent } from './template-objection.component';

describe('TemplateObjectionComponent', () => {
  let component: TemplateObjectionComponent;
  let fixture: ComponentFixture<TemplateObjectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [TemplateObjectionComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(TemplateObjectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
