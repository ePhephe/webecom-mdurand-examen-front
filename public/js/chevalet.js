//Fonctions accessibles sur la page de saisie du numéro de chevalet

/*  
* Récupération des éléments DOM principaux 
*/

// Bouton de lancement d'une nouvelle commande
const formChevalet = document.getElementById('form-chevalet');

/*  
* Fonction de passage d'un champ à l'autre
*/

let inputs = formChevalet.querySelectorAll(`input[type=text]`);

// On parcourt tous les inputs
inputs.forEach((input, index) => {
    // On ajouter un event listener à la aisie
    input.addEventListener('keyup', (e) => {
        // On récupère l'élément suivant
        const nextInput = inputs[index + 1];
        // S'il existe
        if (nextInput) {
            // On met le focus dessus
            nextInput.focus();
        }
    });
});

/*  
* Fonction à la soumission du formulaire
*/

formChevalet.addEventListener(`submit`,(e)=>{
    // On arrête le fonctionnement par défaut
    e.preventDefault();

    // On initialise le numéro de chevalet
    let numChevalet = ``;
    // On initialise une variable de test
    let valide = true;
    // On initialise un tableau de test
    let tabTest = [];

    // On test les valeurs des inputs
    let inputs = formChevalet.querySelectorAll(`input[type=text]`);

    enleveErreur(`chevalet`);
    inputs.forEach(unInput => {
        if(isInteger(unInput.value)) {
            if(parseInt(unInput.value) > -1 && parseInt(unInput.value) < 10) {
                numChevalet += unInput.value;
                tabTest.push(true);
            }
            else {
                tabTest.push(false);
                afficheErreur(`chevalet`,`Le numéro doit être compris entre 0 et 9 !`);
            }
        }
        else { 
            tabTest.push(false);
            afficheErreur(`chevalet`,`Le numéro de chevalet doit être un entier !`);
        }
    });

    tabTest.forEach(test => {
        if(!test) {
            valide = false;
        }
    });

    // Si tout est OK
    if(valide === true) {
        // On récupère notre panier
        let panier = getPanier();

        // On ajoute le numéro de chevalet au panier
        panier = {...panier, chevalet:numChevalet};

        // On met à jour le panier
        setPanier(panier);

        // On redirige vers la fin
        window.location = 'end.html';
    }
});

/*  
* Fonction au chargement de la page
*/

/**
 * Charge les informations nécessaires au chargement de la page
 */
function loadContent(){
    // On récupère le panier
    let panier = getPanier();

    // On vérifie qu'on a une commande, sinon on redirige vers l'accueil
    if(typeof(panier.numCommande) != `undefined`) {
        // On vérifie si on a des produits sinon on redirige vers la page de commande
        if(panier.products.length > 0) {
            // Si on est à emporter, on passe directement à la fin
            if(panier.typeService === "aEmporter") {
                // On affiche la div correspondante
                window.location = `end.html`;
            }
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

// Load categories on page load
document.addEventListener('DOMContentLoaded', loadContent);