// 游戏状态变量
let gameState = {
    running: false,
    workMoodValue: 60, // 初始工作状态值为60%
    bubbleInterval: null,
    thoughtsInterval: null, // 用于定时更新思想影响的计时器
    moveInterval: null, // 用于更新气泡移动的计时器
    spawnRate: 1500, // 生成气泡的频率（毫秒）
    maxBubbles: 8, // 屏幕上最大气泡数量
    activeBubbles: 0,
    activePositiveBubbles: 0, // 当前场上积极想法数量
    activeNegativeBubbles: 0,  // 当前场上消极想法数量
    bubbles: [], // 存储所有气泡对象
    safeAreaCalculated: false, // 是否已计算安全区域
    emotionState: null, // 当前情绪状态：'angry', 'sad', 'fear' 或 null
    gender: 'male', // 当前角色性别：'male' 或 'female'
    currentFloor: 1, // 当前楼层：从1F开始
    elevatorInterval: null, // 电梯上升计时器
    gameTime: 15000, // 游戏总时间（毫秒），电梯从1F到15F需要15秒
    totalFloors: 15, // 总楼层数
    characterName: '', // 当前角色的英文名
    currentRound: 1, // 当前游戏轮次
    totalRounds: 5, // 总轮次数
    roundResults: [], // 存储每轮游戏结果，包含姓名、性别、工作状态等信息
    consecutiveNegative: 0 // 添加连续消极想法计数器
};

// 情绪类型列表
const emotionTypes = ['angry', 'sad', 'fear'];

// 性别类型列表
const genderTypes = ['male', 'female'];

// 英文名字列表
const names = {
    male: ['James', 'John', 'Robert', 'Michael', 'William', 
           'David', 'Richard', 'Thomas', 'Charles', 'Daniel', 
           'Matthew', 'Anthony', 'Mark', 'Steven', 'Andrew',
           'Kenneth', 'George', 'Paul', 'Jonathan', 'Christopher'],
    female: ['Mary', 'Jennifer', 'Linda', 'Elizabeth', 'Susan', 
             'Jessica', 'Sarah', 'Karen', 'Nancy', 'Lisa', 
             'Emma', 'Olivia', 'Sophia', 'Isabella', 'Mia',
             'Charlotte', 'Amelia', 'Harper', 'Evelyn', 'Abigail']
};

// 积极和消极想法库
const thoughts = {
    positive: [
        "今天的工作挑战让我成长",
        "解决问题是我的强项",
        "我能够高效完成任务",
        "团队合作让工作更轻松",
        "我的努力被同事认可",
        "每天都在提升自己的能力",
        "积极面对挑战才能进步",
        "保持专注能提高工作效率",
        "我为自己的工作成果感到自豪",
        "今天我可以做得更好",
        "我能应对各种工作压力",
        "我的贡献对公司很重要",
        "学习新技能让我充满热情",
        "我可以很好地平衡工作与休息",
        "良好的沟通能解决大部分问题"
    ],
    // 按情绪类型分类的消极想法
    negative: {
        anger: [
            "为什么总是我来做这些",
            "这个会议完全是浪费时间",
            "同事又在摸鱼而我在加班",
            "领导的决定毫无道理",
            "我的意见又被无视了",
            "凭什么他能升职我不行",
            "又有人打断我的工作",
            "这个客户太难缠了",
            "他们根本不尊重我的劳动",
            "年终奖肯定又没我的份",
            "工作量分配太不公平",
            "这破电脑怎么又卡了",
            "我受够这个团队了",
            "别再给我增加任务了",
            "谁又动了我的东西"
        ],
        sadness: [
            "我的能力不足以胜任",
            "努力了这么久却没有回报",
            "同事都不喜欢和我交流",
            "我好像拖团队后腿了",
            "又一个周末被工作占据",
            "我的建议从来不被采纳",
            "没人理解我的压力有多大",
            "这份工作毫无意义",
            "我永远赶不上别人的进度",
            "辛苦做的项目被取消了",
            "感觉自己被孤立了",
            "我的职业生涯毫无亮点",
            "别人都在进步只有我原地踏步",
            "失去了工作的热情",
            "我的未来在哪里"
        ],
        fear: [
            "今天的任务完不成会被批评",
            "如果这个项目失败怎么办",
            "我会不会是下一个被裁员的",
            "新来的同事会取代我吗",
            "领导突然要见我是出事了吗",
            "绩效考核肯定过不了",
            "我跟不上团队的节奏",
            "这个错误会害我丢掉工作",
            "我会被调到不喜欢的部门吧",
            "客户会投诉我的工作吗",
            "我的能力会被淘汰吗",
            "演讲时会不会紧张到说不出话",
            "同事都在背后议论我吧",
            "我的决定会导致严重后果吗",
            "如果我生病了工作怎么办"
        ]
    }
};

