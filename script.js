const gameState = {
   currentScene: 'start',
   inventory: [],
   hasFlashlight: false,
   hasMap: false,
   hasKey: false,
   metHunter: false,
   endingsAchieved: []
};

const sceneImages = {
   start: 'assets/images/forest.jpg',
   forest: 'assets/images/forest.jpg',
   leftPath: 'assets/images/river.jpg',
   rightPath: 'assets/images/wolf.jpg',
   straightPath: 'assets/images/forest.jpg',
   river: 'assets/images/river.jpg',
   bridge: 'assets/images/plane.jpg',
   cabin: 'assets/images/cabin.jpg',
   wolf: 'assets/images/wolf.jpg',
   plane: 'assets/images/plane.jpg',
   rescue: 'assets/images/rescue.jpg',
   death: 'assets/images/death.jpg'
};

const scenes = {
   start: {
       text: "Вы очнулись в темном лесу после крушения самолета. Голова раскалывается от боли, но вы понимаете, что нужно искать помощь. Вокруг вас густой лес, а сквозь деревья едва пробивается свет. Перед вами три тропинки: налево, направо и прямо.",
       choices: [
           { text: "Пойти налево", nextScene: "leftPath" },
           { text: "Пойти направо", nextScene: "rightPath" },
           { text: "Пойти прямо", nextScene: "straightPath" }
       ],
       onEnter: () => {
           gameState.inventory = [];
           gameState.hasFlashlight = false;
           gameState.hasMap = false;
           gameState.hasKey = false;
           gameState.metHunter = false;
           updateInventory();
       }
   },
   leftPath: {
       text: "Вы идете по левой тропинке. Ветки хлещут вас по лицу, но вы продолжаете двигаться вперед. Вдруг вы замечаете что-то блестящее в кустах.",
       choices: [
           { text: "Исследовать блестящий предмет", nextScene: "findFlashlight" },
           { text: "Игнорировать и идти дальше", nextScene: "leftPathContinue" }
       ]
   },
   findFlashlight: {
       text: "Вы раздвигаете кусты и находите фонарик. Он выглядит рабочим. Теперь у вас будет свет в темноте.",
       choices: [
           { text: "Взять фонарик и продолжить путь", nextScene: "leftPathContinue" }
       ],
       onEnter: () => {
           gameState.hasFlashlight = true;
           updateInventory();
       }
   },
   leftPathContinue: {
       text: "С фонариком в руках вы продолжаете путь. Тропинка становится все уже, и вскоре вы выходите к реке. Вода течет быстро и выглядит опасной.",
       choices: [
           { text: "Попытаться переплыть реку", nextScene: "swimRiver" },
           { text: "Искать мост вдоль берега", nextScene: "findBridge" },
           { text: "Вернуться назад", nextScene: "start" }
       ]
   },
   swimRiver: {
       text: "Вы решаете переплыть реку. Течение сильнее, чем вы думали. Вода ледяная, и через несколько метров вы начинаете терять силы...",
       choices: [
           { text: "Продолжать плыть изо всех сил", nextScene: "drown" },
           { text: "Попытаться вернуться к берегу", nextScene: "leftPathContinue" }
       ]
   },
   drown: {
       text: "К сожалению, течение оказалось слишком сильным. Вода затягивает вас под воду... Все становится темно.",
       choices: [],
       isEnding: true,
       endingType: "bad",
       onEnter: () => showEnding()
   },
   findBridge: {
       text: "Вы идете вдоль берега и вскоре находите старый деревянный мост. Он выглядит ненадежным, но это лучше, чем пытаться переплыть.",
       choices: [
           { text: "Перейти по мосту", nextScene: "crossBridge" },
           { text: "Вернуться назад", nextScene: "leftPathContinue" }
       ]
   },
   crossBridge: {
       text: "Вы осторожно переходите по мосту. Доски скрипят под вашими ногами, но мост выдерживает. На другом берегу вы замечаете дымок вдалеке.",
       choices: [
           { text: "Идти к дыму", nextScene: "findCabin" },
           { text: "Игнорировать дым и идти дальше", nextScene: "deepForest" }
       ]
   },
   findCabin: {
       text: "Вы подходите к маленькой хижине. Дым идет из трубы - значит, кто-то есть внутри. Вы стучите в дверь, и через некоторое время дверь открывает старый охотник.",
       choices: [
           { text: "Попросить помощи", nextScene: "askForHelp" },
           { text: "Убежать", nextScene: "runFromCabin" }
       ],
       onEnter: () => {
           gameState.metHunter = true;
       }
   },
   askForHelp: {
       text: "Охотник приглашает вас внутрь. Он дает вам теплую одежду и еду. Узнав о крушении, он обещает отвести вас в ближайший город утром.",
       choices: [
           { text: "Принять помощь", nextScene: "goodEnding" }
       ]
   },
   runFromCabin: {
       text: "Вы в панике убегаете от хижины. В темноте вы не замечаете корень и падаете, ударяясь головой о камень...",
       choices: [],
       isEnding: true,
       endingType: "bad",
       onEnter: () => showEnding()
   },
   goodEnding: {
       text: "Утром охотник ведет вас по безопасной тропе к городу. Через несколько часов вы выходите к дороге, где вас замечает полиция. Вскоре вас спасают!",
       choices: [],
       isEnding: true,
       endingType: "good",
       onEnter: () => showEnding()
   },
   rightPath: {
       text: "Вы выбираете правую тропинку. Через некоторое время вы слышите странные звуки впереди. Это похоже на рычание.",
       choices: [
           { text: "Продолжить идти вперед", nextScene: "meetWolf" },
           { text: "Вернуться назад", nextScene: "start" },
           { text: "Спрятаться за деревом", nextScene: "hideFromWolf" }
       ]
   },
   meetWolf: {
       text: "Из кустов выскакивает большой серый волк! Он рычит и показывает зубы. У вас нет оружия, и вы понимаете, что в опасности.",
       choices: [
           { text: "Попытаться убежать", nextScene: "runFromWolf" },
           { text: "Кричать и махать руками", nextScene: "scareWolf" },
           { text: "Замри на месте", nextScene: "freezeWolf" }
       ]
   },
   runFromWolf: {
       text: "Вы разворачиваетесь и бежите что есть сил. Волк преследует вас. Вы спотыкаетесь о корень и падаете...",
       choices: [],
       isEnding: true,
       endingType: "bad",
       onEnter: () => showEnding()
   },
   scareWolf: {
       text: "Вы начинаете кричать и махать руками. Волк на секунду останавливается, но затем, кажется, только злится еще больше. Он готовится к прыжку...",
       choices: [],
       isEnding: true,
       endingType: "bad",
       onEnter: () => showEnding()
   },
   freezeWolf: {
       text: "Вы замираете на месте. Волк медленно приближается, обнюхивает вас и, кажется, теряет интерес. Через несколько напряженных минут он уходит.",
       choices: [
           { text: "Осторожно продолжить путь", nextScene: "rightPathContinue" },
           { text: "Вернуться назад", nextScene: "start" }
       ]
   },
   hideFromWolf: {
       text: "Вы прячетесь за большим деревом и задерживаете дыхание. Волк проходит мимо, не заметив вас. Через несколько минут вы решаете продолжить путь.",
       choices: [
           { text: "Продолжить путь", nextScene: "rightPathContinue" },
           { text: "Вернуться назад", nextScene: "start" }
       ]
   },
   rightPathContinue: {
       text: "Вы идете дальше по тропинке и выходите к обломкам самолета. Возможно, здесь можно найти что-то полезное.",
       choices: [
           { text: "Обыскать обломки", nextScene: "searchPlane" },
           { text: "Продолжить путь мимо", nextScene: "findRoad" }
       ]
   },
   searchPlane: {
       text: "Среди обломков вы находите карту местности и небольшой нож. Это может пригодиться!",
       choices: [
           { text: "Взять предметы и продолжить", nextScene: "findRoad" }
       ],
       onEnter: () => {
           gameState.hasMap = true;
           updateInventory();
       }
   },
   findRoad: {
       text: "Продолжая путь, вы выходите на грунтовую дорогу. Вдалеке виднеется движение. У вас есть шанс на спасение!",
       choices: [
           { text: "Идти к движению", nextScene: "rescueEnding" }
       ]
   },
   rescueEnding: {
       text: "Вы выходите на дорогу, где вас замечает проезжающий грузовик. Водитель останавливается и соглашается отвезти вас в город. Вы спасены!",
       choices: [],
       isEnding: true,
       endingType: "good",
       onEnter: () => showEnding()
   },
   straightPath: {
       text: "Вы идете прямо. Тропинка становится все более заросшей, и вскоре вы понимаете, что заблудились. Вокруг становится темнее.",
       choices: [
           { text: "Продолжить идти вперед", nextScene: "deepForest" },
           { text: "Попытаться вернуться", nextScene: "start" },
           { text: "Развести костер и остаться на ночь", nextScene: "makeFire" }
       ]
   },
   deepForest: {
       text: "Вы заходите все глубже в лес. Ветки становятся такими густыми, что почти не пропускают свет. Вы слышите странные звуки вокруг.",
       choices: [
           { text: "Продолжить идти", nextScene: "lostEnding" },
           { text: "Попытаться найти дорогу назад", nextScene: "start" }
       ]
   },
   lostEnding: {
       text: "Вы блуждаете по лесу несколько дней. Еды и воды нет, силы на исходе. В конце концов, вы падаете без сил... Спасатели так и не находят вас.",
       choices: [],
       isEnding: true,
       endingType: "bad",
       onEnter: () => showEnding()
   },
   makeFire: {
       text: "Вы собираете ветки и разводите небольшой костер. Тепло огня согревает вас. Утром вы сможете продолжить путь с новыми силами.",
       choices: [
           { text: "Утром продолжить путь", nextScene: "morningContinue" }
       ]
   },
   morningContinue: {
       text: "С рассветом вы продолжаете путь. Свежий утренний воздух бодрит. Вскоре вы выходите к знакомой тропинке - это путь назад к месту крушения.",
       choices: [
           { text: "Вернуться к месту крушения", nextScene: "start" },
           { text: "Попробовать другой путь", nextScene: "findNewPath" }
       ]
   },
   findNewPath: {
       text: "Вы решаете попробовать другой путь. После нескольких часов ходьбы вы замечаете вдалеке вышку сотовой связи!",
       choices: [
           { text: "Идти к вышке", nextScene: "towerEnding" }
       ]
   },
   towerEnding: {
       text: "Добравшись до вышки, вы находите рабочих. Они вызывают помощь, и вскоре вас забирает вертолет. Вы спасены!",
       choices: [],
       isEnding: true,
       endingType: "good",
       onEnter: () => showEnding()
   }
};

