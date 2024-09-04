/**
 * ? Fonctions principale pour la page de choix des produits dans la commande
 */

/*  
* Récupération des éléments DOM principaux 
*/

// Bouton d'abandon de la commande
const buttonAbandon = document.getElementById('button-abandon');
// Bouton pour passer à la finalisation
const buttonPayer = document.getElementById('button-payer');
// Liste qui contient les catégories
const containerCategories = document.getElementById('list-categories');
// Div qui contient la liste des produits
const containerProduits = document.getElementById('product-list-container');
// Div de gestion de la modal
const divModalContainer = document.getElementById('modal-choix-container');
// Div de titre pour la modal
const titreModal = document.getElementById('modal-title');
// Div du texte d'accroche pour la modal
const texteModal = document.getElementById('modal-texte');
// Formulaire lors du choix du produit
const formModalSelection = document.getElementById('modal-selection');

/*  
* Variables d'utilité globale
*/

// On récupère la catégorie en cours d'affichjage
const currentCategorie = parseInt(getURLParameter('categorie')) || 1;
// On définit un tableau de transcodification pour les catégories
const arrayRefCategorie = [];
// On définit notre slider pour les catégories
const swiper = new Swiper('.swiper', {
    // Optional parameters
    direction: 'horizontal',
    loop: false,
    slidesPerView: 1,
    freemode: false,
    spaceBetween: 8,

    // Navigation arrows
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },

    //Gestion des différentes taille d'écran
    breakpoints: {
        500: {
            slidesPerView: 'auto',
            freemode: true
        }
    },
});
// Produit courant
let currentProduct = null;
// Etape encours dans les choix d'un menu
let currentEtapeMenu = null;
// Produits boisson pour les menus (alimenté en fetch)
let arrayBoissons = [];
// Produits sauces pour les menus (alimenté en fetch)
let arraySauces = [];

/*  
* Ecouteur d'évènement sur les boutons principaux Abandon et Payer
*/

// On définit le comportement de notre bouton abandon
buttonAbandon.addEventListener(`click`,(e)=>{
    // On interompt le comportement de base
    e.preventDefault();

    // On vide le panier en cours
    sessionStorage.clear();

    // On redirige vers l'accueil
    window.location = `/`; 
});
// On définit le comportement de notre bouton abandon
buttonPayer.addEventListener(`click`,(e)=>{
    // On interompt le comportement de base
    e.preventDefault();
    
    // On récupère le panier
    let panier = getPanier();

    // On vérifie que l'on a bien des produits présents (commande non vide)
    if(panier.products.length > 0){
        // Selon le type de service on redirige vers le choix du chevalet (sur place) ou directement à la fin
        window.location = (panier.typeService === `surPlace`) ? `chevalet.html` : `end.html`;
    }
});

/*  
* Fonctions d'affichage de la commande en cours
*/

/**
 * Affiche la commande en cours
 */