// 情绪相关事件数据
const emotionEvents = {
    anger: [
        "地铁挤成饺子",
        "连续上了10天班",
        "网购买到假货"
    ],
    sadness: [
        "和情侣床头吵架了",
        "昨晚一个人过生日",
        "养的电子宠物饿死了"
    ],
    fear: [
        "听说公司要裁员",
        "信用卡刷爆了",
        "手机电量低于80%"
    ]
};

// DOM元素
const gameArea = document.querySelector('.game-area');
const restartButton = document.getElementById('restart-button');
const statusValue = document.querySelector('.status-value');
const moodProgress = document.getElementById('mood-progress');
const gameMessage = document.getElementById('game-message');
const elevatorProgress = document.getElementById('elevator-progress');
const elevatorFloorMarker = document.getElementById('elevator-current-floor');
const startScreen = document.getElementById('start-screen');
const mainStartButton = document.getElementById('main-start-button');
const characterNameElement = document.getElementById('character-name');
const currentRoundElement = document.getElementById('current-round');
const totalRoundsElement = document.getElementById('total-rounds');
const gameProgressElement = document.getElementById('game-progress');
const summaryScreen = document.getElementById('summary-screen');
const resultsContainer = document.getElementById('results-container');
const restartGameButton = document.getElementById('restart-game-button');

// 事件监听器
mainStartButton.addEventListener('click', hideStartScreenAndStartGame);
restartGameButton.addEventListener('click', resetGameCompletely);

// 计算游戏区域的安全区域（避免气泡生成在角色上方）
function getSafeArea() {
    const gameAreaRect = gameArea.getBoundingClientRect();
    
    // 使用固定的排除区域百分比，不再基于屏幕比例动态调整
    const bottomExcludePercent = 0.5; // 固定排除底部50%的区域
    
    const safeArea = {
        width: gameAreaRect.width,
        height: gameAreaRect.height,
        // 限制生成区域，避开底部的角色图片区域
        bottomExcluded: gameAreaRect.height * bottomExcludePercent
    };
    
    gameState.safeAreaCalculated = true;
    return safeArea;
}

// 更新工作状态值显示
function updateMoodDisplay() {
    // 确保工作状态值在0-100之间
    gameState.workMoodValue = Math.max(0, Math.min(100, gameState.workMoodValue));
    
    // 更新UI显示
    statusValue.textContent = `${Math.round(gameState.workMoodValue)}%`;
    moodProgress.style.width = `${gameState.workMoodValue}%`;
    
    // 根据工作状态值改变进度条颜色
    if (gameState.workMoodValue < 30) {
        moodProgress.style.background = 'linear-gradient(90deg, #f44336, #ff9800)';
    } else if (gameState.workMoodValue < 60) {
        moodProgress.style.background = 'linear-gradient(90deg, #ff9800, #ffc107)';
    } else {
        moodProgress.style.background = 'linear-gradient(90deg, #4caf50, #8bc34a)';
    }
    
    // 当工作状态大于80%时移除情绪状态
    if (gameState.workMoodValue > 80 && gameState.emotionState) {
        gameState.emotionState = null;
        const emotionImage = document.getElementById('emotion-image');
        emotionImage.style.display = 'none';
    }
    
    // 工作状态降至0时游戏继续
    if (gameState.workMoodValue <= 0) {
        return;
    }
}

