/// <reference types="cypress" />

context("Login Suit", () => {
  let validPassword = "A@345678";
  beforeEach(() => {
    cy.visit("https://example.cypress.io/commands/actions");
  });

  it("username field does not accept invalid email address", () => {
    cy.get("#username").type("invalidEmail.com");
    cy.get("#errorMessage").contains("The email address is not valid").should("be.visible");
    cy.get("#username").clear().type("invalidEmail@hotmail");
    cy.get("#errorMessage").contains("The email address is not valid").should("be.visible");
  });

  it("username field should accept valid email address", () => {
    cy.get("#username").type("myemail@hotmail.com");
    cy.get("#errorMessage").should("not.be.visible");
  });

  it("password field should not accept less than 8 charachter", () => {
    cy.get("#password").type("1234567");
    cy.get("#errorMessage")
      .contains(
        "The password must be equal or more than 8 charachters and have at least one special character and one upper case character"
      )
      .should("be.visible");
    cy.get("#password").type("A234567");
    cy.get("#errorMessage")
      .contains("The password must be equal or more than 8 charachters and have at least one special character")
      .should("be.visible");
    cy.get("#password").type("A@34567");
    cy.get("#errorMessage").contains("The password must be equal or more than 8 charachters").should("be.visible");
    cy.get("#password").type(validPassword);
    cy.get("#errorMessage").should("not.be.visible");
  });

  it("repeat password field should not accept a different password", () => {
    cy.get("#password").type("wrongPassword");
    cy.get("#errorMessage").contains("The password does not match").should("be.visible");
  });

  it("repeat password field should not accept a different password", () => {
    cy.get("#password").type("wrongPassword");
    cy.get("#errorMessage").contains("The password does not match").should("be.visible");
  });

  it("repeat password field should accept the same password", () => {
    cy.get("#password").type(validPassword);
    cy.get("#errorMessage").contains("The password does not match").should("not.be.visible");
  });

  it("after login the user should be redirected to userlist page", () => {
    cy.get("#username").type("myValidUsername@hotmail.com");
    cy.get("#password").type(validPassword);
    cy.get("#submitBtn").click();
    cy.url().should("include", "/userlist");
    cy.get("#userListTable").should("be.visible");
  });

  it("each user row should have delete and edit buttons", () => {
    cy.get("#userListTable #userRow:first").get("#editBtn").should("be.visible");
    cy.get("#userListTable #userRow:first").get("#deletBtn").should("be.visible");
  });

  it("clicking on delete button should delete the user", () => {
    cy.get("#userListTable #userRow:first")
      .get("#id")
      .invoke("val")
      .then((id) => {
        cy.get("#userListTable #userRow:first").get("#deletBtn").click();
        cy.get("#alertPopup").should("be.visible");
        cy.get("#alertYes").click();
        cy.get("#id").contains(id).should("not.exist");
      });
  });

  it("clicking on edit button should edit the user", () => {
    const lastName = "adam";
    cy.get("#userListTable #userRow:first").get("#editBtn").click();
    cy.get("#editPopup").should("be.visible");
    cy.get("#lastname").clear().type(lastName);
    cy.get("#save").click();
    cy.get("#userListTable #userRow:first").get("#lastname").should("have.value", lastName);
  });
  it("user should be able to logout", () => {
    cy.get("#logout").click();
    cy.get("#confirmLogout").click();
    cy.url().should("include", "/login");
  });

  it("the user tries to login more than 3 times with wrong password", () => {
    for (let i; i < 3; i++) {
      cy.get("#username").type("myValidUsername@hotmail.com");
      cy.get("#password").type("invalidPassword");
      cy.get("#repeatPassword").type("invalidPassword");
      cy.get("#submitBtn").click();
    }
    cy.get("#errorMessage").contains("This account is invalidated and deactivated").should("be.visible");
  });
});
