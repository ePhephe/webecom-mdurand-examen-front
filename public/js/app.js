//Fonctions accessibles sur l'ensemble du 

//On récupère les éléments pour le menu burger
let divMenuBurger = document.getElementById(`menuBurger`);
let divNavBurger = document.getElementById(`navigationBurger`);
//On ajouter un listener click sur le menu burger
if(divMenuBurger) {
    divMenuBurger.addEventListener(`click`,(e)=>{
        divNavBurger.classList.toggle(`navigation-burger-affiche`);    
    });
}

//On récupère l'élément pour la police accessible
let tabInputPolice = document.querySelectorAll(`.switch-input-police`);
let divPolice = document.querySelector(`.switch p`);
let divSwitch = document.querySelector(`.switch`);
//Listener sur le bouton pour la slide en haut
tabInputPolice.forEach(inputPolice => {
        inputPolice.addEventListener(`change`,(e)=>{
        setPolice(e.target.checked);
    });
});
// Si l'option d'accessibilité est présente
if(divPolice) {
    // On réucpère la valeur
    let opendys = sessionStorage.getItem(`opendys`);

    if(opendys === `true`) {
        tabInputPolice.forEach(inputPolice => {
            inputPolice.checked = true;
            setPolice(true);
        });
    }

    divPolice.addEventListener(`click`,(e)=>{
        divSwitch.classList.toggle(`ouvert`);
    })
}

/**
 * Applique la bonne police selon le choix de l'utilsateur
 * @param {boolean} police - True si la police accessible est choisie, false sinon.
 */
function setPolice(police){
    let body = document.querySelector(`body`);

    if(police===true) {
        sessionStorage.setItem(`opendys`,`true`);
        body.classList.add(`accessible-theme`);
    }
    else {
        sessionStorage.setItem(`opendys`,`false`);
        body.classList.remove(`accessible-theme`);
    }
}
//On place ici les fonctions réutilisées dans plusieurs pages
/**
 * Test si du code HTML est présent dans le texte passé en paramètre
 * @param {string} texte - Texte à tester
 * @returns booléen - True s'il y a du code HTML, sinon false
 */
function hasCode(texte) {
    let regHTML = /<("[^"]*"|'[^']*'|[^'">])*>/;
    return regHTML.test(texte);
}
/**
 * Test si on a bien un entier
 * @param {integer} integer - Entier à tester
 * @returns booléen - True si c'est bien un entier, sinon false
 */
function isInteger(integer) {
    let regInteger = /^-?\d+$/;
    return regInteger.test(integer);
}
/**
 * Affiche une erreur sur le champ dont l'id est passé en paramètre
 * @param {string} id - id unique de l'élément dans le DOM
 * @param {string} messageErreur - Message d'erreur à afficher
 */
function afficheErreur(id,messageErreur){
    //On récupère l'élément message d'erreur
    let message = document.getElementById(`error-` + id);

    //On insère le message d'erreur et on l'affiche en lui retirant la classe display none
    message.innerHTML += messageErreur + `<br>`;
    message.classList.remove(`display-none`);

}
/**
 * Enlève les erreurs sur le champ dont l'id est passé en paramètre
 * @param {string} id - id unique de l'élément dans le DOM
 */
function enleveErreur(id){
    //On récupère l'élément message d'erreur
    let message = document.getElementById(`error-` + id);

    //On enlève le message d'erreur et on le masque en lui remettant la classe display none
    message.innerHTML = ``;
    message.classList.add(`display-none`);
}

/**
 * Récupère la valeur d'un paramètre dans l'URL
 * @param {string} name Nom du paramètre à récupérer
 * @returns {mixed} Valeur du paramètre
 */
function getURLParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Récupération du panier du client
function getPanier(){
    return sessionStorage.getItem("panier") != null ? JSON.parse(sessionStorage.getItem("panier")) : {};
}

// Mise à jour du panier du client
function setPanier(panier){
    sessionStorage.setItem("panier",JSON.stringify(panier));
}