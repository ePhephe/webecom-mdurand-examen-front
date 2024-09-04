/**
 * ? Fonctions de création des éléments HTML pour la page de la commande
 */

/**
 * Crée un élement article pour un produit
 * @param {Object} produit Produit pour lequel on veut créé l'article
 * @returns {HTMLElement} Element HTML correspondant
 */
function createProductArticle(produit) {
    // On initialise un élément
    const article = document.createElement('article');
    // On ajoute les attributs itemscope et itemtype, issu de schema.org
    article.setAttribute('itemscope', ''); 
    article.setAttribute('itemtype', 'http://schema.org/Product');
    // On lui donne les bonnes classes
    article.className = 'flex direction-column justify-between';
    // On crée le contenu de l'article
    article.innerHTML = `
        <div class="product-image large-12-12 flex align-center justify-center">
            <img itemprop="image" src="/public/images${produit.image}" alt="Illustration de ${produit.nom}">
        </div>
        <div class="product-description flex direction-column gap-8px">
            <h3 itemprop="name">${produit.nom}</h3>
            <span itemprop="offers" itemscope itemtype="http://schema.org/Offer">
                <div itemprop="price">${produit.prix}€</div>
            </span>
        </div>
    `;

    //On ajoute l'écouteur d'évènement
    article.addEventListener('click', () => afficheAddProduct(produit));
    return article;
}

/**
 * Met à jour le titre et l'accroche de la liste des produits
 * @param {integer} idCategorie Identifiant de la catégorie
 */
function setHeaderList(idCategorie){
    // On récupère l'élément titre et accroche
    let titreListeProduit = document.querySelector(`.product-list h2`);
    let accrocheListeProduit = document.querySelector(`.product-list p`);

    // Mise à jour des éléments
    titreListeProduit.innerHTML = `Nos ` + arrayRefCategorie[idCategorie];
    accrocheListeProduit.innerHTML = arrayInfosCategorie[arrayRefCategorie[idCategorie]]["accroche"];
}

/**
 * Crée les boutons radio de choix du format pour le produit
 * @param {Object} produit Produit pour lequel créer l'input
 * @param {Object} xl Information sur la possibilité de format XL sur le produit
 * @returns {string} Template HTML du/des inputs
 */
function createInputsRadio(produit, xl) {
    // Si le format XL n'est pas autorisé
    if (!xl.autorise) {
        return `<div>
            <input type="radio" id="format-N" name="format" value="N" checked>
            <label for="format-N" class="choix-radio flex direction-column align-center justify-center">
                <img src="/public/images${produit.image}" alt="Illustration du produit ${produit.nom}">
                <span>${produit.nom}</span>
            </label>
        </div>
        <p class="p-error display-none" id="error-format">`;
    }
    
    // Sinon on construit le choix
    return `<div class="choix-modal large-12-12 flex justify-between">
        <div>
            <input type="radio" id="format-XL" name="format" value="XL">
            <label for="format-XL" class="choix-radio flex direction-column align-center justify-center">
                <img class="format-XL" src="/public/images${produit.image}" alt="Illustration du produit ${produit.nom}">
                <span>${xl.libelleXL}</span>
            </label>
        </div>
        <div>
            <input type="radio" id="format-N" name="format" value="N">
            <label for="format-N" class="choix-radio flex direction-column align-center justify-center">
                <img src="/public/images${produit.image}" alt="Illustration du produit ${produit.nom}">
                <span>${xl.libelleN}</span>
            </label>
        </div>
    </div>
    <p class="p-error display-none" id="error-format"></p>`;
}

/**
 * Crée les boutons radio de choix du format du menu
 * @param {Object} produit Produit pour lequel créer l'input
 * @param {Object} xl Information sur la possibilité de format XL sur le produit
 * @returns {string} Template HTML du/des inputs
 */
