define([
    'jquery',
    'helpers/version-checker',
    'helpers/device-master'
], function(
    $,
    VersionChecker,
    DeviceMaster
) {
    const check = (device, key) => {
        let d = $.Deferred();
        if(device.version) {
            DeviceMaster.selectDevice(device);
            let vc = VersionChecker(device.version);
            d.resolve(vc.meetVersion(requirement[key]));
        }
        else {
            DeviceMaster.selectDevice(device).then(() => {
                return DeviceMaster.getDeviceInfo();
            })
            .then(deviceInfo => {
                let vc = VersionChecker(deviceInfo.version);
                d.resolve(vc.meetVersion(requirement[key]));
            });
        }

        return d.promise();
    };

    const requirement = {
        BACKLASH                    : '1.5b12',
        OPERATE_DURING_PAUSE        : '1.6.20',
        UPGRADE_KIT_PROFILE_SETTING : '1.6.20',
        SCAN_CALIBRATION            : '1.6.25',
        M666R_MMTEST                : '1.6.40',
        CLOUD                       : '1.5.0'
    };

    return {
        check
    };
});
