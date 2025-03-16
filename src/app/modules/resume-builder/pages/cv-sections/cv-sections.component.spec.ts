import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CvSectionsComponent } from './cv-sections.component';

describe('CvSectionsComponent', () => {
  let component: CvSectionsComponent;
  let fixture: ComponentFixture<CvSectionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CvSectionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CvSectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