function loadOrder(){
    // On récupère le panier en cours du client
    const panier = getPanier();

    // On vérifie qu'on a un numéro de commande
    if(typeof(panier.numCommande) != `undefined`) {
        // On récupère les éléments à mettre à jour
        const divNumCde = document.getElementById(`order-number`);
        const divRefCde = document.getElementById(`order-reference`);
        const divCartOrder = document.getElementById(`cart-order`);
        const divTotalOrder = document.getElementById(`order-total-price`);

        // On met à jours les référence de commande
        divNumCde.innerHTML = panier.numCommande;
        divRefCde.innerHTML = (panier.typeService === `aEmporter` ? `A emporter : ` : `Sur place : `) + panier.refCommandeService;
        // On remet à zéro la liste des produits dans le panier
        divCartOrder.innerHTML = ``;

        let totalOrder = 0;
        panier.products.forEach(product => {
            // On crée la DIV qui va contenir le produit et le bouton de suppression
            const divProduitContainer = document.createElement(`div`)
            divProduitContainer.className = `large-12-12 flex justify-between`;
            
            // On crée la DIV qui va contenir les informations du produit
            const divProduit = document.createElement(`div`)
            divProduit.className = `order-product`;
            // On crée le contenu de l'article
            if(product.type == `produit`){
                let formatProduit = (product.format===`XL`) ? `(XL)` : `` ;
                divProduit.innerHTML = `
                    ${product.quantite} ${product.nom} ${formatProduit}
                `;
            }
            else if(product.type == `menu`){
                let formatMenu = (product.format===`XL`) ? `maxi best of` : `best of` ;
                divProduit.innerHTML = `
                    ${product.quantite} ${product.nom}
                    <ul>
                        <li>${formatMenu}</li>
                        <li>${product.accompagnement}</li>
                        <li>${product.sauce}</li>
                        <li>${product.boisson}</li>
                    </ul>
                `;
            }
            // On ajoute à la div container
            divProduitContainer.appendChild(divProduit);

            // On créé la div qui va contenir le lien de suppression du produit
            const divProduitRemove = document.createElement(`div`);
            divProduitRemove.className = ``;
            // On crée le contenu de l'article
            divProduitRemove.innerHTML = `
                <a href="" title="Suppression du produit de la commande">
                    <img src="/public/images/site/trash.png" alt="Icone de suppression du produit ${product.nom}">
                </a>
            `;
            divProduitRemove.addEventListener(`click`,(e)=>{
                e.preventDefault();
                removeFromOrder(product.id);
            });
            // On ajoute à la div container
            divProduitContainer.appendChild(divProduitRemove);

            divCartOrder.appendChild(divProduitContainer);
            totalOrder += product.total;
        });

        //Gestion de l'affichage du bouton Payer
        if(panier.products.length > 0) {
            buttonPayer.classList.remove(`disabled`);
        }
        else {
            buttonPayer.classList.add(`disabled`);
        }

        divTotalOrder.innerHTML = totalOrder.toFixed(2) + `€`;
    }
    else {
        // Si on a pas de numéro de commande, on redirige vers l'accueil
        window.location = `/`;
    }
}

/*  
* Fonctions de gestion de la modal
*/

/**
 * Affiche les informations sur le produit à ajouter à la commande
 * @param {Object} produit 
 */
function afficheAddProduct(produit) {
    const infosCategorie = arrayInfosCategorie[arrayRefCategorie[currentCategorie]];
    if (infosCategorie.accompagnement) {
        afficheModalMenu(produit, infosCategorie.xl, infosCategorie.quantite);
    } else {
        afficheModalProduit(produit, infosCategorie.xl, infosCategorie.quantite);
    }
}

/**
 * Crée la modal selon les informations fournis et l'affiche
 * @param {Object} produit 
 * @param {Object} xl 
 * @param {boolean} quantite 
 */
function afficheModalProduit(produit, xl, quantite) {
    titreModal.innerHTML = arrayInfosCategorie[arrayRefCategorie[currentCategorie]]["titre modal"];
    texteModal.innerHTML = arrayInfosCategorie[arrayRefCategorie[currentCategorie]]["accroche modal"];

    const inputsRadio = createInputsRadio(produit, xl);
    const inputQuantite = quantite ? createInputQuantite() : '';

    formModalSelection.innerHTML = `${inputsRadio}${inputQuantite}<div class="actions-modal flex gap-48px">
        <input id="button-annuler" type="button" class="button secondary" value="Annuler">
        <input type="submit" class="button primary" value="Ajouter à ma commande">
    </div>`;

    document.getElementById('button-annuler').addEventListener('click', closeModal);
    document.getElementById('modal-button-close').addEventListener('click', closeModal);
    currentProduct = produit;
    formModalSelection.addEventListener('submit', handleSubmitProduct);
    
    divModalContainer.classList.remove('display-none');
}

/**
 * Crée la modal dans le cas d'un menu selon les informations fournis et l'affiche
 * @param {Object} produit 
 * @param {Object} xl 
 * @param {boolean} quantite 
 */
