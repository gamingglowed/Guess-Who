var words = {
    food: [
        "Pizza","Burger","Sushi","Ice Cream","Fried Chicken",
        "Noodles","Pancakes","Watermelon","Spaghetti","Tacos",
        "Chocolate","Popcorn","Donuts","French Fries","Pasta",
        "Cake","Hot Dog","Mango","Apple","Banana",
        "Strawberry","Cupcake","Cookie","Sandwich","Steak",
        "Salad","Soup","Curry","Dumplings","Waffles",
        "Brownie","Cheesecake","Pudding","Macaroni","Lasagna",
        "Sausage","Burrito","Nachos","Toast","Eggs",
        "Rice","Popiah","Satay","Ramen","Tempura",
        "Kebab","Corn","Pineapple","Orange","Grapes",
        "Blueberry","Garlic Bread","Muffin","Pretzel",
        "Marshmallow","Yogurt","Cheese","Pancake"
    ],

    animals: [
        "Dog","Cat","Elephant","Penguin","Tiger",
        "Dolphin","Rabbit","Monkey","Lion","Giraffe",
        "Koala","Panda","Bear","Wolf","Fox",
        "Horse","Cow","Pig","Chicken","Duck",
        "Eagle","Owl","Parrot","Flamingo","Peacock",
        "Shark","Whale","Octopus","Jellyfish","Crab",
        "Turtle","Crocodile","Snake","Lizard","Frog",
        "Butterfly","Bee","Ant","Spider","Scorpion",
        "Kangaroo","Zebra","Hippopotamus","Rhinoceros","Camel",
        "Deer","Goat","Sheep","Donkey","Squirrel",
        "Hamster","Mouse","Bat","Otter","Seal",
        "Sloth","Chameleon","Gorilla","Cheetah","Leopard"
    ],

    places: [
        "Beach","School","Airport","Cinema","Hospital",
        "Zoo","Library","Restaurant","Shopping Mall",
        "Supermarket","Park","Hotel","Museum","Stadium",
        "Gym","Swimming Pool","Train Station","Bus Station",
        "Amusement Park","Water Park","Aquarium","Farm",
        "Forest","Mountain","Island","City","Village",
        "Cafe","Bakery","Market","Bank","Post Office",
        "Police Station","Fire Station","University","Office",
        "Factory","Theatre","Concert Hall","Castle","Bridge",
        "Harbour","Lighthouse","Desert","Cave","Jungle",
        "Waterfall","River","Lake","Playground","Arcade",
        "Bowling Alley","Ice Rink","Camping Site","Pet Shop",
        "Bookstore","Toy Store","Garden"
    ]
};


/* =====================================================
   GAME STATE
===================================================== */

var players = [];
var activePlayers = [];
var eliminatedPlayers = [];

var imposterIndex = -1;
var secretWord = "";

var currentPlayer = 0;

var roundNumber = 1;

var startingPlayerIndex = -1;
var previousStartingPlayerIndex = -1;

var votes = {};
var votersRemaining = [];

var currentVoter = -1;
var selectedVote = null;

var voteResultType = "";

var gameStarted = false;


/* =====================================================
   SCREEN
===================================================== */

function showScreen(id) {

    var screens =
        document.querySelectorAll(".screen");

    for (var i = 0; i < screens.length; i++) {
        screens[i].classList.remove("active");
    }

    var screen =
        document.getElementById(id);

    if (screen) {
        screen.classList.add("active");
    }
}


/* =====================================================
   PLAYER DROPDOWN
===================================================== */

function createPlayerDropdown() {

    var dropdown =
        document.getElementById("playerDropdown");

    if (!dropdown) {
        return;
    }

    dropdown.innerHTML = "";

    for (var i = 3; i <= 12; i++) {

        var option =
            document.createElement("option");

        option.value = i;
        option.textContent =
            i + " players";

        dropdown.appendChild(option);
    }

    var count =
        document.getElementById("playerCount");

    if (count) {
        dropdown.value = count.value;
    }
}


/* =====================================================
   PLAYER NAMES
===================================================== */

