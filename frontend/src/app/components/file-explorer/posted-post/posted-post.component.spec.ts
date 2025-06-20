import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostedPostComponent } from './posted-post.component';

describe('PostedPostComponent', () => {
  let component: PostedPostComponent;
  let fixture: ComponentFixture<PostedPostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostedPostComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostedPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
