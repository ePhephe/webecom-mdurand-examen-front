/**
 * ? Fonctions de chargement des produits pour la page de commande
 */

/**
 * Charge la liste des catégories
 */
function loadCategories() {
    //Appel du fichier json pour construire la liste
    fetch(`/public/json/categories.json`).then(res => {
        return res.json();
    }).then(rep => {
        //On appelle notre fonction d'affichage
        affichageCategories(rep);
        //On charge ensuite lesp roduits
        loadProduits();
    }).catch(err => {
        console.log(err);
    });
}

/**
 * Affichage des catégories pour la navigation
 * @param {array} categories 
 */
function affichageCategories(categories){
    // On initialise le template
    let templateHTML = ``;
    // On récupère la div qui va accueillir nos catégories
    const containerCategories = document.getElementById(`list-categories`);

    categories.forEach(category => {
        // On regarde si on est sur la catégorie active
        const isActive = (category.id==currentCategorie)?`current`:``;
        // On stocke le lien catégorie et id
        arrayRefCategorie[category.id] = category.title;
        // On construit le template
        templateHTML += `<li class="swiper-slide ${isActive}">
            <a href="order.html?categorie=${category.id}" title="Accès aux produits de la catégorie des ${category.title}" class="direction-column align-center justify-between">
                <div class="img-categorie">
                    <img class="responsive" src="/public/images${category.image}" alt="Illustration de la catégorie ${category.title}">      
                </div>
                ${category.title}
            </a>
        </li>`;
    });

    // On remplie notre liste avec le template généré
    containerCategories.innerHTML = templateHTML;
    // On met à jour l'affichage de la liste en fonction de la catégorie courante
    setHeaderList(currentCategorie);
    // On affiche la bonne slide sur la liste des catégories (-1 car l'index de slide par de 0)
    swiper.slideTo(currentCategorie-1);
}

/*  
* Fonctions de chargement et d'affichage des produits
*/

/**
 * Charge la liste des produits
 */
function loadProduits() {
    //Appel du fichier json pour construire la liste
    fetch(`/public/json/produits.json`).then(res => {
        return res.json();
    }).then(rep => {
        //On appelle notre fonction d'affichage
        affichageProduits(rep[arrayRefCategorie[currentCategorie]])
    }).catch(err => {
        console.log(err);
    });
}

/**
 * Charge la liste des boissons
 */
function loadBoissons(){
    //Appel du fichier json pour construire la liste
    fetch(`/public/json/produits.json`).then(res => {
        return res.json();
    }).then(rep => {
        //On stocke le tableau des boissons
        arrayBoissons = rep["boissons"];
    }).catch(err => {
        console.log(err);
    });
}

/**
 * Charge la liste des sauces
 */
function loadSauces(){
    //Appel du fichier json pour construire la liste
    fetch(`/public/json/produits.json`).then(res => {
        return res.json();
    }).then(rep => {
        //On stocke le tableau des boissons
        arraySauces = rep["sauces"];
    }).catch(err => {
        console.log(err);
    });
}

/**
 * Affichage des produits
 * @param {array} produits 
 */
function affichageProduits(produits){
    // On vide le container des produits
    containerProduits.innerHTML = '';
    // On parcourt chacun de nos produits
    produits.forEach(produit => {
        // On appelle la fonction pour créé l'article correspondant au produit
        const article = createProductArticle(produit);
        // On ajoute le produit au container
        containerProduits.appendChild(article);
    });
}