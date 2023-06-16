const puppeteer = require('puppeteer-extra')
const cheerio = require("cheerio");
const axios = require("axios");

const fs = require("fs");

// const StealthPlugin = require('puppeteer-extra-plugin-stealth')
// puppeteer.use(StealthPlugin())


(async function scrapperCarrefour() {
  const url = 'https://www.carrefour.fr/services/drive'
  const browser = await puppeteer.launch({
    headless: false,
  })
  
  console.log('Démarrage de la récolte des donnés...')

  const page = await browser.newPage()
  await page.setViewport({
    width: 1800,
    height: 800,
  })
  // accéder a la page
  try {
    await page.goto(url)
    await page.waitForSelector("#onetrust-accept-btn-handler")
    await page.waitForTimeout(1000)
    await page.waitForSelector("#onetrust-accept-btn-handler")
    console.log("SUCCESS : Accès à la page réussi !")

  } catch(err) {
    console.log("ERREUR : Vous n'arrivez pas à acceder à la page")
  }
    // accepter les cookies
  try {
    await page.click("#onetrust-accept-btn-handler");
    console.log("SUCCESS : Les cookies on été acceptés !")
  } catch(err) {
    console.log("ERREUR : Les cookies n'ont pas été acceptés")
  }
  
  // choix du magasin 
  await page.waitForTimeout(2000)
  try {
    let magasin = "fismes"
    await page.waitForSelector(".service-onboarding-store__actions > button");
    await page.click(".service-onboarding-store__actions > button")
    await page.waitForSelector("[name=addressSearch]")
    await page.type('[name=addressSearch]', magasin, {delay: 1000})
    await page.waitForSelector('[tabindex="-1"]');
    await page.click('[tabindex="-1"] > b');
    await page.waitForSelector("[aria-label='Choisir le Retrait au parking, magasin Market Fismes']")
    await page.click("[aria-label='Choisir le Retrait au parking, magasin Market Fismes']")
    await page.waitForTimeout(5000)
    console.log("SUCCESS : Vous avez accès aux produits du magasin de " + magasin.toUpperCase())
  } catch(err) {
    console.log("ERREUR : Une érreur s'est produite durant la sélection du magasin.")
  }

  // choix du type d'article
  try {
    let achat = "tomate"
    await page.waitForSelector("[data-testid='pl-input-text'] > input")
    await page.type("[data-testid='pl-input-text'] > input", achat, {delay: 800})
    await page.waitForSelector("[class='pl-input-text-group__append'] > button")
    await page.click("[class='pl-input-text-group__append'] > button")
    await page.waitForTimeout(2000)
    if(page.url() === "https://www.carrefour.fr/s?q=tomate") {
      console.log("SUCCESS : Vous avez accéder a la liste " + achat)
    } else {
      console.log("Nous ré-essayons d'acceder a l'article " + achat)
    }
  } catch(err) {
    console.log("ERREUR : Vous n'étes pas parvenu a accéder a la liste" + achat)
  }

  // récuperer les données html  

  
  await page.waitForTimeout(2000)

  let CurrentUrl = page.url()

  let achat = "tomate"
  if(CurrentUrl !== "https://www.carrefour.fr/s?q=tomate") {
    try {
      await page.waitForSelector("[data-testid='pl-input-text'] > input")
      await page.type("[data-testid='pl-input-text'] > input", achat, {delay: 800})
      await page.waitForSelector("[class='pl-input-text-group__append'] > button")
      await page.click("[class='pl-input-text-group__append'] > button")
      console.log("SUCCESS : Vous avez accéder a la liste " + achat)
    } catch(err) {
      console.log("ERREUR : Vous n'étes pas parvenu a accéder a la liste" + achat)
    }
  } else {
      try {
        await page.goto(CurrentUrl)
        console.log("récupération des donnés sur l'article " + achat + " en cours...")
        

        await page.waitForSelector(".product-card-title > h2")
        await page.waitForSelector(".product-grid-item")
        await page.evaluate(() => {
        let article = Array.from(document.querySelectorAll(".product-grid-item"))
        for(let i = 0; i < article.length; i++) {
          console.log(article.length)
        }
      })
      console.log()

        console.log("SUCCESS : Récupération des données réussi");
      } catch(err) {
        console.log("ERREUR: Les données n'ont pas été récupérés");
        console.error(err);
      }
    
  }



// await page.waitForSelector(".product-card-title > h2")
// await page.waitForSelector(".product-tile__prices")
// await page.waitForSelector(".product-tile__unit-price")
    
  



// fonctionne !!!!

//   await page.waitForSelector(".product-card-title > h2")
//   const data = await page.evaluate(() => {
//     let noms = Array.from(document.querySelectorAll(".product-card-title > h2"))
//     return noms.map((nom) => nom.innerText)
// })

// console.log(data)

  // await browser.close()

})()