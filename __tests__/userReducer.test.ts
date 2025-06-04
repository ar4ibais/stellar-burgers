import {
  userSlice,
  loginUser,
  getUser,
  updateUser,
  logoutUser
} from '../src/services/slices/userSlice';
import { TUser } from '../src/utils/types';
import { TLoginData, TAuthResponse } from '../src/utils/burger-api';

jest.mock('../src/utils/burger-api', () => ({
  loginUserApi: jest.fn(),
  registerUserApi: jest.fn(),
  logoutApi: jest.fn(),
  getUserApi: jest.fn(),
  updateUserApi: jest.fn()
}));

describe('userSlice reducer', () => {
  const mockUser: TUser = {
    email: 'test@example.com',
    name: 'Test User'
  };

  const mockLoginData: TLoginData = {
    email: 'test@example.com',
    password: 'password123'
  };

  const mockAuthResponse: TAuthResponse = {
    success: true,
    user: mockUser,
    accessToken: 'access-token',
    refreshToken: 'refresh-token'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('loginUser', () => {
    it('should handle pending state', () => {
      const initialState = userSlice.getInitialState();
      const action = loginUser.pending('requestId', mockLoginData);
      const state = userSlice.reducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        isLoading: true,
        isAuthChecked: true
      });
    });

    it('should handle fulfilled state', () => {
      const initialState = userSlice.getInitialState();
      const action = loginUser.fulfilled(mockUser, 'requestId', mockLoginData);
      const state = userSlice.reducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        user: mockUser,
        isLoading: false,
        isAuthChecked: true
      });
    });

    it('should handle rejected state', () => {
      const initialState = userSlice.getInitialState();
      const action = loginUser.rejected(
        new Error('Invalid credentials'),
        'requestId',
        mockLoginData
      );
      const state = userSlice.reducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        isLoading: false,
        isAuthChecked: true,
        user: null
      });
    });
  });

  describe('logoutUser', () => {
    it('should handle fulfilled state', () => {
      const initialState = {
        ...userSlice.getInitialState(),
        user: mockUser
      };
      const action = logoutUser.fulfilled(undefined, 'requestId');
      const state = userSlice.reducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        user: null,
        isLoading: false,
        isAuthChecked: true
      });
    });
  });

  describe('getUser', () => {
    it('should handle pending state', () => {
      const initialState = userSlice.getInitialState();
      const action = getUser.pending('requestId');
      const state = userSlice.reducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        isLoading: true
      });
    });

    it('should handle fulfilled state', () => {
      const initialState = userSlice.getInitialState();
      const action = getUser.fulfilled(
        { success: true, user: mockUser },
        'requestId'
      );
      const state = userSlice.reducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        user: mockUser,
        isLoading: false,
        isAuthChecked: true
      });
    });

    it('should handle rejected state', () => {
      const initialState = userSlice.getInitialState();
      const action = getUser.rejected(
        new Error('Failed to fetch user'),
        'requestId'
      );
      const state = userSlice.reducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        isLoading: false,
        isAuthChecked: true
      });
    });
  });

  describe('updateUser', () => {
    it('should handle fulfilled state', () => {
      const updatedUser = { ...mockUser, name: 'Updated User' };
      const initialState = userSlice.getInitialState();
      const action = updateUser.fulfilled(
        { success: true, user: updatedUser },
        'requestId',
        { name: 'Updated User' }
      );
      const state = userSlice.reducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        user: updatedUser,
        isLoading: false
      });
    });
  });
});