function createNameInputs() {

    var countElement =
        document.getElementById("playerCount");

    var container =
        document.getElementById("nameInputs");

    if (!countElement || !container) {
        return;
    }

    var count =
        Number(countElement.value);

    if (count < 3) {
        count = 3;
    }

    if (count > 12) {
        count = 12;
    }

    countElement.value = count;

    var oldNames = [];

    for (var i = 1; i <= 12; i++) {

        var oldInput =
            document.getElementById(
                "playerName" + i
            );

        if (oldInput) {
            oldNames[i - 1] =
                oldInput.value;
        }
    }

    container.innerHTML = "";

    for (var j = 1; j <= count; j++) {

        var row =
            document.createElement("div");

        row.className =
            "name-row";

        var number =
            document.createElement("div");

        number.className =
            "name-number";

        number.textContent =
            j;

        var input =
            document.createElement("input");

        input.type = "text";

        input.id =
            "playerName" + j;

        input.placeholder =
            "Player " + j;

        if (oldNames[j - 1]) {
            input.value =
                oldNames[j - 1];
        }

        row.appendChild(number);
        row.appendChild(input);

        container.appendChild(row);
    }

    var dropdown =
        document.getElementById(
            "playerDropdown"
        );

    if (dropdown) {
        dropdown.value = count;
    }
}


/* =====================================================
   PLAYER EVENTS
===================================================== */

var playerDropdown =
    document.getElementById(
        "playerDropdown"
    );

if (playerDropdown) {

    playerDropdown.addEventListener(
        "change",
        function () {

            var count =
                Number(this.value);

            document.getElementById(
                "playerCount"
            ).value = count;

            createNameInputs();
        }
    );
}


var playerCount =
    document.getElementById(
        "playerCount"
    );

if (playerCount) {

    playerCount.addEventListener(
        "change",
        function () {

            var count =
                Number(this.value);

            if (count < 3) {
                count = 3;
            }

            if (count > 12) {
                count = 12;
            }

            this.value = count;

            createNameInputs();
        }
    );
}


/* =====================================================
   GET PLAYER NAMES
===================================================== */

function getPlayerNames() {

    var count =
        Number(
            document.getElementById(
                "playerCount"
            ).value
        );

    players = [];

    for (var i = 1; i <= count; i++) {

        var input =
            document.getElementById(
                "playerName" + i
            );

        var name = "";

        if (input) {
            name =
                input.value.trim();
        }

        if (name === "") {
            name =
                "Player " + i;
        }

        players.push(name);
    }
}


/* =====================================================
   CLEAR SECRET INFORMATION
===================================================== */

function clearSecretInformation() {

    var roleText =
        document.getElementById(
            "roleText"
        );

    var role =
        document.getElementById(
            "role"
        );

    var revealButton =
        document.getElementById(
            "revealButton"
        );

    var passButton =
        document.getElementById(
            "passButton"
        );

    if (roleText) {
        roleText.textContent = "";
        roleText.innerHTML = "";
    }

    if (role) {
        role.classList.add("hidden");
    }

    if (revealButton) {
        revealButton.style.display =
            "block";
    }

    if (passButton) {
        passButton.disabled = true;
    }
}


/* =====================================================
   CREATE NEW MATCH SECRET
===================================================== */

function createMatchSecret() {

    var categoryElement =
        document.getElementById(
            "category"
        );

    var category =
        categoryElement
            ? categoryElement.value
            : "food";

    var categoryWords =
        words[category];

    /*
       THIS HAPPENS ONLY ON A NEW MATCH.
    */

    secretWord =
        categoryWords[
            Math.floor(
                Math.random() *
                categoryWords.length
            )
        ];

    var randomPosition =
        Math.floor(
            Math.random() *
            activePlayers.length
        );

    imposterIndex =
        activePlayers[
            randomPosition
        ];
}


/* =====================================================
   START A COMPLETELY NEW MATCH
===================================================== */

function startGame() {

    getPlayerNames();

    if (players.length < 3) {

        alert(
            "You need at least 3 players."
        );

        return;
    }

    activePlayers = [];

    eliminatedPlayers = [];

    for (
        var i = 0;
        i < players.length;
        i++
    ) {
        activePlayers.push(i);
    }

    roundNumber = 1;

    startingPlayerIndex = -1;
    previousStartingPlayerIndex = -1;

    votes = {};
    votersRemaining = [];

    currentVoter = -1;
    selectedVote = null;

    voteResultType = "";

    gameStarted = true;

    /*
       NEW MATCH:
       new word + new imposter.
    */

    createMatchSecret();

    /*
       Secret reveal happens ONLY HERE.
    */

    startSecretReveal();
}


