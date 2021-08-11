const _ = require('lodash');
const { SignJWT } = require('jose/jwt/sign');
const crypto = require('crypto');

function deepMap(obj, f, ctx) {
    if (Array.isArray(obj)) {
        return obj.map(function(val, key) {
            return (typeof val === 'object') ? deepMap(val, f, ctx) : f.call(ctx, val, key);
        });
    } else if (typeof obj === 'object') {
        res = {};
        for (var key in obj) {
            var val = obj[key];
            if (typeof val === 'object') {
                res[key] = deepMap(val, f, ctx);
            } else {
                res[key] = f.call(ctx, val, key);
            }
        }
        return res;
    } else {
        return obj;
    }
}

function findPath(searchKey, obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key)) {
            if (searchKey === obj[key]) {
                return key;
            } else if (obj[key] && typeof obj[key] === 'object') {
                var path = findPath(searchKey, obj[key]);
                if (path)  {
                    return key + "." + path;
                }
            }
        }
    }
}

async function postProcessContactFormEmail(contactEmail) {
    const secretKey = crypto
        .createHash("sha256")
        .update(process.env.STACKBIT_CONTACT_FORM_SECRET)
        .digest();

    return new SignJWT({ email: contactEmail })
        .setProtectedHeader({ alg: 'HS256' })
        .sign(secretKey);
}

module.exports = {
     postProcessContactFormEmails: async (data) => {
        const paths = [];
        deepMap(data, (val, key, ctx) => {
            if (val === 'form_section') {
                const path = findPath('form_section', data).split('.');
                path.pop();
                paths.push(path)
            }
        });
        await Promise.all(paths.map(async path => {
            const formSection = _.get(data, path);
            const jwt = await postProcessContactFormEmail(formSection.form_contact);
            formSection.form_contact = jwt;
        }));
        return data;
    }
}