import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinComponent } from './join.component';

const mockSessionService = {
  joinSession: jest.fn(),
};

describe('JoinComponent', () => {
  let component: JoinComponent;
  let fixture: ComponentFixture<JoinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JoinComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(JoinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  /*
  it("should join a session without a set user name", () => {
    component.joinSession();
    expect(mockSessionService.joinSession).toHaveBeenCalled();
  });

  it("should join a session with a set user name", () => {
    runStoreAction("user", StoreActions.Update, {
      payload: {
        data: {
          name: "name",
          pic: "pic",
        },
      },
    });
    component.joinSession();
    expect(mockSessionService.joinSession).toHaveBeenCalled();
  });
  */
});
