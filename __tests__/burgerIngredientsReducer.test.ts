import {
  burgerIngredientsSlice,
  fetchBurgerIngredients
} from '../src/services/slices/burgerIngredientsSlice';
import { TIngredient } from '../src/utils/types';

jest.mock('../src/utils/burger-api', () => ({
  getIngredientsApi: jest.fn()
}));

describe('Редьюсер слайса burgerIngredients', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockIngredient = (id: string, name: string): TIngredient => ({
    _id: id,
    name,
    type: 'main',
    proteins: 10,
    fat: 5,
    carbohydrates: 20,
    calories: 100,
    price: 50,
    image: `${name.toLowerCase()}.png`,
    image_mobile: `${name.toLowerCase()}_mobile.png`,
    image_large: `${name.toLowerCase()}_large.png`,
    __v: 0
  });

  describe('Обработка статусов запроса ингредиентов', () => {
    it('должен установить статус loading при pending', () => {
      const initialState = burgerIngredientsSlice.getInitialState();
      const action = fetchBurgerIngredients.pending('requestId');
      const state = burgerIngredientsSlice.reducer(initialState, action);

      expect(state.status).toBe('loading');
      expect(state.error).toBeNull();
    });

    it('должен установить статус succeeded и сохранить ингредиенты при fulfilled', () => {
      const ingredients = [mockIngredient('1', 'Ingredient 1')];
      const initialState = burgerIngredientsSlice.getInitialState();
      const action = fetchBurgerIngredients.fulfilled(ingredients, 'requestId');
      const state = burgerIngredientsSlice.reducer(initialState, action);

      expect(state.status).toBe('succeeded');
      expect(state.ingredients).toEqual(ingredients);
      expect(state.error).toBeNull();
    });

    it('должен установить статус failed и сохранить ошибку при rejected', () => {
      const errorMessage = 'Failed to fetch';
      const initialState = burgerIngredientsSlice.getInitialState();
      const action = fetchBurgerIngredients.rejected(
        new Error(errorMessage),
        'requestId'
      );
      const state = burgerIngredientsSlice.reducer(initialState, action);

      expect(state.status).toBe('failed');
      expect(state.error).toBe(errorMessage);
    });
  });
});
