"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fromPairs = require("lodash.frompairs");
const ngcomponent_1 = require("ngcomponent");
const React = require("react");
const react_dom_1 = require("react-dom");
/**
 * Wraps a React component in Angular. Returns a new Angular component.
 *
 * Usage:
 *
 *   ```ts
 *   type Props = { foo: number }
 *   class ReactComponent extends React.Component<Props, S> {}
 *   const AngularComponent = react2angular(ReactComponent, ['foo'])
 *   ```
 */
function react2angular(Class, bindingNames) {
    const names = bindingNames
        || (Class.propTypes && Object.keys(Class.propTypes))
        || [];
    return {
        bindings: fromPairs(names.map(_ => [_, '<'])),
        controller: ['$element', class extends ngcomponent_1.default {
                constructor($element) {
                    super();
                    this.$element = $element;
                }
                render() {
                    // TODO: rm any when https://github.com/Microsoft/TypeScript/pull/13288 is merged
                    react_dom_1.render(React.createElement(Class, Object.assign({}, this.props)), this.$element[0]);
                }
                componentWillUnmount() {
                    react_dom_1.unmountComponentAtNode(this.$element[0]);
                }
            }]
    };
}
exports.react2angular = react2angular;
//# sourceMappingURL=index.js.map