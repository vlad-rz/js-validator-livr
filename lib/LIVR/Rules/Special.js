const util = require('../util');

module.exports = {
    email() {
        const emailRe = /^([\w\-_+]+(?:\.[\w\-_+]+)*)@((?:[\w\-]+\.)*\w[\w\-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;

        return value => {
            if (util.isNoValue(value)) return;
            if (!util.isPrimitiveValue(value)) return 'FORMAT_ERROR';

            value += '';
            if (!emailRe.test(value)) return 'WRONG_EMAIL';
            if (/\@.*\@/.test(value)) return 'WRONG_EMAIL';
            if (/\@.*_/.test(value)) return 'WRONG_EMAIL';
            return;
        };
    },

    equal_to_field(field) {
        return (value, params) => {
            if (util.isNoValue(value)) return;
            if (!util.isPrimitiveValue(value)) return 'FORMAT_ERROR';

            if (value != params[field]) return 'FIELDS_NOT_EQUAL';
            return;
        };
    },

    url() {
        const urlReStr =
            '^(?:(?:http|https)://)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[0-1]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))\\.?|localhost)(?::\\d{2,5})?(?:[/?#]\\S*)?$';
        const urlRe = new RegExp(urlReStr, 'i');

        return value => {
            if (util.isNoValue(value)) return;
            if (!util.isPrimitiveValue(value)) return 'FORMAT_ERROR';

            if (value.length < 2083 && urlRe.test(value)) return;
            return 'WRONG_URL';
        };
    },

    iso_date() {
        return value => {
            if (util.isNoValue(value)) return;
            if (!util.isPrimitiveValue(value)) return 'FORMAT_ERROR';

            const matched = value.match(/^(\d{4})-([0-1][0-9])-([0-3][0-9])$/);

            if (matched) {
                const epoch = Date.parse(value);
                if (!epoch && epoch !== 0) return 'WRONG_DATE';

                const d = new Date(epoch);
                d.setTime(d.getTime() + d.getTimezoneOffset() * 60 * 1000);

                if (
                    d.getFullYear() == matched[1] &&
                    d.getMonth() + 1 == +matched[2] &&
                    d.getDate() == +matched[3]
                ) {
                    return;
                }
            }

            return 'WRONG_DATE';
        };
    }
};
