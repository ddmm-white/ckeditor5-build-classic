import Command from '@ckeditor/ckeditor5-core/src/command';
import { getSelectedInlineWidgetModel } from './utils.es6';

export default class InlineWidgetCommand extends Command {
  execute({ data }) {
    const model = this.editor.model;

    model.change(writer => {
      let inlineWidget = writer.createElement('inlineWidget', {
		  data
      });

      model.insertContent(inlineWidget);
      writer.setSelection(inlineWidget, 'on');
    });
  }

  refresh() {
    const model = this.editor.model;
    const selection = model.document.selection;

    this.isEnabled = model.schema.checkChild(
      selection.focus.parent,
      'inlineWidget'
    );

    const selectedWidget = getSelectedInlineWidgetModel(selection);
    this.data = selectedEquation
      ? selectedEquation.getAttribute('data')
      : null;
  }
}
