"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const angular_1 = require("angular");
require("angular-mocks");
const ngimport_1 = require("ngimport");
const React = require("react");
const test_utils_1 = require("react-dom/test-utils");
const _1 = require("./");
class TestOne extends React.Component {
    render() {
        return React.createElement("div", null,
            React.createElement("p", null,
                "Foo: ",
                this.props.foo),
            React.createElement("p", null,
                "Bar: ",
                this.props.bar.join(',')),
            React.createElement("p", { onClick: () => this.props.baz(42) }, "Baz"),
            this.props.children);
    }
    componentWillUnmount() { }
}
const TestTwo = props => React.createElement("div", null,
    React.createElement("p", null,
        "Foo: ",
        props.foo),
    React.createElement("p", null,
        "Bar: ",
        props.bar.join(',')),
    React.createElement("p", { onClick: () => props.baz(42) }, "Baz"),
    props.children);
class TestThreeWithPropTypes extends React.Component {
    render() {
        return React.createElement("div", null,
            React.createElement("p", null,
                "Foo: ",
                this.props.foo),
            React.createElement("p", null,
                "Bar: ",
                this.props.bar.join(',')),
            React.createElement("p", { onClick: () => this.props.baz(42) }, "Baz"),
            this.props.children);
    }
    componentWillUnmount() { }
}
TestThreeWithPropTypes.propTypes = {
    bar: React.PropTypes.array.isRequired,
    baz: React.PropTypes.func.isRequired,
    foo: React.PropTypes.number.isRequired
};
const TestAngularOne = _1.react2angular(TestOne, ['foo', 'bar', 'baz']);
const TestAngularTwo = _1.react2angular(TestTwo, ['foo', 'bar', 'baz']);
angular_1.module('test', ['bcherny/ngimport'])
    .component('testAngularOne', TestAngularOne)
    .component('testAngularTwo', TestAngularTwo);
