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
                name: battleField[marked.x][marked.y].type.name
                });
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

        function click(e) {
            var x = Math.floor(e.offsetX / tileSize);
            var y = Math.floor(e.offsetY / tileSize);
            marked = {x: x, y: y};
            notifyMarked();
        }
        elem.onmousedown = click;

        notifyMarked();
    }

    this.setField = function(field, x, y) {
        battleField[x][y].type = field;
    }

    this.draw = function() {
        var drawX = context.canvas.width / tileSize;
        var drawY = context.canvas.height / tileSize;
        for (var x = position.x; x < drawX + position.x; x++) {
            for (var y = position.y; y < drawY + position.y; y++) {
                try {
                    context.drawImage(battleField[x][y].type.img,
                        (x - position.x) * tileSize, 
                        (y - position.y) * tileSize);
                } catch (e) {
                    
                }
/*                if (this.unitGamefield[x][y] != null)
                    context.drawImage(this.unitGamefield[x][y].image,
                        (x - this.posX) * tileSize,
                        (y - this.posY) * tileSize);*/
            }
        }
    }

    initBattlefield();
}
