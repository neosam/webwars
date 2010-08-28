function Battlefield(elem, width, height, tileSize) {
    var context = elem.getContext('2d');
    var battleField = new Array(width);
    var position = new Object();
    position.x = 0;
    position.y = 0;
    
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
