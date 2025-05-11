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

function svuotaCarrello() {
    // Rimuovi il contenuto del carrello in localStorage (se stai usando localStorage)
    localStorage.removeItem("carrello");  // o se usi un array: localStorage.setItem("carrello", JSON.stringify([]));

    // Resetta il totale a 0.00
    document.getElementById("totale-carrello").textContent = "0.00";

    // Svuota la visualizzazione del carrello
    const carrelloDiv = document.getElementById("carrello");
    carrelloDiv.innerHTML = "";  // Rimuove tutti gli elementi visualizzati

    // Facoltativo: Aggiungi un messaggio di conferma o reset
    alert("Carrello svuotato!");
}
// Funzione di inizio per visualizzare i prodotti all'avvio della pagina

// Salva un nuovo prodotto personalizzato in localStorage
function salvaProdottoPersonalizzato(nome, prezzo) {
    const prodotti = getProdottiDisponibili();
    prodotti.push({ nome, prezzo: parseFloat(prezzo) }); // ✅ forzatura del tipo
    localStorage.setItem('prodottiDisponibili', JSON.stringify(prodotti));
}

function getDatiCliente() {
    return {
        nome: document.getElementById('cliente-nome').value,
        indirizzo: document.getElementById('cliente-indirizzo').value,
        citta: document.getElementById('cliente-citta').value,
        piva: document.getElementById('cliente-piva').value
    };
}

//Fattura
function caricaFattura() {
    const carrello = JSON.parse(localStorage.getItem('carrello')) || [];
    const lista = document.getElementById('lista-fattura');
    const totaleSpan = document.getElementById('totale-fattura');
    const imponibileSpan = document.getElementById('imponibile-fattura');
    const ivaSpan = document.getElementById('iva-fattura');
    
    // Elementi per la versione stampabile
    const tabellaPrintBody = document.getElementById('tabella-print-body');
    const totalePrintSpan = document.getElementById('totale-print');
    const imponibilePrintSpan = document.getElementById('imponibile-print');
    const ivaPrintSpan = document.getElementById('iva-print');
    
    // Pulisci le liste
    if (lista) lista.innerHTML = '';
    if (tabellaPrintBody) tabellaPrintBody.innerHTML = '';
    
    let totale = 0;

    if (carrello.length === 0) {
        // Versione visualizzazione schermo
        if (lista) {
            const riga = document.createElement('div');
            riga.className = 'fattura-item fattura-vuota';
            riga.innerHTML = '<p>Nessun prodotto nel carrello</p>';
            lista.appendChild(riga);
        }
        
        // Versione stampabile
        if (tabellaPrintBody) {
            const rigaStampa = document.createElement('tr');
            rigaStampa.innerHTML = '<td colspan="4" style="text-align: center;">Nessun prodotto nel carrello</td>';
            tabellaPrintBody.appendChild(rigaStampa);
        }
    } else {
        carrello.forEach((item, index) => {
            // Verifica che il prezzo e la quantità siano numerici e validi
            const prezzoSingolo = parseFloat(item.prezzo) || 0;
            const quantita = parseInt(item.quantita) || 1;
            const prezzoTotale = prezzoSingolo * quantita;

            totale += prezzoTotale;

            // Versione visualizzazione schermo
            if (lista) {
                const riga = document.createElement('div');
                riga.className = 'fattura-item';
                riga.innerHTML = `
                    <div class="fattura-descrizione">${item.nome}</div>
                    <div class="fattura-prezzo">${prezzoSingolo.toFixed(2)} €</div>
                    <div class="fattura-quantita">
                        <input type="number" value="${quantita}" min="1" class="quantita" data-index="${index}" />
                    </div>
                    <div class="fattura-totale">${prezzoTotale.toFixed(2)} €</div>
                    <div class="fattura-azioni">
                        <button onclick="rimuoviDaFattura(${index})">🗑️</button>
                    </div>
                `;
                lista.appendChild(riga);

                // Aggiungi un event listener per gestire il cambiamento della quantità
                const inputQuantita = riga.querySelector('.quantita');
                if (inputQuantita) {
                    inputQuantita.addEventListener('change', (event) => {
                        aggiornaQuantita(index, event.target.value);
                    });
                }
            }
            
            // Versione stampabile
            if (tabellaPrintBody) {
                const rigaStampa = document.createElement('tr');
                rigaStampa.innerHTML = `
                    <td>${item.nome}</td>
                    <td>${prezzoSingolo.toFixed(2)} €</td>
                    <td>${quantita}</td>
                    <td>${prezzoTotale.toFixed(2)} €</td>
                `;
                tabellaPrintBody.appendChild(rigaStampa);
            }
        });
    }

    // Calcola imponibile e IVA
    const imponibile = totale / 1.22; // supponendo IVA al 22%
    const iva = totale - imponibile;
    
    // Aggiorna i vari totali - versione schermo
    if (imponibileSpan) imponibileSpan.textContent = imponibile.toFixed(2) + ' €';
    if (ivaSpan) ivaSpan.textContent = iva.toFixed(2) + ' €';
    if (totaleSpan) totaleSpan.textContent = totale.toFixed(2) + ' €';
    
    // Aggiorna i vari totali - versione stampa
    if (imponibilePrintSpan) imponibilePrintSpan.textContent = imponibile.toFixed(2) + ' €';
    if (ivaPrintSpan) ivaPrintSpan.textContent = iva.toFixed(2) + ' €';
    if (totalePrintSpan) totalePrintSpan.textContent = totale.toFixed(2) + ' €';
}

