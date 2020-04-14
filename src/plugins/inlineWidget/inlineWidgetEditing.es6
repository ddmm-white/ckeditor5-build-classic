import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import { toWidget, viewToModelPositionOutsideModelElement } from '@ckeditor/ckeditor5-widget/src/utils';
import Widget from '@ckeditor/ckeditor5-widget/src/widget';

import InlineWidgetCommand from './inlineWidgetCommand.es6';

export default class InlineWidgetEditing extends Plugin {
  static get requires() {
    return [Widget];
  }

  static get pluginName() {
    return 'InlineWidgetEditing';
  }

  init() {
    const editor = this.editor;
    editor.commands.add('widget', new InlineWidgetCommand(editor));

    this._defineSchema();
    this._defineConverters();

    editor.editing.mapper.on(
    	'viewToModelPosition',
		viewToModelPositionOutsideModelElement(editor.model, viewElement => viewElement.hasClass('ck-inline-widget'))
	);
  }

  _defineSchema() {
    const schema = this.editor.model.schema;

    schema.register('inlineWidget', {
      allowWhere: '$text',
      isInline: true,
      isObject: true,
      allowAttributes: ['data']
    });
  }

  _defineConverters() {
    const conversion = this.editor.conversion;

    // View -> Model
    conversion.for('upcast').elementToElement({
      view: {
        name: 'span',
        attributes: {
          class: 'ck-inline-widget'
        }
      },
      model: (viewElement, modelWriter) => {
        const data = viewElement.getChild(0).data.trim();
        return modelWriter.createElement('inlineWidget', {
			data
        });
      }
    });

    // Model -> View (element)
    conversion.for('editingDowncast').elementToElement({
      model: 'inlineWidget',
      view: (modelItem, viewWriter) => {
        const widgetElement = this._createInlineWidgetEditingView(
          modelItem,
          viewWriter
        );
        return toWidget(widgetElement, viewWriter);
      }
    });

    // Model -> Data
    conversion.for('dataDowncast').elementToElement({
      model: 'inlineWidget',
      view: this._createInlineWidgetView
    });
  }

  _createInlineWidgetEditingView(modelItem, viewWriter) {
    const data = modelItem.getAttribute('data');

    const inlineWidgetView = viewWriter.createContainerElement('span', {
      style: 'user-select: none;',
	  class: 'ck-inline-widget'
    });

    const uiElement = viewWriter.createUIElement('span', null, function(
      domDocument
    ) {
      const domElement = this.toDomElement(domDocument);
      domElement.innerHTML = `<span>${data}</span>`;
      return domElement;
    });

    viewWriter.insert(viewWriter.createPositionAt(inlineWidgetView, 0), uiElement);

    return inlineWidgetView;
  }

  _createInlineWidgetView(modelItem, viewWriter) {
    const data = modelItem.getAttribute('data');
    const inlineWidgetView = viewWriter.createContainerElement('span', {
      class: 'ck-inline-widget'
    });

    viewWriter.insert(
      viewWriter.createPositionAt(inlineWidgetView, 0),
      viewWriter.createText(data)
    );

    return inlineWidgetView;
  }
}