/* =====================================================
   SECRET REVEAL
===================================================== */

function startSecretReveal() {

    currentPlayer = 0;

    findNextActivePlayer();

    clearSecretInformation();

    if (
        currentPlayer >=
        players.length
    ) {

        beginRoundScreen();

        return;
    }

    updateRevealScreen();

    showScreen("reveal");
}


/* =====================================================
   FIND NEXT ACTIVE PLAYER
===================================================== */

function findNextActivePlayer() {

    while (
        currentPlayer < players.length &&
        activePlayers.indexOf(
            currentPlayer
        ) === -1
    ) {

        currentPlayer++;
    }
}


/* =====================================================
   REVEAL SCREEN
===================================================== */

function updateRevealScreen() {

    clearSecretInformation();

    var title =
        document.getElementById(
            "playerTitle"
        );

    if (
        title &&
        currentPlayer < players.length
    ) {

        title.textContent =
            players[currentPlayer];
    }
}


/* =====================================================
   SHOW SECRET
===================================================== */

function showRole() {

    var roleText =
        document.getElementById(
            "roleText"
        );

    if (!roleText) {
        return;
    }

    if (
        currentPlayer ===
        imposterIndex
    ) {

        roleText.innerHTML =
            '<span class="imposter-label">' +
            "YOU ARE THE IMPOSTER" +
            "</span>";

    } else {

        roleText.textContent =
            "THE WORD IS: " +
            secretWord;
    }

    var role =
        document.getElementById(
            "role"
        );

    if (role) {
        role.classList.remove("hidden");
    }

    var revealButton =
        document.getElementById(
            "revealButton"
        );

    if (revealButton) {
        revealButton.style.display =
            "none";
    }

    var passButton =
        document.getElementById(
            "passButton"
        );

    if (passButton) {
        passButton.disabled = false;
    }
}


/* =====================================================
   PASS PLAYER
===================================================== */

function nextPlayer() {

    var role =
        document.getElementById(
            "role"
        );

    /*
       Cannot pass without revealing.
    */

    if (
        role &&
        role.classList.contains("hidden")
    ) {
        return;
    }

    /*
       Destroy previous secret immediately.
    */

    clearSecretInformation();

    currentPlayer++;

    findNextActivePlayer();

    if (
        currentPlayer >=
        players.length
    ) {

        beginRoundScreen();

        return;
    }

    updateRevealScreen();
}


/* =====================================================
   ROUND START SCREEN
===================================================== */

function beginRoundScreen() {

    chooseStartingPlayer();

    var roundElement =
        document.getElementById(
            "roundNumber"
        );

    var starterElement =
        document.getElementById(
            "startingPlayer"
        );

    if (roundElement) {

        roundElement.textContent =
            String(roundNumber)
                .padStart(2, "0");
    }

    if (starterElement) {

        starterElement.textContent =
            players[
                startingPlayerIndex
            ];
    }

    showScreen("roundStart");
}


/* =====================================================
   CHOOSE STARTING PLAYER
===================================================== */

function chooseStartingPlayer() {

    var possible = [];

    for (
        var i = 0;
        i < activePlayers.length;
        i++
    ) {

        var index =
            activePlayers[i];

        if (
            index !==
            previousStartingPlayerIndex
        ) {

            possible.push(index);
        }
    }

    if (possible.length === 0) {

        possible =
            activePlayers.slice();
    }

    var normalPlayers = [];

    for (
        var j = 0;
        j < possible.length;
        j++
    ) {

        if (
            possible[j] !==
            imposterIndex
        ) {

            normalPlayers.push(
                possible[j]
            );
        }
    }

    /*
       80% normal player.
       20% imposter.
    */

    if (
        normalPlayers.length > 0 &&
        Math.random() < 0.8
    ) {

        startingPlayerIndex =
            normalPlayers[
                Math.floor(
                    Math.random() *
                    normalPlayers.length
                )
            ];

    } else {

        startingPlayerIndex =
            possible[
                Math.floor(
                    Math.random() *
                    possible.length
                )
            ];
    }

    previousStartingPlayerIndex =
        startingPlayerIndex;
}


