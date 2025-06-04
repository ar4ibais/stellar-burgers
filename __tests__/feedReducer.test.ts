import { feedSlice, fetchOrders } from '../src/services/slices/feedSlice';
import { TFeedsResponse } from '../src/utils/burger-api';

jest.mock('../src/utils/burger-api', () => ({
  getFeedsApi: jest.fn()
}));

describe('Редьюсер слайса feedSlice', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const createMockOrder = (id: string, number: number) => ({
    _id: id,
    ingredients: [`ingredient${number}1`, `ingredient${number}2`],
    status: 'done',
    name: `Order ${number}`,
    createdAt: '2023-10-01T00:00:00Z',
    updatedAt: '2023-10-01T00:00:00Z',
    number
  });

  const createMockFeedsResponse = (): TFeedsResponse => ({
    success: true,
    orders: [createMockOrder('1', 1)],
    total: 1,
    totalToday: 1
  });

  describe('Обработка статусов запроса заказов', () => {
    it('должен установить статус loading при начале загрузки', () => {
      const initialState = feedSlice.getInitialState();
      const state = feedSlice.reducer(
        initialState,
        fetchOrders.pending('requestId')
      );

      expect(state.status).toBe('loading');
      expect(state.error).toBeNull();
    });

    it('должен корректно обрабатывать успешный ответ', () => {
      const mockResponse = createMockFeedsResponse();
      const initialState = feedSlice.getInitialState();
      const state = feedSlice.reducer(
        initialState,
        fetchOrders.fulfilled(mockResponse, 'requestId')
      );

      expect(state.status).toBe('succeeded');
      expect(state.feeds).toEqual(mockResponse);
      expect(state.error).toBeNull();
    });

    it('должен обрабатывать ошибку запроса', () => {
      const errorMessage = 'Failed to fetch';
      const initialState = feedSlice.getInitialState();
      const state = feedSlice.reducer(
        initialState,
        fetchOrders.rejected(new Error(errorMessage), 'requestId')
      );

      expect(state.status).toBe('failed');
      expect(state.error).toBe(errorMessage);
    });
  });
});
