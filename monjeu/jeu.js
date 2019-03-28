var jeu = document.getElementById("container");


window.onload = function()
{
    var canvasWidth = 800;
    var canvasHeight = 450;
    var blockSize = 30; 
    var  ctx;
    var delay = 100;
    var snakee;
    var applee;
    var widthinblocks = canvasWidth/blockSize; 
    var heightinblocks = canvasHeight/blockSize; 
    var snake;
    var score;
    var timeout;
 
    
    
    init();
    
    function init()
    {
            var canvas = document.createElement('canvas');
            canvas.width = canvasWidth;
            canvas.height = canvasHeight;
            canvas.style.border = "30px solid black";
            canvas.style.margin = " auto";
            canvas.style.display = "block";
            canvas.style.backgroundColor= "#ddd";
            document.body.appendChild(canvas);
            ctx = canvas.getContext('2d');
            snakee = new Snake([[6,4], [5,4], [4,4], [3,4], [2,4]] , "right"); 
            applee = new apple([10,10]);
            score = 0;
            refreshCanvas();
    }
    
    function refreshCanvas()
    {
           
            snakee.advance();
            if(snakee.checkCollision())
            {
               gameover()
            }
        else
        {
            if(snakee.iseatingapple(applee))
            {
                score += 3;
                snakee.eatapple = true;
                do
                {
                    applee.setnewposition();
                }
                while(applee.isonsnake(snakee))
               
            }
            ctx.clearRect(0,0,canvasWidth, canvasHeight);
            drawscore();
            snakee.draw();
            applee.draw();
            timeout = setTimeout(refreshCanvas,delay);  
        }
            
    }
    
    function gameover()
        {
            ctx.save();
            ctx.fillStyle ="orange"; 
            ctx.font = "bold 20px sans-serif";
            ctx.fillText("Appuyer sur espace pour rejouer", 250, 225);
            ctx.fillStyle = "red";
            ctx.font = "bold 50px sans-serif";
            ctx.fillText("GameOver", 500, 50);
            ctx.restore();
            
            
            
        }
    function restart()
    {
            snakee = new Snake([[6,4], [5,4], [4,4], [3,4], [2,4]] , "right"); 
            applee = new apple([10,10]);
            score = 0;
        clearTimeout(timeout);
            refreshCanvas();
    }
    function drawscore()
    {
            ctx.save();
             ctx.fillStyle = "red";
            ctx.font = "bold 100px sans-serif";
            ctx.fillText(score.toString(),50, 100);
            ctx.restore();  
    }  
  
    function drawBlock(ctx, position)
    {
        var x = position[0] * blockSize;
         var y = position[1] * blockSize;
        ctx.fillRect(x ,y , blockSize, blockSize)
    }
    function Snake(body,direction)
    {
       this.body = body;
        this.direction = direction;
        this.eatapple = false;
        this.draw = function()
        {
            ctx.save();
            ctx.fillStyle = "#d82e2c";
            for(var i = 0; i < this.body.length; i++)
            {
                drawBlock(ctx, this.body[i]);
            }
            ctx.restore();
        };
        this.advance = function()
        {
            var nextposition = this.body[0].slice(); 
            switch(this.direction)
            {
                case "left":
                    nextposition[0] -= 1;
                    break;
                case "right":
                     nextposition[0] += 1;
                    break;
                case "down":
                     nextposition[1] += 1;
                    break;
                case"up":
                     nextposition[1] -= 1;
                    break;
            
                    default:
                    throw("invalide derection");
            }
            this.body.unshift(nextposition);
            if(!this.eatapple)   
            this.body.pop();
             else
                    this.eatapple = false;
        };
        this.setdirection = function(newdirection)
        {
          var alloweddirections;
            switch(this.direction)
            {
                case "left" :
                case "right":
                    alloweddirections = ["up","down"];
                    break;
                case "down" :
                case"up":
                    alloweddirections = ["left","right"];
                    break;  
                     default:
                        throw("invalide derection");
            }
            if(alloweddirections.indexOf(newdirection) > -1)
            {
                this.direction = newdirection;
            }
        };
        this.checkCollision = function()
        {
            var wallCollision = false;
            var snakeCollision = false;
            var head = this.body[0];
            var rest = this.body.slice(1);
            var snakeX = head[0];
            var snakeY = head[1]; 
            var minX = 0;
            var minY = 0;
            var maxX = widthinblocks ;
            var maxY = heightinblocks - 1;
            var isNotBetweenHorizontalWalls = (snakeX < minX )|| (snakeX > maxX);                                                             
            var isNotBetweenVeticalWalls = (snakeY < minY) || (snakeY > maxY);
            
            if(isNotBetweenHorizontalWalls || isNotBetweenVeticalWalls)
            {
                wallCollision = true;
            }
            for(var i = 0; i < rest.length ; i++)
            {
                if(snakeX === rest[i][0] && snakeY === rest[i][1] )
                {
                    snakeCollision = true;
                }
                
                    
            }
            return wallCollision || snakeCollision;
        };
//        
        this.iseatingapple  = function(appletoeat)
        {
           var head = this.body[0];
            if(head[0] === appletoeat.position[0] && head[1] === appletoeat.position[1])
                return true;
         
            else 
                return false;
        };
    }
    
    function apple(position)
    {
        this.position = position;
        this.draw = function()
        {
            ctx.save;
            ctx.fillStyle = "#33cc33";
            ctx.beginPath();
            var radius = blockSize/2;
            var x = this.position[0]*blockSize + radius;
            var y = this.position[1]*blockSize + radius;
            ctx.arc(x,y, radius, 0, Math.PI*2, true);
            ctx.fill();
            ctx.restore();
        };
        
        this.setnewposition = function()
        {
            var newX = Math.round(Math.random() * (widthinblocks - 1)); 
            var newY = Math.round(Math.random() * (heightinblocks - 1)); 
            this.position = [newX, newY];
        };
        this.isonsnake = function(snaketocheck)
        {
            var isonsnake = false;
            for( var i = 0; i < snaketocheck.body; i++)
            {
                if(this.position[0]===snaketocheck.body[i][0] &&  this.position[1]===snaketocheck.body[i][1])
                {
                    isonsnake = true;
                }
            }
            return isonsnake;    
        };
    }
   
document.onkeydown = function handlekeydown(e)
{
    var key = e.keyCode;
    var newdirection;
    switch(key)
            {
            case 37:
                newdirection = "left";
                break; 
            case 38:
                 newdirection = "up";
                break;
            case 39:
                newdirection = "right";
                break;
            case 40:
                newdirection = "down";
                break;
             case 32:
                restart();
                  return;
                default:
           
                    return;
            }
           snakee.setdirection(newdirection);       
                    
                    
                    
}
                    
}