function afficheModalMenu(produit, xl, quantite){
    // On vide le formulaire et on enlève le listener en cours
    formModalSelection.innerHTML = ``;
    formModalSelection.removeEventListener('submit',handleSubmitMenu);

    // On récupère le produit en produit courant si il n'est pas null
    currentProduct = (currentProduct != null) ? currentProduct : produit;
    
    // Selon l'étape dans laquelle on est dans l'établissement du menu
    // Etape null ou étape 1
    if(currentEtapeMenu === null || currentEtapeMenu === 1) {
        // On affecte le numéro de l'étape, si jamais il était null
        currentEtapeMenu = 1;
        // On affiche la bonne accroche et le bon titre
        titreModal.innerHTML = arrayInfosCategorie[arrayRefCategorie[currentCategorie]]["titre modal"];
        texteModal.innerHTML = arrayInfosCategorie[arrayRefCategorie[currentCategorie]]["accroche modal"];

        // On récupère les inputs radio pour le choix du format
        // Avant on écrase les images par celles d'illustration d'un menu
        const inputsRadio = createInputsRadioFormatMenu(currentProduct, xl);
        const inputQuantite = quantite ? createInputQuantite() : '';

        // On construit le formulaire
        formModalSelection.innerHTML = `${inputsRadio}${inputQuantite}<div class="actions-modal flex gap-48px">
            <input type="submit" class="button primary" value="Étape suivante">
        </div>`;

        document.getElementById('modal-button-close').addEventListener('click', closeModal);

        formModalSelection.addEventListener('submit', handleSubmitMenu);

        // On affiche la modal
        divModalContainer.classList.remove('display-none');
    }
    else if(currentEtapeMenu === 2){
        // On affiche la bonne accroche et le bon titre
        titreModal.innerHTML = `Choisissez votre accompagnement`;
        texteModal.innerHTML = `Frites, potatoes, la pomme de terre dans tous ses états`;
        // On récupère les inputs radio pour le choix du format
        const inputsRadio = createInputsRadioAccompagnementMenu();

        // On construit le formulaire
        formModalSelection.innerHTML = `${inputsRadio}<div class="actions-modal flex gap-48px">
            <input type="submit" class="button primary" value="Étape suivante">
        </div>`;

        document.getElementById('modal-buttons-nav').classList.remove(`justify-end`);
        document.getElementById('modal-buttons-nav').classList.add(`justify-between`);
        document.getElementById('modal-button-back').classList.remove(`display-none`);
        document.getElementById('modal-button-back').addEventListener('click', etapePrecedente);
        document.getElementById('modal-button-close').addEventListener('click', closeModal);

        formModalSelection.addEventListener('submit', handleSubmitMenu);

        // On affiche la modal
        divModalContainer.classList.remove('display-none');
    }
    else if(currentEtapeMenu === 3){
        // On affiche la bonne accroche et le bon titre
        titreModal.innerHTML = `Choisissez votre sauce`;
        texteModal.innerHTML = `Une sauce pour accompagner votre repas`;

        // On récupère les inputs radio pour le choix de la sauce
        const inputsRadio = createInputsRadioSauceMenu();

        // On construit le formulaire
        formModalSelection.innerHTML = `${inputsRadio}<div class="actions-modal flex gap-48px">
            <input type="submit" class="button primary" value="Étape suivante">
        </div>`;

        // On définit notre slider pour les boissons dans le cas d'un menu
        const swiperSauce = new Swiper('.swiper-sauces', {
            // Optional parameters
            direction: 'horizontal',
            loop: false,
            slidesPerView: 1,
            freemode: false,
            spaceBetween: 8,

            // Navigation arrows
            navigation: {
                nextEl: '.swiper-button-next-sauces',
                prevEl: '.swiper-button-prev-sauces',
            },

            //Gestion des différentes taille d'écran
            breakpoints: {
                1024: {
                    slidesPerView: 'auto',
                    freemode: true
                }
            },
        });

        formModalSelection.addEventListener('submit', handleSubmitMenu);
    }
    else if(currentEtapeMenu === 4){
        // On affiche la bonne accroche et le bon titre
        titreModal.innerHTML = `Choisissez votre boisson`;
        texteModal.innerHTML = `Un soda , un jus de fruit ou un verre d’eau pour accompagner votre repas`;

        // On récupère les inputs radio pour le choix de la boisson
        // Avant on écrase les images par celles d'illustration d'un menu
        const inputsRadio = createInputsRadioBoissonMenu();

        // On construit le formulaire
        formModalSelection.innerHTML = `${inputsRadio}<div class="actions-modal flex gap-48px">
            <input type="submit" class="button primary" value="Ajouter le menu à la commande">
        </div>`;

        // On définit notre slider pour les boissons dans le cas d'un menu
        const swiperBoisson = new Swiper('.swiper-boissons', {
            // Optional parameters
            direction: 'horizontal',
            loop: false,
            slidesPerView: 1,
            freemode: false,
            spaceBetween: 8,

            // Navigation arrows
            navigation: {
                nextEl: '.swiper-button-next-boissons',
                prevEl: '.swiper-button-prev-boissons',
            },

            //Gestion des différentes taille d'écran
            breakpoints: {
                1024: {
                    slidesPerView: 'auto',
                    freemode: true
                }
            },
        });

        formModalSelection.addEventListener('submit', handleSubmitMenu);
    }
    else {
        // Si on est pas dans un des cas, on ferme la fenêtre
        closeModal();
    }
}