/* =====================================================
   MEETING
===================================================== */

function startVoting() {

    if (!gameStarted) {
        return;
    }

    /*
       MEETING DOES NOT:
       - change word
       - change imposter
       - restore eliminated players
       - start a new match
    */

    votes = {};

    votersRemaining =
        activePlayers.slice();

    currentVoter = -1;
    selectedVote = null;

    showNextVoter();
}


/* =====================================================
   WHO ARE YOU?
===================================================== */

function showNextVoter() {

    if (
        votersRemaining.length === 0
    ) {

        calculateVotes();

        return;
    }

    var voterList =
        document.getElementById(
            "voterList"
        );

    if (!voterList) {
        return;
    }

    voterList.innerHTML = "";

    for (
        var i = 0;
        i < votersRemaining.length;
        i++
    ) {

        var index =
            votersRemaining[i];

        var button =
            document.createElement(
                "button"
            );

        button.className =
            "vote-player";

        button.innerHTML =
            '<span class="vote-number">' +
            (index + 1) +
            "</span>" +
            players[index];

        button.onclick =
            (function (playerIndex) {

                return function () {

                    selectVoter(
                        playerIndex
                    );
                };

            })(index);

        voterList.appendChild(
            button
        );
    }

    showScreen("whoAreYou");
}


/* =====================================================
   SELECT VOTER
===================================================== */

function selectVoter(index) {

    currentVoter = index;

    showVoteChoices();
}


/* =====================================================
   VOTE CHOICES
===================================================== */

function showVoteChoices() {

    var voterName =
        document.getElementById(
            "voterName"
        );

    if (voterName) {

        voterName.textContent =
            players[currentVoter];
    }

    var list =
        document.getElementById(
            "voteList"
        );

    if (!list) {
        return;
    }

    list.innerHTML = "";

    /*
       Only ACTIVE players can be voted for.
       You cannot vote yourself.
    */

    for (
        var i = 0;
        i < activePlayers.length;
        i++
    ) {

        var index =
            activePlayers[i];

        if (
            index ===
            currentVoter
        ) {
            continue;
        }

        var button =
            document.createElement(
                "button"
            );

        button.className =
            "vote-player";

        button.innerHTML =
            '<span class="vote-number">' +
            (index + 1) +
            "</span>" +
            players[index];

        button.onclick =
            (function (voteIndex) {

                return function () {

                    selectVote(
                        voteIndex
                    );
                };

            })(index);

        list.appendChild(button);
    }

    /*
       SKIP
    */

    var skip =
        document.createElement(
            "button"
        );

    skip.className =
        "vote-player skip-button";

    skip.textContent =
        "SKIP";

    skip.onclick =
        function () {

            selectVote("skip");
        };

    list.appendChild(skip);

    showScreen("voteChoice");
}


/* =====================================================
   SELECT VOTE
===================================================== */

function selectVote(choice) {

    selectedVote =
        choice;

    var confirmation =
        document.getElementById(
            "voteConfirmationText"
        );

    if (!confirmation) {
        return;
    }

    if (choice === "skip") {

        confirmation.textContent =
            players[currentVoter] +
            " chose SKIP.";

    } else {

        confirmation.textContent =
            players[currentVoter] +
            " voted for " +
            players[choice] +
            ".";
    }

    showScreen("voteConfirm");
}


/* =====================================================
   CANCEL VOTE
===================================================== */

function cancelVote() {

    selectedVote = null;

    showVoteChoices();
}


/* =====================================================
   CONFIRM VOTE
===================================================== */

function confirmVote() {

    if (
        currentVoter === -1 ||
        selectedVote === null
    ) {
        return;
    }

    votes[currentVoter] =
        selectedVote;

    votersRemaining =
        votersRemaining.filter(
            function (index) {

                return index !==
                    currentVoter;
            }
        );

    currentVoter = -1;
    selectedVote = null;

    showNextVoter();
}


/* =====================================================
   CALCULATE VOTES
===================================================== */

