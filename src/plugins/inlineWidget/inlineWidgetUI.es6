import global from '@ckeditor/ckeditor5-utils/src/dom/global';
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ContextualBalloon from '@ckeditor/ckeditor5-ui/src/panel/balloon/contextualballoon';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import pencilIcon from '@ckeditor/ckeditor5-core/theme/icons/pencil.svg';

import InlineWidgetView from './views/inlineWidgetView.es6';
import InlineWidgetEditing from './inlineWidgetEditing.es6';

export default class InlineWidgetUI extends Plugin {
  static get requires() {
    return [ContextualBalloon, InlineWidgetEditing];
  }

  static get pluginName() {
    return 'InlineWidgetUI';
  }

  init() {
    const editor = this.editor;

    this._balloon = editor.plugins.get(ContextualBalloon);

    this._createToolbarWidgetButton();
    this._enableUserBalloonInteractions();
  }

  destroy() {
    super.destroy();
    this.inlineWidgetView && this.inlineWidgetView.destroy();
  }

  _showUI() {
    const editor = this.editor;
    const inlineWidgetCommand = editor.commands.get('widget');

    if (!inlineWidgetCommand.isEnabled) {
      return;
    }

    this.inlineWidgetView = this._createInlineWidgetView();
    this._addInlineWidgetView();

    this._balloon.showStack('main');

    this._clickOutsideHandler();
  }

  _getTextAreaElement() {
  	return global.document.getElementById('ck-widget-textarea');
  }

  _createInlineWidgetView() {
    const editor = this.editor;
    const inlineWidgetCommand = editor.commands.get('widget');

    const inlineWidgetView = new InlineWidgetView(editor.locale, {
      saveButtonLabel: 'Save',
      cancelButtonLabel: 'Cancel'
    });

    inlineWidgetView.saveButtonView.bind('isEnabled').to(inlineWidgetCommand);

    this.listenTo(inlineWidgetView, 'save', () => {
      let data = this._getTextAreaElement().value;
      if (!data) return;

      editor.execute('widget', {data});
      this._hideUI();
    });

    this.listenTo(inlineWidgetView, 'cancel', () => {
      this._hideUI();
    });

    return inlineWidgetView;
  }

  _addInlineWidgetView() {
    if (this._isFormInPanel) {
      return;
    }

    this._balloon.add({
      view: this.inlineWidgetView,
      position: this._getBalloonPositionData()
    });
  }

  _hideUI() {
    if (!this._isFormInPanel) {
      return;
    }

    const editor = this.editor;

    this.stopListening(editor.ui, 'update');
    this.stopListening(this._balloon, 'change:visibleView');

    editor.editing.view.focus();

    this._removeFormView();
  }

  _removeFormView() {
    if (!this._isFormInPanel) return;

    this.inlineWidgetView.saveButtonView.focus();
    this._balloon.remove(this.inlineWidgetView);
    this.inlineWidgetView.destroy();
    this.editor.editing.view.focus();
  }

  _getBalloonPositionData() {
    const view = this.editor.editing.view;
    const viewDocument = view.document;
    const target = view.domConverter.viewRangeToDom(
      viewDocument.selection.getFirstRange()
    );

    return { target };
  }

  _createToolbarWidgetButton() {
    const editor = this.editor;
    const inlineWidgetCommand = editor.commands.get('widget');

    this.editor.ui.componentFactory.add('inlineWidget', locale => {
      const button = new ButtonView(locale);

      button.isEnabled = true;
      button.label = 'Insert inline widget';
      button.icon = pencilIcon;
      button.tooltip = true;
      button.isToggleable = true;

      button.bind('isEnabled').to(inlineWidgetCommand, 'isEnabled');

      this.listenTo(button, 'execute', () => this._showUI());

      return button;
    });
  }

  _enableUserBalloonInteractions() {
    this.editor.keystrokes.set('Esc', (data, cancel) => {
      if (this._isUIVisible) {
        this._hideUI();
        cancel();
      }
    });
  }

  _clickOutsideHandler() {
    this.inlineWidgetView.listenTo(global.document, 'mousedown', (evt, { target }) => {
      if (!this._isFormInPanel) {
        return;
      }

      if (
        this._balloon.view.element.contains(target)
      )
        return;

      this._hideUI();
    });
  }

  get _isUIVisible() {
    const visibleView = this._balloon.visibleView;
    return this.inlineWidgetView && visibleView === this.inlineWidgetView;
  }

  get _isFormInPanel() {
    return this.inlineWidgetView && this._balloon.hasView(this.inlineWidgetView);
  }
}