// 创建思想气泡
function createThoughtBubble() {
    // 如果游戏不在运行状态或已达到最大气泡数，则不创建
    if (!gameState.running || gameState.activeBubbles >= gameState.maxBubbles) {
        return;
    }
    
    // 确保安全区域已计算
    if (!gameState.safeAreaCalculated) {
        getSafeArea();
    }
    
    // 决定是积极想法还是消极想法
    // 检查是否已有两个连续的消极想法
    let isPositive;
    if (gameState.consecutiveNegative >= 2) {
        // 强制生成积极想法
        isPositive = true;
        // 重置连续消极计数器
        gameState.consecutiveNegative = 0;
    } else {
        // 正常随机判断
        isPositive = Math.random() > 0.6; // 60%几率为消极想法
        
        // 如果生成的是积极想法，重置连续消极计数器
        if (isPositive) {
            gameState.consecutiveNegative = 0;
        } else {
            // 增加连续消极计数器
            gameState.consecutiveNegative++;
        }
    }
    
    // 根据是否为积极想法和当前情绪状态选择相应的想法库
    let thoughtText;
    if (isPositive) {
        // 积极想法从统一的库中选择
        const thoughtsArray = thoughts.positive;
        thoughtText = thoughtsArray[Math.floor(Math.random() * thoughtsArray.length)];
    } else {
        // 消极想法根据当前情绪状态选择
        let thoughtsArray;
        if (gameState.emotionState === 'anger') {
            thoughtsArray = thoughts.negative.anger;
        } else if (gameState.emotionState === 'sadness') {
            thoughtsArray = thoughts.negative.sadness;
        } else if (gameState.emotionState === 'fear') {
            thoughtsArray = thoughts.negative.fear;
        } else {
            // 如果没有明确的情绪状态，随机选择一种
            const emotionTypes = ['anger', 'sadness', 'fear'];
            const randomEmotion = emotionTypes[Math.floor(Math.random() * emotionTypes.length)];
            thoughtsArray = thoughts.negative[randomEmotion];
        }
        thoughtText = thoughtsArray[Math.floor(Math.random() * thoughtsArray.length)];
    }
    
    // 创建气泡元素
    const bubble = document.createElement('div');
    bubble.className = `thought-bubble`; // 移除积极/消极的类，使外观一致
    bubble.textContent = thoughtText;
    
    // 计算气泡尺寸（根据文本长度和设备屏幕大小调整）
    const screenWidth = window.innerWidth;
    const maxWidth = Math.min(screenWidth * 0.6, 200); // 最大宽度为屏幕宽度的60%或200px
    const bubbleWidth = Math.min(Math.max(150, thoughtText.length * 8), maxWidth);
    const bubbleHeight = Math.min(60, Math.max(40, Math.ceil(thoughtText.length / 20) * 20));
    
    // 获取安全区域
    const safeArea = getSafeArea();
    
    // 设置气泡在游戏区域内的随机位置，避开底部区域
    const maxLeft = safeArea.width - bubbleWidth;
    const maxTop = safeArea.height - safeArea.bottomExcluded - bubbleHeight;
    
    // 确保有足够的空间放置气泡
    if (maxLeft <= 0 || maxTop <= 0) {
        return;
    }
    
    const leftPosition = Math.random() * maxLeft;
    const topPosition = Math.random() * maxTop;
    
    bubble.style.left = `${leftPosition}px`;
    bubble.style.top = `${topPosition}px`;
    
    // 随机速度和方向
    // 在移动设备上降低速度系数，使游戏更易于操作
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const baseFactor = isMobile ? 0.8 : 1.2;
    const speedVariation = 0.8;
    
    // 确保气泡至少有一定的移动速度
    let dx = (Math.random() - 0.5) * speedVariation;
    let dy = (Math.random() - 0.5) * speedVariation;
    
    // 确保气泡不会静止或移动太慢
    if (Math.abs(dx) < 0.2) dx = dx > 0 ? 0.2 : -0.2;
    if (Math.abs(dy) < 0.2) dy = dy > 0 ? 0.2 : -0.2;
    
    dx *= baseFactor;
    dy *= baseFactor;
    
    // 存储气泡数据
    const bubbleData = {
        element: bubble,
        type: isPositive ? 'positive' : 'negative', // 在数据中仍保留类型信息
        x: leftPosition,
        y: topPosition,
        dx: dx,
        dy: dy,
        width: bubbleWidth,
        height: bubbleHeight
    };
    
    // 添加到气泡数组
    gameState.bubbles.push(bubbleData);
    
    // 点击事件处理
    bubble.addEventListener('click', () => {
        // 如果点击的是积极想法，添加视觉反馈
        if (isPositive) {
            // 人物和表情图片抖动
            const characterImage = document.querySelector('.character-image');
            const emotionImage = document.getElementById('emotion-image');
            
            // 移除之前可能存在的动画类，以确保动画重新触发
            characterImage.classList.remove('character-shake');
            emotionImage.classList.remove('character-shake');
            
            // 触发重排以重置动画
            void characterImage.offsetWidth;
            void emotionImage.offsetWidth;
            
            // 添加抖动动画类
            characterImage.classList.add('character-shake');
            if (gameState.emotionState) {
                emotionImage.classList.add('character-shake');
            }
            
            // 气泡红色闪烁
            bubble.classList.add('bubble-flash');
            
            // 设置定时器移除动画类
            setTimeout(() => {
                characterImage.classList.remove('character-shake');
                emotionImage.classList.remove('character-shake');
                
                // 更新计数
                gameState.activePositiveBubbles--;
                
                // 移除气泡
                bubble.remove();
                gameState.activeBubbles--;
                
                // 从数组中移除气泡
                const index = gameState.bubbles.findIndex(b => b.element === bubble);
                if (index !== -1) {
                    gameState.bubbles.splice(index, 1);
                }
            }, 400);
        } else {
            // 消极气泡直接移除
            // 更新计数
            gameState.activeNegativeBubbles--;
            
            // 移除气泡
            bubble.remove();
            gameState.activeBubbles--;
            
            // 从数组中移除气泡
            const index = gameState.bubbles.findIndex(b => b.element === bubble);
            if (index !== -1) {
                gameState.bubbles.splice(index, 1);
            }
        }
    });
    
    // 将气泡添加到游戏区域
    gameArea.appendChild(bubble);
    gameState.activeBubbles++;
    
    // 更新积极/消极气泡计数
    if (isPositive) {
        gameState.activePositiveBubbles++;
    } else {
        gameState.activeNegativeBubbles++;
    }
}

