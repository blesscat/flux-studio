define([
    'react',
    'app/actions/initialize-machine',
    'helpers/api/usb-config',
    'jsx!widgets/Modal',
    'app/actions/alert-actions',
    'app/stores/alert-store'
], function(
    React,
    initializeMachine,
    usbConfig,
    Modal,
    AlertActions,
    AlertStore
) {
    'use strict';

    return function(args) {
        args = args || {};

        return React.createClass({

            getInitialState: function() {
                return {
                    lang                 : args.state.lang,
                    validPrinterName     : true,
                    validPrinterPassword : true,
                    settingPrinter       : initializeMachine.settingPrinter.get()
                }
            },

            _handleSetPrinter: function(e) {
                e.preventDefault();

                var self        = this,
                    name        = self.refs.name.getDOMNode().value,
                    password    = self.refs.password.getDOMNode().value,
                    usb         = usbConfig(),
                    lang        = self.state.lang,
                    onError     = function(response) {
                        AlertActions.showPopupError('set-machine-error', response.error);
                    },
                    goNext = function() {
                        self.state.settingPrinter.name = name;
                        initializeMachine.settingPrinter.set(self.state.settingPrinter);
                        location.hash = '#initialize/wifi/select';
                    },
                    setPassword = function(password) {
                        setMachine.password(password, {
                            onSuccess: function(response) {
                                goNext();
                            }
                        });
                    },
                    startSetting = function() {
                        setMachine = usb.setMachine({
                            onError: onError
                        });

                        setMachine.name(name, {
                            onSuccess: function(response) {
                                if ('' !== password) {
                                    setPassword(password);
                                }
                                else {
                                    goNext();
                                }
                            }
                        });
                    },
                    setMachine,
                    isValid;

                self.setState({
                    validPrinterName: name !== '',
                });

                isValid = (name !== '' && 0 === name.replace(/(\w| |_)+/g, '').length);

                if (true === isValid) {

                    if (true === self.state.settingPrinter.password && '' !== password) {
                        AlertStore.onCustom(startSetting);
                        AlertActions.showPopupCustom(
                            'change-password',
                            lang.initialize.errors.keep_connect.content,
                            lang.initialize.confirm
                        );
                    }
                    else {
                        startSetting();
                    }

                }
            },

            _renderAlert: function(lang) {
                var self = this,
                    buttons = [{
                        label: lang.initialize.confirm,
                        className: 'btn-action',
                        dataAttrs: {
                            'ga-event': 'confirm'
                        },
                        onClick: self.state.alertContent.onClick
                    },
                    {
                        label: lang.initialize.cancel,
                        dataAttrs: {
                            'ga-event': 'cancel'
                        },
                        onClick: function(e) {
                            self.setState({
                                openAlert: false
                            });
                        }
                    }],
                    content = (
                        <Alert caption={this.state.alertContent.caption} message={this.state.alertContent.message} buttons={buttons}/>
                    );

                return (
                    true === this.state.openAlert ?
                    <Modal content={content}/> :
                    ''
                );
            },

            render : function() {
                var lang = this.state.lang,
                    wrapperClassName = {
                        'initialization': true
                    },
                    // alert = this._renderAlert(lang),
                    cx = React.addons.classSet,
                    printerNameClass,
                    printerPasswordClass,
                    content;

                printerNameClass = cx({
                    'required'  : true,
                    'error'     : !this.state.validPrinterName
                });

                printerPasswordClass = cx({
                    'required'  : true,
                    'error'     : !this.state.validPrinterPassword
                });

                content = (
                    <div className="set-machine-generic text-center">
                        <img className="brand-image" src="/img/menu/main_logo.svg"/>

                        <form className="form h-form">
                            <h1 className="headline">{lang.initialize.name_your_flux}</h1>

                            <div className="controls">
                                <p className="control">
                                    <label for="printer-name">
                                        {lang.initialize.set_machine_generic.printer_name}
                                    </label>
                                    <input ref="name" id="printer-name" type="text" className={printerNameClass}
                                    autoFocus={true}
                                    defaultValue={this.state.settingPrinter.name}
                                    placeholder={lang.initialize.set_machine_generic.printer_name_placeholder}/>
                                </p>
                                <p className="control">
                                    <label for="printer-password">
                                        {lang.initialize.set_machine_generic.password}
                                    </label>
                                    <input ref="password" for="printer-password" type="password" className={printerPasswordClass}
                                    placeholder={lang.initialize.set_machine_generic.password_placeholder}/>
                                </p>
                            </div>
                            <div className="btn-v-group">
                                <button className="btn btn-action btn-large" data-ga-event="next" onClick={this._handleSetPrinter} autoFocus={true}>
                                    {lang.initialize.next}
                                </button>
                                <a href="#initialize/wifi/setup-complete/with-usb" data-ga-event="skip" className="btn btn-link btn-large">
                                    {lang.initialize.skip}
                                </a>
                            </div>
                        </form>
                    </div>
                );

                return (
                    <Modal className={wrapperClassName} content={content}/>
                );
            }
        });
    };
});