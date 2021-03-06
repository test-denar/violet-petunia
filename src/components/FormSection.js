import React from 'react';
import axios from 'axios';
import _ from 'lodash';

import { classNames, markdownify } from '../utils';
import FormField from './FormField';

export default class FormSection extends React.Component {
    formHandler = (data, url) => {
        return axios({
            method: 'post',
            url,
            data
        })
    }

    handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const value = Object.fromEntries(data.entries());
        const section = _.get(this.props, 'section');
        const formAction = _.get(section, 'form_action');
        this.formHandler(value, formAction);
    }
    
    render() {
        const section = _.get(this.props, 'section');
        const sectionId = _.get(section, 'section_id');
        const title = _.get(section, 'title');
        const subtitle = _.get(section, 'subtitle');
        const content = _.get(section, 'content');
        const hasText = title || subtitle || content;
        const formId = _.get(section, 'form_id');
        const formContact = _.get(section, 'form_contact');
        const formFields = _.get(section, 'form_fields');
        const submitLabel = _.get(section, 'submit_label');
        const formHoneypotInputId = formId + '-honeypot';
        const formHoneypotLabelId = formId + '-honeypot-label';
        const formHoneypotName = formId + '-bot-field';
        console.log(formContact);

        return (
            <section id={sectionId} className="section section--form">
                <div className="container container--lg">
                    <div className={classNames({ 'grid': hasText })}>
                        {hasText && (
                            <div className="section__content cell">
                                {title && <h2 className="section__title line-top">{title}</h2>}
                                {subtitle && <p className="section__subtitle">{subtitle}</p>}
                                {content && (
                                    <div className="section__body text-block">
                                        {markdownify(content)}
                                    </div>
                                )}
                            </div>
                        )}
                        <div className={classNames('section__form-container', { 'cell': hasText })}>
                            <form
                                onSubmit={this.handleSubmit}
                                name={formId}
                                id={formId}
                                method="POST"
                                data-netlify="true"
                                data-netlify-honeypot={formHoneypotName}
                            >
                                <div className="screen-reader-text">
                                    <label id={formHoneypotLabelId} htmlFor={formHoneypotInputId}>
                                        Don't fill this out if you're human:
                                        <input
                                            aria-labelledby={formHoneypotLabelId}
                                            id={formHoneypotInputId}
                                            name={formHoneypotName}
                                        />
                                    </label>
                                </div>
                                <input type="hidden" name="form-name" value={formId} />
                                <input type="hidden" name="form-contact" value={formContact} />
                                {_.map(formFields, (field, index) => (
                                    <FormField key={index} field={field} section={section} />
                                ))}
                                <div className="form-submit">
                                    <button type="submit" className="button button--primary">
                                        {submitLabel}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}
