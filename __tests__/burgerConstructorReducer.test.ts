import {
  burgerConstructorSlice,
  addIngredient,
  removeIngredient,
  moveIngredient
} from '../src/services/slices/burgerConstructorSlice';
import { TIngredient } from '../src/utils/types';

jest.mock('../src/utils/burger-api', () => ({
  orderBurgerApi: jest.fn()
}));

describe('Редьюсер слайса constructor', () => {
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
    image: 'image.png',
    image_mobile: 'image_mobile.png',
    image_large: 'image_large.png',
    __v: 0
  });

  describe('Добавление ингредиента', () => {
    it('должен корректно добавлять ингредиент', () => {
      const ingredient = mockIngredient('1', 'Ingredient');
      const initialState = burgerConstructorSlice.getInitialState();
      const action = addIngredient(ingredient);
      const state = burgerConstructorSlice.reducer(initialState, action);

      expect(state.constructorItems.ingredients).toContainEqual(ingredient);
    });
  });

  describe('Удаление ингредиента', () => {
    it('должен корректно удалять ингредиент по индексу', () => {
      const ingredient = mockIngredient('1', 'Ingredient');
      const initialState = {
        ...burgerConstructorSlice.getInitialState(),
        constructorItems: {
          bun: null,
          ingredients: [ingredient]
        }
      };

      const action = removeIngredient(0);
      const state = burgerConstructorSlice.reducer(initialState, action);

      expect(state.constructorItems.ingredients).not.toContainEqual(ingredient);
    });
  });

  describe('Изменение порядка ингредиентов', () => {
    it('должен корректно менять местами ингредиенты', () => {
      const ingredient1 = mockIngredient('1', 'Ingredient 1');
      const ingredient2 = mockIngredient('2', 'Ingredient 2');

      const initialState = {
        ...burgerConstructorSlice.getInitialState(),
        constructorItems: {
          bun: null,
          ingredients: [ingredient1, ingredient2]
        }
      };

      const action = moveIngredient({ fromIndex: 0, toIndex: 1 });
      const state = burgerConstructorSlice.reducer(initialState, action);

      expect(state.constructorItems.ingredients).toEqual([
        ingredient2,
        ingredient1
      ]);
    });
  });
});
