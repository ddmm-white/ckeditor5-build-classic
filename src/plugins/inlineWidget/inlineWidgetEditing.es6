import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import { toWidget } from '@ckeditor/ckeditor5-widget/src/utils';
import Widget from '@ckeditor/ckeditor5-widget/src/widget';

export default class InlineWidgetEditing extends Plugin {
  static get requires() {
    return [Widget];
  }

  static get pluginName() {
    return 'InlineWidgetEditing';
  }

  init() {
    this._defineSchema();
    this._defineConverters();
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
          classes: ['inlineWidget']
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
        const widgetElement = this._createEditingView(
          modelItem,
          viewWriter
        );
        return toWidget(widgetElement, viewWriter);
      }
    });

    // Model -> Data
    conversion.for('dataDowncast').elementToElement({
      model: 'inlineWidget',
      view: this._createView
    });
  }

	_createEditingView(modelItem, viewWriter) {
    const data = modelItem.getAttribute('data');

    const view = viewWriter.createContainerElement('div', {
      style: 'user-select: none; display: inline-block;'
    });

    const uiElement = viewWriter.createUIElement('div', null, function(
      domDocument
    ) {
      const domElement = this.toDomElement(domDocument);
		domElement.innerHTML = `<span>${data}</span>`
      return domElement;
    });

    viewWriter.insert(viewWriter.createPositionAt(view, 0), uiElement);

    return view;
  }

	_createView(modelItem, viewWriter) {
    const data = modelItem.getAttribute('data');
    const view = viewWriter.createContainerElement('span');

    viewWriter.insert(
      viewWriter.createPositionAt(view, 0),
      viewWriter.createText(data)
    );

    return view;
  }
}
