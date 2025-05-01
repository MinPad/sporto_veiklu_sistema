beforeEach(() => {
    cy.request('POST', 'http://127.0.0.1:8000/api/test/create-user');
});
describe('Auth Flow', () => {
    const email = 'admin@gmail.com';
    const password = 'Admin123!';

    it('logs in successfully', () => {
        cy.visit('http://localhost:3000/login');
        cy.get('input[name="email"]').type(email);
        cy.get('input[name="password"]').type(password);
        cy.get('form').submit();

        cy.contains('Welcome to sports activities Website!').should('exist');
    });
    it('shows error on invalid login', () => {
        cy.visit('http://localhost:3000/login');
        cy.get('input[name="email"]').type('wrong@email.com');
        cy.get('input[name="password"]').type('WrongPassword123!');
        cy.get('form').submit();

        cy.contains('Incorrect email or password.').should('exist');
    });
    it('signs up a new user successfully', () => {
        const random = Math.floor(Math.random() * 100000);
        const newEmail = `newuser${random}@test.com`;

        cy.visit('http://localhost:3000/signup');
        cy.get('input[name="name"]').type('Test User');
        cy.get('input[name="email"]').type(newEmail);
        cy.get('input[name="password"]').type('TestPass123!');
        cy.get('input[name="password_confirmation"]').type('TestPass123!');
        cy.get('form').submit();

        cy.contains('Signup successful! You can now log in.').should('exist');
        cy.url().should('include', '/login');
    });
    // it.only vienam
    it('signs up and logs in the new user', () => {
        const random = Math.floor(Math.random() * 100000);
        const email = `user${random}@test.com`;
        const password = 'TestPass123!';

        cy.visit('http://localhost:3000/signup');
        cy.get('input[name="name"]').type('Full Test User');
        cy.get('input[name="email"]').type(email);
        cy.get('input[name="password"]').type(password);
        cy.get('input[name="password_confirmation"]').type(password);
        cy.get('form').submit();

        cy.contains('Signup successful! You can now log in.').should('exist');
        cy.url().should('include', '/login');

        cy.get('input[name="email"]').type(email);
        cy.get('input[name="password"]').type(password);
        cy.get('form').submit();

        cy.contains('Welcome to sports activities Website!').should('exist');
    });
});
