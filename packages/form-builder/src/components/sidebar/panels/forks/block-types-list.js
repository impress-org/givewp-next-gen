/**
 * @note This is a fork of the WordPress component.
 *
 * Substantive changes:
 *  - Updates the isDraggable in _inserterListItem to account for isDisabled.
 *
 * Maintenance changes:
 *  - Update relative component imports for _inserterListItem, _inserterListbox.
 *  - Disabled eslint rule strict for original components "use strict" statement.
 */

"use strict"; // eslint-disable-line strict

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
    value: true,
});
exports.default = void 0;

var _element = require("@wordpress/element");

var _blocks = require("@wordpress/blocks");

var _inserterListItem = _interopRequireDefault(require("@wordpress/block-editor/build/components/inserter-list-item"));

var _inserterListbox = require("@wordpress/block-editor/build/components/inserter-listbox");

/**
 * WordPress dependencies
 */

/**
 * Internal dependencies
 */
function chunk(array, size) {
    const chunks = [];

    for (let i = 0, j = array.length; i < j; i += size) {
        chunks.push(array.slice(i, i + size));
    }

    return chunks;
}

function BlockTypesList(_ref) {
    let {
        items = [],
        onSelect,
        onHover = () => {
        },
        children,
        label,
        isDraggable = true,
    } = _ref;
    return (0, _element.createElement)(_inserterListbox.InserterListboxGroup, {
        className: "block-editor-block-types-list",
        "aria-label": label,
    }, chunk(items, 3).map((row, i) => (0, _element.createElement)(_inserterListbox.InserterListboxRow, {
        key: i,
    }, row.map((item, j) => (0, _element.createElement)(_inserterListItem.default, {
        key: item.id,
        item: item,
        className: (0, _blocks.getBlockMenuDefaultClassName)(item.id),
        onSelect: onSelect,
        onHover: onHover,
        isDraggable: isDraggable && !item.isDisabled, /** @note Include isDisabled when setting isDraggable. */
        isFirst: i === 0 && j === 0,
    })))), children);
}

var _default = BlockTypesList;
exports.default = _default;
//# sourceMappingURL=index.js.map
