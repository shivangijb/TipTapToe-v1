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
            background-position: center;
        }

        .cell-image {
            background-size: contain;
            z-index: 10;
            background-repeat: no-repeat;
        }

        .cell-fish-1 {
            background-image: url('./assets/fishIcon.png');
        }

        .cell-fish-2 {
            background-image: url('./assets/fishIcon_clown.png');
        }

        .cell-fish-3 {
            background-image: url('./assets/fishIcon_octopus.png');
        }

        .cell-fish-4 {
            background-image: url('./assets/fishIcon_yelblue.png');
        }

        .cell-fish-5 {
            background-image: url('./assets/fishIcon_seahorse.png');
        }

        .cell-fish-6 {
            background-image: url('./assets/fishIcon_whale.png');
        }

        .cell-fish-7 {
            background-image: url('./assets/fishIcon_Jelly.png');
        }

        .cell-catch {
            background-image: url('./assets/peanuts.png');
        }

        .cell-correct {
            background-image: url('./assets/check.png');
        }

        .cell-wrong {
            background-image: url('./assets/cross.png');
        }

        .cell-missed {
            background-image: url('./assets/double-exclamation.png');
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
            el.setAttribute('class', 'grid-cell cell-image');
            el.setAttribute('id', 'gridid_'+i);
            el.setAttribute('onclick', 'cellClick(this)');
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