/// <reference types="cypress" />

Cypress.on('uncaught:exception', (err, runnable) => {
    return false
})

const array = ['buy', 'play', 'sleep','eat','shopping'];

describe('To Do List', () => {
    //----adding items function-------//
    const add = () => {
        for (let index = 0; index < array.length; index++) {
            const element = array[index]
            cy.get('[data-test=new-todo]').type(element).type('{enter}')
                .should('have.value', '')
            cy.get('.todo-list li').should('have.length', index + 3)
                .last()
                .and('contain', element)
        }
    }
    //----checking function---//
    const check = () => {
        for (let index = 0; index < array.length; index++) {
            const element = array[index];
            cy.get('.todo-list li')
                .contains(element)
                .parents('li')
                .within(() => {
                    cy.get('input[type="checkbox"]').check({ force: true })
                })
        }
    }
    beforeEach('visit URL', () => {
        cy.visit('https://example.cypress.io/todo')
        add()     //calling add function
    })

    it('Verify items added', () => {
        cy.get('.todo-list').within(() => {
            array.forEach(element => {
                cy.get('li')
                    .contains(element)
                    .should('exist')
                    .should('be.visible')
            })

        })
    })

    it('verify items checked', () => {
        for (let index = 0; index < array.length; index++) {
            const element = array[index];
            cy.get('.todo-list li').contains(element).parents('li').within(() => {
                cy.get('input[type="checkbox"]')
                    .check({ force: true })
                cy.get('input[type="checkbox"]')
                    .should('be.checked')

            })
        }
    })

    it('can show completed items', () => {
        check()
        cy.get('[href="#/completed"]')
            .click({ force: true })
        for (let index = 0; index < array.length; index++) {
            const element = array[index];
            cy.get('.todo-list li')
                .contains(element)
                .parents('li')
                .should('have.class', 'completed')
        }
    })

    it('show all items added', () => {
        cy.get('[href="#/"]').contains('All').click({ force: true })
        array.forEach(element => {
            cy.get('.todo-list li')
                .contains(element)
                .parents('li')
                .should('exist')
                .should('be.visible')
        })
    })

    it('verify items active', () => {
        check()
        cy.get('[href="#/active"]')
            .click({ force: true })
        cy.get('.todo-list li')
            .find('input')
            .should('not.be.checked')
            .parents('li')
            .should('be.visible')
    })

    it('checking active and all items',()=>{
        for (let index = 2; index < array.length; index++) {
            const element = array[index];
            cy.get('.todo-list li')
                .contains(element)
                .parents('li')
                .within(() => {
                    cy.get('input[type="checkbox"]').check({ force: true })
                })
        }
        cy.get('[href="#/active"]')
            .click({ force: true })
        for (let index = 0; index < array.length - 3; index++) {
            const element = array[index];
            cy.get('.todo-list li')
                .contains(element)
                .should('be.visible')
                .parents('li')
                .find('input')
                .should('not.be.checked')
        }
    
    
        cy.get('[href="#/"]').contains('All').click({ force: true })
        array.forEach(element => {
            cy.get('.todo-list li')
                .contains(element)
                .parents('li')
                .should('exist')
                .should('be.visible')
        })
    })

    it('checking active and completed items',()=>{
        for (let index = 2; index < array.length; index++) {
            const element = array[index];
            cy.get('.todo-list li')
                .contains(element)
                .parents('li')
                .within(() => {
                    cy.get('input[type="checkbox"]').check({ force: true })
                })
        }

        cy.get('[href="#/active"]')
            .click({ force: true })
        for (let index = 0; index < array.length - 3; index++) {
            const element = array[index];
            cy.get('.todo-list li')
                .contains(element)
                .should('be.visible')
                .parents('li')
                .find('input')
                .should('not.be.checked')
        }
    
        cy.get('[href="#/completed"]')
        .click({ force: true })
        for (let index = 2; index < array.length; index++) {
            const element = array[index];
            cy.get('.todo-list li')
                .contains(element)
                .parents('li')
                .should('have.class', 'completed')
        }
    })
    it('check if number of items is changed', () => {
        cy.contains('items left')
                .get('strong')
                .should('have.html', '7')
        cy.get('[data-test=new-todo]').type('going to gym').type('{enter}')
        cy.contains('items left')
            .get('strong')
            .should('have.html', '8')
        cy.get('input[type="checkbox"]')
            .last()
            .check({ force: true })
        cy.contains('items left')
            .get('strong')
            .should('have.html', '7')
        
    })

    it(' unchecking items', () => {
        check()
        for (let index = 0; index < array.length; index++) {
            const element = array[index];
            cy.get('.todo-list li')
                .contains(element)
                .parents('li')
                .within(() => {
                    cy.get('input').uncheck({ force: true })
                    cy.get('input').should('not.be.checked')
                })
        }
    })
    it('checking all items by one click',()=>{
        cy.get('[for="toggle-all"]').click({force: true})
        array.forEach(element=>{
            cy.contains(element)
                .get('input[type="checkbox"]')
                .should('be.checked')
        })
    })

    it('can show "clear completed" button',()=>{
        array.forEach(element=>{
            cy.contains(element)
                .parents('li')
                .find('input')
                .check({force: true})
            cy.get('.todo-button.clear-completed')
                .should('have.css','display','block')
            cy.contains(element)
                .parents('li')
                .find('input')
                .uncheck({force: true})
        })
    })

    it('can clear all completed items',()=>{
        check()
        cy.get('.todo-button.clear-completed')
            .click({force: true})
        cy.get('.todo-list li').should('not.deep.include',array)
    })

    it('can delete an item',()=>{
        array.forEach(element=>{
            cy.contains(element)
                .parents('li')
                .find('.destroy.todo-button')
                .click({force: true})
            cy.get('.todo-list li')
                .should('not.contain',element)
        })
    })
})

