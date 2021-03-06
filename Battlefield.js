function Battlefield(elem, width, height, tileSize, notify) {
    var context = elem.getContext('2d');
    var battleField = new Array(width);
    var position = {x: 0, y: 0};
    var marked = {x: 0, y: 0};
    
    function notifyMarked() {
        notify({
                type: 'marked',
                x: marked.x,
                y: marked.y,
                name: battleField[marked.x][marked.y].type.name,
                unit: battleField[marked.x][marked.y].unit
                });
    }

    function notifyPosition() {
        var offsetX = Math.floor(context.canvas.width / tileSize / 2);
        var offsetY = Math.floor(context.canvas.height / tileSize / 2);
        notify({
                type: 'position',
                x: position.x,
                y: position.y,
                centerX: position.x + offsetX,
                centerY: position.y + offsetY,
                });
    }

    function notifyUnitMove(x, y) {
        notify({
                type: 'unitMove',
                fromX: marked.x,
                fromY: marked.y,
                toX: x,
                toY: y,
                unit: battleField[x][y].unit
                });
    }

    function clearHighlights() {
        for (var x = 0; x < width; x++) 
            for (var y = 0; y < height; y++) 
                battleField[x][y].highlight = false;
    }

    function updateUnitWaypath() {
        clearHighlights();
        if (battleField[marked.x][marked.y].unit == undefined) 
            return;
        var unit = battleField[marked.x][marked.y].unit;
        var type = unit.type;
        for (var x = marked.x - unit.rangeLeft; x <= marked.x + unit.rangeLeft; 
                                                            x++) {
            for (var y = marked.y - unit.rangeLeft; 
                                    y <= marked.y + unit.rangeLeft;
                                    y++) {
                try {
                    battleField[x][y].highlight = true;
                } catch (e) {
                }
            }
        }
    }

    function moveUnit(x1, y1, x2, y2) {
        if (x1 == x2 && y1 == y2)
            return;
        if (battleField[x1][y1] == undefined)
            return;
        battleField[x2][y2].unit = battleField[x1][y1].unit;
        battleField[x1][y1].unit = undefined;
        clearHighlights();
    }

    function initBattlefield() {
        var grass = new Image();
        grass.src = 'grass.jpg';
        for (var x = 0; x < width; x++) {
            var line = new Array(height);
            battleField[x] = line;
            for (var y = 0; y < height; y++) {
                var field = new Object();
                field.x = x;
                field.y = y;
                field.type = new Object();
                field.type.name = 'grass';
                field.type.img = grass;
                battleField[x][y] = field;
            }
        }

        clearHighlights();
        context.canvas.oncontextmenu = function() {return false};

        function click(e) {
            var relX = 0;
            var relY = 0;
            if (e.offsetX != undefined) { /* Netkit */
                relX = e.offsetX;
                relY = e.offsetY;
            } else if (e.view != undefined) { /* Gecko */
                relX = e.clientX - this.offsetLeft;
                relY = e.clientY - this.offsetTop;
            }
            var x = Math.floor(relX / tileSize) + position.x;
            var y = Math.floor(relY / tileSize) + position.y;
            switch (e.button) {
            case 0: /* Mark field on left mouse button */
                marked = {x: x, y: y};
                updateUnitWaypath();
                notifyMarked();
                draw();
                break;
            case 1: /* Center map on middle click */
                centerMapOn(x, y);
                notifyPosition();
                draw();
                break;
            case 2: /* Move unit */
                if (!battleField[x][y].highlight)
                    break;
                moveUnit(marked.x, marked.y, x, y);
                notifyUnitMove(x, y);
                marked.x = x;
                marked.y = y;
                updateUnitWaypath();
                draw();
                break;
            }
        }
        elem.onmousedown = click;

        notifyMarked();
        notifyPosition();
    }

    this.setField = function(field, x, y) {
        battleField[x][y].type = field;
    }

    function draw() {
        var drawX = context.canvas.width / tileSize;
        var drawY = context.canvas.height / tileSize;
        for (var x = position.x; x < drawX + position.x; x++) {
            for (var y = position.y; y < drawY + position.y; y++) {
                try {
                    context.drawImage(battleField[x][y].type.img,
                        (x - position.x) * tileSize, 
                        (y - position.y) * tileSize);
                    if (battleField[x][y].unit != undefined) {
                        context.drawImage(battleField[x][y].unit.type.img,
                            (x - position.x) * tileSize, 
                            (y - position.y) * tileSize);
                    }
                    if (battleField[x][y].highlight) {
                        context.fillStyle = 'rgba(0, 0, 255, .5)';
                        context.fillRect((x - position.x) * tileSize,
                                        (y - position.y) * tileSize,
                                        tileSize, tileSize);
                    }
                } catch (e) {
                    context.fillStyle = '#000';
                    context.fillRect((x - position.x) * tileSize,
                                    (y - position.y) * tileSize,
                                    tileSize, tileSize);
                }
/*                if (this.unitGamefield[x][y] != null)
                    context.drawImage(this.unitGamefield[x][y].image,
                        (x - this.posX) * tileSize,
                        (y - this.posY) * tileSize);*/
            }
        }
    }
    this.draw = draw;

    function centerMapOn(x, y) {
        var offsetX = Math.floor(context.canvas.width / tileSize / 2);
        var offsetY = Math.floor(context.canvas.height / tileSize / 2);
        position = {x: x - offsetX, y: y - offsetY};
        draw();
    }
    this.centerMapOn = centerMapOn;

    function setUnit(unit, x, y) {
        battleField[x][y].unit = unit;
        draw();
    }
    this.setUnit = setUnit;

    initBattlefield();
}
