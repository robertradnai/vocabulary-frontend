import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WordListChoiceComponent } from './word-list-choice.component';

describe('WordListChoiceComponent', () => {
  let component: WordListChoiceComponent;
  let fixture: ComponentFixture<WordListChoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WordListChoiceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WordListChoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