function createInputsRadioFormatMenu(produit,xl) {
    // Si le format XL n'est pas autorisé
    if (!xl.autorise) {
        return `<div>
            <input type="radio" id="format-N" name="format" value="N" checked>
            <label for="format-N" class="choix-radio flex direction-column align-center justify-center">
                <img src="/public/images/site/illustration-best-of.png" alt="Illustration du produit ${produit.nom}">
                <span>${produit.nom}</span>
            </label>
        </div>
        <p class="p-error display-none" id="error-format">`;
    }
    
    // Sinon on construit le choix
    return `<div class="choix-modal large-12-12 flex justify-between">
        <div>
            <input type="radio" id="format-XL" name="format" value="XL">
            <label for="format-XL" class="choix-radio flex direction-column align-center justify-center">
                <img src="/public/images/site/illustration-maxi-best-of.png" alt="Illustration du produit ${produit.nom}">
                <span>${xl.libelleXL}</span>
            </label>
        </div>
        <div>
            <input type="radio" id="format-N" name="format" value="N">
            <label for="format-N" class="choix-radio flex direction-column align-center justify-center">
                <img src="/public/images/site/illustration-best-of.png" alt="Illustration du produit ${produit.nom}">
                <span>${xl.libelleN}</span>
            </label>
        </div>
    </div>
    <p class="p-error display-none" id="error-format"></p>`;
}

/**
 * Crée les boutons radio de choix de l'accompagnement du menu
 * @returns {string} Template HTML du/des inputs
 */
function createInputsRadioAccompagnementMenu() {  
    // On affiche le bon format d'accompagnement
    let imgFrites = (currentProduct.format === `XL`) ? `GRANDE_FRITE.png` : `MOYENNE_FRITE.png` ;
    let imgPotatoes = (currentProduct.format === `XL`) ? `GRANDE_POTATOES.png` : `POTATOES.png` ;
    let imgSalade = `PETITE-SALADE.png`; 

    // On construit le choix entre potatoes et frites
    return `<div class="choix-modal large-12-12 flex gap justify-center">
        <div>
            <input type="radio" id="accompagnement-frites" name="accompagnement" value="frites">
            <label for="accompagnement-frites" class="choix-radio flex direction-column align-center justify-center">
                <img src="/public/images/frites/${imgFrites}" alt="Illustration des frites">
                <span>Frites</span>
            </label>
        </div>
        <div>
            <input type="radio" id="accompagnement-potatoes" name="accompagnement" value="potatoes">
            <label for="accompagnement-potatoes" class="choix-radio flex direction-column align-center justify-center">
                <img src="/public/images/frites/${imgPotatoes}" alt="Illustration des potatoes">
                <span>Potatoes</span>
            </label>
        </div>
        <div>
            <input type="radio" id="accompagnement-salade" name="accompagnement" value="salade">
            <label for="accompagnement-salade" class="choix-radio flex direction-column align-center justify-center">
                <img src="/public/images/salades/${imgSalade}" alt="Illustration de salade">
                <span>Salade</span>
            </label>
        </div>
    </div>
    <p class="p-error display-none" id="error-accompagnement"></p>`;
}

/**
 * Crée les boutons radio de choix de la boisson
 * @returns {string} Template HTML du/des inputs
 */
function createInputsRadioBoissonMenu() {  
    // On construit le slider
    let templateHTML = `<div class="boissons-container large-12-12 flex align-center justify-between">
                <!-- Bouton pour aller en arrière -->
                <div class="swiper-button-prev-boissons flex justify-center">
                    <img src="/public/images/site/fleche-slider.png" alt="Flèche de navigation vers la boisson précédente">
                </div>
                <!-- Slider main container / Pour l'affichage des catégories-->
                <div class="swiper-boissons">
                    <!-- Additional required wrapper -->
                    <div id="list-boissons" class="swiper-wrapper">
                        <!-- Slides / Boissons -->
                        `;

    // On parcourt les boissons pour contruire tous nos inputs radio
    arrayBoissons.forEach(boisson => {
        templateHTML += `
            <div class="swiper-slide">
                <input type="radio" id="boissons-${boisson.id}" name="boisson" value="${boisson.nom}">
                <label for="boissons-${boisson.id}" class="padding-8px gap-24px flex direction-column align-center justify-center">
                    <img src="/public/images${boisson.image}" alt="Illustration de la boisson ${boisson.nom}">
                    <span>${boisson.nom}</span>
                </label>
            </div>
        `;
    });

    // On termine le slider
    templateHTML += `</div>
                </div>
                <!-- Bouton pour aller en arrière -->
                <div class="swiper-button-next-boissons">
                    <img src="/public/images/site/fleche-slider.png" alt="Flèche de navigation vers la boisson suivante">
                </div>
            </div>
            <p class="p-error display-none" id="error-boissons"></p>`;

    return templateHTML;
}

