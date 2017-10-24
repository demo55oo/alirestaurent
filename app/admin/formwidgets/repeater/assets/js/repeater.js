/*
 * Field Repeater plugin
 * 
 * Data attributes:
 * - data-control="repeater" - enables the plugin on an element
 */

+function ($) {
    "use strict";

    // FIELD REPEATER CLASS DEFINITION
    // ============================

    var Repeater = function (element, options) {
        this.options = options
        this.$el = $(element)
        this.$sortable = $(this.options.sortableContainer, this.$el)
        this.$appendTo = $(this.options.appendTo, this.$el)

        // Init
        this.init()
    }

    Repeater.DEFAULTS = {
        appendTo: 'table.repeater-items > tbody',
        sortableContainer: 'table.repeater-items',
        sortableContainerSelector: 'is-sortable',
        sortableItemPath: '> tbody',
        sortableItemSelector: 'tr',
        sortableHandle: '.repeater-item-handle',
        sortablePlaceholder: '<tr class="placeholder"><td colspan="99"></td></tr>',
    }

    Repeater.prototype.init = function () {
        this.$el.on('click', '[data-control="add-item"]', $.proxy(this.addItem, this))

        this.bindSorting()
    }

    Repeater.prototype.bindSorting = function () {
        var sortableOptions = {
            containerSelector: this.options.sortableContainerSelector,
            itemPath: this.options.sortableItemPath,
            itemSelector: this.options.sortableItemSelector,
            placeholder: this.options.sortablePlaceholder,
            handle: this.options.sortableHandle,
            nested: false
        }

        this.$sortable.sortable(sortableOptions)
    }

    Repeater.prototype.unbind = function () {
        this.$sortable.sortable('destroy')
        this.$el.removeData('ti.repeater')
    }

    Repeater.prototype.addItem = function (event) {
        var self = this,
            $element = $(event.target),
            $template = self.$el.find('[data-repeater-template]'),
            $newTemplate = $template.clone(),
            find = new RegExp($template.data('find'), "g"),
            replace = $template.data('replace')

        if (!$newTemplate.length) {
            throw new Error("No template element found with attribute [data-repeater-template]")
        }

        this.$appendTo.append($newTemplate[0].innerHTML.replace(find, replace))
        $template.data('replace', parseInt(replace) + 1)

        var $added = this.$appendTo.find('> :last-child')
        $added.find('select.form-control').select2({minimumResultsForSearch: Infinity})
        $added.find('[data-toggle="toggle"]').bootstrapToggle()
    }

    // FIELD REPEATER PLUGIN DEFINITION
    // ============================

    var old = $.fn.repeater

    $.fn.repeater = function (option) {
        var args = Array.prototype.slice.call(arguments, 1), result
        this.each(function () {
            var $this = $(this)
            var data = $this.data('ti.repeater')
            var options = $.extend({}, Repeater.DEFAULTS, $this.data(), typeof option == 'object' && option)
            if (!data) $this.data('ti.repeater', (data = new Repeater(this, options)))
            if (typeof option == 'string') result = data[option].apply(data, args)
            if (typeof result != 'undefined') return false
        })

        return result ? result : this
    }

    $.fn.repeater.Constructor = Repeater

    // FIELD REPEATER NO CONFLICT
    // =================

    $.fn.repeater.noConflict = function () {
        $.fn.repeater = old
        return this
    }

    // FIELD REPEATER DATA-API
    // ===============

    $(document).ready(function () {
        $('[data-control="repeater"]').repeater()
    });

}(window.jQuery);