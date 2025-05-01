beforeEach(() => {
    cy.request('POST', 'http://127.0.0.1:8000/api/test/create-user', {
        email: 'admin@example.com',
        password: 'Admin123!',
        role: 'Admin'
    });
});
describe('Auth Flow', () => {
    const email = 'admin@gmail.com';
    const password = 'Admin123!';

    it('redirects unauthenticated user from /users to login', () => {
        cy.clearLocalStorage();
        cy.visit('http://localhost:3000/users');
        cy.url().should('include', '/login');
    });
    it('redirects to originally intended route after login', () => {
        cy.request('POST', 'http://127.0.0.1:8000/api/test/create-user', {
            email: 'admin@example.com',
            password: 'Admin123!',
            role: 'Admin'
        });

        cy.visit('http://localhost:3000/users');
        cy.url().should('include', '/login');

        cy.get('input[name="email"]').type('admin@example.com');
        cy.get('input[name="password"]').type('Admin123!');
        cy.get('form').submit();

        cy.url().should('include', '/');
    });




});

