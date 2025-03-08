const messageInput= document.querySelector(".message-input");
const chatBody = document.querySelector(".chatbot-body");
const sendMessage =document.querySelector("#send-message");

// Configuration de l'Api
API_KEY = "AIzaSyD0mAocoK8dbVtLDv_bk6a37OHBozKZftA";
const API_URL=`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

// initialiser les données utilisateur
const userData= {
    message: null,
}

// fonction qui cree un element message en fonction du contenu et des classes
const createMessageElement = (content, ...classes) => {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", ...classes);
    messageDiv.innerHTML = content;
    return messageDiv;
}

// Liste des mots-clés liés à l'immobilier
const immobilierKeywords = ["immobilier" ,"maison", "appartement", "terrain", "achat", "vente", "loyer", "hypothèque", "agence immobilière", "investissement", "propriété", "agence immobilière en Côte d'Ivoire", "prix de terrain en Côte d'Ivoire","bien foncier", "Le prix de l'immobilier dans les villes de la Côte d'Ivoire","Les agences immobilières dans les villes de la Côte d'Ivoire", "immobilier dans les villes du monde"];

// Fonction pour vérifier si un message parle d'immobilier
const isRealEstateQuestion = (message) => {
    return immobilierKeywords.some(keyword => message.toLowerCase().includes(keyword));
};

// générer une réponse du chat avec Api
const generateBotResponse = async (incomingMessageDiv) =>{
    const messageElement= incomingMessageDiv.querySelector('.message-text');
    
    // Vérifier si la question parle bien d'immobilier avant d'envoyer à l'API
    if (!isRealEstateQuestion(userData.message)) {
        messageElement.innerText = "Salut je suis spécialisé en immobilier. Posez-moi des questions sur l'achat, la vente ou la location de biens prix!";
        incomingMessageDiv.classList.remove("thinking");
        return;
    }
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{ parts: [{ text: userData.message }] }]
        }),
    };

    try {
        const response = await fetch(API_URL, requestOptions);
        const data = await response.json();

        // Vérification si la réponse API est correcte
        if (!data.candidates || !data.candidates[0].content.parts[0].text) {
            throw new Error("Réponse invalide de l'API");
        }

        // Nettoyer et afficher la réponse
        const apiResponse = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").trim();
        messageElement.innerText = apiResponse;
    } catch (error) {
        console.error('Erreur API:', error);
        messageElement.innerText = "Désolé, une erreur est survenue.";
    } finally {
        incomingMessageDiv.classList.remove("thinking");
    }
};



// fonction qui affiche le message de l'autre utilisateur

const handleOutgoingMessage= (e) => {
    e.preventDefault();
    userData.message = messageInput.value.trim();
    messageInput.value = ""; //effacer le text dans la textarea après avoir envoyé le message

    if (!userData.message) return; // Empêcher l'envoi de messages vides

    const messageContent = `<div class="message-text"></div>`;
    // créer et afficher le message de l'utlisateur
    const outgoingMessageDiv = createMessageElement(
        `<div class="message-text">${userData.message}</div>`, 
        "user-message"
    );    
    
    chatBody.appendChild(outgoingMessageDiv);
    
    messageInput.value = ""; // Effacer le champ après l'envoi

    // fonction qui affiche la pensée du chatbot
setTimeout(()=>{
    const messageContent = `<div class="message bot-message">
                <svg class="bot-avatar" xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 1024 1024">
                    <path d="M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4.7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9zM351.7 448.2c0-29.5 23.9-53.5 53.5-53.5s53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5-53.5-23.9-53.5-53.5zm157.9 267.1c-67.8 0-123.8-47.5-132.3-109h264.6c-8.6 61.5-64.5 109-132.3 109zm110-213.7c-29.5 0-53.5-23.9-53.5-53.5s23.9-53.5 53.5-53.5 53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5zM867.2 644.5V453.1h26.5c19.4 0 35.1 15.7 35.1 35.1v121.1c0 19.4-15.7 35.1-35.1 35.1h-26.5zM95.2 609.4V488.2c0-19.4 15.7-35.1 35.1-35.1h26.5v191.3h-26.5c-19.4 0-35.1-15.7-35.1-35.1zM561.5 149.6c0 23.4-15.6 43.3-36.9 49.7v44.9h-30v-44.9c-21.4-6.5-36.9-26.3-36.9-49.7 0-28.6 23.3-51.9 51.9-51.9s51.9 23.3 51.9 51.9z"></path>
                </svg>
                <div class="message-text">
                    <div class="thinking-indicator">
                        <div class="dot"></div>
                        <div class="dot"></div>
                        <div class="dot"></div>
                        
                    </div>
                </div>
            </div>`;
    const incomingMessageDiv = createMessageElement(messageContent,"bot-message", "thinking");
    chatBody.appendChild(incomingMessageDiv );
    // generer la reponse de chat avec gemini 
    generateBotResponse(incomingMessageDiv);
    
},500)
};


// fonction qui affiche le message de notre utilisateur
messageInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && messageInput.value.trim()) {
        handleOutgoingMessage(e);
    }
});


sendMessage.addEventListener("click", (e) =>  handleOutgoingMessage(e))