function calculateVotes() {

    var counts = {};

    var voteKeys =
        Object.keys(votes);

    for (
        var i = 0;
        i < voteKeys.length;
        i++
    ) {

        var vote =
            votes[voteKeys[i]];

        if (
            counts[vote] ===
            undefined
        ) {

            counts[vote] = 0;
        }

        counts[vote]++;
    }

    var keys =
        Object.keys(counts);

    if (keys.length === 0) {
        return;
    }

    var highest = 0;

    for (
        var j = 0;
        j < keys.length;
        j++
    ) {

        if (
            counts[keys[j]] >
            highest
        ) {

            highest =
                counts[keys[j]];
        }
    }

    var winners = [];

    for (
        var k = 0;
        k < keys.length;
        k++
    ) {

        if (
            counts[keys[k]] ===
            highest
        ) {

            winners.push(
                keys[k]
            );
        }
    }

    /*
       TIE
       Nobody is eliminated.
       Same match.
    */

    if (winners.length > 1) {

        showVotingResult(
            "IT'S A TIE",
            "Nobody is eliminated. Vote again.",
            counts,
            "tie"
        );

        return;
    }

    var winner =
        winners[0];

    /*
       SKIP
    */

    if (winner === "skip") {

        showVotingResult(
            "MAJORITY VOTED SKIP",
            "Nobody is eliminated.",
            counts,
            "skip"
        );

        return;
    }

    var eliminated =
        Number(winner);

    /*
       IMPOSTER VOTED OUT
       PLAYERS WIN.
    */

    if (
        eliminated ===
        imposterIndex
    ) {

        showVotingResult(
            "IMPOSTER FOUND",
            players[eliminated] +
            " was the imposter.",
            counts,
            "imposter"
        );

        return;
    }

    /*
       NORMAL PLAYER VOTED OUT.
    */

    activePlayers =
        activePlayers.filter(
            function (index) {

                return index !==
                    eliminated;
            }
        );

    eliminatedPlayers.push(
        eliminated
    );

    /*
       IMPORTANT:

       The imposter ONLY wins when
       exactly TWO active players remain.
    */

    if (
        activePlayers.length === 2 &&
        activePlayers.indexOf(
            imposterIndex
        ) !== -1
    ) {

        showVotingResult(
            "IMPOSTER WINS",
            "Only two players remain, and the imposter is one of them.",
            counts,
            "imposterWin"
        );

        return;
    }

    /*
       More than 2 players remain.
       SAME MATCH CONTINUES.
    */

    showVotingResult(
        "PLAYER ELIMINATED",
        players[eliminated] +
        " is out for this match.",
        counts,
        "eliminated"
    );
}


/* =====================================================
   VOTE RESULT
===================================================== */

function showVotingResult(
    title,
    text,
    counts,
    type
) {

    var titleElement =
        document.getElementById(
            "voteResultTitle"
        );

    var textElement =
        document.getElementById(
            "voteResultText"
        );

    var box =
        document.getElementById(
            "voteCounts"
        );

    var button =
        document.getElementById(
            "resultButton"
        );

    if (titleElement) {
        titleElement.textContent =
            title;
    }

    if (textElement) {
        textElement.textContent =
            text;
    }

    if (box) {

        box.innerHTML = "";

        var keys =
            Object.keys(counts);

        for (
            var i = 0;
            i < keys.length;
            i++
        ) {

            var key =
                keys[i];

            var row =
                document.createElement(
                    "div"
                );

            row.className =
                "vote-count";

            var name;

            if (key === "skip") {

                name = "SKIP";

            } else {

                name =
                    players[
                        Number(key)
                    ];
            }

            row.innerHTML =
                "<span>" +
                name +
                "</span>" +
                "<strong>" +
                counts[key] +
                "</strong>";

            box.appendChild(row);
        }
    }

    voteResultType =
        type;

    if (button) {

        if (type === "tie") {

            button.textContent =
                "VOTING";

        } else {

            button.textContent =
                "CONTINUE";
        }
    }

    showScreen("voteResult");
}


/* =====================================================
   CONTINUE AFTER VOTE
===================================================== */

