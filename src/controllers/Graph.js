class Graph {
    constructor(elements, connections, canvas, selectedNode) {
        this.canvas = canvas;
        this.zoomFactor = 1.0;
        this.zoomIncrement = 0.275;
        this.selectedNode = selectedNode;

        this.elements = elements;
        this.connections = connections;

        this.drag = false;
        this.selectedElement = null;

        this.drawnConnections = {};

        this.offsetIncrement = 10;
        this.offsetX = 0;
        this.offsetY = 0;

        this.nodeRadius = 20;
    }

    $onInit() {
        this.canvas = document.getElementById('myCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        Object.keys(this.elements).forEach((k,e)=>{
            const randomWidth = Object.keys(this.elements).length * (Math.random() * this.canvas.width) % this.canvas.width;
            const randomHeight = Object.keys(this.elements).length * (Math.random() * this.canvas.height) % this.canvas.height;

            this.elements[k] = {
                x: Object.keys(this.elements).length * (Math.random() * this.canvas.width) % this.canvas.width,
                y: Object.keys(this.elements).length * (Math.random() * this.canvas.height) % this.canvas.height,
                name: this.elements[k].name,
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

        this.canvas.addEventListener('mousedown', (e) => {
            let rect = this.canvas.getBoundingClientRect();
            let mouseX = e.clientX - rect.left;
            let mouseY = e.clientY - rect.top;

            for (let element in this.elements) {
                var dist = Math.sqrt(Math.pow(mouseX - this.elements[element].x, 2) + Math.pow(mouseY - this.elements[element].y, 2));
                if (dist < this.nodeRadius) {
                    this.drag = true;
                    this.selectedElement = element;
                    this.offsetX = mouseX - this.elements[element].x;
                    this.offsetY = mouseY - this.elements[element].y;
                    break;
                }
            }

        });

        this.canvas.addEventListener('mouseup', () => {
            this.drag = false;
            this.selectedElement = null;
        });

        this.drawElements();
        this.drawConnections();
    }

    drawElements() {
        for (let element in this.elements) {
            this.ctx.beginPath();
            this.ctx.arc(this.elements[element].x, this.elements[element].y, this.nodeRadius, 0, Math.PI * 2);
            this.ctx.fillStyle = this.selectedNode === element ? 'red' : 'lightblue'; 
            
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
                            connection.direction,
                            connection.relation
                        );
                    }
                }
            });
        });
    }

    isConnectionDrawn(connectionKey, offset) {
        return this.drawnConnections[`${connectionKey}-${offset}`];
    }

    drawArrowWithOffset(fromX, fromY, toX, toY, offset, direction, relation) {
        if (direction === 'TO') {
            let temp = fromX;
            fromX = toX;
            toX = temp;
            temp = fromY;
            fromY = toY;
            toY = temp;
        }

        let headLength = 10;
        let angle = Math.atan2(toY - fromY, toX - fromX);

        let startOffsetX = Math.cos(angle) * this.nodeRadius;
        let startOffsetY = Math.sin(angle) * this.nodeRadius;
        let endOffsetX = Math.cos(angle) * this.nodeRadius;
        let endOffsetY = Math.sin(angle) * this.nodeRadius;

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

        this.ctx.save();
        this.ctx.translate((fromX + toX) / 2, (fromY + toY) / 2);
        this.ctx.rotate(angle);
        this.ctx.fillStyle = 'black';
        this.ctx.font = '12px Arial';
        this.ctx.fillText(relation, 0, 0);
        this.ctx.restore();
    }

    destroy() {
        if(this.canvas) {
            this.canvas.removeEventListener('mousemove', this);
            this.canvas.removeEventListener('mousedown', this);
            this.canvas.removeEventListener('mouseup', this);
            delete this.elements;
            delete this.connections;
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }
}

export default Graph;
