const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

// URL du site Leclerc Drive
const url = 'https://www.leclercdrive.fr/';

// Fonction pour récupérer les produits et les prix
async function scrapeLeclercDrive() {
  try {
    // Envoyer une requête GET à l'URL et obtenir le contenu de la page
    const response = await axios.get(url);
    const html = response.data;

    // Charger le contenu HTML dans Cheerio
    const $ = cheerio.load(html);

    // Sélectionner tous les éléments contenant les informations des produits et des prix
    const productElements = $('.product-name');
    const priceElements = $('.product-price');

    // Créer un tableau pour stocker les produits et les prix
    const products = [];

    // Parcourir les éléments et extraire les informations
    productElements.each((index, element) => {
      const productName = $(element).text().trim();
      const productPrice = $(priceElements[index]).text().trim();

      // Créer un objet pour stocker les informations du produit
      const product = {
        name: productName,
        price: productPrice
      };

      // Ajouter le produit au tableau
      products.push(product);
    });

    // Enregistrer les produits dans un fichier JSON
    fs.writeFileSync('leclerc_drive_products.json', JSON.stringify(products, null, 4));

    console.log('Les produits ont été récupérés et enregistrés dans le fichier leclerc_drive_products.json.');
  } catch (error) {
    console.error('Une erreur s\'est produite :', error);
  }
}

// Appeler la fonction pour récupérer les produits
scrapeLeclercDrive();