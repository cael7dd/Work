var Main = (function (_super) {
    __extends(Main, _super);
    function Main() {
        _super.call(this);
        this._stage = 1;
        this.init();
    }
    var d = __define,c=Main,p=c.prototype;
    p.init = function () {
        this._result = new egret.TextField();
        this._result.x = 220;
        this._showStage = new egret.TextField();
        this._showStage.x = 200;
        this._showStage.y = 700;
        this._lastStage = new egret.TextField();
        this._lastStage.text = "上一关";
        this._lastStage.x = 50;
        this._lastStage.y = 750;
        this._nextStage = new egret.TextField();
        this._nextStage.text = "下一关";
        this._nextStage.x = 340;
        this._nextStage.y = 750;
        this._restart = new egret.TextField();
        this._restart.text = "重来";
        this._restart.x = 210;
        this._restart.y = 750;
        this._restart.touchEnabled = true;
        this._lastStage.touchEnabled = true;
        this._nextStage.touchEnabled = true;
        this._cards = new egret.DisplayObjectContainer();
        this.addChild(this._cards);
        this.addLastAndNext();
        this.addChild(this._showStage);
        this.addChild(this._nextStage);
        this.addChild(this._lastStage);
        this.addChild(this._result);
        this.addChild(this._restart);
        this.stageStart();
    };
    p.stageStart = function () {
        this._cards.removeChildren();
        this._showStage.text = "\u7B2C" + this._stage + "\u5173";
        this._result.text = 0;
        this._cardAmount = this._stage * 2;
        this._blockes = Main.createBlocks();
        this._shouldReverse = true;
        this._rightNum = 0;
        this._cardContainer = [];
        this.createCards();
        this.addListener();
    };
    p.addLastAndNext = function () {
        var self = this;
        this._nextStage.addEventListener(egret.TouchEvent.TOUCH_TAP, function next(event) {
            self._stage = Math.min(18, ++self._stage);
            self.stageStart();
        }, this);
        this._lastStage.addEventListener(egret.TouchEvent.TOUCH_TAP, function (event) {
            self._stage = Math.max(1, --self._stage);
            self.stageStart();
        }, this);
        this._restart.addEventListener(egret.TouchEvent.TOUCH_TAP, function (event) {
            self.stageStart();
        }, this);
    };
    p.addListener = function () {
        var self = this;
        for (var i = 0; i < this._cardContainer.length; i++) {
            this._cardContainer[i].touchEnabled = true;
            this._cardContainer[i].addEventListener(egret.TouchEvent.TOUCH_TAP, function (event) {
                if (self._shouldReverse) {
                    for (var j = 0; j < self._cardAmount; j++) {
                        self._cardContainer[j].flipAnimate(true);
                    }
                    self._shouldReverse = false;
                }
                else {
                    if (this._num - 1 == self._rightNum) {
                        self._rightNum++;
                        this.flipAnimate(false);
                        if (self._rightNum == self._cardAmount) {
                            self._stage++;
                            self._result.text = "success!";
                            setTimeout(function () {
                                self.stageStart();
                            }, 1000);
                        }
                        else
                            self._result.text = self._rightNum;
                    }
                    else {
                        self._result.text = "wrong!";
                        setTimeout(function () {
                            self._result.text = self._rightNum;
                        }, 1000);
                        this.wrongAnsAnimate();
                    }
                }
            }, this._cardContainer[i]);
        }
    };
    p.createCards = function () {
        for (var i = 0; i < this._cardAmount; i++) {
            var index = Math.floor(Math.random() * this._blockes.length);
            var x = this._blockes[index].x;
            var y = this._blockes[index].y;
            this._blockes.splice(index, 1);
            var temp = new Card(i + 1, x * 75 + (x + 1) * 5, y * 75 + (y + 1) * 5 + 160);
            this._cardContainer.push(temp);
            this._cards.addChild(temp);
        }
    };
    Main.createBlocks = function () {
        var blocks = [];
        for (var i = 0; i < 6; i++) {
            for (var j = 0; j < 6; j++) {
                blocks.push({ x: i, y: j });
            }
        }
        return blocks;
    };
    return Main;
}(egret.DisplayObjectContainer));
egret.registerClass(Main,'Main');
//# sourceMappingURL=Main.js.map