// 移动气泡并处理边缘碰撞
function moveBubbles() {
    if (!gameState.running) return;
    
    // 确保安全区域已计算
    if (!gameState.safeAreaCalculated) {
        getSafeArea();
    }
    
    const safeArea = getSafeArea();
    const areaWidth = safeArea.width;
    const areaHeight = safeArea.height - safeArea.bottomExcluded;
    
    // 如果游戏区域太小，暂停气泡移动
    if (areaWidth <= 0 || areaHeight <= 0) {
        return;
    }
    
    gameState.bubbles.forEach(bubble => {
        // 更新位置
        bubble.x += bubble.dx;
        bubble.y += bubble.dy;
        
        // 检测边界碰撞并反弹
        if (bubble.x <= 0 || bubble.x + bubble.width >= areaWidth) {
            bubble.dx = -bubble.dx; // 水平反弹
            
            // 添加一些随机性，使反弹更自然
            bubble.dx += (Math.random() - 0.5) * 0.2;
            
            // 确保不会卡在边界
            if (bubble.x <= 0) bubble.x = 1;
            if (bubble.x + bubble.width >= areaWidth) bubble.x = areaWidth - bubble.width - 1;
        }
        
        if (bubble.y <= 0 || bubble.y + bubble.height >= areaHeight) {
            bubble.dy = -bubble.dy; // 垂直反弹
            
            // 添加一些随机性，使反弹更自然
            bubble.dy += (Math.random() - 0.5) * 0.2;
            
            // 确保不会卡在边界
            if (bubble.y <= 0) bubble.y = 1;
            if (bubble.y + bubble.height >= areaHeight) bubble.y = areaHeight - bubble.height - 1;
        }
        
        // 确保速度不会太快或太慢
        // 在移动设备上降低最大速度
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const maxSpeed = isMobile ? 1.8 : 2.5;
        const minSpeed = 0.5;
        
        if (Math.abs(bubble.dx) > maxSpeed) {
            bubble.dx = bubble.dx > 0 ? maxSpeed : -maxSpeed;
        } else if (Math.abs(bubble.dx) < minSpeed) {
            bubble.dx = bubble.dx > 0 ? minSpeed : -minSpeed;
        }
        
        if (Math.abs(bubble.dy) > maxSpeed) {
            bubble.dy = bubble.dy > 0 ? maxSpeed : -maxSpeed;
        } else if (Math.abs(bubble.dy) < minSpeed) {
            bubble.dy = bubble.dy > 0 ? minSpeed : -minSpeed;
        }
        
        // 更新DOM元素位置
        bubble.element.style.left = `${bubble.x}px`;
        bubble.element.style.top = `${bubble.y}px`;
    });
}

// 定时更新工作状态值，基于当前场上的积极/消极想法数量
function updateThoughtsEffect() {
    if (!gameState.running) return;
    
    // 积极想法每秒+2，消极想法每秒-1
    gameState.workMoodValue += gameState.activePositiveBubbles*2;
    gameState.workMoodValue -= gameState.activeNegativeBubbles;
    
    // 更新显示
    updateMoodDisplay();
}

// 更新电梯楼层显示
function updateElevatorDisplay() {
    // 计算进度百分比
    const progress = (gameState.currentFloor - 1) / (gameState.totalFloors - 1) * 100;
    
    // 更新电梯进度条
    elevatorProgress.style.height = `${progress}%`;
    
    // 更新楼层指示器位置
    elevatorFloorMarker.style.bottom = `${progress}%`;
    
    // 更新楼层文本
    elevatorFloorMarker.textContent = `${Math.floor(gameState.currentFloor)}F`;
    
    // 如果到达公司楼层，结束游戏
    if (gameState.currentFloor >= gameState.totalFloors) {
        // 检查工作状态值是否大于等于90%
        const success = gameState.workMoodValue >= 80;
        endGame(success);
    }
}

