/**
 * ? Fonctions accessibles sur la page d'accueil
 */

// On récupère nos éléments radio pour le type de service
let arrayRadioService = document.querySelectorAll(`.choix-service input[type=radio]`);

// On ajoute l'eventlistener sur les radio
arrayRadioService.forEach(radioService => {
    // On va réagir au click
    radioService.addEventListener(`click`,(e)=>{
        // On récupère notre panier
        let panier = getPanier();
        // On récupère le type de service pour la commande
        let typeService = radioService.value;
        let numCommande = '';
        let refCommandeService = '';

        // On génère un numéro de commande aléatoire (serait fourni par un back idéalement)
        if (typeService === "aEmporter" || typeService === "surPlace") {
            numCommande = (typeService === "aEmporter" ? `E` : `P`) + Math.floor(Math.random() * 100) + Date.now().toString().substring(11,13);
            refCommandeService = Math.floor(Math.random() * 100) + Date.now().toString().substring(10,13);
        }

        // On affecte ces valeurs au panier du client et on initialise un tableau de produits
        panier.typeService = typeService;
        panier.numCommande = numCommande;
        panier.refCommandeService = refCommandeService;
        panier.products = [];

        // On sauvegarde notre panier
        setPanier(panier);

        // On dirige l'utilisateur vers la suite
        window.location = `order.html`;
    })
});


/**
 * Vérifie la présence d'un panier en cours
 */
function loadContent(){
    // On récupère le panier
    let panier = getPanier();

    // Si un panier est en cours, on ramène à la page de construction de la commande
    if(panier.numCommande != undefined) {
        window.location = 'order.html';
    }
}

// Load categories on page load
document.addEventListener('DOMContentLoaded', loadContent);

