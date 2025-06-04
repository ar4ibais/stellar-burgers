import { TIngredient } from '../../src/utils/types';

describe('Burger Constructor Integration Tests', () => {
  let ingredientsData: any;

  before(() => {
    cy.fixture('ingredients.json').then((data) => {
      ingredientsData = data;
    });
  });

  const setupTestEnvironment = () => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' }).as(
      'fetchIngredients'
    );
    cy.visit('/');
    cy.wait('@fetchIngredients');
  };

  const openIngredientModal = (index = 0) => {
    cy.get("[data-cy='ingredients-items']")
      .first()
      .find("[data-cy='ingredient-container']")
      .eq(index)
      .click();
  };

  const verifyIngredientDetailsInModal = (ingredient: TIngredient) => {
    cy.get("[data-cy='ingredient-details-name']").should(
      'contain',
      ingredient.name
    );
    cy.get("[data-cy='ingredient-details-image']").should(
      'have.attr',
      'src',
      ingredient.image_large
    );
    cy.get("[data-cy='ingredient-details-calories']").should(
      'contain',
      ingredient.calories
    );
    cy.get("[data-cy='ingredient-details-proteins']").should(
      'contain',
      ingredient.proteins
    );
    cy.get("[data-cy='ingredient-details-fat']").should(
      'contain',
      ingredient.fat
    );
    cy.get("[data-cy='ingredient-details-carbs']").should(
      'contain',
      ingredient.carbohydrates
    );
  };

  beforeEach(() => {
    setupTestEnvironment();
  });

  describe('Ingredient Management', () => {
    it('should correctly display empty state before adding ingredients', () => {
      cy.get("[data-cy='noBuns']").should('have.length', 3);
    });

    it('should add correct ingredient to constructor when dragged', () => {
      const testIngredient = ingredientsData.data[0];

      // Add ingredient to constructor
      cy.get("[data-cy='ingredients-items']")
        .contains(testIngredient.name)
        .trigger('dragstart');

      cy.get("[data-cy='burger-constructor']")
        .trigger('drop')
        .trigger('dragend');

      // Verify correct ingredient was added
      cy.get("[data-cy='burger-constructor-element']")
        .should('contain', testIngredient.name)
        .and('be.visible');
    });
  });

  describe('Ingredient Modal Functionality', () => {
    it('should display correct ingredient details in modal', () => {
      const testIngredient = ingredientsData.data[1];
      openIngredientModal(1);

      cy.checkModalViibility(true);
      verifyIngredientDetailsInModal(testIngredient);
    });

    it('should close modal when close button is clicked', () => {
      openIngredientModal();
      cy.checkModalViibility(true);

      cy.get("[data-cy='modal-close-button']").click();
      cy.checkModalViibility(false);
    });

    it('should close modal when overlay is clicked', () => {
      openIngredientModal();
      cy.checkModalViibility(true);

      cy.get("[data-cy='modal-overlay']").click({ force: true });
      cy.checkModalViibility(false);
    });
  });

  describe('API Request Optimization', () => {
    it('should fetch ingredients only once on initial app load', () => {
      cy.intercept('GET', 'api/ingredients').as('ingredientsRequest');
      cy.visit('/');

      cy.wait('@ingredientsRequest').then((interception) => {
        expect(interception.request.url).to.include('api/ingredients');
      });

      // Verify no additional requests are made
      cy.get("[data-cy='header-constructor-link']").click();
      cy.get("[data-cy='header-feed-link']").click();
      cy.get('@ingredientsRequest.all').should('have.length', 1);
    });
  });
});