// 电梯上升函数
function elevatorRise() {
    if (!gameState.running) return;
    
    // 计算每次更新增加的楼层
    const floorIncrement = (gameState.totalFloors - 1) / (gameState.gameTime / 100); // 每100毫秒更新一次
    gameState.currentFloor += floorIncrement;
    
    // 更新电梯显示
    updateElevatorDisplay();
}

// 隐藏开始界面并开始游戏
function hideStartScreenAndStartGame() {
    // 重置游戏状态
    gameState.currentRound = 1;
    gameState.roundResults = [];
    
    // 更新轮次显示
    currentRoundElement.textContent = gameState.currentRound;
    totalRoundsElement.textContent = gameState.totalRounds;
    
    // 显示游戏进度
    gameProgressElement.style.display = 'block';
    
    // 隐藏开始界面，确保背景图片可见
    startScreen.style.opacity = '0';
    
    // 确保角色和表情图片初始不可见
    const characterImage = document.querySelector('.character-image');
    const emotionImage = document.getElementById('emotion-image');
    characterImage.style.opacity = '0';
    characterImage.style.transform = 'translateY(100%)';
    emotionImage.style.display = 'none';
    
    setTimeout(() => {
        startScreen.style.display = 'none';
        
        // 显示背景，然后启动游戏
        const backgroundImage = document.querySelector('.background-image');
        backgroundImage.style.opacity = '1';
        
        // 短暂延迟后开始游戏，给背景图片足够的时间显示
        setTimeout(() => {
            startGame();
        }, 200);
    }, 500);
}

// 获取随机情绪事件
function getRandomEmotionEvent(emotion) {
    const events = emotionEvents[emotion];
    const randomIndex = Math.floor(Math.random() * events.length);
    return events[randomIndex];
}

// 修复开始游戏函数
function startGame() {
    // 重置游戏状态
    gameState.running = false; // 先将游戏状态设置为非运行，等动画结束后再开始
    gameState.workMoodValue = 60;
    gameState.activeBubbles = 0;
    gameState.activePositiveBubbles = 0;
    gameState.activeNegativeBubbles = 0;
    gameState.bubbles = []; // 清空气泡数组
    gameState.currentFloor = 1; // 重置当前楼层
    gameState.consecutiveNegative = 0; // 重置连续消极计数器
    
    // 随机选择性别
    const randomGenderIndex = Math.floor(Math.random() * genderTypes.length);
    gameState.gender = genderTypes[randomGenderIndex];
    
    // 随机选择角色名字
    const namesArray = names[gameState.gender];
    const randomNameIndex = Math.floor(Math.random() * namesArray.length);
    gameState.characterName = namesArray[randomNameIndex];
    
    // 更新名字显示
    characterNameElement.textContent = gameState.characterName;
    characterNameElement.style.display = 'block';
    
    // 加载对应性别的角色图片并准备入场动画
    const characterImage = document.querySelector('.character-image');
    characterImage.src = `artRes/body_${gameState.gender}.png`;
    characterImage.style.opacity = '0';
    characterImage.style.transform = 'translateY(100%)';
    
    // 随机选择一种情绪状态
    const emotions = ['anger', 'sadness', 'fear'];
    const randomEmotionIndex = Math.floor(Math.random() * emotions.length);
    gameState.emotionState = emotions[randomEmotionIndex];
    
    // 获取并显示情绪事件
    const emotionEvent = getRandomEmotionEvent(gameState.emotionState);
    const emotionEventElement = document.getElementById('emotion-event');
    emotionEventElement.textContent = emotionEvent;
    
    // 更新情绪事件元素的颜色类
    emotionEventElement.className = 'emotion-event'; // 清除之前的类
    emotionEventElement.classList.add(gameState.emotionState); // 添加当前情绪类
    
    // 设置情绪表情图片（根据当前性别和情绪）
    const emotionImage = document.getElementById('emotion-image');
    const emotionMapping = {
        'anger': 'angry',
        'sadness': 'sad',
        'fear': 'fear'
    };
    emotionImage.src = `artRes/face_${gameState.gender}_${emotionMapping[gameState.emotionState]}.png`;
    emotionImage.style.display = 'block';
    emotionImage.style.opacity = '0';
    emotionImage.style.transform = 'translateY(100%)';
    
    // 初始化电梯显示
    updateElevatorDisplay();
    
    // 清空游戏消息
    gameMessage.textContent = '';
    
    // 隐藏重新开始按钮
    restartButton.style.display = 'none';
    
    // 清空游戏区域中的气泡
    const bubbles = gameArea.querySelectorAll('.thought-bubble');
    bubbles.forEach(bubble => bubble.remove());
    
    // 更新工作状态显示
    updateMoodDisplay();
    
    // 延迟一小段时间后开始入场动画
    setTimeout(() => {
        // 执行入场动画
        characterImage.classList.add('character-enter');
        emotionImage.classList.add('character-enter');
        
        // 动画结束后开始游戏逻辑
        setTimeout(() => {
            // 移除动画类
            characterImage.classList.remove('character-enter');
            emotionImage.classList.remove('character-enter');
            
            // 重置样式
            characterImage.style.opacity = '1';
            characterImage.style.transform = 'translateY(0)';
            emotionImage.style.opacity = '1';
            emotionImage.style.transform = 'translateY(0)';
            
            // 设置游戏运行状态为true
            gameState.running = true;
                
            // 开始生成气泡
            gameState.bubbleInterval = setInterval(createThoughtBubble, gameState.spawnRate);
            
            // 启动思想影响计时器，每秒更新一次
            gameState.thoughtsInterval = setInterval(updateThoughtsEffect, 1000);
            
            // 启动气泡移动计时器，每50毫秒更新一次
            gameState.moveInterval = setInterval(moveBubbles, 50);
            
            // 启动电梯上升计时器，每100毫秒更新一次
            gameState.elevatorInterval = setInterval(elevatorRise, 100);
            
        }, 500); // 入场动画持续时间
    }, 100); // 短暂延迟，确保DOM已更新
}

