define([
    'react',
    'jsx!widgets/Modal',
    'jsx!widgets/Button-Group',
    'helpers/api/config',
    'helpers/sprintf',
    'helpers/i18n'
], function(React, Modal, ButtonGroup, config, sprintf, i18n) {
    'use strict';

    var View = React.createClass({

        getDefaultProps: function() {
            return {
                open: false,
                type: 'software',
                machineName: '',
                latestVersion: '',
                releaseNote: '',
                onClose: function() {},
                onInstall: function() {}
            };
        },

        _onSkip: function() {
            var key = this.props.type + '-update-ignore-list',
                ignoreList = config().read(key) || [];

            ignoreList.push(this.props.latestVersion);

            // save skip version and close
            config().write(key, ignoreList);
            this._handleClose();
        },

        _onClose: function() {
            this._handleClose();
            this.props.onClose();
        },

        _onInstall: function() {
            this.props.onInstall();
            this._handleClose();
        },

        _handleClose: function() {
            React.unmountComponentAtNode(this.refs.modal.getDOMNode().parentNode);
        },

        _getButtons: function(lang) {
            var buttons = [{
                label: lang.update.later,
                onClick: this._onClose
            },
            {
                label: lang.update.install,
                onClick: this._onInstall
            }];

            return buttons;
        },

        _getReleaseNote: function() {
            return {
                __html: this.props.releaseNote
            };
        },

        render: function() {
            if (false === this.props.open) {
                return <div/>;
            }

            var lang = i18n.get(),
                caption = lang.update[this.props.type].caption,
                message1 = sprintf(lang.update[this.props.type].message_pattern_1, this.props.machineName),
                message2 = sprintf(lang.update[this.props.type].message_pattern_2, this.props.latestVersion, window.FLUX.version),
                buttons = this._getButtons(lang),
                content = (
                    <div className="update-wrapper">
                        <h2 className="caption">{caption}</h2>
                        <article className="update-brief">
                            <p>{message1}</p>
                            <p>{message2}</p>
                        </article>
                        <h4 className="release-note-caption">{lang.update.release_note}</h4>
                        <div className="release-note-content" dangerouslySetInnerHTML={this._getReleaseNote()}/>
                        <div className="action-button">
                            <button className="btn btn-link" onClick={this._onSkip}>{lang.update.skip}</button>
                            <ButtonGroup buttons={buttons}/>
                        </div>
                    </div>
                ),
                className = {
                    'modal-update': true
                };

            return (
                <Modal ref="modal" className={className} content={content}/>
            );
        }

    });

    return View;
});