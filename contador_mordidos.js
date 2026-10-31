//Tuve una idea, hay que añadir algo, algo que se guarde aunque se recargue la página, entonces voy a añadir esto, que se puedan morder a los clientes

class ContadorMordidos extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: "open" });

        shadow.innerHTML = `
            <style>
                :host{
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 12px;
                    flex-wrap: wrap;
                    margin: 0 0 18px;
                    padding: 10px 14px;
                    border: 1px solid var(--morado, #5b2a86);
                    border-radius: 8px;
                    background: #150a10;
                    color: var(--texto, #ece3e6);
                    font-family: Arial, sans-serif;
                }
                strong{
                    color: var(--verde, #5dff7a);
                    font-size: 1.2rem;
                }
                button{
                    padding: 8px 14px;
                    cursor: pointer;
                    color: var(--morado-claro, #b78cf0);
                    background: transparent;
                    border: 1px solid var(--morado, #5b2a86);
                    border-radius: 6px;
                }
                button:hover{
                    background: var(--morado, #5b2a86);
                    color: white;
                }
                button:focus-visible{
                    outline: 2px solid var(--verde, #5dff7a);
                    outline-offset: 2px;
                }
            </style>
            <span>Mordidos: <strong id="mordidos">0</strong> de <span id="total">0</span></span>
            <button type="button">Perdonar a todos</button>
        `;

        this.numMordidos = shadow.querySelector("#mordidos");
        this.numTotal = shadow.querySelector("#total");

        // Emitir un evento personalizado al pulsar el botón
        shadow.querySelector("button").addEventListener("click", () => {
            this.dispatchEvent(new CustomEvent("limpiar-marcas", {
                bubbles: true,
                composed: true
            }));
        });
    }

    // Método público para actualizar los números mostrados
    actualizar(mordidos, total) {
        this.numMordidos.textContent = mordidos;
        this.numTotal.textContent = total;
    }
}

customElements.define("contador-mordidos", ContadorMordidos);