// 结束游戏
function endGame(isWin) {
    gameState.running = false;
    clearInterval(gameState.bubbleInterval);
    clearInterval(gameState.thoughtsInterval);
    clearInterval(gameState.moveInterval); // 停止气泡移动
    clearInterval(gameState.elevatorInterval); // 停止电梯上升
    
    // 存储当前轮次的游戏结果
    storeRoundResult(isWin);
    
    // 不再显示游戏消息和按钮
    gameMessage.textContent = '';
    restartButton.style.display = 'none';

    // 为所有气泡添加淡出动画
    const bubbles = document.querySelectorAll('.thought-bubble');
    bubbles.forEach(bubble => {
        bubble.style.transition = 'opacity 0.5s ease';
        bubble.style.opacity = '0';
    });

    // 等待气泡淡出后再执行人物出场动画
    setTimeout(() => {
        // 清除所有气泡
        bubbles.forEach(bubble => bubble.remove());
        gameState.bubbles = [];
        gameState.activeBubbles = 0;
        gameState.activePositiveBubbles = 0;
        gameState.activeNegativeBubbles = 0;

        // 执行出场动画
        const characterImage = document.querySelector('.character-image');
        const emotionImage = document.getElementById('emotion-image');
        
        // 添加出场动画类
        characterImage.classList.add('character-exit');
        
        // 如果情绪状态存在，也为情绪添加出场动画
        if (gameState.emotionState) {
            emotionImage.classList.add('character-exit');
        }
        
        // 动画结束后进入下一轮或结束游戏
        setTimeout(() => {
            // 移除动画类
            characterImage.classList.remove('character-exit');
            emotionImage.classList.remove('character-exit');
            
            // 重置样式以便下一次入场
            characterImage.style.opacity = '0';
            characterImage.style.transform = 'translateY(100%)';
            emotionImage.style.opacity = '0';
            emotionImage.style.transform = 'translateY(100%)';
            
            // 如果是胜利，确保移除情绪状态
            if (isWin) {
                gameState.emotionState = null;
                emotionImage.style.display = 'none';
            }
            
            // 短暂延迟后进入下一轮或显示结果
            setTimeout(() => {
                if (gameState.currentRound >= gameState.totalRounds) {
                    showGameResults();
                } else {
                    nextRound();
                }
            }, 300);
        }, 500); // 出场动画持续时间
    }, 500); // 等待气泡淡出的时间
}

// 重新开始游戏
function restartGame() {
    // 清除所有计时器
    clearInterval(gameState.bubbleInterval);
    clearInterval(gameState.thoughtsInterval);
    clearInterval(gameState.moveInterval);
    clearInterval(gameState.elevatorInterval);
    
    // 重置情绪状态
    gameState.emotionState = null;
    const emotionImage = document.getElementById('emotion-image');
    emotionImage.style.display = 'none';
    
    // 重新开始游戏
    startGame();
}

// 存储当前轮次的游戏结果
function storeRoundResult(isWin) {
    const result = {
        round: gameState.currentRound,
        name: gameState.characterName,
        gender: gameState.gender,
        emotion: gameState.emotionState,
        workMoodValue: Math.round(gameState.workMoodValue),
        success: isWin
    };
    
    gameState.roundResults.push(result);
}

