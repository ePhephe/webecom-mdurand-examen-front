/**
 * ? Fonctions de gestion du panier pour la page de la commande
 */

/**
 * Vérifie que la quantité saisie est correcte
 * @returns True si la quantité est valide sinon false
 */
function verifQuantite(){
    // On réinitialise les erreurs
    enleveErreur(`quantite`);
    // On vérifie que la quantité est un entier
    let quantiteValue = parseInt(formModalSelection.querySelector(`#quantite`).value);

    // On vérifie que c'est un entier
    if(!isInteger(quantiteValue)) {
        afficheErreur(`quantite`,`La quantité doit être un entier !`);
        return false;
    }
    
    // On vérifie que la quantité est > 0 et < 30
    if(quantiteValue > 30) {
        afficheErreur(`quantite`,`La quantité ne peut pas être supérieur à 30 !`);
        return false;
    }
    else if(quantiteValue > 0) {
        enleveErreur(`quantite`);
        return true;
    }
    else {
        afficheErreur(`quantite`,`La quantité ne peut pas être inférieur à 1 !`);
        return false;
    }
}

/**
 * Procède aux contrôles et à l'ajout au panier du produit
 * @param {Object} produit Produit concerné
 * @param {string} formatProduit Format du produit
 */
function addToOrder(produit, formatProduit) {
    // On récupère les informations sur la catégorie de produit
    const infosCategorie = arrayInfosCategorie[arrayRefCategorie[currentCategorie]];

    // On récupère le panier
    let panier = getPanier();
    // On vérifie si le produit est déjà dans le panier
    const produitExistant = panier.products.findIndex(p => p.id === produit.id && p.format === formatProduit);
    // On calcul le prix en fonction du format et de la quantité
    let quantiteValue = 1;
    if (infosCategorie.quantite) {
        quantiteValue = parseInt(formModalSelection.querySelector(`#quantite`).value);
    }
    let prixFinal = (formatProduit === "XL") ? (produit.prix + 0.5) * quantiteValue : produit.prix * quantiteValue;

    if (produitExistant > -1) {
        // Si le produit existe, on met à jour la quantité
        panier.products[produitExistant].quantite += quantiteValue;
        panier.products[produitExistant].total += prixFinal;
    } else {
        // Sinon, on l'ajoute au panier
        panier.products.push({ ...produit, type: "produit", format: formatProduit, quantite: quantiteValue, total: prixFinal });
    }

    // On met à jour le panier
    setPanier(panier);
    // On recharge la commande
    loadOrder();
    // On ferme la modal
    closeModal();
}


/**
 * Procède aux contrôle et à l'ajout au panier du produit
 * @param {Object} produit Produit concerné
 */
function addMenuToOrder(produit) {
    // On récupère le panier
    let panier = getPanier();
    // On calcul le prix en fonction du format et de la quantité
    let quantiteValue = 1;
    let prixFinal = (produit.format==="XL") ? (produit.prix+1)*quantiteValue : produit.prix*quantiteValue;

    // Sinon, on l'ajoute au panier
    panier.products.push({...produit, type: "menu", quantite: quantiteValue, total: prixFinal});

    // On met à jour le panier
    setPanier(panier);
    // On recharge la commande
    loadOrder();
    // On ferme la modal
    closeModal();
}

/**
 * Supprime un produit de la commande
 * @param {integer} idProduit Identifiant du produit à supprimer
 */
function removeFromOrder(idProduit) {
    // On récupère le panier
    let panier = getPanier();

    // On filtre le panier pour supprimer le produit avec l'ID donné
    panier.products = panier.products.filter(produit => produit.id !== idProduit);

    // On met à jour le panier filter
    setPanier(panier);

    // On met à jour l'affichage de la commande
    loadOrder();
}
