import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import Widget from '@ckeditor/ckeditor5-widget/src/widget';

import InlineWidgetUI from './inlineWidgetUI.es6';
import InlineWidgetEditing from './inlineWidgetEditing.es6';

export default class InlineWidget extends Plugin {
  static get requires() {
    return [InlineWidgetEditing, InlineWidgetUI, Widget];
  }

  static get pluginName() {
    return 'InlineWidget';
  }
}