// 展示游戏结果
function showGameResults() {
    // 清空之前的结果
    resultsContainer.innerHTML = '';
    
    // 计算总体成功率
    const totalRounds = gameState.roundResults.length;
    const successRounds = gameState.roundResults.filter(result => result.success).length;
    const successRate = Math.round((successRounds / totalRounds) * 100);
    
    // 添加总体成功率
    const summaryHeader = document.createElement('div');
    summaryHeader.className = 'result-summary';
    summaryHeader.innerHTML = `<div>本周成功率: <span class="${successRate >= 60 ? 'success' : 'fail'}">${successRate}%</span></div>`;
    resultsContainer.appendChild(summaryHeader);
    
    // 为每轮游戏添加更紧凑的结果项
    gameState.roundResults.forEach(result => {
        const resultItem = document.createElement('div');
        resultItem.className = 'result-item';
        
        const statusClass = result.success ? 'success' : 'fail';
        const statusText = result.success ? '良好' : '不佳';
        const emotion = result.emotion ? `(${result.emotion === 'anger' ? '愤怒' : result.emotion === 'sadness' ? '悲伤' : '恐惧'})` : '';
        
        resultItem.innerHTML = `
            <div class="name">第${result.round}天: ${result.name} ${emotion}</div>
            <div class="status ${statusClass}">${statusText} ${result.workMoodValue}%</div>
        `;
        
        resultsContainer.appendChild(resultItem);
    });
    
    // 显示结算界面
    summaryScreen.style.display = 'flex';
    summaryScreen.style.opacity = '1';
}

// 开始下一轮游戏
function nextRound() {
    // 如果已经完成所有轮次，显示结果
    if (gameState.currentRound >= gameState.totalRounds) {
        showGameResults();
        return;
    }
    
    // 更新当前轮次
    gameState.currentRound++;
    document.getElementById('current-round').textContent = gameState.currentRound;
    
    // 重置游戏状态
    gameState.running = false; // 先将游戏状态设置为非运行，等动画结束后再开始
    gameState.workMoodValue = 60;
    gameState.activeBubbles = 0;
    gameState.activePositiveBubbles = 0;
    gameState.activeNegativeBubbles = 0;
    gameState.bubbles = []; // 清空气泡数组
    gameState.currentFloor = 1; // 重置当前楼层
    gameState.consecutiveNegative = 0; // 重置连续消极计数器
    
    // 随机选择性别
    const randomGenderIndex = Math.floor(Math.random() * genderTypes.length);
    gameState.gender = genderTypes[randomGenderIndex];
    
    // 随机选择角色名字
    const namesArray = names[gameState.gender];
    const randomNameIndex = Math.floor(Math.random() * namesArray.length);
    gameState.characterName = namesArray[randomNameIndex];
    
    // 更新名字显示
    characterNameElement.textContent = gameState.characterName;
    characterNameElement.style.display = 'block';
    
    // 加载对应性别的角色图片并准备入场动画
    const characterImage = document.querySelector('.character-image');
    characterImage.src = `artRes/body_${gameState.gender}.png`;
    characterImage.style.opacity = '0';
    characterImage.style.transform = 'translateY(100%)';
    
    // 随机选择一种情绪状态
    const emotions = ['anger', 'sadness', 'fear'];
    const randomEmotionIndex = Math.floor(Math.random() * emotions.length);
    gameState.emotionState = emotions[randomEmotionIndex];
    
    // 获取并显示情绪事件
    const emotionEvent = getRandomEmotionEvent(gameState.emotionState);
    const emotionEventElement = document.getElementById('emotion-event');
    emotionEventElement.textContent = emotionEvent;
    
    // 更新情绪事件元素的颜色类
    emotionEventElement.className = 'emotion-event'; // 清除之前的类
    emotionEventElement.classList.add(gameState.emotionState); // 添加当前情绪类
    
    // 设置情绪表情图片（根据当前性别和情绪）
    const emotionImage = document.getElementById('emotion-image');
    const emotionMapping = {
        'anger': 'angry',
        'sadness': 'sad',
        'fear': 'fear'
    };
    emotionImage.src = `artRes/face_${gameState.gender}_${emotionMapping[gameState.emotionState]}.png`;
    emotionImage.style.display = 'block';
    emotionImage.style.opacity = '0';
    emotionImage.style.transform = 'translateY(100%)';
    
    // 初始化电梯显示
    updateElevatorDisplay();
    
    // 清空游戏消息
    gameMessage.textContent = '';
    
    // 隐藏重新开始按钮
    restartButton.style.display = 'none';
    
    // 清空游戏区域中的气泡
    const bubbles = gameArea.querySelectorAll('.thought-bubble');
    bubbles.forEach(bubble => bubble.remove());
    
    // 更新工作状态显示
    updateMoodDisplay();
    
    // 延迟一小段时间后开始入场动画
    setTimeout(() => {
        // 执行入场动画
        characterImage.classList.add('character-enter');
        emotionImage.classList.add('character-enter');
        
        // 动画结束后开始游戏逻辑
        setTimeout(() => {
            // 移除动画类
            characterImage.classList.remove('character-enter');
            emotionImage.classList.remove('character-enter');
            
            // 重置样式
            characterImage.style.opacity = '1';
            characterImage.style.transform = 'translateY(0)';
            emotionImage.style.opacity = '1';
            emotionImage.style.transform = 'translateY(0)';
            
            // 设置游戏运行状态为true
            gameState.running = true;
                
            // 开始生成气泡
            gameState.bubbleInterval = setInterval(createThoughtBubble, gameState.spawnRate);
            
            // 启动思想影响计时器，每秒更新一次
            gameState.thoughtsInterval = setInterval(updateThoughtsEffect, 1000);
            
            // 启动气泡移动计时器，每50毫秒更新一次
            gameState.moveInterval = setInterval(moveBubbles, 50);
            
            // 启动电梯上升计时器，每100毫秒更新一次
            gameState.elevatorInterval = setInterval(elevatorRise, 100);
            
            // 随着时间增加难度
            setTimeout(() => {
                if (gameState.running) {
                    gameState.spawnRate = 1200; // 1分钟后加快生成速度
                    clearInterval(gameState.bubbleInterval);
                    gameState.bubbleInterval = setInterval(createThoughtBubble, gameState.spawnRate);
                }
            }, 60000);
            
            setTimeout(() => {
                if (gameState.running) {
                    gameState.spawnRate = 1000; // 2分钟后再次加快生成速度
                    clearInterval(gameState.bubbleInterval);
                    gameState.bubbleInterval = setInterval(createThoughtBubble, gameState.spawnRate);
                }
            }, 120000);
        }, 500); // 入场动画持续时间
    }, 100); // 短暂延迟，确保DOM已更新
}

