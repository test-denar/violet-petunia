const { SignJWT } = require('jose/jwt/sign');
const crypto = require('crypto');

export const postProcess = async (props) => {
    const formSection = props.page.sections.find(({ type }) => type === 'form_section');
    const secretKey = crypto
        .createHash("sha256")
        .update(process.env.STACKBIT_CONTACT_FORM_SECRET)
        .digest();

    const jwt = await new SignJWT({ email: formSection.form_contact })
        .setProtectedHeader({ alg: 'HS256' })
        .sign(secretKey)
    formSection.form_contact = jwt;

    return props;
}