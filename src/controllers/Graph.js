class Graph {
    constructor(elements, connections, canvas) {
        this.canvas = canvas;
        this.elements = elements;
        Object.keys(elements).forEach((k,e)=>{
            console.log(k,e,elements[k])
            elements[k] = {
                x: Object.keys(elements).length * (Math.random() * 1080) % window.innerWidth,
                y: Object.keys(elements).length * (Math.random() * 1920) % window.innerHeight,
                name: elements[k].name,
            }
        });
        this.connections = connections;
        console.log('*************************')
        console.log(this.elements, this.connections)
        this.drag = false;
        this.selectedElement = null;
        this.drawnConnections = {};
        this.offsetIncrement = 10;
        this.offsetX = 0;
        this.offsetY = 0;
    }

    /**
     * 
     */
    $onInit() {
        this.canvas = document.getElementById('myCanvas');
        console.log(this.canvas)
        this.ctx = this.canvas.getContext('2d');
        console.log(this.canvas,this.ctx);

        this.canvas.addEventListener('mousedown', (e) => {
            let rect = this.canvas.getBoundingClientRect();
            let mouseX = e.clientX - rect.left;
            let mouseY = e.clientY - rect.top;

            for (let element in this.elements) {
                var dist = Math.sqrt(Math.pow(mouseX - this.elements[element].x, 2) + Math.pow(mouseY - this.elements[element].y, 2));
                if (dist < 20) {
                    this.drag = true;
                    this.selectedElement = element;
                    this.offsetX = mouseX - this.elements[element].x;
                    this.offsetY = mouseY - this.elements[element].y;
                    break;
                }
            }
        });

        this.canvas.addEventListener('mousemove', (e) => {
            if (this.drag) {
                let rect = this.canvas.getBoundingClientRect();
                let mouseX = e.clientX - rect.left;
                let mouseY = e.clientY - rect.top;

                this.elements[this.selectedElement].x = mouseX - this.offsetX;
                this.elements[this.selectedElement].y = mouseY - this.offsetY;

                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                this.drawElements();
                this.drawConnections();
            }
        });

        this.canvas.addEventListener('mouseup', () => {
            this.drag = false;
            this.selectedElement = null;
        });

        this.drawElements();
        this.drawConnections();
    }

    /**
     *
     */
    drawElements() {
        for (let element in this.elements) {
            this.ctx.beginPath();
            this.ctx.arc(this.elements[element].x, this.elements[element].y, 20, 0, Math.PI * 2);
            this.ctx.fillStyle = 'lightblue';
            this.ctx.fill();
            this.ctx.stroke();
            this.ctx.fillStyle = 'black';
            this.ctx.fillText(this.elements[element].name, this.elements[element].x - 5, this.elements[element].y + 5);
        }
    }

    drawConnections() {
        this.drawnConnections = {};

        Object.keys(this.connections).forEach(element => {
            this.connections[element].forEach(connection => {
                let connectedElement = connection.target;
                if (this.elements[connectedElement]) {
                    let connectionKey = `${element}-${connectedElement}`;
                    let connectionKey2 = `${connectedElement}-${element}`;
                    let offset = 0;
                    if (this.isConnectionDrawn(connectionKey, offset) || this.isConnectionDrawn(connectionKey2, offset)) {
                        offset += this.offsetIncrement;
                    } else {
                        if(connection.direction === 'TO') {
                            this.drawnConnections[`${connectionKey2}-${offset}`] = true;
                        }
                        else if (connection.direction === 'FROM') {
                            this.drawnConnections[`${connectionKey}-${offset}`] = true;
                        }
                        this.drawArrowWithOffset(
                            this.elements[element].x,
                            this.elements[element].y,
                            this.elements[connectedElement].x,
                            this.elements[connectedElement].y,
                            offset,
                            connection.direction
                        );
                    }
                }
            });
        });
    }

    isConnectionDrawn(connectionKey, offset) {
        return this.drawnConnections[`${connectionKey}-${offset}`];
    }

    drawConnectionFE(from, to) {
        let startX = from.x < to.x ? from.x + 20 : from.x - 20;
        let startY = from.y;
        let endX = to.x < from.x ? to.x + 20 : to.x - 20;
        let endY = to.y;

        this.ctx.beginPath();
        this.ctx.moveTo(startX, startY);
        this.ctx.lineTo(endX, endY);
        this.ctx.strokeStyle = 'black';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
    }

    drawArrowWithOffset(fromX, fromY, toX, toY, offset, direction) {
        if(direction === 'TO'){
            let temp = fromX;
            fromX = toX;
            toX = temp;
            temp = fromY;
            fromY = toY;
            toY = temp;
        }

        let headLength = 10;
        let angle = Math.atan2(toY - fromY, toX - fromX);

        let startOffsetX = Math.cos(angle) * 20;
        let startOffsetY = Math.sin(angle) * 20;
        let endOffsetX = Math.cos(angle) * 20;
        let endOffsetY = Math.sin(angle) * 20;

        this.ctx.beginPath();
        this.ctx.moveTo(fromX + startOffsetX, fromY + startOffsetY - offset);
        this.ctx.lineTo(toX - endOffsetX, toY - endOffsetY - offset);
        this.ctx.strokeStyle = 'black';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.moveTo(toX - headLength * Math.cos(angle - Math.PI / 6) - endOffsetX, toY - headLength * Math.sin(angle - Math.PI / 6) - endOffsetY - offset);
        this.ctx.lineTo(toX - endOffsetX, toY - endOffsetY - offset);
        this.ctx.lineTo(toX - headLength * Math.cos(angle + Math.PI / 6) - endOffsetX, toY - headLength * Math.sin(angle + Math.PI / 6) - endOffsetY - offset);
        this.ctx.fillStyle = 'black';
        this.ctx.fill();
    }

    addElement() {

    }

    addConnection() {

    }

}

export default Graph;
