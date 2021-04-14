var dog,sadDog,happyDog, database;
var foodS,foodStock;
var addFood;
var foodObj;
var feed;
var lastFedL,lastFed;

function preload(){
sadDog=loadImage("Dog.png");
happyDog=loadImage("happy dog.png");
}

function setup() {
  database=firebase.database();
  createCanvas(1000,400);
  foodObj = new Food();
  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  lastFed=database.ref('FeedTime');
  lastFed.on("value",(data)=>{
    lastFed=data.val();
    foodObj.getFedTime(lastFed);
  });
  dog=createSprite(800,200,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;
  feed=createButton("Feed the Dog");
  feed.position(800,150);
  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);
  lastFedL=createElement('h3');
  lastFedL.position(100,100);
}

function draw() {
  background(46,139,87);
  foodObj.display();
  if(lastFed > 12){
    var lastFeed=lastFed-12;
    textSize(30);
    text("Last Fed:"+lastFeed,350,30);
    text("PM",495,30);
  }
  else if(lastFed === 12){
    textSize(30);
    text("Last Fed: 12 AM", 350,30);
  }
  else{
    var lastFeed=lastFed;
    textSize(30);
    text("Last Fed:"+lastFeed,350,30);
    text("AM",495,30);
  }
  feedDog();
  drawSprites();
}

function readFeedTime(data){
  lastFed=data.val();
  foodObj.getFedTime(lastFed);
}

function readStock(data){
  foodStock=data.val();
  foodObj.updateFoodStock(foodStock);
}

function feedDog(){
  dog.addImage(happyDog);
  feed.mousePressed(()=>{
   foodStock=foodObj.getFoodStock();
    if(foodStock <=0){
      foodObj.updateFoodStock(foodStock*0);
    }
    else{
      foodObj.updateFoodStock(foodStock-1);
    }
    lastFed=hour();
    foodObj.getFeedTime(lastFed);
  })
}

function addFoods(){
  foodStock++;
  database.ref('/').update({
    Food:foodStock
  })
}
