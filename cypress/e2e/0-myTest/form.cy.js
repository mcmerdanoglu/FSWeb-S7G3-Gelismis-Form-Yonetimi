/// <reference types="cypress" />

const passingFullName = "cem";
const passingEmail = "cem@test.com";
const failingEmail = "cem@testcom";
const passingPassword = "123456";
const failingPassword = "12345";
const initialListLenght = 4;

describe("form testleri", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000");
  });

  it("form elemanlarının hepsi ekranda", () => {
    cy.get("input").should("have.length", 6);
    cy.get("button[type=submit]").should("be.visible");
  });

  it("hatasız giriş yapınca, üye listesine ekleniyor", () => {
    cy.get("input[name='fullName']").type(passingFullName);
    cy.get("input[name='email']").type(passingEmail);
    cy.get("input[name='password']").type(passingPassword);
    cy.get("input[name='languages']").click();
    cy.get("button[type=submit]").click();
    cy.get(".App.App-header ul li").should(
      "have.length",
      initialListLenght + 1
    );
  });

  it("sadece isim boşken form gönderilmiyor, hata mesajı görünüyor", () => {
    cy.get("input[name='fullName']").type("tamAd");
    cy.get("input[name='fullName']").clear();
    cy.get("input[name='email']").type(passingEmail);
    cy.get("input[name='password']").type(passingPassword);
    cy.get("input[name='languages']").click();
    cy.get("input[name='fullName']+span").should("be.visible");
    cy.get("input[name='fullName']+span").should("have.text", "tamAd zorunlu");
    cy.get("button[type=submit]").should("be.disabled");
  });

  it("şifre kısa veya boş iken form gönderilmiyor, hata mesajı görünüyor", () => {
    cy.get("input[name='fullName']").type(passingFullName);
    cy.get("input[name='email']").type("hatalitestcom");
    cy.get("input[name='password']").type(passingPassword);
    cy.get("input[name='language']").click();
    cy.get("input[name='email']+span").should("be.visible");
    cy.get("input[name='email']+span").should(
      "have.text",
      "eposta alanında bir hata olabilir mi?"
    );
    cy.get("button[type=submit]").should("be.disabled");
    cy.get("input[name='email']").clear();
    cy.get("input[name='email']").type(passingEmail);
    cy.get("button[type=submit]").should("not.be.disabled");
    cy.get("input[name='email']+span").should("not.exist");
  });

  it("dil seçili değil iken form gönderilemiyor, hata mesajı görünüyor", () => {
    cy.get("input[name='fullName']").type(passingFullName);
    cy.get("input[name='email']").type(passingEmail);
    cy.get("input[name='password']").type(passingPassword);

    cy.get("[data-cy='errorLanguage']").should("not.exist");
    cy.get("button[type=submit]").should("be.disabled");

    cy.get("input[name='language']").click();
    cy.get("input[name='language']").click();

    cy.get("[data-cy='errorLanguage']").should("be.visible");
    cy.get("[data-cy='errorLanguage']").should(
      "have.text",
      "en az 1 dil zorulu"
    );
    cy.get("button[type=submit]").should("be.disabled");
  });
});