// 完全重置游戏（全新开始）
function resetGameCompletely() {
    // 隐藏结算界面
    summaryScreen.style.opacity = '0';
    setTimeout(() => {
        summaryScreen.style.display = 'none';
        
        // 重置游戏状态
        gameState.currentRound = 1;
        gameState.roundResults = [];
        
        // 更新轮次显示
        currentRoundElement.textContent = gameState.currentRound;
        
        // 显示开始界面
        startScreen.style.opacity = '1';
        startScreen.style.display = 'flex';
    }, 500);
}

// 页面加载时初始化
window.addEventListener('load', () => {
    // 显示开始界面
    startScreen.style.display = 'flex';
    
    // 隐藏角色名字，直到游戏开始
    characterNameElement.style.display = 'none';
    
    // 隐藏游戏进度，直到游戏开始
    gameProgressElement.style.display = 'none';
    
    // 确保人物和表情图片初始不可见
    const characterImage = document.querySelector('.character-image');
    const emotionImage = document.getElementById('emotion-image');
    characterImage.style.opacity = '0';
    characterImage.style.transform = 'translateY(100%)';
    emotionImage.style.display = 'none';
    
    // 调整初始界面
    updateMoodDisplay();
    
    // 初始化电梯显示
    updateElevatorDisplay();
    
    // 初始计算安全区域
    getSafeArea();
    
    // 监听窗口大小变化，重新计算安全区域
    window.addEventListener('resize', () => {
        // 重置安全区域计算标志
        gameState.safeAreaCalculated = false;
        const safeArea = getSafeArea();
        
        if (gameState.running) {
            // 如果游戏正在运行，调整所有气泡位置
            gameState.bubbles.forEach(bubble => {
                if (bubble.x + bubble.width > safeArea.width) {
                    bubble.x = safeArea.width - bubble.width - 1;
                }
                if (bubble.y + bubble.height > safeArea.height - safeArea.bottomExcluded) {
                    bubble.y = safeArea.height - safeArea.bottomExcluded - bubble.height - 1;
                }
                bubble.element.style.left = `${bubble.x}px`;
                bubble.element.style.top = `${bubble.y}px`;
            });
        }
    });
    
    // 处理触摸设备上的点击事件
    if ('ontouchstart' in window) {
        // 在移动设备上稍微增加目标范围，使气泡更容易点击
        const style = document.createElement('style');
        style.textContent = `
            .thought-bubble {
                padding: 12px 18px;
            }
        `;
        document.head.appendChild(style);
    }
}); 