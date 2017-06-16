"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var angular_1 = require("angular");
require("angular-mocks");
var ngimport_1 = require("ngimport");
var React = require("react");
var test_utils_1 = require("react-dom/test-utils");
var _1 = require("./");
var TestOne = (function (_super) {
    __extends(TestOne, _super);
    function TestOne() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TestOne.prototype.render = function () {
        var _this = this;
        return React.createElement("div", null,
            React.createElement("p", null,
                "Foo: ",
                this.props.foo),
            React.createElement("p", null,
                "Bar: ",
                this.props.bar.join(',')),
            React.createElement("p", { onClick: function () { return _this.props.baz(42); } }, "Baz"),
            this.props.children);
    };
    TestOne.prototype.componentWillUnmount = function () { };
    return TestOne;
}(React.Component));
var TestTwo = function (props) {
    return React.createElement("div", null,
        React.createElement("p", null,
            "Foo: ",
            props.foo),
        React.createElement("p", null,
            "Bar: ",
            props.bar.join(',')),
        React.createElement("p", { onClick: function () { return props.baz(42); } }, "Baz"),
        props.children);
};
var TestThreeWithPropTypes = (function (_super) {
    __extends(TestThreeWithPropTypes, _super);
    function TestThreeWithPropTypes() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TestThreeWithPropTypes.prototype.render = function () {
        var _this = this;
        return React.createElement("div", null,
            React.createElement("p", null,
                "Foo: ",
                this.props.foo),
            React.createElement("p", null,
                "Bar: ",
                this.props.bar.join(',')),
            React.createElement("p", { onClick: function () { return _this.props.baz(42); } }, "Baz"),
            this.props.children);
    };
    TestThreeWithPropTypes.prototype.componentWillUnmount = function () { };
    return TestThreeWithPropTypes;
}(React.Component));
TestThreeWithPropTypes.propTypes = {
    bar: React.PropTypes.array.isRequired,
    baz: React.PropTypes.func.isRequired,
    foo: React.PropTypes.number.isRequired
};
var TestAngularOne = _1.react2angular(TestOne, ['foo', 'bar', 'baz']);
var TestAngularTwo = _1.react2angular(TestTwo, ['foo', 'bar', 'baz']);
angular_1.module('test', ['bcherny/ngimport'])
    .component('testAngularOne', TestAngularOne)
    .component('testAngularTwo', TestAngularTwo);
