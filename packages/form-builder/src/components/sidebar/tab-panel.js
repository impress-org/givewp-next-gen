/**
 * @note This is a fork of the WordPress component.
 *
 * Changes:
 *  - Update relative component imports.
 *  - Replace useState hook with injected state for external control of the selected tab.
 */

import _extends from "@babel/runtime/helpers/esm/extends";
import {createElement} from "@wordpress/element";

/**
 * External dependencies
 */
import classnames from 'classnames';
import {partial, find} from 'lodash';
/**
 * WordPress dependencies
 */

import {/* useState, */ useEffect} from '@wordpress/element';
import {useInstanceId} from '@wordpress/compose';

/**
 * Internal dependencies
 */

import {NavigableMenu, Button} from '@wordpress/components';
// import { NavigableMenu } from '../navigable-container';
// import Button from '../button';

const noop = () => {
};

const TabButton = _ref => {
    let {
        tabId,
        onClick,
        children,
        selected,
        ...rest
    } = _ref;
    return createElement(Button, _extends({
        role: "tab",
        tabIndex: selected ? null : -1,
        "aria-selected": selected,
        id: tabId,
        onClick: onClick,
    }, rest), children);
};

export default function TabPanel(_ref2) {
    var _selectedTab$name;

    let {
        className,
        children,
        tabs,
        initialTabName,
        orientation = 'horizontal',
        activeClass = 'is-active',
        onSelect = noop,
        state: [selected, setSelected], /** @note Injecting state for external control of the selected tab. */
    } = _ref2;
    const instanceId = useInstanceId(TabPanel, 'tab-panel');
    // const [selected, setSelected] = useState(null);

    const handleClick = tabKey => {
        setSelected(tabKey);
        onSelect(tabKey);
    };

    const onNavigate = (childIndex, child) => {
        child.click();
    };

    const selectedTab = find(tabs, {
        name: selected,
    });
    const selectedId = `${instanceId}-${(_selectedTab$name = selectedTab === null || selectedTab === void 0 ? void 0 : selectedTab.name) !== null && _selectedTab$name !== void 0 ? _selectedTab$name : 'none'}`;
    useEffect(() => {
        const newSelectedTab = find(tabs, {
            name: selected,
        });

        if (!newSelectedTab) {
            setSelected(initialTabName || (tabs.length > 0 ? tabs[0].name : null));
        }
    }, [tabs]);
    return createElement("div", {
        className: className,
    }, createElement(NavigableMenu, {
        role: "tablist",
        orientation: orientation,
        onNavigate: onNavigate,
        className: "components-tab-panel__tabs",
    }, tabs.map(tab => createElement(TabButton, {
        className: classnames('components-tab-panel__tabs-item', tab.className, {
            [activeClass]: tab.name === selected,
        }),
        tabId: `${instanceId}-${tab.name}`,
        "aria-controls": `${instanceId}-${tab.name}-view`,
        selected: tab.name === selected,
        key: tab.name,
        onClick: partial(handleClick, tab.name),
    }, tab.title))), selectedTab && createElement("div", {
        key: selectedId,
        "aria-labelledby": selectedId,
        role: "tabpanel",
        id: `${selectedId}-view`,
        className: "components-tab-panel__tab-content",
    }, children(selectedTab)));
}
//# sourceMappingURL=index.js.map