function aggiornaQuantita(index, nuovaQuantita) {
    let carrello = JSON.parse(localStorage.getItem('carrello')) || [];
    nuovaQuantita = parseInt(nuovaQuantita);
    
    if (nuovaQuantita > 0) {
        carrello[index].quantita = nuovaQuantita;
        localStorage.setItem('carrello', JSON.stringify(carrello));
        caricaFattura(); // Ricarica la fattura dopo l'aggiornamento
    } else {
        // Se la quantità è 0 o negativa, imposta a 1
        document.querySelectorAll('.quantita')[index].value = 1;
        aggiornaQuantita(index, 1);
    }
}

function rimuoviDaFattura(index) {
    if (confirm('Sei sicuro di voler rimuovere questo prodotto dalla fattura?')) {
        let carrello = JSON.parse(localStorage.getItem('carrello')) || [];
        carrello.splice(index, 1);
        localStorage.setItem('carrello', JSON.stringify(carrello));
        caricaFattura();
    }
}

function stampaFattura() {
    // 📅 Genera data e numero fattura
    const oggi = new Date();
    const dataFormattata = oggi.toLocaleDateString('it-IT');
    const numeroFattura = '2023/' + Math.floor(Math.random() * 999).toString().padStart(3, '0');

    const dataElemento = document.querySelector('.numero-fattura p:nth-child(2)');
    const numeroElemento = document.querySelector('.numero-fattura p:nth-child(3)');

    if (dataElemento) dataElemento.textContent = 'N° ' + numeroFattura;
    if (numeroElemento) numeroElemento.textContent = 'Data: ' + dataFormattata;

    // 👤 Prendi i dati dal form cliente
    const nome = document.getElementById("cliente-nome").value;
    const indirizzo = document.getElementById("cliente-indirizzo").value;
    const citta = document.getElementById("cliente-citta").value;
    const piva = document.getElementById("cliente-piva").value;

    // 📌 Inserisci i dati cliente nella sezione dedicata alla stampa
    const outputCliente = document.getElementById("output-cliente");
    if (outputCliente) {
        outputCliente.innerHTML = `
            <h3>Dati Cliente:</h3>
            <p><strong>${nome}</strong></p>
            <p>${indirizzo}</p>
            <p>${citta}</p>
            <p>${piva}</p>
        `;
    }

    // 🖨 Avvia stampa
    window.print();
}


window.onload = function () {
    mostraProdottiDisponibili(); // Mostra i prodotti disponibili
    mostraCarrello(); // Mostra il carrello
    caricaFattura;
}