const storyTextElement = document.getElementById('story-text');
const choicesElement = document.getElementById('choices');
const restartBtn = document.getElementById('restart-btn');
const inventoryElement = document.querySelector('.inventory');
const inventoryItemsElement = document.querySelector('.inventory-items');
const sceneImageContainer = document.getElementById('scene-image-container');
const startBtn = document.getElementById('start-btn');

function startGame() {
   document.querySelector('.game-area').classList.remove('hidden');
   startBtn.classList.add('hidden');
   inventoryElement.classList.remove('hidden');
   loadScene('start');
}

function loadScene(sceneId) {
   const scene = scenes[sceneId];
   if (!scene) return;

   gameState.currentScene = sceneId;
   
   while (choicesElement.firstChild) {
       choicesElement.removeChild(choicesElement.firstChild);
   }
   
   storyTextElement.textContent = scene.text;
   storyTextElement.style.opacity = 0;
   setTimeout(() => {
       storyTextElement.style.opacity = 1;
   }, 100);
   
   sceneImageContainer.innerHTML = '';
   if (sceneImages[sceneId]) {
       const img = document.createElement('img');
       img.src = sceneImages[sceneId];
       img.alt = 'Сцена';
       img.className = 'scene-image';
       sceneImageContainer.appendChild(img);
   }
   
   if (scene.choices && scene.choices.length > 0) {
       scene.choices.forEach(choice => {
           const button = document.createElement('button');
           button.className = 'choice-btn';
           button.textContent = choice.text;
           button.addEventListener('click', () => {
               loadScene(choice.nextScene);
           });
           choicesElement.appendChild(button);
       });
   } else {
       restartBtn.classList.remove('hidden');
   }
   
   if (scene.onEnter) {
       scene.onEnter();
   }
}