angular_1.bootstrap(angular_1.element(), ['test'], { strictDi: true });
describe('react2angular', () => {
    let $compile;
    beforeEach(() => {
        angular_1.mock.module('test');
        angular_1.mock.inject(function (_$compile_) {
            $compile = _$compile_;
        });
    });
    describe('initialization', () => {
        it('should give an angular component', () => {
            expect(TestAngularOne.bindings).not.toBe(undefined);
            expect(TestAngularOne.controller).not.toBe(undefined);
        });
        it('should use the propTypes when present and no bindingNames were specified', () => {
            const reactAngularComponent = _1.react2angular(TestThreeWithPropTypes);
            expect(reactAngularComponent.bindings).toEqual({
                bar: '<',
                baz: '<',
                foo: '<'
            });
        });
        it('should use the bindingNames when present over the propTypes', () => {
            const reactAngularComponent = _1.react2angular(TestThreeWithPropTypes, ['foo']);
            expect(reactAngularComponent.bindings).toEqual({
                foo: '<'
            });
        });
        it('should have empty bindings when parameter is an empty array', () => {
            const reactAngularComponent = _1.react2angular(TestThreeWithPropTypes, []);
            expect(reactAngularComponent.bindings).toEqual({});
        });
    });
    describe('react classes', () => {
        it('should render', () => {
            const scope = Object.assign(ngimport_1.$rootScope.$new(true), {
                bar: [true, false],
                baz: (value) => value + 1,
                foo: 1
            });
            const element = angular_1.element(`<test-angular-one foo="foo" bar="bar" baz="baz"></test-angular-one>`);
            $compile(element)(scope);
            ngimport_1.$rootScope.$apply();
            expect(element.find('p').length).toBe(3);
        });
        it('should update', () => {
            const scope = Object.assign(ngimport_1.$rootScope.$new(true), {
                bar: [true, false],
                baz: (value) => value + 1,
                foo: 1
            });
            const element = angular_1.element(`<test-angular-one foo="foo" bar="bar" baz="baz"></test-angular-one>`);
            $compile(element)(scope);
            ngimport_1.$rootScope.$apply();
            expect(element.find('p').eq(1).text()).toBe('Bar: true,false');
            scope.$apply(() => scope.bar = [false, true, true]);
            expect(element.find('p').eq(1).text()).toBe('Bar: false,true,true');
        });
        it('should destroy', () => {
            const scope = Object.assign(ngimport_1.$rootScope.$new(true), {
                bar: [true, false],
                baz: (value) => value + 1,
                foo: 1
            });
            const element = angular_1.element(`<test-angular-one foo="foo" bar="bar" baz="baz"></test-angular-one>`);
            $compile(element)(scope);
            ngimport_1.$rootScope.$apply();
            spyOn(TestOne.prototype, 'componentWillUnmount');
            scope.$destroy();
            expect(TestOne.prototype.componentWillUnmount).toHaveBeenCalled();
        });
        it('should take callbacks', () => {
            const baz = jasmine.createSpy('baz');
            const scope = Object.assign(ngimport_1.$rootScope.$new(true), {
                bar: [true, false],
                baz,
                foo: 1
            });
            const element = angular_1.element(`<test-angular-one foo="foo" bar="bar" baz="baz"></test-angular-one>`);
            $compile(element)(scope);
            ngimport_1.$rootScope.$apply();
            test_utils_1.Simulate.click(element.find('p').eq(2)[0]);
            expect(baz).toHaveBeenCalledWith(42);
        });
        // TODO: support children
        it('should not support children', () => {
            const scope = Object.assign(ngimport_1.$rootScope.$new(true), {
                bar: [true, false],
                baz: (value) => value + 1,
                foo: 1
            });
            const element = angular_1.element(`<test-angular-one foo="foo" bar="bar" baz="baz"><span>Transcluded</span></test-angular-one>`);
            $compile(element)(scope);
            ngimport_1.$rootScope.$apply();
            expect(element.find('span').length).toBe(0);
        });
    });
    describe('react stateless components', () => {
        it('should render', () => {
            const scope = Object.assign(ngimport_1.$rootScope.$new(true), {
                bar: [true, false],
                baz: (value) => value + 1,
                foo: 1
            });
            const element = angular_1.element(`<test-angular-two foo="foo" bar="bar" baz="baz"></test-angular-two>`);
            $compile(element)(scope);
            ngimport_1.$rootScope.$apply();
            expect(element.find('p').length).toBe(3);
        });
        it('should update', () => {
            const scope = Object.assign(ngimport_1.$rootScope.$new(true), {
                bar: [true, false],
                baz: (value) => value + 1,
                foo: 1
            });
            const element = angular_1.element(`<test-angular-two foo="foo" bar="bar" baz="baz"></test-angular-two>`);
            $compile(element)(scope);
            ngimport_1.$rootScope.$apply();
            expect(element.find('p').eq(1).text()).toBe('Bar: true,false');
            scope.$apply(() => scope.bar = [false, true, true]);
            expect(element.find('p').eq(1).text()).toBe('Bar: false,true,true');
        });
        // TODO: figure out how to test this
        xit('should destroy', () => { });
        it('should take callbacks', () => {
            const baz = jasmine.createSpy('baz');
            const scope = Object.assign(ngimport_1.$rootScope.$new(true), {
                bar: [true, false],
                baz,
                foo: 1
            });
            const element = angular_1.element(`<test-angular-two foo="foo" bar="bar" baz="baz"></test-angular-two>`);
            $compile(element)(scope);
            ngimport_1.$rootScope.$apply();
            test_utils_1.Simulate.click(element.find('p').eq(2)[0]);
            expect(baz).toHaveBeenCalledWith(42);
        });
        // TODO: support children
        it('should not support children', () => {
            const scope = Object.assign(ngimport_1.$rootScope.$new(true), {
                bar: [true, false],
                baz: (value) => value + 1,
                foo: 1
            });
            const element = angular_1.element(`<test-angular-two foo="foo" bar="bar" baz="baz"><span>Transcluded</span></test-angular-two>`);
            $compile(element)(scope);
            ngimport_1.$rootScope.$apply();
            expect(element.find('span').length).toBe(0);
        });
    });
});
//# sourceMappingURL=test.js.map