/**
 * Ferme la modal
 */
function closeModal() {
    // On remet le formulaire vide
    formModalSelection.innerHTML = ``;
    // On supprime l'event listener
    formModalSelection.removeEventListener('submit',handleSubmitProduct);
    formModalSelection.removeEventListener('submit',handleSubmitMenu);
    // On réinitialise le produit courant
    currentProduct = null;
    currentEtapeMenu = null;
    // On réinitiale les boutons de navigation de la modal
    document.getElementById('modal-buttons-nav').classList.add(`justify-end`);
    document.getElementById('modal-buttons-nav').classList.remove(`justify-between`);
    document.getElementById('modal-button-back').classList.add(`display-none`);
    // On masque la modal
    divModalContainer.classList.add('display-none');
}

/**
 * Retourne à l'étape précédente
 */
function etapePrecedente(e){
    // On arrête le fonctionnement par défaut
    e.preventDefault();
    // On enlève une étape
    currentEtapeMenu -= 1;
    // On réaffiche la modal
    console.log(currentProduct)
    const infosCategorie = arrayInfosCategorie[arrayRefCategorie[currentCategorie]];
    afficheModalMenu(currentProduct,infosCategorie.xl,infosCategorie.quantite);
}


/*  
* Fonctions de gestion de la commande
*/

/**
 * Soumission d'un produit
 */
function handleSubmitProduct(e){
    // On arrête le fonctionnement par défaut
    e.preventDefault();
    // On récupère lesi nformations sur la catégorie de produit
    const infosCategorie = arrayInfosCategorie[arrayRefCategorie[currentCategorie]];

    //On définit nos variables pour les tests
    let valide = true;
    let tabTest = [];
    let formatProduit = ``;

    // On vérifie la saisie du formulaire
    // On vérifie qu'on a un choix radio
    enleveErreur(`format`);
    let radio = formModalSelection.querySelectorAll(`input[type=radio]`);
    let testValidationRadio = false;
    radio.forEach(choix => {
        if(choix.checked === true) {
            formatProduit = choix.value;
            testValidationRadio = true;
        }
    });
    // On affiche un erreur si rien n'est sélectionné
    if(testValidationRadio === false) {
        afficheErreur(`format`,`Vous devez choisir entre le format normal ou le format XL !`);
    }
    tabTest.push(testValidationRadio);

    // Vérification de la quantité si elle est nécessaire
    if(infosCategorie.quantite) {
        tabTest.push(verifQuantite());
    }

    //On parcourt tous les tests pour chercher une erreur
    tabTest.forEach(test => {
        if(test===false) {
            valide = false;
        }
    });

    // Si le test est OK, on ajoute le produit au panier
    if(valide === true) {
        // On lance l'ajout au panier du produit
        addToOrder(currentProduct,formatProduit);
    }
}

/**
 * Soumission d'un menu
 */