angular_1.bootstrap(angular_1.element(), ['test'], { strictDi: true });
describe('react2angular', function () {
    var $compile;
    beforeEach(function () {
        angular_1.mock.module('test');
        angular_1.mock.inject(function (_$compile_) {
            $compile = _$compile_;
        });
    });
    describe('initialization', function () {
        it('should give an angular component', function () {
            expect(TestAngularOne.bindings).not.toBe(undefined);
            expect(TestAngularOne.controller).not.toBe(undefined);
        });
        it('should use the propTypes when present and no bindingNames were specified', function () {
            var reactAngularComponent = _1.react2angular(TestThreeWithPropTypes);
            expect(reactAngularComponent.bindings).toEqual({
                bar: '<',
                baz: '<',
                foo: '<'
            });
        });
        it('should use the bindingNames when present over the propTypes', function () {
            var reactAngularComponent = _1.react2angular(TestThreeWithPropTypes, ['foo']);
            expect(reactAngularComponent.bindings).toEqual({
                foo: '<'
            });
        });
        it('should have empty bindings when parameter is an empty array', function () {
            var reactAngularComponent = _1.react2angular(TestThreeWithPropTypes, []);
            expect(reactAngularComponent.bindings).toEqual({});
        });
    });
    describe('react classes', function () {
        it('should render', function () {
            var scope = Object.assign(ngimport_1.$rootScope.$new(true), {
                bar: [true, false],
                baz: function (value) { return value + 1; },
                foo: 1
            });
            var element = angular_1.element("<test-angular-one foo=\"foo\" bar=\"bar\" baz=\"baz\"></test-angular-one>");
            $compile(element)(scope);
            ngimport_1.$rootScope.$apply();
            expect(element.find('p').length).toBe(3);
        });
        it('should update', function () {
            var scope = Object.assign(ngimport_1.$rootScope.$new(true), {
                bar: [true, false],
                baz: function (value) { return value + 1; },
                foo: 1
            });
            var element = angular_1.element("<test-angular-one foo=\"foo\" bar=\"bar\" baz=\"baz\"></test-angular-one>");
            $compile(element)(scope);
            ngimport_1.$rootScope.$apply();
            expect(element.find('p').eq(1).text()).toBe('Bar: true,false');
            scope.$apply(function () {
                return scope.bar = [false, true, true];
            });
            expect(element.find('p').eq(1).text()).toBe('Bar: false,true,true');
        });
        it('should destroy', function () {
            var scope = Object.assign(ngimport_1.$rootScope.$new(true), {
                bar: [true, false],
                baz: function (value) { return value + 1; },
                foo: 1
            });
            var element = angular_1.element("<test-angular-one foo=\"foo\" bar=\"bar\" baz=\"baz\"></test-angular-one>");
            $compile(element)(scope);
            ngimport_1.$rootScope.$apply();
            spyOn(TestOne.prototype, 'componentWillUnmount');
            scope.$destroy();
            expect(TestOne.prototype.componentWillUnmount).toHaveBeenCalled();
        });
        it('should take callbacks', function () {
            var baz = jasmine.createSpy('baz');
            var scope = Object.assign(ngimport_1.$rootScope.$new(true), {
                bar: [true, false],
                baz: baz,
                foo: 1
            });
            var element = angular_1.element("<test-angular-one foo=\"foo\" bar=\"bar\" baz=\"baz\"></test-angular-one>");
            $compile(element)(scope);
            ngimport_1.$rootScope.$apply();
            test_utils_1.Simulate.click(element.find('p').eq(2)[0]);
            expect(baz).toHaveBeenCalledWith(42);
        });
        // TODO: support children
        it('should not support children', function () {
            var scope = Object.assign(ngimport_1.$rootScope.$new(true), {
                bar: [true, false],
                baz: function (value) { return value + 1; },
                foo: 1
            });
            var element = angular_1.element("<test-angular-one foo=\"foo\" bar=\"bar\" baz=\"baz\"><span>Transcluded</span></test-angular-one>");
            $compile(element)(scope);
            ngimport_1.$rootScope.$apply();
            expect(element.find('span').length).toBe(0);
        });
    });
    describe('react stateless components', function () {
        it('should render', function () {
            var scope = Object.assign(ngimport_1.$rootScope.$new(true), {
                bar: [true, false],
                baz: function (value) { return value + 1; },
                foo: 1
            });
            var element = angular_1.element("<test-angular-two foo=\"foo\" bar=\"bar\" baz=\"baz\"></test-angular-two>");
            $compile(element)(scope);
            ngimport_1.$rootScope.$apply();
            expect(element.find('p').length).toBe(3);
        });
        it('should update', function () {
            var scope = Object.assign(ngimport_1.$rootScope.$new(true), {
                bar: [true, false],
                baz: function (value) { return value + 1; },
                foo: 1
            });
            var element = angular_1.element("<test-angular-two foo=\"foo\" bar=\"bar\" baz=\"baz\"></test-angular-two>");
            $compile(element)(scope);
            ngimport_1.$rootScope.$apply();
            expect(element.find('p').eq(1).text()).toBe('Bar: true,false');
            scope.$apply(function () {
                return scope.bar = [false, true, true];
            });
            expect(element.find('p').eq(1).text()).toBe('Bar: false,true,true');
        });
        // TODO: figure out how to test this
        xit('should destroy', function () { });
        it('should take callbacks', function () {
            var baz = jasmine.createSpy('baz');
            var scope = Object.assign(ngimport_1.$rootScope.$new(true), {
                bar: [true, false],
                baz: baz,
                foo: 1
            });
            var element = angular_1.element("<test-angular-two foo=\"foo\" bar=\"bar\" baz=\"baz\"></test-angular-two>");
            $compile(element)(scope);
            ngimport_1.$rootScope.$apply();
            test_utils_1.Simulate.click(element.find('p').eq(2)[0]);
            expect(baz).toHaveBeenCalledWith(42);
        });
        // TODO: support children
        it('should not support children', function () {
            var scope = Object.assign(ngimport_1.$rootScope.$new(true), {
                bar: [true, false],
                baz: function (value) { return value + 1; },
                foo: 1
            });
            var element = angular_1.element("<test-angular-two foo=\"foo\" bar=\"bar\" baz=\"baz\"><span>Transcluded</span></test-angular-two>");
            $compile(element)(scope);
            ngimport_1.$rootScope.$apply();
            expect(element.find('span').length).toBe(0);
        });
    });
});
//# sourceMappingURL=test.js.map