function updateInventory() {
   inventoryItemsElement.innerHTML = '';
   
   if (gameState.hasFlashlight) {
       const item = document.createElement('div');
       item.className = 'inventory-item';
       item.textContent = 'Фонарик';
       inventoryItemsElement.appendChild(item);
   }
   
   if (gameState.hasMap) {
       const item = document.createElement('div');
       item.className = 'inventory-item';
       item.textContent = 'Карта';
       inventoryItemsElement.appendChild(item);
   }
   
   if (gameState.hasKey) {
       const item = document.createElement('div');
       item.className = 'inventory-item';
       item.textContent = 'Ключ';
       inventoryItemsElement.appendChild(item);
   }
}

function showEnding() {
   const scene = scenes[gameState.currentScene];
   if (scene.endingType === "good") {
       document.body.style.backgroundImage = "url('assets/images/rescue.jpg')";
   } else {
       document.body.style.backgroundImage = "url('assets/images/death.jpg')";
   }
   
   if (!gameState.endingsAchieved.includes(gameState.currentScene)) {
       gameState.endingsAchieved.push(gameState.currentScene);
   }
   
   restartBtn.classList.remove('hidden');
}

restartBtn.addEventListener('click', () => {
   gameState.currentScene = 'start';
   loadScene('start');
   document.body.style.backgroundImage = "url('assets/images/forest.jpg')";
});

startBtn.addEventListener('click', startGame);