//Fonctions accessibles sur la page de fin de la commande

/*  
* Récupération des éléments DOM principaux 
*/

// Bouton de lancement d'une nouvelle commande
const buttonNewOrder = document.getElementById('button-end');
// Div pour afficher le numéro de la commande, dans le cas à emporter
const divNumOrder = document.getElementById('number-commande');

/*  
* Fonction au chargement de la page
*/

/**
 * Charge les informations nécessaires au chargement de la page
 */
function loadContent(){
    // On récupère le panier
    let panier = getPanier();

    // On vérifie qu'on a une commande et des produits, sinon on redirige vers l'accueil
    if(typeof(panier.numCommande) != `undefined`) {
        // On vérifie si on a des produits sinon on redirige vers la page de commande
        if(panier.products.length > 0) {
            // Si on est à emporter, on affiche le numéro de sa commande au client
            if(panier.typeService === "aEmporter") {
                // On affiche la div correspondante
                divNumOrder.classList.remove(`display-none`);
                // On lui affiche le numéro de sa commande
                divNumOrder.innerHTML = `Votre commande est la numéro ${panier.numCommande}, vous pouvez aller la récupérer au comptoir.`;
            }

            // Appel de la fonction pour envoyer au back-office la commande
            sendOrder(panier);
        }
        else {
            // Si on a pas de numéro de commande, on redirige vers l'accueil
            window.location = `order.html`;
        }
    }
    else {
        // Si on a pas de numéro de commande, on redirige vers l'accueil
        window.location = `/`;
    }
}

/*  
* Fonction d'envoi de la commande
*/

/**
 * Envoi de la commande au back-office
 * @param {Objet} panier Panier correspondant à la commande
 */
function sendOrder(panier){
    /*
    //Appel d'une API fictive pour envoyer la commande
    fetch(`/api/order/send`,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(panier)
    }).then(res => {
        return res.json();
    }).then(rep => {
        // Gestion de la réponse du serveur
    }).catch(err => {
        console.log(err);
    });
    */

    // On vide le sessionStorage
    // TODO Si l'appel de l'API fonctionnait, on l'appellerai au succès de l'appel
    sessionStorage.clear();
}

// Load categories on page load
document.addEventListener('DOMContentLoaded', loadContent);