function handleSubmitMenu(e){
    // On récupère les informations sur la catégorie de produit
    const infosCategorie = arrayInfosCategorie[arrayRefCategorie[currentCategorie]];
    // On arrête le comportement par défaut
    e.preventDefault();
    // Selon l'étape dans laquelle on est dans l'établissement du menu
    // Etape 1 : format du menu
    if(currentEtapeMenu === 1) {
        // On vérifie la saisie du formulaire, ici qu'on a bien un format
        // On vérifie qu'on a un choix radio
        enleveErreur(`format`);
        let radio = formModalSelection.querySelectorAll(`input[type=radio]`);
        let testValidationRadio = false;
        let formatProduit = ``;
        radio.forEach(choix => {
            if(choix.checked === true) {
                formatProduit = choix.value;
                testValidationRadio = true;
            }
        });
        // On affiche un erreur si rien n'est sélectionné
        if(testValidationRadio === false) {
            afficheErreur(`format`,`Vous devez choisir entre le format normal ou le format XL !`);
        }
        else {
            currentProduct = {...currentProduct,format: formatProduit};
            currentEtapeMenu = 2;
            afficheModalMenu(currentProduct,infosCategorie.xl,infosCategorie.quantite);
        }
    }
    else if(currentEtapeMenu === 2){
        // On vérifie la saisie du formulaire, ici qu'on a bien un accompagnement
        // On vérifie qu'on a un choix radio
        enleveErreur(`accompagnement`);
        let radio = formModalSelection.querySelectorAll(`input[type=radio]`);
        let testValidationRadio = false;
        let accompagnementMenu = ``;
        radio.forEach(choix => {
            if(choix.checked === true) {
                accompagnementMenu = choix.value;
                testValidationRadio = true;
            }
        });
        // On affiche un erreur si rien n'est sélectionné
        if(testValidationRadio === false) {
            afficheErreur(`accompagnement`,`Vous devez choisir entre les frites, la salade ou les potatoes !`);
        }
        else {
            currentProduct = {...currentProduct,accompagnement: accompagnementMenu};
            currentEtapeMenu = 3;
            afficheModalMenu(currentProduct,infosCategorie.xl,infosCategorie.quantite);
        }
    }
    else if(currentEtapeMenu === 3){
        // On vérifie la saisie du formulaire, ici qu'on a bien une boisson
        // On vérifie qu'on a un choix radio
        enleveErreur(`sauces`);
        let radio = formModalSelection.querySelectorAll(`input[type=radio]`);
        let testValidationRadio = false;
        let sauceMenu = ``;
        radio.forEach(choix => {
            if(choix.checked === true) {
                sauceMenu = choix.value;
                testValidationRadio = true;
            }
        });
        // On affiche un erreur si rien n'est sélectionné
        if(testValidationRadio === false) {
            afficheErreur(`sauces`,`Vous devez choisir une sauce !`);
        }
        else {
            currentProduct = {...currentProduct,sauce: sauceMenu};
            currentEtapeMenu = 4;
            afficheModalMenu(currentProduct,infosCategorie.xl,infosCategorie.quantite);
        }
    }
    else if(currentEtapeMenu === 4){
        // On vérifie la saisie du formulaire, ici qu'on a bien une boisson
        // On vérifie qu'on a un choix radio
        enleveErreur(`boissons`);
        let radio = formModalSelection.querySelectorAll(`input[type=radio]`);
        let testValidationRadio = false;
        let boissonMenu = ``;
        radio.forEach(choix => {
            if(choix.checked === true) {
                boissonMenu = choix.value;
                testValidationRadio = true;
            }
        });
        // On affiche un erreur si rien n'est sélectionné
        if(testValidationRadio === false) {
            afficheErreur(`boissons`,`Vous devez choisir une boisson !`);
        }
        else {
            currentProduct = {...currentProduct,boisson: boissonMenu};
        }

        // Si le test est OK, on ajoute le produit au panier
        if(testValidationRadio === true) {
            // On ajoute le menu au panier
            addMenuToOrder(currentProduct);
        }
    }
    else {
        // Si on est pas dans un des cas, on ferme la fenêtre
        closeModal();
    }
}

/*  
* Fonction au chargement de la page
*/

/**
 * Charge les informations nécessaires au chargement de la page
 */
function loadContent(){
    // Informations sur la commande
    loadOrder();
    // Informations sur les catégories
    loadCategories();
    // Informations sur les boissons
    loadBoissons();
    // Informations sur les sauces
    loadSauces();
}

// Load categories on page load
document.addEventListener('DOMContentLoaded', loadContent);
