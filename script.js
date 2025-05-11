// Classe Product per definire il prodotto
class Product {
    constructor(nome, prezzo) {
        this.nome = nome;
        this.prezzo = prezzo;
    }

    // Metodo per ottenere una rappresentazione in stringa del prodotto
    toString() {
        return `${this.nome} - €${this.prezzo.toFixed(2)}`;
    }
}

// Recupera i prodotti disponibili da localStorage
function getProdottiDisponibili() {
    // Recupera l'array dei prodotti da localStorage
    const prodotti = localStorage.getItem('prodottiDisponibili');

    // Se non ci sono prodotti, restituisce un array vuoto
    return prodotti ? JSON.parse(prodotti) : [];
}

// Salva i prodotti disponibili in localStorage
function setProdottiDisponibili(prodotti) {
    localStorage.setItem('prodottiDisponibili', JSON.stringify(prodotti)); // Salva in formato JSON
}

// Mostra i prodotti disponibili nella lista
function mostraProdottiDisponibili() {
    const lista = document.getElementById('lista-prodotti');
    if (!lista) return;

    lista.innerHTML = ''; // Pulisce la lista ogni volta che viene ricaricata
    const prodotti = getProdottiDisponibili(); // Recupera i prodotti da localStorage

    // Cicla su ogni prodotto e lo mostra
    prodotti.forEach((p, i) => {
        const div = document.createElement('div');
        div.className = 'prodotto-item';
        const prezzo = parseFloat(p.prezzo); // ✅ forza il prezzo a numero
        div.innerHTML = `
  <span class="azioni">
    <button onclick="aggiungiAlCarrello(${i})">🛒</button>
    <strong>${p.nome}</strong> - <strong>€${prezzo.toFixed(2)}</strong></span>
  <span class="azioni">
    <button onclick="modificaProdotto(${i})">✏️</button>
    <button onclick="eliminaProdotto(${i})">🗑️</button>
  </span>
`;
        lista.appendChild(div);
    });
}

// Aggiunge un prodotto personalizzato alla lista
function aggiungiProdotto(nome, prezzo) {
    // Recupera l'array dei prodotti da localStorage
    const prodotti = getProdottiDisponibili();

    // Aggiungi il nuovo prodotto all'array
    prodotti.push({ nome: nome, prezzo: prezzo });

    // Salva l'array aggiornato in localStorage
    localStorage.setItem('prodottiDisponibili', JSON.stringify(prodotti));

    // Rende visibile il prodotto appena aggiunto
    mostraProdottiDisponibili();
}

// Modifica un prodotto già esistente nella lista
function modificaProdotto(index) {
    const prodotti = getProdottiDisponibili();
    const prodotto = prodotti[index];

    const nuovoNome = prompt("Modifica il nome del prodotto:", prodotto.nome);
    if (nuovoNome === null) return;

    const nuovoPrezzo = parseFloat(prompt("Modifica il prezzo:", prodotto.prezzo));
    if (isNaN(nuovoPrezzo)) {
        alert("Prezzo non valido.");
        return;
    }

    // Aggiorna i dati del prodotto
    prodotti[index].nome = nuovoNome;
    prodotti[index].prezzo = nuovoPrezzo;

    setProdottiDisponibili(prodotti);
    mostraProdottiDisponibili(); // Mostra la lista aggiornata
}

// Elimina un prodotto dalla lista
function eliminaProdotto(index) {
    const prodotti = getProdottiDisponibili();
    prodotti.splice(index, 1); // Rimuove il prodotto selezionato
    setProdottiDisponibili(prodotti);
    mostraProdottiDisponibili(); // Mostra la lista aggiornata
}

// Aggiungi un prodotto al carrello
let carrello = [];

function aggiungiAlCarrello(index) {
    const prodotti = getProdottiDisponibili(); // Recupera i prodotti
    const prodotto = prodotti[index];

    // Recupera il carrello da localStorage, se esiste
    let carrello = JSON.parse(localStorage.getItem('carrello')) || [];

    // Controlla se il prodotto è già nel carrello
    const prodottoEsistente = carrello.find(item => item.nome === prodotto.nome);

    if (prodottoEsistente) {
        // Se il prodotto è già nel carrello, aggiorna la quantità
        prodottoEsistente.quantita += 1;
    } else {
        // Se il prodotto non è nel carrello, aggiungilo con quantità 1
        prodotto.quantita = 1;
        carrello.push(prodotto);
    }

    // Salva il carrello aggiornato nel localStorage
    localStorage.setItem('carrello', JSON.stringify(carrello));

    // Mostra il carrello aggiornato
    mostraCarrello();
}

