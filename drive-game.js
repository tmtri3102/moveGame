const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Car
let car = {
  x: canvas.width / 2 - 25,
  y: canvas.height / 2 - 50,
  width: function () {
    if (this.direction == 0 || this.direction == 180) return 100;
    else if (this.direction == 90 || this.direction == -90) return 50;
  },
  height: function () {
    if (this.direction == 0 || this.direction == 180) return 50;
    else if (this.direction == 90 || this.direction == -90) return 100;
  },
  speed: 2,
  direction: 90, // Hướng mặc định là lên trên (90 độ)
  image: function () {
    let img = new Image();
    if (this.direction == 0) img.src = "carRight.jpg";
    else if (this.direction == 90) img.src = "carUp.jpg";
    else if (this.direction == 180) img.src = "carLeft.jpg";
    else if (this.direction == -90) img.src = "carDown.jpg";
    return img;
  },
};

document.addEventListener("keydown", function (event) {
  if (event.ctrlKey) {
    car.speed = 5; // Tăng tốc độ xe
  }
});

document.addEventListener("keyup", function (event) {
  if (!event.ctrlKey) {
    car.speed = 2; // Quay lại tốc độ chậm
  }
});

document.addEventListener("keydown", function (event) {
  if (event.key === "ArrowLeft") {
    car.direction = 180; // Quay sang trái (180 độ)
  } else if (event.key === "ArrowRight") {
    car.direction = 0; // Quay sang phải (0 độ)
  } else if (event.key === "ArrowUp") {
    car.direction = 90; // Quay lên trên (90 độ)
  } else if (event.key === "ArrowDown") {
    car.direction = -90; // Quay xuống dưới (-90 độ)
  }
});

// Obstacles
let obstacles = [];
function generateObstacles() {
  for (let i = 0; i < 5; i++) {
    obstacles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      width: 50,
      height: 50,
    });
  }
}
generateObstacles();

// Coins and Score
let score = 0;
let coins = [];
function generateCoins() {
  for (let i = 0; i < 10; i++) {
    coins.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      width: 40,
      height: 40,
      image: function () {
        let img = new Image();
        img.src = "Coin.jpg";
        return img;
      },
    });
  }
}
generateCoins();

// Update and draw everything
function update() {
  let radians = (car.direction * Math.PI) / 180; // Chuyển độ thành radian
  car.x += car.speed * Math.cos(radians); // Cập nhật vị trí theo trục x
  car.y -= car.speed * Math.sin(radians); // Cập nhật vị trí theo trục y
  draw();
  setTimeout(update, 1000 / 60); // Update 60 times per second
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(car.image(), car.x, car.y, car.width(), car.height());

  obstacles.forEach((obstacle) => {
    ctx.fillStyle = "red";
    ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);

    if (
      car.x < obstacle.x + obstacle.width &&
      car.x + car.width() > obstacle.x &&
      car.y < obstacle.y + obstacle.height &&
      car.y + car.height() > obstacle.y
    ) {
      alert("Game Over!");
      window.location.reload();
    }
  });

  coins.forEach((coin, index) => {
    ctx.fillStyle = "gold";
    ctx.drawImage(coin.image(), coin.x, coin.y, coin.width, coin.height);

    if (
      car.x < coin.x + coin.width &&
      car.x + car.width() > coin.x &&
      car.y < coin.y + coin.height &&
      car.y + car.height() > coin.y
    ) {
      coins.splice(index, 1); // Xóa coin khi lấy được
      score += 10; // Cộng điểm
    }

    if (score == 100) {
      alert("You Won!");
      window.location.reload();
    }
  });

  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 10, 30);
}

update();
