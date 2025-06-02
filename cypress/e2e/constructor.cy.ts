describe('Burger Constructor Functionality', () => {
  const setupTestEnvironment = () => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' }).as(
      'fetchIngredients'
    );
    cy.visit('/');
    cy.wait('@fetchIngredients');
  };

  const openIngredientModal = () => {
    cy.get("[data-cy='ingredients-items']")
      .first()
      .find("[data-cy='ingredient-container']")
      .first()
      .click();
  };

  beforeEach(() => {
    setupTestEnvironment();
  });

  describe('Ingredient Handling', () => {
    it('should correctly display empty state before adding ingredients', () => {
      cy.get("[data-cy='noBuns']").should('have.length', 3);
    });

    it('should allow adding ingredients to constructor', () => {
      cy.clickIngredientInIndexedContainer(0);
      cy.clickIngredientInIndexedContainer(1);

      cy.get("[data-cy='burger-constructor-element']").should('be.visible');
      cy.get("[data-cy='burger-constructor-element-fullwidth']").should(
        'be.visible'
      );
    });
  });

  describe('Modal Window Behavior', () => {
    beforeEach(() => {
      openIngredientModal();
      cy.checkModalViibility(true);
    });

    it('should close modal when close button is clicked', () => {
      cy.get("[data-cy='modal']").find('button').click();

      cy.checkModalViibility(false);
    });

    it('should close modal when overlay is clicked', () => {
      cy.get("[data-cy='modal-overlay']").click({ force: true });

      cy.checkModalViibility(false);
    });
  });
});