// Mostra il carrello
function mostraCarrello() {
    const listaCarrello = document.getElementById('carrello');  // Aggiorna il selettore al div corretto
    if (!listaCarrello) return;

    listaCarrello.innerHTML = ''; // Pulisce la lista del carrello
    let totale = 0;
    const carrello = JSON.parse(localStorage.getItem('carrello')) || [];

    if (carrello.length === 0) {
        listaCarrello.innerHTML = '<p>Il carrello è vuoto.</p>';
    } else {
        carrello.forEach((prodotto, i) => {
            const div = document.createElement('div');
            div.className = 'prodotto-carrello';
            div.innerHTML = `
            <div class="elementFattura">
                <span><strong>${prodotto.nome}</strong></span>  
                <span><strong>${prodotto.quantita} x ${prodotto.prezzo.toFixed(2)} € </strong></span>
                 = <span><strong>${(prodotto.prezzo * prodotto.quantita).toFixed(2)} €</strong></span>
                <span><button onclick="rimuoviDalCarrello(${i})">🗑️</button></span>
            </div>
      `;
            listaCarrello.appendChild(div);
            totale += prodotto.prezzo * prodotto.quantita; // Aggiorna il totale considerando la quantità
        });
    }

    const totaleDiv = document.getElementById('totale-carrello');
    if (totaleDiv) {
        totaleDiv.innerHTML = `Totale: ${totale.toFixed(2)} €`;
    }
}

// Rimuovi un prodotto dal carrello
function rimuoviDalCarrello(index) {
    let carrello = JSON.parse(localStorage.getItem('carrello')) || [];

    // Rimuovi il prodotto dal carrello
    carrello.splice(index, 1);

    // Salva il carrello aggiornato nel localStorage
    localStorage.setItem('carrello', JSON.stringify(carrello));

    // Mostra il carrello aggiornato
    mostraCarrello();
}


// Funzione di inizio per visualizzare i prodotti all'avvio della pagina

// Salva un nuovo prodotto personalizzato in localStorage
function salvaProdottoPersonalizzato(nome, prezzo) {
    const prodotti = getProdottiDisponibili();
    prodotti.push({ nome, prezzo: parseFloat(prezzo) }); // ✅ forzatura del tipo
    localStorage.setItem('prodottiDisponibili', JSON.stringify(prodotti));
}

//Fattura
function caricaFattura() {
    const carrello = JSON.parse(localStorage.getItem('carrello')) || [];
    const lista = document.getElementById('lista-fattura');
    const totaleSpan = document.getElementById('totale-fattura');
    lista.innerHTML = '';
    let totale = 0;

    carrello.forEach((item, index) => {
        const riga = document.createElement('div');
        riga.className = 'carrello-item';

        // Verifica che il prezzo e la quantità siano numerici e validi
        const prezzoSingolo = parseFloat(item.prezzo) || 0;
        const quantita = parseInt(item.quantita) || 1;
        const prezzoTotale = prezzoSingolo * quantita;

        totale += prezzoTotale;

        // Aggiungi l'elemento nella lista della fattura
        riga.innerHTML = `
        <div class="printFattura">
            
            <span>${item.nome}  <-->  ${prezzoSingolo.toFixed(2)}€ x</span> 
            <input type="number" value="${quantita}" min="1" class="quantita" data-index="${index}" />
            = <strong>€${prezzoTotale.toFixed(2)}</strong>
        </div>
           <button onclick="rimuoviDaFattura(${index})">🗑️</button>
          
        `;

        lista.appendChild(riga);

        // Aggiungi un event listener per gestire il cambiamento della quantità
        const inputQuantita = riga.querySelector('.quantita');
        inputQuantita.addEventListener('change', (event) => {
            aggiornaQuantita(index, event.target.value);
        });
    });

    totaleSpan.textContent = totale.toFixed(2);
}

function aggiornaQuantita(index, nuovaQuantita) {
    let carrello = JSON.parse(localStorage.getItem('carrello')) || [];
    if (nuovaQuantita > 0) {
        carrello[index].quantita = parseInt(nuovaQuantita);
        localStorage.setItem('carrello', JSON.stringify(carrello));
        caricaFattura(); // Ricarica la fattura dopo l'aggiornamento
    }
}

function rimuoviDaFattura(index) {
    let carrello = JSON.parse(localStorage.getItem('carrello')) || [];
    carrello.splice(index, 1);
    localStorage.setItem('carrello', JSON.stringify(carrello));
    caricaFattura();
}

function stampaFattura() {
    window.print();
}

window.onload = function () {
    mostraProdottiDisponibili(); // Mostra i prodotti disponibili
    mostraCarrello(); // Mostra il carrello
    caricaFattura;
}
