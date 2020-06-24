const template = document.createElement('template');
template.innerHTML = `
    <style>
        .game-grid {
            display: grid;
            grid-gap: 0;
            height: 100%;
            border: 1px solid #294374;
        }
        .grid-cell {
            box-sizing: border-box;
            border: 1px solid #294374;
            cursor: pointer;
        }
    </style>
    <div id='game-grid' class='game-grid'>
        
    </div>`;

class CheckboxGrid extends HTMLElement {
    constructor() { 
        //how make row, column mandatory attribute and pass in contructor??
        super();

        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    get row() {
        return this.getAttribute('row');
    }

    get column() {
        return this.getAttribute('column');
    }

    connectedCallback() {
        const gamegrid = this.shadowRoot.getElementById('game-grid');
        for (let i=0; i<this.row*this.column; i++) {
            let el = document.createElement("DIV");
            el.setAttribute('class', 'grid-cell');
            el.setAttribute('id', 'gridid_'+i);
            // el.setAttribute('onclick', '_cellClick()');
            // el.addEventListener('click', this._cellClick.bind(this));
            gamegrid.appendChild(el);
        }
        const gridstyle=`
            grid-template-columns: repeat(${this.row}, auto);
            grid-template-rows: repeat(${this.column}, auto);
        `;
        gamegrid.setAttribute('style', gridstyle);
    }
}

window.customElements.define('checkbox-grid', CheckboxGrid);