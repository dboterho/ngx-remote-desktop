"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var guacamole_common_js_1 = require("@illgrenoble/guacamole-common-js");
var rxjs_1 = require("rxjs");
var services_1 = require("../services");
var DisplayComponent = /** @class */ (function () {
    function DisplayComponent(viewport) {
        this.viewport = viewport;
        /**
         * Emit the mouse move events to any subscribers
         */
        this.onMouseMove = new rxjs_1.BehaviorSubject(null);
        this.isFullScreen = false;
        /**
         * Bind input listeners if display is focused, otherwise, unbind
         */
        this.isFocused = false;
    }
    /**
     * Create the display canvas when initialising the component
     */
    DisplayComponent.prototype.ngOnInit = function () {
        this.createDisplayCanvas();
    };
    /**
     * Unbind all display input listeners when destroying the component
     */
    DisplayComponent.prototype.ngOnDestroy = function () {
        this.removeDisplayInputListeners();
    };
    /**
     * Rescale the display when any changes are detected
     * @param changes
     */
    DisplayComponent.prototype.ngOnChanges = function (changes) {
        var _this = this;
        var isFocused = changes.isFocused;
        if (isFocused && !isFocused.firstChange) {
            this.bindDisplayInputListeners();
        }
        window.setTimeout(function () { return _this.setDisplayScale(); }, 100);
    };
    /**
     * Rescale the display when the window is resized
     * @param event
     */
    DisplayComponent.prototype.onWindowResize = function (event) {
        this.setDisplayScale();
    };
    /**
     * Release all the keyboards when the window loses focus
     * @param event
     */
    DisplayComponent.prototype.onWindowBlur = function (event) {
        if (this.keyboard) {
            this.keyboard.reset();
        }
    };
    /**
     * Create the remote desktop display and bind the event handlers
     */
    DisplayComponent.prototype.createDisplayCanvas = function () {
        this.createDisplay();
        this.createDisplayInputs();
        this.bindDisplayInputListeners();
    };
    /**
     * Get the remote desktop display and set the scale
     */
    DisplayComponent.prototype.setDisplayScale = function () {
        var display = this.getDisplay();
        var scale = this.calculateDisplayScale();
        display.scale(scale);
    };
    /**
     * Get the remote desktop display
     */
    DisplayComponent.prototype.getDisplay = function () {
        return this.manager.getClient().getDisplay();
    };
    /**
     * Get the remote desktop client
     */
    DisplayComponent.prototype.getClient = function () {
        return this.manager.getClient();
    };
    /**
     * Calculate the scale for the display
     */
    DisplayComponent.prototype.calculateDisplayScale = function () {
        var viewportElement = this.viewport.nativeElement;
        var screenElement = window.screen;
        var scale = Math.min(viewportElement.clientWidth / screenElement.width, viewportElement.clientHeight / screenElement.height);
        return scale;
    };
    /**
     * Assign the display to the client
     */
    DisplayComponent.prototype.createDisplay = function () {
        var element = this.display.nativeElement;
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
        var display = this.getDisplay();
        element.appendChild(display.getElement());
    };
    /**
     * Bind input listeners for keyboard and mouse
     */
    DisplayComponent.prototype.bindDisplayInputListeners = function () {
        this.removeDisplayInputListeners();
        if (this.isFocused) {
            this.mouse.onmousedown = this.mouse.onmouseup = this.mouse.onmousemove = this.handleMouseState.bind(this);
            this.keyboard.onkeyup = this.handleKeyUp.bind(this);
            this.keyboard.onkeydown = this.handleKeyDown.bind(this);
        }
    };
    /**
     * Remove all input listeners
     */
    DisplayComponent.prototype.removeDisplayInputListeners = function () {
        if (this.keyboard) {
            this.keyboard.onkeydown = null;
            this.keyboard.onkeyup = null;
        }
        if (this.mouse) {
            this.mouse.onmousedown = this.mouse.onmouseup = this.mouse.onmousemove = null;
        }
    };
    /**
     * Create the keyboard and mouse inputs
     */
    DisplayComponent.prototype.createDisplayInputs = function () {
        var display = this.display.nativeElement.children[0];
        this.mouse = new guacamole_common_js_1.Mouse(display);
        this.keyboard = new guacamole_common_js_1.Keyboard(window.document);
    };
    /**
     * Send mouse events to the remote desktop
     * @param mouseState
     */
    DisplayComponent.prototype.handleMouseState = function (mouseState) {
        var display = this.getDisplay();
        var scale = display.getScale();
        var scaledState = new guacamole_common_js_1.Mouse.State(mouseState.x / scale, mouseState.y / scale, mouseState.left, mouseState.middle, mouseState.right, mouseState.up, mouseState.down);
        this.getClient().sendMouseState(scaledState);
        this.onMouseMove.next(mouseState);
    };
    /**
     * Send key down event to the remote desktop
     * @param key
     */
    DisplayComponent.prototype.handleKeyDown = function (key) {
        this.getClient().sendKeyEvent(1, key);
    };
    /**
     * Send key up event to the remote desktop
     * @param key
     */
    DisplayComponent.prototype.handleKeyUp = function (key) {
        this.getClient().sendKeyEvent(0, key);
    };
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], DisplayComponent.prototype, "onMouseMove", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", services_1.RemoteDesktopManager)
    ], DisplayComponent.prototype, "manager", void 0);
    __decorate([
        core_1.ViewChild('display'),
        __metadata("design:type", core_1.ElementRef)
    ], DisplayComponent.prototype, "display", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], DisplayComponent.prototype, "isFullScreen", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], DisplayComponent.prototype, "isFocused", void 0);
    __decorate([
        core_1.HostListener('window:resize', ['$event']),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], DisplayComponent.prototype, "onWindowResize", null);
    __decorate([
        core_1.HostListener('window:blur', ['$event']),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], DisplayComponent.prototype, "onWindowBlur", null);
    DisplayComponent = __decorate([
        core_1.Component({
            selector: 'ngx-remote-desktop-display',
            host: { class: 'ngx-remote-desktop-viewport' },
            template: "\n        <div class=\"ngx-remote-desktop-display\" #display>\n        </div>\n    "
        }),
        __metadata("design:paramtypes", [core_1.ElementRef])
    ], DisplayComponent);
    return DisplayComponent;
}());
exports.DisplayComponent = DisplayComponent;
//# sourceMappingURL=display.component.js.map