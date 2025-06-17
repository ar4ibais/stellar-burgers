describe('Бургер Конструктор', () => {
  const INGREDIENTS_API = 'api/ingredients';
  const INGREDIENTS_FIXTURE = 'ingredients.json';

  beforeEach(() => {
    cy.intercept('GET', INGREDIENTS_API, { fixture: INGREDIENTS_FIXTURE }).as(
      'getIngredients'
    );
    cy.visit('/');
    cy.wait('@getIngredients');
  });

  const openModal = () => {
    cy.get("[data-cy='ingredients-items']")
      .first()
      .find("[data-cy='ingredient-container']")
      .first()
      .click();
  };

  describe('Добавление ингредиентов в конструктор', () => {
    it('должен отображать пустые состояния для булок и начинок', () => {
      cy.get("[data-cy='noBuns']").should('have.length', 3);
    });

    it('должен добавлять ингредиенты в конструктор', () => {
      cy.clickIngredientInIndexedContainer(0);
      cy.clickIngredientInIndexedContainer(1);

      cy.get("[data-cy='burger-constructor-element']").should('be.visible');
      cy.get("[data-cy='burger-constructor-element-fullwidth']").should(
        'be.visible'
      );
    });
  });

  describe('Модальное окно ингредиента', () => {
    beforeEach(() => {
      openModal();
      cy.checkModalViibility(true);
    });

    it('должно закрываться при клике на кнопку закрытия', () => {
      cy.get("[data-cy='modal']").find('button').click();

      cy.checkModalViibility(false);
    });

    it('должно закрываться при клике на оверлей', () => {
      cy.get("[data-cy='modal-overlay']").click({ force: true });

      cy.checkModalViibility(false);
    });
  });
});