/**
 * Crée les boutons radio de choix de la boisson
 * @returns {string} Template HTML du/des inputs
 */
function createInputsRadioSauceMenu() {  
    // On construit le slider
    let templateHTML = `<div class="sauces-container large-12-12 flex align-center justify-between">
                <!-- Bouton pour aller en arrière -->
                <div class="swiper-button-prev-sauces flex justify-center">
                    <img src="/public/images/site/fleche-slider.png" alt="Flèche de navigation vers la sauce précédente">
                </div>
                <!-- Slider main container / Pour l'affichage des sauces-->
                <div class="swiper-sauces">
                    <!-- Additional required wrapper -->
                    <div id="list-sauces" class="swiper-wrapper">
                        <!-- Slides / Sauces -->
                        `;

    // On parcourt les sauces pour contruire tous nos inputs radio
    arraySauces.forEach(sauce => {
        templateHTML += `
            <div class="swiper-slide">
                <input type="radio" id="sauces-${sauce.id}" name="sauce" value="${sauce.nom}">
                <label for="sauces-${sauce.id}" class="padding-8px gap-24px flex direction-column align-center justify-center">
                    <img src="/public/images${sauce.image}" alt="Illustration de la sauce ${sauce.nom}">
                    <span>${sauce.nom}</span>
                </label>
            </div>
        `;
    });

    // On termine le slider
    templateHTML += `</div>
                </div>
                <!-- Bouton pour aller en arrière -->
                <div class="swiper-button-next-sauces">
                    <img src="/public/images/site/fleche-slider.png" alt="Flèche de navigation vers la sauce suivante">
                </div>
            </div>
            <p class="p-error display-none" id="error-sauces"></p>`;

    return templateHTML;
}

/**
 * Crée l'input pour choisir la quantité
 * @returns {string} Template HTML du/des inputs
 */
function createInputQuantite() {
    return `<div id="container-quantity" class="large-12-12 flex justify-center">
        <input id="button-moins" onclick="quantiteMoins()" type="button" class="button quantite flex align-center justify-center" value="-">
        <input id="quantite" onchange="verifQuantite()" name="quantite" type="text" value="1">
        <input id="button-plus" onclick="quantitePlus()" type="button" class="button quantite flex align-center justify-center" value="+">
    </div>
    <p class="p-error display-none" id="error-quantite"></p>`;
}

/**
 * Enlève 1 à la quantité
 */
function quantiteMoins(){
    // On récupère la quantité courante et on retire 1
    let quantiteValue = parseInt(formModalSelection.querySelector(`#quantite`).value) - 1;
    // Si on est à moins de 1, on remet le minimum 1
    if(quantiteValue < 1) {
        formModalSelection.querySelector(`#quantite`).value = 1;
    }
    // Sinon on affecte la valeur et on vérifie la quantité
    else {
        formModalSelection.querySelector(`#quantite`).value = quantiteValue;
        verifQuantite();
    }
}


/**
 * Ajoute 1 à la quantité
 */
function quantitePlus(){
    // On récupère la quantité courante et on ajoute 1
    let quantiteValue = parseInt(formModalSelection.querySelector(`#quantite`).value) + 1;
    // Si on est à plus de 30, on remet le maximum 30
    if(quantiteValue > 30) {
        formModalSelection.querySelector(`#quantite`).value = 30;
    }
    // Sinon on affecte la valeur et on vérifie la quantité
    else {
        formModalSelection.querySelector(`#quantite`).value = quantiteValue;
        verifQuantite();
    }
}