function continueAfterVote() {

    /*
       TIE:
       Start voting again immediately.

       SAME MATCH.
    */

    if (
        voteResultType ===
        "tie"
    ) {

        startVoting();

        return;
    }

    /*
       IMPOSTER FOUND:
       MATCH IS OVER.
    */

    if (
        voteResultType ===
        "imposter"
    ) {

        gameStarted = false;

        showWinScreen(
            "PLAYERS WIN"
        );

        return;
    }

    /*
       IMPOSTER WINS:
       MATCH IS OVER.
    */

    if (
        voteResultType ===
        "imposterWin"
    ) {

        gameStarted = false;

        showWinScreen(
            "IMPOSTER WINS"
        );

        return;
    }

    /*
       SKIP:
       SAME MATCH.
       NO REVEAL.
       NEXT ROUND.
    */

    if (
        voteResultType ===
        "skip"
    ) {

        startNextRound();

        return;
    }

    /*
       NORMAL PLAYER ELIMINATED:
       SAME MATCH.
       NO REVEAL.
       NEXT ROUND.
    */

    if (
        voteResultType ===
        "eliminated"
    ) {

        startNextRound();

        return;
    }
}


/* =====================================================
   START NEXT ROUND
===================================================== */

function startNextRound() {

    roundNumber++;

    /*
       Choose another active starting player.
    */

    chooseStartingPlayer();

    var nextPlayer =
        document.getElementById(
            "nextStartingPlayer"
        );

    if (nextPlayer) {

        nextPlayer.textContent =
            players[
                startingPlayerIndex
            ];
    }

    showScreen("nextStart");
}


/* =====================================================
   CONTINUE NEXT ROUND
===================================================== */

function continueRound() {

    /*
       THIS IS NOT A NEW MATCH.

       DO NOT:
       - choose a new word
       - choose a new imposter
       - restore eliminated players
       - reveal secrets again

       Just start a meeting.
    */

    votes = {};

    votersRemaining =
        activePlayers.slice();

    currentVoter = -1;

    selectedVote = null;

    voteResultType = "";

    startVoting();
}


/* =====================================================
   WIN SCREEN
===================================================== */

function showWinScreen(title) {

    var winTitle =
        document.getElementById(
            "winTitle"
        );

    var imposterName =
        document.getElementById(
            "imposterName"
        );

    var imposterWord =
        document.getElementById(
            "imposterWord"
        );

    if (winTitle) {

        winTitle.textContent =
            title;
    }

    if (imposterName) {

        imposterName.textContent =
            players[
                imposterIndex
            ];
    }

    if (imposterWord) {

        imposterWord.textContent =
            secretWord;
    }

    showScreen("winScreen");
}


/* =====================================================
   NEW MATCH
===================================================== */

function newGame() {

    /*
       NEW MATCH = COMPLETE RESET.

       Names stay.
       Topic stays.

       Players return.
       New imposter.
       New word.
       Round 1.
    */

    activePlayers = [];

    eliminatedPlayers = [];

    for (
        var i = 0;
        i < players.length;
        i++
    ) {

        activePlayers.push(i);
    }

    imposterIndex = -1;

    secretWord = "";

    currentPlayer = 0;

    roundNumber = 1;

    startingPlayerIndex = -1;

    previousStartingPlayerIndex = -1;

    votes = {};

    votersRemaining = [];

    currentVoter = -1;

    selectedVote = null;

    voteResultType = "";

    gameStarted = true;

    /*
       ONLY NEW MATCH CREATES
       NEW WORD + NEW IMPOSTER.
    */

    createMatchSecret();

    /*
       Secret reveal happens again
       because this is actually a new match.
    */

    startSecretReveal();
}


/* =====================================================
   GO TO LOBBY
===================================================== */

function goToLobby() {

    clearSecretInformation();

    /*
       The setup screen remains populated
       with the previous names/topic.
    */

    players = [];

    activePlayers = [];

    eliminatedPlayers = [];

    imposterIndex = -1;

    secretWord = "";

    currentPlayer = 0;

    roundNumber = 1;

    startingPlayerIndex = -1;

    previousStartingPlayerIndex = -1;

    votes = {};

    votersRemaining = [];

    currentVoter = -1;

    selectedVote = null;

    voteResultType = "";

    gameStarted = false;

    showScreen("setup");

    createNameInputs();
}


/* =====================================================
   INITIALIZE
===================================================== */

createPlayerDropdown();
createNameInputs();
