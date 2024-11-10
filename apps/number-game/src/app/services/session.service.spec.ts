import { TestBed } from '@angular/core/testing';

import { SessionService } from './session.service';

const mockJoinData = {
  name: 'user',
  pic: 'pic',
  uuid: '123',
  sessionID: '123456',
};

const mockJoinSessionState = {
  players: [],
  sessionUser: {
    sessionID: '123456',
    uuid: '123',
  },
  userGuess: -1,
  winningNumber: -1,
};

const mockJoinUserState = {
  name: 'user',
  pic: 'pic',
};

const mockRestartData = {
  players: [
    {
      uuid: '123',
      name: 'playerRestart',
      pic: 'pic',
      guess: -1,
      won: false,
    },
  ],
  winningNumber: -1,
};

const mockRestartState = {
  players: [
    {
      guess: -1,
      name: 'playerRestart',
      pic: 'pic',
      uuid: '123',
      won: false,
    },
  ],
  sessionUser: {
    sessionID: '',
    uuid: '',
  },
  userGuess: -1,
  winningNumber: -1,
};

const mockRunningData = {
  players: [
    {
      uuid: '123',
      name: 'playerRunning',
      pic: 'pic',
      guess: 1,
      won: false,
    },
  ],
  winningNumber: 42,
};

const mockRunningState = {
  players: [
    {
      guess: 1,
      name: 'playerRunning',
      pic: 'pic',
      uuid: '123',
      won: false,
    },
  ],
  sessionUser: {
    sessionID: '',
    uuid: '',
  },
  userGuess: -1,
  winningNumber: 42,
};

const mockResetState = {
  players: [],
  sessionUser: {
    sessionID: '',
    uuid: '',
  },
  userGuess: -1,
  winningNumber: -1,
};

const mockGuessedState = {
  players: [],
  sessionUser: {
    sessionID: '',
    uuid: '',
  },
  userGuess: 1,
  winningNumber: -1,
};

const mockRouter = { navigate: jest.fn() };
const mockSessionQuery = {
  user$: {
    subscribe: jest.fn(() => {
      return of({ uuid: '123', sessionID: '123456' });
    }),
  },
};
const mockUserQuery = {};

describe('SessionService', () => {
  let service: SessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SessionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should do nothing if event is empty', () => {
    expect(() => {
      service.handleIncomingData('', {});
    }).toThrow('default case, this should never happen');
  });

  it('should update both stores if event is join', () => {
    service.handleIncomingData('join', mockJoinData);
    expect(sessionStore.getValue()).toEqual(mockJoinSessionState);
    expect(userStore.getValue()).toEqual(mockJoinUserState);
    expect(router.navigate).toHaveBeenCalledWith(['home']);
  });

  it('should restart the session if event is restart', () => {
    service.handleIncomingData('restart', mockRestartData);
    expect(sessionStore.getValue()).toEqual(mockRestartState);
    expect(router.navigate).toHaveBeenCalledWith(['home']);
  });

  it('should update the session store if event is running', () => {
    service.handleIncomingData('running', mockRunningData);
    expect(sessionStore.getValue()).toEqual(mockRunningState);
  });

  it('should leave the session', () => {
    service.leaveSession();
    expect(sessionQuery.user$.subscribe).toHaveBeenCalled();
    expect(sessionStore.getValue()).toEqual(mockResetState);
    expect(router.navigate).toHaveBeenCalledWith(['join']);
  });

  it('should join a session', () => {
    service.joinSession(
      mockJoinData.name,
      mockJoinData.pic,
      mockJoinData.sessionID
    );
    // What to expect here?
  });

  it('should send a guess', () => {
    service.sendGuess(1);
    expect(sessionStore.getValue()).toEqual(mockGuessedState);
    expect(router.navigate).toHaveBeenCalledWith(['result']);
  });

  it('should start a new round', () => {
    service.newRound();
    expect(sessionQuery.user$.subscribe).toHaveBeenCalled();
  });
});
