describe('Sports Events - Join/Leave Flow (with existing event)', () => {
    const eventId = 14;
    const testEmail = 'user@test.com';
    const testPassword = 'Test123!';

    before(() => {
        cy.request('POST', 'http://127.0.0.1:8000/api/test/create-user', {
            email: testEmail,
            password: testPassword,
            role: 'User',
        });
    });

    beforeEach(() => {
        cy.visit('http://localhost:3000/login');
        cy.get('input[name="email"]').type(testEmail);
        cy.get('input[name="password"]').type(testPassword);
        cy.get('form').submit();

        cy.contains('Welcome back').should('exist');
    });

    it.only('can join and leave an existing event from the list', () => {
        cy.visit('http://localhost:3000/sports-events');

        cy.get(`[data-testid="event-card-${eventId}"]`, { timeout: 10000 }).should('exist');

        cy.get(`[data-testid="join-button-${eventId}"], [data-testid="leave-button-${eventId}"]`, { timeout: 10000 })
            .should('exist')
            .then(($el) => {
                const testId = $el.attr('data-testid');
                cy.log(`Detected button: ${testId}`);

                cy.wrap($el).click();

                if (testId.includes('join-button')) {
                    cy.get(`[data-testid="leave-button-${eventId}"]`, { timeout: 8000 }).should('exist');
                } else {
                    cy.get(`[data-testid="join-button-${eventId}"]`, { timeout: 8000 }).should('exist');
                }
            });
    });

    it('redirects unauthenticated users from event details to login', () => {
        cy.clearLocalStorage();
        cy.visit(`http://localhost:3000/sports-events/${eventId}/details`);
        cy.url().should('include', '/login');
    });
});
